import { useProgress } from '../AnimationCore/useProgress'
import { Spark, SparkRef } from '../AnimationObjects/Spark'
import { SkPoint } from '@shopify/react-native-skia'
import { Easing, SharedValue } from 'react-native-reanimated'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { Grid } from '../Grid'
import { createLineWithOrigin, getLast } from '../Grid/utils'
import { StrokeWidthToken } from '../AnimationObjects/getAnimationConfig'
import { type SparkProps } from '../AnimationObjects/Spark'
import { ColorSchemes, ac, c } from '../AnimationObjects/utils'

export interface ConfettiOrchestratorRef {
  run: () => void
  reset: () => void
}

interface ConfettiOrchestratorProps {
  grid: Grid
  paused: SharedValue<boolean>
  strokeWidth: StrokeWidthToken
  keepTrail: boolean
}

export const ConfettiOrchestrator = forwardRef<
  ConfettiOrchestratorRef,
  ConfettiOrchestratorProps
>(({ grid, paused, keepTrail: still, strokeWidth }, ref) => {
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

  const confettiCollection: Pick<
    SparkProps,
    | 'points'
    | 'duration'
    | 'colorsWithBreakpoints'
    | 'startAtprogressOrchestration'
    | 'destructAtFrontProgress'
    | 'strokeWidth'
  >[] = [
    {
      points: createLineWithOrigin(
        grid.getCenter(),
        { x: 2, y: 2 },
        { x: 4, y: 5 },
        { x: 5, y: 10 },
        { x: 6, y: 15 },
      ),
      duration: 900,
      colorsWithBreakpoints: ColorSchemes.createPinkColors(),
      startAtprogressOrchestration: 0,
      destructAtFrontProgress: still ? 1 : 0.4,
      strokeWidth,
    },
    {
      points: createLineWithOrigin(
        grid.getCenter(),
        { x: -2, y: 2 },
        { x: -4, y: 5 },
        { x: -5, y: 10 },
        { x: -6, y: 15 },
      ),
      duration: 900,
      colorsWithBreakpoints: ColorSchemes.createGreenColors(),
      startAtprogressOrchestration: 0.2,
      destructAtFrontProgress: still ? 1 : 0.4,
      strokeWidth,
    },
    {
      points: createLineWithOrigin(
        grid.getCenter(),
        { x: 2, y: -2 },
        { x: 4, y: -5 },
        { x: 5, y: -10 },
        { x: 6, y: -15 },
      ),
      duration: 900,
      colorsWithBreakpoints: ColorSchemes.createBlueColors(),
      startAtprogressOrchestration: 0.4,
      destructAtFrontProgress: still ? 1 : 0.4,
      strokeWidth,
    },
    {
      points: createLineWithOrigin(
        grid.getCenter(),
        { x: -2, y: -2 },
        { x: -4, y: -5 },
        { x: -5, y: -10 },
        { x: -6, y: -15 },
      ),
      duration: 900,
      colorsWithBreakpoints: ColorSchemes.createYellowColors(),
      startAtprogressOrchestration: 0.6,
      destructAtFrontProgress: still ? 1 : 0.4,
      strokeWidth,
    },
    {
      points: createLineWithOrigin(
        grid.getCenter(),
        { x: 2, y: 0 },
        { x: 4, y: 0 },
        { x: 5, y: 0 },
        { x: 6, y: 0 },
      ),
      duration: 900,
      colorsWithBreakpoints: ColorSchemes.createOrangeColors(),
      startAtprogressOrchestration: 0.8,
      destructAtFrontProgress: still ? 1 : 0.4,
      strokeWidth,
    },
    {
      points: createLineWithOrigin(
        grid.getCenter(),
        { x: 0, y: 2 },
        { x: 0, y: 4 },
        { x: 0, y: 5 },
        { x: 0, y: 6 },
      ),
      duration: 900,
      colorsWithBreakpoints: ColorSchemes.createRedColors(),
      startAtprogressOrchestration: 1,
      destructAtFrontProgress: still ? 1 : 0.4,
      strokeWidth,
    },
  ]

  const confettiRefCollection = Array.from(
    { length: confettiCollection.length },
    () => useRef<SparkRef>(null),
  )

  useImperativeHandle(ref, () => ({
    run() {
      confettiRefCollection.forEach(ref => {
        ref?.current?.run()
      })
      runOrchestration()
    },
    reset() {
      confettiRefCollection.forEach(ref => {
        ref?.current?.reset()
      })
      resetOrchestration()
    },
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
