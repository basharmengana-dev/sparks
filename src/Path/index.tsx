import { useMemo } from 'react'
import {
  Path as SkiaPath,
  rect,
  Shader,
  SkHostRect,
} from '@shopify/react-native-skia'
import { Dimensions } from 'react-native'
import { PathGeometry } from './PathGeometry'
import { SharedValue, useDerivedValue } from 'react-native-reanimated'
import { shaderSource } from './Shader'

export const Path = ({
  svg,
  dst,
  progress,
  colorBreakpoints,
}: {
  svg: string
  dst: SkHostRect
  progress: SharedValue<number>
  colorBreakpoints: { breakpoint: number; color: number[] }[]
}) => {
  const preparedPath = useMemo(() => new PathGeometry(svg, dst), [svg])

  const {
    flattenedPoints,
    flattenedDistances,
    strokeWidth,
    totalLength,
    searchThreshold,
    colors,
    breakpoints,
    numBreakpoints,
    pathSVG,
  } = useMemo(() => {
    const strokeWidth = 8
    const pathSVG = preparedPath.path.toSVGString()
    const totalLength = preparedPath.getTotalLength()

    const numSamples = 200
    const points = new Float32Array(numSamples * 2) // Array for storing x and y coordinates
    const distances = new Float32Array(numSamples) // Array for storing distances

    for (let i = 0; i < numSamples; i++) {
      const t = i / (numSamples - 1) // Normalized position [0, 1]
      const point = preparedPath.getPointAtLength(t * totalLength)
      points[i * 2] = point.x
      points[i * 2 + 1] = point.y
      distances[i] = t * totalLength
    }

    // Flatten arrays for passing to the shader
    const flattenedPoints = Array.from(points)
    const flattenedDistances = Array.from(distances)
    const searchThreshold = Math.floor(strokeWidth / 2) + 0.5

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
      pathSVG,
    }
  }, [preparedPath])

  const uniforms = useDerivedValue(() => ({
    u_totalLength: totalLength,
    u_points: flattenedPoints,
    u_distances: flattenedDistances,
    u_searchThreshold: searchThreshold,
    u_numBreakpoints: numBreakpoints,
    u_breakpoints: breakpoints,
    u_colors: colors,
    u_progress: progress.value,
  }))

  return (
    <SkiaPath
      path={pathSVG}
      style="stroke"
      strokeWidth={strokeWidth}
      strokeCap="round">
      <Shader source={shaderSource} uniforms={uniforms} />
    </SkiaPath>
  )
}
