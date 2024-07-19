import { useMemo } from 'react'
import {
  Path as SkiaPath,
  rect,
  Shader,
  SkHostRect,
  Circle,
} from '@shopify/react-native-skia'
import { Dimensions } from 'react-native'
import { PathGeometry } from './PathGeometry'
import { SharedValue, useDerivedValue } from 'react-native-reanimated'
import { shaderSource } from './Shader'

function findClosestDistance(
  points: Float32Array,
  distances: Float32Array,
): Float32Array {
  const n = points.length / 2
  let minDistance = Infinity

  const intersection = new Float32Array(3)

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const x1 = points[2 * i]
      const y1 = points[2 * i + 1]
      const x2 = points[2 * j]
      const y2 = points[2 * j + 1]

      const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))

      if (distance < minDistance) {
        minDistance = distance
        intersection[0] = x2
        intersection[1] = y2
        intersection[2] = distances[j]
      }
    }
  }

  return intersection
}

export const Path = ({
  svg,
  strokeWidth,
  dst,
  progressFront,
  progressBack,
  alphaProgress,
  colorBreakpoints,
}: {
  svg: string
  strokeWidth: number
  dst: SkHostRect
  progressFront: SharedValue<number>
  progressBack: SharedValue<number>
  alphaProgress: SharedValue<number>
  colorBreakpoints: { breakpoint: number; color: number[] }[]
}) => {
  const preparedPath = useMemo(() => new PathGeometry(svg, dst), [svg])

  const {
    flattenedPoints,
    flattenedDistances,
    totalLength,
    searchThreshold,
    colors,
    breakpoints,
    numBreakpoints,
    pathSVG,
    intersection,
  } = useMemo(() => {
    const pathSVG = preparedPath.path.toSVGString()
    const totalLength = preparedPath.getTotalLength()

    const numSamples = 500
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
    const numMaxColors = numMaxBreakpoints * 3
    const breakpoints = new Array(numMaxBreakpoints).fill(0)
    const colors = new Array(numMaxColors).fill(0)

    colorBreakpoints.forEach((bp, index) => {
      breakpoints[index] = bp.breakpoint
      colors[index * 4] = bp.color[0]
      colors[index * 4 + 1] = bp.color[1]
      colors[index * 4 + 2] = bp.color[2]
    })
    const intersection = findClosestDistance(points, distances)
    console.log('IntS: ', intersection, totalLength)

    return {
      flattenedPoints,
      flattenedDistances,
      totalLength,
      searchThreshold,
      colors,
      breakpoints,
      numBreakpoints: colorBreakpoints.length,
      pathSVG,
      intersection,
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
    u_progress_front: progressFront.value,
    u_progress_back: progressBack.value,
    u_progress_alpha: alphaProgress.value,
    u_intersection: intersection,
  }))

  return (
    <>
      <SkiaPath
        path={pathSVG}
        style="stroke"
        strokeWidth={strokeWidth}
        strokeCap="round">
        <Shader source={shaderSource} uniforms={uniforms} />
      </SkiaPath>
      {/* <Circle cx={intersection[0]} cy={intersection[1]} r={1} color={'red'} /> */}
    </>
  )
}
