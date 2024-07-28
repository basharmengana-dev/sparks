import { useMemo } from 'react'
import { Path as SkiaPath, Shader, SkPoint } from '@shopify/react-native-skia'
import { PathGeometry } from './PathGeometry'
import { SharedValue, useDerivedValue } from 'react-native-reanimated'
import { shaderSource } from './Shader'

export const Path = ({
  points,
  cellHeight,
  cellWidth,
  maxIntersectionsAllowed,
  strokeWidth,
  progressFront,
  progressBack,
  alphaProgress,
  colorBreakpoints,
}: {
  points: SkPoint[]
  cellWidth: number
  cellHeight: number
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
        cellWidth,
        cellHeight,
      }),
    [points, cellWidth, cellHeight],
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

    const intersections = preparedPath.findIntersections(
      points,
      distances,
      strokeWidth,
      maxIntersectionsAllowed,
    )

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
