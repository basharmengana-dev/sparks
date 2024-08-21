import { useProgress } from '../AnimationCore/useProgress'
import { Spark, SparkRef } from '../AnimationObjects/Spark'
import { SkPoint } from '@shopify/react-native-skia'
import { Easing, SharedValue } from 'react-native-reanimated'
import { forwardRef, useImperativeHandle, useRef } from 'react'
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
  keepTrail: boolean
}

export const FireworkOrchestrator = forwardRef<
  FireworkOrchestratorRef,
  FireworkOrchestratorProps
>(({ grid, paused, keepTrail: still }, ref) => {
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

  const createSpark = (
    color: RGB,
    duration: number,
    ...points: SkPoint[]
  ): { points: SkPoint[]; color: RGB; duration: number } => {
    return {
      color,
      points: createLineWithOrigin(grid.getCenter(), ...points),
      duration,
    }
  }
  const sparkCollection = [
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
      1500,
      { x: 0, y: 3 },
      { x: 0, y: 8.5 },
      { x: 2, y: 7 },
      { x: 1, y: 5 },
      { x: -1, y: 7 },
      { x: -2, y: 10 },
    ),
    createSpark(
      [0.498, 1.0, 0.0],
      1500,
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
      resetOrchestration()
    },
  }))

  return (
    <>
      {sparkCollection.map((spark, index) => {
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
            strokeWidth="stroke/10"
            progressOrchestration={progressOrchestration}
            easing={Easing.out(Easing.ease)}
            duration={spark.duration}
            startAtprogressOrchestration={0.0}
            destructAtFrontProgress={still ? 1 : 0.3}
            paused={paused}
            ref={sparkRefCollection[index]}
            grid={grid}
          />
        )
      })}
    </>
  )
})
