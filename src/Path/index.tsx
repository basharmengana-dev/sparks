import { useMemo } from 'react'
import {
  PaintStyle,
  Path as SkiaPath,
  SkPoint,
  SkRect,
  Skia,
  dist,
  fitbox,
  processTransform2d,
  rect,
  StrokeCap,
} from '@shopify/react-native-skia'
import { Dimensions, StyleSheet } from 'react-native'
import { PathGeometry, getPointAtLength } from './Geometry'
import { useDerivedValue, SharedValue } from 'react-native-reanimated'
import { svgPathProperties } from 'svg-path-properties'
import { source } from './Shader'

export const fitRect = (src: SkRect, dst: SkRect) =>
  processTransform2d(fitbox('contain', src, dst))

const pad = 75
const { width, height } = Dimensions.get('window')
export const dst = rect(pad, pad, width - pad * 2, height - pad * 2)

const tolerance = StyleSheet.hairlineWidth
const tessellate = (
  geo: PathGeometry,
  t0: number,
  t1: number,
): { p1: SkPoint; p2: SkPoint; length: number }[] => {
  const p0 = geo.getPointAtLength(t0)
  const p1 = geo.getPointAtLength(t1)
  const t05 = (t0 + t1) / 2
  const p05 = getPointAtLength(0.5 * dist(p0, p1), p0, p1)
  const c05 = geo.getPointAtLength(t05)
  const d = dist(p05, c05)
  if (d > tolerance || dist(p0, p1) > 40) {
    return [...tessellate(geo, t0, t05), ...tessellate(geo, t05, t1)]
  } else {
    return [{ p1: p0, p2: p1, length: t0 }]
  }
}

export const prepare = (svg: string) => {
  const path = Skia.Path.MakeFromSVGString(svg)!
  const src = path.computeTightBounds()
  const m3 = fitRect(src, dst)
  path.transform(m3)
  const geo = new PathGeometry(path)
  const totalLength = geo.getTotalLength()
  const lines = tessellate(geo, 0, totalLength)
  return lines
}

export const Path = ({
  svg,
  progress,
}: {
  svg: string
  progress: SharedValue<number>
}) => {
  const preparedPath = useMemo(() => prepare(svg), [svg])
  const colorThreshold = 0.5

  const pathProgress = useDerivedValue(() => {
    const partOfPath = preparedPath.slice(
      0,
      Math.floor(progress.value * preparedPath.length),
    )

    return partOfPath.reduce((acc, line) => {
      return `${acc} M${line.p1.x} ${line.p1.y} L${line.p2.x} ${line.p2.y}`
    }, '')
  })

  const {
    flattenedPoints,
    flattenedDistances,
    strokeWidth,
    totalLength,
    searchThreshold,
  } = useMemo(() => {
    const strokeWidth = 8
    const pathProperties = new svgPathProperties(
      preparedPath.reduce((acc, line) => {
        return `${acc} M${line.p1.x} ${line.p1.y} L${line.p2.x} ${line.p2.y}`
      }, ''),
    )
    const totalLength = pathProperties.getTotalLength()

    const numSamples = 300
    const points = new Float32Array(numSamples * 2) // Array for storing x and y coordinates
    const distances = new Float32Array(numSamples) // Array for storing distances

    for (let i = 0; i < numSamples; i++) {
      const t = i / (numSamples - 1) // Normalized position [0, 1]
      const point = pathProperties.getPointAtLength(t * totalLength)
      points[i * 2] = point.x
      points[i * 2 + 1] = point.y
      distances[i] = t * totalLength
    }

    // Flatten arrays for passing to the shader
    const flattenedPoints = Array.from(points)
    const flattenedDistances = Array.from(distances)
    const searchThreshold = Math.floor(strokeWidth / 2)

    return {
      flattenedPoints,
      flattenedDistances,
      strokeWidth,
      totalLength,
      searchThreshold,
    }
  }, [preparedPath])

  const numMaxBreakpoints = 100
  const numMaxColors = numMaxBreakpoints * 4

  const colorBreakpoints = [
    { breakpoint: 0.0, color: [1.0, 0.4, 0.4, 1.0] }, // Pastel Red
    { breakpoint: 0.1, color: [1.0, 1.0, 0.4, 1.0] }, // Pastel Yellow
    { breakpoint: 0.2, color: [0.4, 1.0, 0.4, 1.0] }, // Pastel Green
    { breakpoint: 0.3, color: [0.4, 1.0, 1.0, 1.0] }, // Pastel Cyan
    { breakpoint: 0.4, color: [0.4, 0.4, 1.0, 1.0] }, // Pastel Blue
    { breakpoint: 0.5, color: [1.0, 0.4, 1.0, 1.0] }, // Pastel Magenta
    { breakpoint: 0.6, color: [1.0, 0.6, 0.4, 1.0] }, // Pastel Orange
    { breakpoint: 0.7, color: [0.6, 0.4, 1.0, 1.0] }, // Pastel Purple
    { breakpoint: 0.8, color: [0.4, 1.0, 0.6, 1.0] }, // Pastel Mint
    { breakpoint: 0.9, color: [1.0, 1.0, 0.6, 1.0] }, // Pastel Peach
    { breakpoint: 1.0, color: [0.8, 0.8, 0.8, 1.0] }, // Light Grey
  ]

  // Prepare the breakpoints and colors for the shader
  const breakpoints = new Array(numMaxBreakpoints).fill(0)
  const colors = new Array(numMaxColors).fill(0)

  colorBreakpoints.forEach((bp, index) => {
    breakpoints[index] = bp.breakpoint
    colors[index * 4] = bp.color[0]
    colors[index * 4 + 1] = bp.color[1]
    colors[index * 4 + 2] = bp.color[2]
    colors[index * 4 + 3] = bp.color[3]
  })

  const uniforms = [
    totalLength,
    ...flattenedPoints,
    ...flattenedDistances,
    searchThreshold,
    colorThreshold,
    colorBreakpoints.length,
    ...breakpoints,
    ...colors,
  ]

  const shader = source.makeShader(uniforms)
  const paint = Skia.Paint()
  paint.setStrokeWidth(strokeWidth)
  paint.setStyle(PaintStyle.Stroke)
  paint.setShader(shader)
  paint.setStrokeCap(StrokeCap.Round)

  return <SkiaPath path={pathProgress} style="stroke" paint={paint} />
}
