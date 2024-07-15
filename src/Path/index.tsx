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
  colorBreakpoints,
}: {
  svg: string
  progress: SharedValue<number>
  colorBreakpoints: { breakpoint: number; color: number[] }[]
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
    colors,
    breakpoints,
    numBreakpoints,
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

    const numMaxBreakpoints = 100
    const numMaxColors = numMaxBreakpoints * 4
    const breakpoints = new Array(numMaxBreakpoints).fill(0)
    const colors = new Array(numMaxColors).fill(0)

    colorBreakpoints.forEach((bp, index) => {
      breakpoints[index] = bp.breakpoint
      colors[index * 4] = bp.color[0]
      colors[index * 4 + 1] = bp.color[1]
      colors[index * 4 + 2] = bp.color[2]
      colors[index * 4 + 3] = bp.color[3]
    })

    return {
      flattenedPoints,
      flattenedDistances,
      strokeWidth,
      totalLength,
      searchThreshold,
      colors,
      breakpoints,
      numBreakpoints: colorBreakpoints.length,
    }
  }, [preparedPath])

  const uniforms = [
    totalLength,
    ...flattenedPoints,
    ...flattenedDistances,
    searchThreshold,
    colorThreshold,
    numBreakpoints,
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
