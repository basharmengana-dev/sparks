import { Path } from '../Path'
import { SkPoint } from '@shopify/react-native-skia'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Easing, SharedValue } from 'react-native-reanimated'
import { useProgress } from '../Animations/useProgress'
import { Grid } from '../Grid'

export interface SparkRef {
  readyToRun: () => void
}

interface SparkProps {
  points: SkPoint[]
  colorsWithBreakpoints: {
    breakpoint: number
    color: number[]
  }[]
  strokeWidth: number
  progressOrchestration: SharedValue<number>
  withDelay?: number
  startAtprogressOrchestration: number
  destructAtFrontProgress: number
  paused: boolean
  grid: Grid
}

export const Spark = forwardRef<SparkRef, SparkProps>(
  (
    {
      points,
      colorsWithBreakpoints,
      strokeWidth,
      progressOrchestration,
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
      pause: pauseFront,
      readyToRun: readyToRunFront,
    } = useProgress({
      to: 1,
      from: 0,
      easing: Easing.out(Easing.ease),
      duration: 1500,
      withDelay,
      waitUntilProgress: {
        progress: progressOrchestration,
        isValue: startAtprogressOrchestration,
      },
      waitUntilRun: false,
    })

    const {
      progress: progressBack,
      pause: pauseBack,
      readyToRun: readyToRunBack,
    } = useProgress({
      to: 1,
      from: 0,
      easing: Easing.out(Easing.ease),
      duration: 2000,
      waitUntilProgress: {
        progress: progressFront,
        isValue: destructAtFrontProgress,
      },
      waitUntilRun: false,
    })

    useEffect(() => {
      pauseFront(paused)
      pauseBack(paused)
    }, [paused])

    useImperativeHandle(ref, () => ({
      readyToRun() {
        readyToRunBack()
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
        progressBack={progressBack}
      />
    )
  },
)
