import { useMemo } from 'react'
import { Path as SkiaPath, Shader, SkPoint } from '@shopify/react-native-skia'
import { PathGeometry } from './PathGeometry'
import { SharedValue, useDerivedValue } from 'react-native-reanimated'
import { shaderSource } from './Shader'
import { Grid } from '../Grid'

export const Path = ({
  points,
  grid,
  maxIntersectionsAllowed,
  strokeWidth,
  progressFront,
  progressBack,
  alphaProgress,
  colorBreakpoints,
}: {
  points: SkPoint[]
  grid: Grid
  maxIntersectionsAllowed: number
  strokeWidth: number
  progressFront: SharedValue<number>
  progressBack: SharedValue<number>
  colorBreakpoints: { breakpoint: number; color: number[] }[]
  alphaProgress?: SharedValue<number>
}) => {
  const preparedPath = useMemo(
    () =>
      new PathGeometry({
        points,
        grid,
      }),
    [points, grid],
  )

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

    // Define fixed total number of points and extra points for intersections
    const totalSamples = 100
    const extraSamples = 50
    const points = new Float32Array((totalSamples + extraSamples) * 2)
    const distances = new Float32Array(totalSamples + extraSamples)

    // Initial sampling and intersection detection
    for (let i = 0; i < totalSamples; i++) {
      const t = i / (totalSamples - 1)
      const point = preparedPath.getPointAtLength(t * totalLength)
      points[i * 2] = point.x
      points[i * 2 + 1] = point.y
      distances[i] = t * totalLength
    }

    const intersections = preparedPath.findIntersections(
      points,
      distances,
      strokeWidth,
      maxIntersectionsAllowed,
    )

    // Distribute extra samples around intersections
    if (intersections.length > 0) {
      const extraSamplesPerIntersection = Math.floor(
        extraSamples / intersections.length,
      )
      let extraSampleIndex = totalSamples

      intersections.forEach(intersection => {
        const intersectionT = intersection / totalLength

        for (let i = 0; i < extraSamplesPerIntersection; i++) {
          const t = intersectionT + (Math.random() - 0.5) * (1 / totalSamples) // Slight variation around the intersection
          const point = preparedPath.getPointAtLength(t * totalLength)
          points[extraSampleIndex * 2] = point.x
          points[extraSampleIndex * 2 + 1] = point.y
          distances[extraSampleIndex] = t * totalLength
          extraSampleIndex++
        }
      })

      // If there's any leftover samples, distribute them evenly across all intersections
      for (let i = 0; i < extraSamples % intersections.length; i++) {
        const intersectionT = intersections[i] / totalLength
        const t = intersectionT + (Math.random() - 0.5) * (1 / totalSamples)
        const point = preparedPath.getPointAtLength(t * totalLength)
        points[extraSampleIndex * 2] = point.x
        points[extraSampleIndex * 2 + 1] = point.y
        distances[extraSampleIndex] = t * totalLength
        extraSampleIndex++
      }
    }

    const flattenedPoints = Array.from(points)
    const flattenedDistances = Array.from(distances)
    const searchThreshold = Math.floor(strokeWidth / 2) + 1.02

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
