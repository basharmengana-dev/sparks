import { Path } from '../Path'
import { SkPoint } from '@shopify/react-native-skia'
import { forwardRef, useImperativeHandle } from 'react'
import { SharedValue, useSharedValue } from 'react-native-reanimated'
import { useProgress } from '../AnimationCore/useProgress'
import { Grid } from '../Grid'
import { EasingFunction } from '../AnimationCore/utils'

export interface LineRef {
  run: () => void
}

interface LineProps {
  points: SkPoint[]
  colorsWithBreakpoints: {
    breakpoint: number
    color: number[]
  }[]
  strokeWidth: number
  easing: EasingFunction
  duration: number
  withDelay?: number
  paused: SharedValue<boolean>
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
      paused,
      grid,
    },
    ref,
  ) => {
    const { progress: progressFront, run } = useProgress({
      to: 1,
      from: 0,
      easing,
      duration,
      withDelay,
      waitUntilRun: false,
      paused,
    })

    useImperativeHandle(ref, () => ({
      run,
    }))

    return (
      <Path
        points={points}
        cellHeight={grid.cellHeight}
        cellWidth={grid.cellWidth}
        gridHeight={grid.gridHeight}
        maxIntersectionsAllowed={2}
        strokeWidth={strokeWidth}
        colorBreakpoints={colorsWithBreakpoints}
        progressFront={progressFront}
        progressBack={useSharedValue(0)}
      />
    )
  },
)
