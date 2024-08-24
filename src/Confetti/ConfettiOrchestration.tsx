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

function createLine({
  origin,
  radius,
  radiusGap,
  rotateAngle,
}: {
  origin: SkPoint
  radius: number
  radiusGap: number
  rotateAngle: number
}): SkPoint[] {
  const angleInRadians = (rotateAngle * Math.PI) / 180

  const startPoint: SkPoint = {
    x: origin.x + radiusGap * Math.cos(angleInRadians),
    y: origin.y + radiusGap * Math.sin(angleInRadians),
  }

  const endPoint: SkPoint = {
    x: startPoint.x + radius * Math.cos(angleInRadians),
    y: startPoint.y + radius * Math.sin(angleInRadians),
  }

  const points = Array.from({ length: radius + 1 }, (_, i) => {
    const t = i / radius
    return {
      x: startPoint.x + t * (endPoint.x - startPoint.x),
      y: startPoint.y + t * (endPoint.y - startPoint.y),
    }
  })

  return points
}

function createLineCollection({
  origin,
  radius,
  radiusGap,
  lineNumber,
  lineGapAngle,
  startAngle = 0,
}: {
  origin: SkPoint
  radius: number
  radiusGap: number
  lineNumber: number
  lineGapAngle: number
  startAngle?: number
}): SkPoint[][] {
  return Array.from({ length: lineNumber }, (_, i) =>
    createLine({
      origin,
      radius,
      rotateAngle: startAngle + i * lineGapAngle,
      radiusGap,
    }),
  )
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

  const pointsCollection = createLineCollection({
    origin: grid.getCenter(),
    radius: 6,
    radiusGap: 2,
    lineNumber: 8,
    lineGapAngle: 45,
  })

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
      ...pointsCollection.map(points => ({
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
