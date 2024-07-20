import { useMemo } from 'react'
import {
  Path as SkiaPath,
  rect,
  Shader,
  SkHostRect,
  Circle,
  Line,
  Skia,
} from '@shopify/react-native-skia'
import { Dimensions } from 'react-native'
import { PathGeometry } from './PathGeometry'
import {
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
} from 'react-native-reanimated'
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

function findTangentSegment(
  points: Float32Array,
  intersection: Float32Array,
  strokeWidth: number,
) {
  const intersectionX = intersection[0]
  const intersectionY = intersection[1]
  let minDistance = Infinity
  let closestIndex = -1

  // Find the closest point in the array to the intersection point
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

  // Determine the points that form the tangent segment
  let p1: [number, number], p2: [number, number]
  if (closestIndex === 0) {
    // If the closest point is the first point, the segment is between the first and second points
    p1 = [points[0], points[1]]
    p2 = [points[2], points[3]]
  } else if (closestIndex === points.length / 2 - 1) {
    // If the closest point is the last point, the segment is between the last and second to last points
    p1 = [points[2 * (closestIndex - 1)], points[2 * (closestIndex - 1) + 1]]
    p2 = [points[2 * closestIndex], points[2 * closestIndex + 1]]
  } else {
    // Otherwise, the segment is between the closest point and the next point
    p1 = [points[2 * closestIndex], points[2 * closestIndex + 1]]
    p2 = [points[2 * (closestIndex + 1)], points[2 * (closestIndex + 1) + 1]]
  }

  // Calculate the direction vector
  const direction = [p2[0] - p1[0], p2[1] - p1[1]]

  // Calculate the length of the direction vector
  const length = Math.sqrt(direction[0] ** 2 + direction[1] ** 2)

  // Normalize the direction vector
  const unitDirection = [direction[0] / length, direction[1] / length]

  // Extend the line segment by a factor in both directions
  const factor = strokeWidth / 2 // Change this factor to make the line longer or shorter
  const extendedP1 = [
    intersection[0] - unitDirection[0] * length * factor,
    intersection[1] - unitDirection[1] * length * factor,
  ]
  const extendedP2 = [
    intersection[0] + unitDirection[0] * length * factor,
    intersection[1] + unitDirection[1] * length * factor,
  ]

  return { p1: extendedP1, p2: extendedP2 }
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
    intersection,
    tangentSegment,
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
    console.log('intersection', intersection)
    // Example usage within Path component
    const tangentSegment = findTangentSegment(points, intersection, strokeWidth)

    // Create the path
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
      tangentSegment,
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
    u_intersection: intersection,
    u_tangent_p1: tangentSegment.p1,
    u_tangent_p2: tangentSegment.p2,
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
      {/* <SkiaPath path={path} color="black" strokeWidth={2} style={'stroke'} /> */}
      {/* <Circle cx={intersection[0]} cy={intersection[1]} r={1} color={'red'} /> */}
    </>
  )
}
