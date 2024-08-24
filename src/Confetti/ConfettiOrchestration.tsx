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
      radius: 2,
      radiusGap: 1,
      lineNumber: 3,
      startAngle: 45,
      lineGapAngle: 80,
      strokeWidth,
      duration: 800,
      startAtprogressOrchestration: 0,
      destructAtFrontProgress: still ? 1 : 0.4,
      colorsWithBreakpoints: ColorSchemes.createPinkColors(),
    })
    .addLine({
      origin: grid.getCenter(),
      radius: 3,
      radiusGap: 1,
      lineNumber: 2,
      startAngle: 180,
      lineGapAngle: 180,
      strokeWidth,
      duration: 500,
      startAtprogressOrchestration: 0.15,
      destructAtFrontProgress: still ? 1 : 0.4,
      colorsWithBreakpoints: ColorSchemes.createBlueColors(),
    })
    .addLine({
      origin: grid.getCenter(),
      radius: 3.5,
      radiusGap: 1,
      lineNumber: 3,
      startAngle: 70,
      lineGapAngle: 90,
      strokeWidth,
      duration: 600,
      startAtprogressOrchestration: 0.25,
      destructAtFrontProgress: still ? 1 : 0.4,
      colorsWithBreakpoints: ColorSchemes.createPurpleColors(),
    })
    .addLine({
      origin: grid.getCenter(),
      radius: 3.5,
      radiusGap: 1,
      lineNumber: 5,
      startAngle: -20,
      lineGapAngle: -50,
      strokeWidth,
      duration: 600,
      startAtprogressOrchestration: 0.3,
      destructAtFrontProgress: still ? 1 : 0.4,
      colorsWithBreakpoints: ColorSchemes.createYellowColors(),
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
      {/* <Circle cx={gridCenter.x} cy={gridCenter.y} r={2} color={'red'} /> */}
    </>
  )
})
