import { useProgress } from '../AnimationCore/useProgress'
import { Spark, SparkRef } from '../AnimationObjects/Spark'
import { SkPoint } from '@shopify/react-native-skia'
import { Easing, SharedValue, useSharedValue } from 'react-native-reanimated'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Grid } from '../Grid'
import { createLineWithOrigin, getLast } from '../Grid/utils'
import { c, ac, RGB } from './utils'

export interface FireworkOrchestratorRef {
  run: () => void
  reset: () => void
}

interface FireworkOrchestratorProps {
  grid: Grid
  paused: SharedValue<boolean>
}

export const FireworkOrchestrator = forwardRef<
  FireworkOrchestratorRef,
  FireworkOrchestratorProps
>(({ grid, paused }, ref) => {
  const { progress: progressOrchestration, run: runOrchestration } =
    useProgress({
      to: 1,
      from: 0,
      easing: Easing.out(Easing.ease),
      duration: 1500,
      paused,
    })

  const stem = {
    points: createLineWithOrigin(
      grid.getBottomCenter(),
      { x: 1, y: 7 },
      { x: 1, y: 14 },
      { x: -1, y: 20 },
    ),
    color: c(1.0, 1.0, 0.878, 0.9),
    duration: 2000,
  }

  const createSpark = (
    color: RGB,
    duration: number,
    ...points: SkPoint[]
  ): { points: SkPoint[]; color: RGB; duration: number } => {
    return {
      color,
      points: createLineWithOrigin(getLast(stem.points), ...points),
      duration,
    }
  }
  const sparkCollection = [
    stem,
    // Purple, right up
    createSpark(
      [0.6275, 0.1255, 0.9412],
      1200,
      { x: 2, y: 2 },
      { x: 4, y: 5 },
      { x: 5, y: 10 },
    ),

    // Green, left
    createSpark(
      [0.498, 1.0, 0.0],
      1200,
      { x: -2, y: 2 },
      { x: -3, y: 4 },
      { x: -4, y: 7 },
    ),

    // Purple, horizontal left
    createSpark(
      [0.6275, 0.1255, 0.9412],
      1200,
      { x: -2, y: -1 },
      { x: -4, y: -1 },
      { x: -6, y: -1 },
    ),

    // Green left
    createSpark([0.498, 1.0, 0.0], 1200, { x: -2, y: 0 }, { x: -5, y: 1 }),
    createSpark([0.498, 1.0, 0.0], 1200, { x: -1, y: 0 }, { x: -3, y: 1 }),
    createSpark([0.498, 1.0, 0.0], 1200, { x: -1, y: 0 }, { x: -4, y: 3 }),

    // Purple, right
    createSpark([0.6275, 0.1255, 0.9412], 1200, { x: 2, y: 0 }, { x: 4, y: 1 }),

    // Purple, up
    createSpark(
      [0.6275, 0.1255, 0.9412],
      1200,
      { x: 0, y: 1 },
      { x: 1, y: 10 },
    ),

    // Green, up
    createSpark([0.498, 1.0, 0.0], 1200, { x: 0, y: 0 }, { x: 1, y: 4 }),

    // Purple, left up
    createSpark(
      [0.6275, 0.1255, 0.9412],
      1200,
      { x: -3, y: 0 },
      { x: -4, y: 2 },
    ),

    // Loops
    createSpark(
      [0.6275, 0.1255, 0.9412],
      2000,
      { x: 0, y: 3 },
      { x: 0, y: 8 },
      { x: 1, y: 7 },
      { x: 0, y: 6 },
      { x: -1, y: 7 },
      { x: -2, y: 10 },
    ),
    createSpark(
      [0.498, 1.0, 0.0],
      2000,
      { x: 1, y: 1 },
      { x: 5, y: 4 },
      { x: 6, y: 2 },
      { x: 4, y: 2 },
      { x: 4, y: 4 },
      { x: 5, y: 7 },
    ),
  ]

  const sparkRefCollection = Array.from(
    { length: sparkCollection.length },
    () => useRef<SparkRef>(null),
  )

  useImperativeHandle(ref, () => ({
    run() {
      sparkRefCollection.forEach(ref => {
        ref?.current?.run()
      })
      runOrchestration()
    },
    reset() {
      sparkRefCollection.forEach(ref => {
        ref?.current?.reset()
      })
    },
  }))

  return (
    <>
      <Spark
        points={sparkCollection[0].points}
        colorsWithBreakpoints={[
          { breakpoint: 0.0, color: c(1.0, 1.0, 1.0, 1.0) },
          { breakpoint: 0.6, color: c(1.0, 1.0, 0.878, 0.9) },
          { breakpoint: 0.75, color: c(0.596, 0.984, 0.596, 0.8) },
          { breakpoint: 0.9, color: c(0.866, 0.627, 0.866, 0.7) },
          { breakpoint: 1, color: c(0.0, 0.0, 0.0, 0.0) },
        ]}
        easing={Easing.out(Easing.ease)}
        duration={sparkCollection[0].duration}
        strokeWidth={3}
        progressOrchestration={progressOrchestration}
        startAtprogressOrchestration={0.0}
        destructAtFrontProgress={0.2}
        paused={paused}
        ref={sparkRefCollection[0]}
        grid={grid}
      />
      {sparkCollection.map((spark, index) => {
        if (index === 0) return null // The stem

        return (
          <Spark
            key={index}
            points={spark.points}
            colorsWithBreakpoints={[
              {
                breakpoint: 0.0,
                color: ac(0.3, spark.color as RGB),
              },
              {
                breakpoint: 0.6,
                color: ac(1.0, spark.color as RGB),
              },
              {
                breakpoint: 1,
                color: ac(0.3, spark.color as RGB),
              },
            ]}
            strokeWidth={3}
            progressOrchestration={progressOrchestration}
            easing={Easing.out(Easing.ease)}
            duration={spark.duration}
            startAtprogressOrchestration={0.9}
            destructAtFrontProgress={0.2}
            withDelay={900}
            paused={paused}
            ref={sparkRefCollection[index]}
            grid={grid}
          />
        )
      })}
    </>
  )
})
