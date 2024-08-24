import { useProgress } from '../AnimationCore/useProgress'
import { Spark, SparkRef } from '../AnimationObjects/Spark'
import { Circle, SkPoint } from '@shopify/react-native-skia'
import { Easing, SharedValue } from 'react-native-reanimated'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Grid } from '../Grid'
import { createLineWithOrigin, getLast } from '../Grid/utils'
import { StrokeWidthToken } from '../AnimationObjects/getAnimationConfig'
import { type SparkProps } from '../AnimationObjects/Spark'
import { ColorSchemes, ac, c } from '../AnimationObjects/utils'
import React from 'react'
import { PointsCollection } from './utils'

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

  const pointsCollection = new PointsCollection()
    .addLine({
      origin: grid.getCenter(),
      radius: 6,
      radiusGap: 2,
      lineNumber: 8,
      lineGapAngle: 45,
    })
    .addLine({
      origin: grid.getCenter(),
      radius: 8,
      radiusGap: 3,
      lineNumber: 6,
      lineGapAngle: 60,
    })
    .getLines()

  const confettiCollection: Pick<
    SparkProps,
    | 'points'
    | 'duration'
    | 'colorsWithBreakpoints'
    | 'startAtprogressOrchestration'
    | 'destructAtFrontProgress'
    | 'strokeWidth'
  >[] = useMemo(
    () => [
      ...pointsCollection.map((points, i) => ({
        points,
        duration: 900,
        colorsWithBreakpoints: ColorSchemes.createPinkColors(),
        startAtprogressOrchestration: 0,
        destructAtFrontProgress: still ? 1 : 0.4,
        strokeWidth,
      })),
    ],
    [pointsCollection, still, strokeWidth],
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

  const [confettiCount, setConfettiCount] = useState(confettiCollection.length)
  const [autoDraw, setAutoDraw] = useState(true)

  useEffect(() => {
    if (autoDraw && confettiCollection.length !== confettiCount) {
      reset()
      run()
      setConfettiCount(confettiCollection.length)
    }
  }, [confettiCollection.length, autoDraw])

  const gridCenter = grid.gridToPixelCoordinates(grid.getCenter())
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
      <Circle cx={gridCenter.x} cy={gridCenter.y} r={2} color={'red'} />
    </>
  )
})
