import { Path } from '../Path'
import { SkPoint } from '@shopify/react-native-skia'
import { forwardRef, useImperativeHandle } from 'react'
import { SharedValue, useSharedValue } from 'react-native-reanimated'
import { useProgress } from '../AnimationCore/useProgress'
import { Grid } from '../Grid'
import { EasingFunction } from '../AnimationCore/utils'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'
import { getAnimationConfig, StrokeWidthToken } from './getAnimationConfig'

export interface LineRef {
  run: () => void
  reset: () => void
}

interface LineProps {
  points: SkPoint[]
  colorsWithBreakpoints: {
    breakpoint: number
    color: number[]
  }[]
  strokeWidth: StrokeWidthToken
  easing: EasingFunction
  duration: number
  withDelay?: number
  paused: SharedValue<boolean>
  progressOrchestration: SharedValue<number>
  startAtprogressOrchestration: number
  grid: Grid
}

export const Line = forwardRef<LineRef, LineProps>(
  (
    {
      points,
      colorsWithBreakpoints,
      strokeWidth,
      easing,
      duration,
      withDelay = null,
      progressOrchestration,
      startAtprogressOrchestration,
      paused,
      grid,
    },
    ref,
  ) => {
    const {
      progress: progressFront,
      run,
      reset,
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

    useImperativeHandle(ref, () => ({
      run,
      reset,
    }))

    return (
      <Path
        points={points}
        grid={grid}
        maxIntersectionsAllowed={2}
        animationConfig={getAnimationConfig(strokeWidth)}
        colorBreakpoints={colorsWithBreakpoints}
        progressFront={progressFront}
        progressBack={useSharedValue(0)}
      />
    )
  },
)
