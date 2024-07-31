import { Path } from '../Path'
import { SkPoint } from '@shopify/react-native-skia'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { SharedValue, useSharedValue } from 'react-native-reanimated'
import { useProgress } from '../AnimationCore/useProgress'
import { Grid } from '../Grid'
import { EasingFunction } from '../AnimationCore/utils'

export interface LineRef {
  readyToRun: () => void
}

interface LineProps {
  points: SkPoint[]
  colorsWithBreakpoints: {
    breakpoint: number
    color: number[]
  }[]
  strokeWidth: number
  progressOrchestration: SharedValue<number>
  easing: EasingFunction
  duration: number
  withDelay?: number
  startAtprogressOrchestration: number
  destructAtFrontProgress: number
  paused: boolean
  grid: Grid
}

export const Line = forwardRef<LineRef, LineProps>(
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
      paused,
      grid,
    },
    ref,
  ) => {
    const {
      progress: progressFront,
      pause: pauseFront,
      readyToRun: readyToRunFront,
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
      waitUntilRun: false,
    })

    useEffect(() => {
      pauseFront(paused)
    }, [paused])

    useImperativeHandle(ref, () => ({
      readyToRun() {
        readyToRunFront()
      },
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
