import { useMemo } from 'react'
import {
  Path as SkiaPath,
  Shader,
  SkHostRect,
} from '@shopify/react-native-skia'
import { PathGeometry } from './PathGeometry'
import { SharedValue, useDerivedValue } from 'react-native-reanimated'
import { shaderSource } from './Shader'

const findPathIntersectionWithDistance = (
  points: Float32Array,
  distances: Float32Array,
): Float32Array => {
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

const findTangent = (
  points: Float32Array,
  intersection: Float32Array,
  strokeWidth: number,
) => {
  const intersectionX = intersection[0]
  const intersectionY = intersection[1]
  let minDistance = Infinity
  let closestIndex = -1

  for (let i = 0; i < points.length / 2; i++) {
    const x = points[2 * i]
    const y = points[2 * i + 1]
    const distance = Math.sqrt(
      Math.pow(intersectionX - x, 2) + Math.pow(intersectionY - y, 2),
    )

    if (distance < minDistance) {
      minDistance = distance
      closestIndex = i
    }
  }

  let p1: [number, number], p2: [number, number]
  if (closestIndex === 0) {
    p1 = [points[0], points[1]]
    p2 = [points[2], points[3]]
  } else if (closestIndex === points.length / 2 - 1) {
    p1 = [points[2 * (closestIndex - 1)], points[2 * (closestIndex - 1) + 1]]
    p2 = [points[2 * closestIndex], points[2 * closestIndex + 1]]
  } else {
    p1 = [points[2 * closestIndex], points[2 * closestIndex + 1]]
    p2 = [points[2 * (closestIndex + 1)], points[2 * (closestIndex + 1) + 1]]
  }

  const direction = [p2[0] - p1[0], p2[1] - p1[1]]
  const length = Math.sqrt(direction[0] ** 2 + direction[1] ** 2)
  const normalizeDirection = [direction[0] / length, direction[1] / length]

  const expansionFactor = strokeWidth / 1.5
  const extendedP1 = [
    intersection[0] - normalizeDirection[0] * length * expansionFactor,
    intersection[1] - normalizeDirection[1] * length * expansionFactor,
  ]
  const extendedP2 = [
    intersection[0] + normalizeDirection[0] * length * expansionFactor,
    intersection[1] + normalizeDirection[1] * length * expansionFactor,
  ]

  return { p1: extendedP1, p2: extendedP2 }
}

const findIntersections = (
  points: Float32Array,
  distances: Float32Array,
  strokeWidth: number,
) => {
  const intersection = findPathIntersectionWithDistance(points, distances)
  const tangent = findTangent(points, intersection, strokeWidth)

  return [intersection[2], ...tangent.p1, ...tangent.p2]
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
  colorBreakpoints: { breakpoint: number; color: number[] }[]
  alphaProgress?: SharedValue<number>
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
    intersections,
  } = useMemo(() => {
    const pathSVG = preparedPath.path.toSVGString()
    const totalLength = preparedPath.getTotalLength()

    const numSamples = 500
    const points = new Float32Array(numSamples * 2)
    const distances = new Float32Array(numSamples)

    for (let i = 0; i < numSamples; i++) {
      const t = i / (numSamples - 1)
      const point = preparedPath.getPointAtLength(t * totalLength)
      points[i * 2] = point.x
      points[i * 2 + 1] = point.y
      distances[i] = t * totalLength
    }

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

    const intersections = findIntersections(points, distances, strokeWidth)

    return {
      flattenedPoints,
      flattenedDistances,
      totalLength,
      searchThreshold,
      colors,
      breakpoints,
      numBreakpoints: colorBreakpoints.length,
      pathSVG,
      intersections,
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
    u_progress_alpha: alphaProgress?.value ?? 1,
    u_intersections: intersections,
    u_strokeWidth: strokeWidth,
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
    </>
  )
}
