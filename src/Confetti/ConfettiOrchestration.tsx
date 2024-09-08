import { useProgress } from '../AnimationCore/useProgress'
import { Spark, SparkRef } from '../AnimationObjects/Spark'
import { Easing, SharedValue } from 'react-native-reanimated'
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import { Grid } from '../Grid'
import React from 'react'
import {
  PointsCollection,
  ConfettiLineConfig,
  ConfettiLoopConfig,
} from './utils'

export interface ConfettiOrchestratorRef {
  run: () => void
  reset: () => void
}

export type Confetti =
  | (ConfettiLineConfig & { lineType: 'line' })
  | (ConfettiLoopConfig & { lineType: 'loop' })

interface ConfettiOrchestratorProps {
  confetti: Confetti[]
  grid: Grid
  paused: SharedValue<boolean>
}

export const ConfettiOrchestrator = forwardRef<
  ConfettiOrchestratorRef,
  ConfettiOrchestratorProps
>(({ confetti = [], grid, paused }, ref) => {
  const {
    progress: progressOrchestration,
    run: runOrchestration,
    reset: resetOrchestration,
  } = useProgress({
    to: 1,
    from: 0,
    easing: Easing.out(Easing.ease),
    duration: 1500,
    paused,
  })

  const pointsCollection = new PointsCollection()
  confetti.forEach(confetti => {
    if (confetti.lineType === 'line') {
      pointsCollection.addLine(confetti)
    }
    if (confetti.lineType === 'loop') {
      pointsCollection.addLoopedLine(confetti)
    }
  })

  const confettiCollection = useMemo(
    () => pointsCollection.getConfettiConfig(),
    [pointsCollection],
  )

  const maxConfettiCount = 100
  const confettiRefCollection = Array.from({ length: maxConfettiCount }, () =>
    useRef<SparkRef>(null),
  )

  const run = () => {
    confettiRefCollection.forEach(ref => {
      ref?.current?.run()
    })
    runOrchestration()
  }

  const reset = () => {
    confettiRefCollection.forEach(ref => {
      ref?.current?.reset()
    })
    resetOrchestration()
  }

  useImperativeHandle(ref, () => ({
    run,
    reset,
  }))

  return (
    <>
      {confettiCollection.map((spark, index) => {
        return (
          <Spark
            key={index}
            points={spark.points}
            colorsWithBreakpoints={spark.colorsWithBreakpoints}
            duration={spark.duration}
            startAtprogressOrchestration={spark.startAtprogressOrchestration}
            destructAtFrontProgress={spark.destructAtFrontProgress}
            strokeWidth={spark.strokeWidth}
            paused={paused}
            ref={confettiRefCollection[index]}
            grid={grid}
            progressOrchestration={progressOrchestration}
            easing={Easing.out(Easing.ease)}
          />
        )
      })}
    </>
  )
})
