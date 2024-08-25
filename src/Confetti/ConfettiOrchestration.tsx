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
      strokeWidth: 'stroke/2',
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
      strokeWidth: 'stroke/3',
      duration: 500,
      startAtprogressOrchestration: 0.15,
      destructAtFrontProgress: still ? 1 : 0.4,
      colorsWithBreakpoints: ColorSchemes.createBlueColors(),
    })
    .addLine({
      origin: grid.getCenter(),
      radius: 3.5,
      radiusGap: 2,
      lineNumber: 3,
      startAngle: 70,
      lineGapAngle: 90,
      strokeWidth: 'stroke/2',
      duration: 600,
      startAtprogressOrchestration: 0.25,
      destructAtFrontProgress: still ? 1 : 0.4,
      colorsWithBreakpoints: ColorSchemes.createPurpleColors(),
    })
    .addLine({
      origin: grid.getCenter(),
      radius: 3.5,
      radiusGap: 1.5,
      lineNumber: 5,
      startAngle: -20,
      lineGapAngle: -50,
      strokeWidth: 'stroke/4',
      duration: 600,
      startAtprogressOrchestration: 0.3,
      destructAtFrontProgress: still ? 1 : 0.4,
      colorsWithBreakpoints: ColorSchemes.createYellowColors(),
    })
    .addLoopedLine({
      origin: grid.getCenter(),
      radius: 4,
      radiusGap: 1,
      rotateAngle: 30,
      loopFacing: 'up',
      numberOfLoops: 1,
      loopOffsetSteps: 1,
      loopStart: 0.4,
      strokeWidth: 'stroke/2',
      duration: 700,
      colorsWithBreakpoints: ColorSchemes.createRedColors(),
      startAtprogressOrchestration: 0.1,
      destructAtFrontProgress: still ? 1 : 0.3,
    })
    .addLoopedLine({
      origin: grid.getCenter(),
      radius: 5,
      radiusGap: 1.5,
      rotateAngle: -100,
      loopFacing: 'down',
      numberOfLoops: 1,
      loopOffsetSteps: 1.3,
      strokeWidth: 'stroke/3',
      loopStart: 0.6,
      duration: 700,
      colorsWithBreakpoints: ColorSchemes.createSunsetColors(),
      startAtprogressOrchestration: 0.0,
      destructAtFrontProgress: still ? 1 : 0.4,
    })
    .addLoopedLine({
      origin: grid.getCenter(),
      radius: 6,
      radiusGap: 1.25,
      rotateAngle: 100,
      loopFacing: 'up',
      numberOfLoops: 1,
      loopOffsetSteps: 2,
      strokeWidth: 'stroke/3',
      loopStart: 0.3,
      duration: 700,
      colorsWithBreakpoints: ColorSchemes.createOceanColors(),
      startAtprogressOrchestration: 0.0,
      destructAtFrontProgress: still ? 1 : 0.4,
    })
    .addLoopedLine({
      origin: grid.getCenter(),
      radius: 5,
      radiusGap: 1.5,
      rotateAngle: 310,
      loopFacing: 'up',
      numberOfLoops: 1,
      loopOffsetSteps: 1,
      strokeWidth: 'stroke/1',
      loopStart: 0.2,
      duration: 800,
      colorsWithBreakpoints: ColorSchemes.createGreenColors(),
      startAtprogressOrchestration: 0.0,
      destructAtFrontProgress: still ? 1 : 0.5,
    })
    .addLine({
      origin: grid.getCenter(),
      radius: 1,
      radiusGap: 4,
      lineNumber: 7,
      startAngle: 10,
      lineGapAngle: 50,
      strokeWidth: 'stroke/3',
      duration: 500,
      startAtprogressOrchestration: 0.9,
      destructAtFrontProgress: still ? 1 : 0.4,
      colorsWithBreakpoints: ColorSchemes.createPastelColors(),
    })
    .addLine({
      origin: grid.getCenter(),
      radius: 1,
      radiusGap: 3.8,
      lineNumber: 7,
      startAngle: 30,
      lineGapAngle: 50,
      strokeWidth: 'stroke/3',
      duration: 500,
      startAtprogressOrchestration: 0.9,
      destructAtFrontProgress: still ? 1 : 0.4,
      colorsWithBreakpoints: ColorSchemes.createTealColors(),
    })
    .addLine({
      origin: grid.getCenter(),
      radius: 1,
      radiusGap: 2.5,
      lineNumber: 7,
      startAngle: 40,
      lineGapAngle: 50,
      strokeWidth: 'stroke/2',
      duration: 500,
      startAtprogressOrchestration: 0.9,
      destructAtFrontProgress: still ? 1 : 0.4,
      colorsWithBreakpoints: ColorSchemes.createRedColors(),
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
      <Circle cx={gridCenter.x} cy={gridCenter.y} r={2} color={'red'} />
    </>
  )
})
