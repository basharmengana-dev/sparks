import { useMemo } from 'react'
import { Path as SkiaPath, Shader, SkPoint } from '@shopify/react-native-skia'
import { PathGeometry } from './PathGeometry'
import { SharedValue, useDerivedValue } from 'react-native-reanimated'
import { shaderSource } from './Shader'
import { Grid } from '../Grid'
import { AnimationConfig } from '../AnimationObjects/getAnimationConfig'

export const Path = ({
  points,
  grid,
  maxIntersectionsAllowed,
  progressFront,
  progressBack,
  colorBreakpoints,
  animationConfig,
}: {
  points: SkPoint[]
  grid: Grid
  maxIntersectionsAllowed: number
  progressFront: SharedValue<number>
  progressBack: SharedValue<number>
  colorBreakpoints: { breakpoint: number; color: number[] }[]
  animationConfig: AnimationConfig
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
    const searchThreshold =
      Math.floor(animationConfig.strokeWidth / 2) +
      animationConfig.searchThreshold

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

    const intersections = preparedPath.findIntersections({
      points,
      distances,
      expectedIntersections: maxIntersectionsAllowed,
      expansionFactor: animationConfig.tagentExtension,
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
    u_intersections: intersections,
    u_strokeWidth: animationConfig.strokeWidth,
    u_falloff_back: animationConfig.falloffBack,
    u_falloff_front: animationConfig.falloffFront,
    u_tangent_start_adjustment: animationConfig.tangentStartAdjustment,
  }))

  return (
    <>
      <SkiaPath
        path={pathSVG}
        style="stroke"
        strokeWidth={animationConfig.strokeWidth}
        strokeCap="round">
        <Shader source={shaderSource} uniforms={uniforms} />
      </SkiaPath>
    </>
  )
}
