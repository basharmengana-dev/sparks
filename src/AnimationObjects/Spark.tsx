import { Path } from '../Path'
import { SkPoint } from '@shopify/react-native-skia'
import { forwardRef, useImperativeHandle } from 'react'
import { SharedValue } from 'react-native-reanimated'
import { useProgress } from '../AnimationCore/useProgress'
import { Grid } from '../Grid'
import { EasingFunction } from '../AnimationCore/utils'
import { getAnimationConfig, StrokeWidthToken } from './getAnimationConfig'

export interface SparkRef {
  run: () => void
  reset: () => void
}

interface SparkProps {
  points: SkPoint[]
  colorsWithBreakpoints: {
    breakpoint: number
    color: number[]
  }[]
  strokeWidth: StrokeWidthToken
  progressOrchestration: SharedValue<number>
  easing: EasingFunction
  duration: number
  withDelay?: number
  startAtprogressOrchestration: number
  destructAtFrontProgress: number
  paused: SharedValue<boolean>
  grid: Grid
}

export const Spark = forwardRef<SparkRef, SparkProps>(
  (
    {
      points,
      colorsWithBreakpoints,
      strokeWidth,
      progressOrchestration,
      easing,
      duration,
      withDelay = null,
      startAtprogressOrchestration,
      destructAtFrontProgress,
      paused,
      grid,
    },
    ref,
  ) => {
    const {
      progress: progressFront,
      run: runFront,
      reset: resetFront,
    } = useProgress({
      to: 1,
      from: 0,
      easing,
      duration,
      withDelay,
      waitUntilProgress: {
        progress: progressOrchestration,
        isValue: startAtprogressOrchestration,
      },
      paused,
    })

    const {
      progress: progressBack,
      run: runBack,
      reset: resetBack,
    } = useProgress({
      to: 1,
      from: 0,
      easing,
      duration,
      waitUntilProgress: {
        progress: progressFront,
        isValue: destructAtFrontProgress,
      },
      paused,
    })

    useImperativeHandle(ref, () => ({
      run() {
        runFront()
        runBack()
      },
      reset() {
        resetFront()
        resetBack()
      },
    }))

    return (
      <Path
        points={points}
        grid={grid}
        maxIntersectionsAllowed={2}
        animationConfig={getAnimationConfig(strokeWidth)}
        colorBreakpoints={colorsWithBreakpoints}
        progressFront={progressFront}
        progressBack={progressBack}
      />
    )
  },
)
