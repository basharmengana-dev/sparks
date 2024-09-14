import { SkPoint } from '@shopify/react-native-skia'
import { SparkProps } from '../AnimationObjects/Spark'

import { type ColorSchema } from '../AnimationObjects/ColorSchemas'
import { StrokeWidthToken } from '../AnimationObjects/getAnimationConfig'

export const createLine = ({
  origin,
  radius,
  radiusGap,
  rotateAngle,
}: {
  origin: SkPoint
  radius: number
  radiusGap: number
  rotateAngle: number
}): SkPoint[] => {
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

export const createLoopedLine = ({
  origin,
  radius,
  radiusGap,
  rotateAngle,
  loopFacing,
  numberOfLoops,
  gridStepsBetweenLoops,
  loopOffsetSteps,
  loopStart,
}: {
  origin: SkPoint
  radius: number
  radiusGap: number
  rotateAngle: number
  loopFacing: 'up' | 'down'
  numberOfLoops: 1 | 2
  gridStepsBetweenLoops: number
  loopOffsetSteps: number
  loopStart: number // 0 to 1, where 0 is the start and 1 is the end of the line
}): SkPoint[] => {
  const angleInRadians = (rotateAngle * Math.PI) / 180

  // Calculate start point
  const startPoint: SkPoint = {
    x: origin.x + radiusGap * Math.cos(angleInRadians),
    y: origin.y + radiusGap * Math.sin(angleInRadians),
  }

  // Calculate end point
  const endPoint: SkPoint = {
    x: startPoint.x + radius * Math.cos(angleInRadians),
    y: startPoint.y + radius * Math.sin(angleInRadians),
  }

  // Calculate the first loop's start point based on loopStart
  const firstLoopStartPoint: SkPoint = {
    x: startPoint.x + loopStart * (endPoint.x - startPoint.x),
    y: startPoint.y + loopStart * (endPoint.y - startPoint.y),
  }

  // Calculate the loop points relative to the line's first loop start point before rotation
  const loopOffset = {
    x: loopOffsetSteps, // Move right by the specified number of grid steps
    y: loopFacing === 'up' ? -loopOffsetSteps : loopOffsetSteps, // Move up or down by the specified number of grid steps
  }

  // Calculate points for the first loop
  const midPoint1: SkPoint = {
    x: firstLoopStartPoint.x + loopOffset.x,
    y: firstLoopStartPoint.y - loopOffset.y,
  }

  const midPoint2: SkPoint = {
    x: midPoint1.x - 2 * loopOffset.x,
    y: midPoint1.y,
  }

  // Rotate the loop points around the first loop start point
  const rotatedMidPoint1 = rotatePoint(
    midPoint1,
    firstLoopStartPoint,
    angleInRadians,
  )
  const rotatedMidPoint2 = rotatePoint(
    midPoint2,
    firstLoopStartPoint,
    angleInRadians,
  )

  // Initialize the points array with the first loop
  let points = [
    startPoint,
    firstLoopStartPoint,
    rotatedMidPoint1,
    rotatedMidPoint2,
    firstLoopStartPoint,
  ]

  // If a second loop is needed, calculate and add the second loop
  if (numberOfLoops === 2) {
    // Adjust the midpoint for the second loop by using gridStepsBetweenLoops
    const secondLoopStartPoint: SkPoint = {
      x:
        firstLoopStartPoint.x +
        gridStepsBetweenLoops * Math.cos(angleInRadians),
      y:
        firstLoopStartPoint.y +
        gridStepsBetweenLoops * Math.sin(angleInRadians),
    }

    // Calculate points for the second loop
    const midPoint3: SkPoint = {
      x: secondLoopStartPoint.x + loopOffset.x,
      y: secondLoopStartPoint.y - loopOffset.y,
    }

    const midPoint4: SkPoint = {
      x: midPoint3.x - 2 * loopOffset.x,
      y: midPoint3.y,
    }

    // Rotate the second loop points around the second loop start point
    const rotatedMidPoint3 = rotatePoint(
      midPoint3,
      secondLoopStartPoint,
      angleInRadians,
    )
    const rotatedMidPoint4 = rotatePoint(
      midPoint4,
      secondLoopStartPoint,
      angleInRadians,
    )

    // Add the second loop points to the array
    points.push(
      secondLoopStartPoint,
      rotatedMidPoint3,
      rotatedMidPoint4,
      secondLoopStartPoint,
    )
  }

  // Add the end point to the array
  points.push(endPoint)

  return points
}

// Function to rotate a point around the origin
const rotatePoint = (
  point: SkPoint,
  origin: SkPoint,
  angle: number,
): SkPoint => {
  const cosTheta = Math.cos(angle)
  const sinTheta = Math.sin(angle)
  const translatedX = point.x - origin.x
  const translatedY = point.y - origin.y

  return {
    x: origin.x + translatedX * cosTheta - translatedY * sinTheta,
    y: origin.y + translatedX * sinTheta + translatedY * cosTheta,
  }
}

export const createLineCollection = ({
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
}): SkPoint[][] => {
  return Array.from({ length: lineNumber }, (_, i) =>
    createLine({
      origin,
      radius,
      rotateAngle: startAngle + i * lineGapAngle,
      radiusGap,
    }),
  )
}

export type ConfettiSparkConfig = Pick<
  SparkProps,
  | 'points'
  | 'duration'
  | 'colorsWithBreakpoints'
  | 'startAtprogressOrchestration'
  | 'destructAtFrontProgress'
  | 'strokeWidth'
>

export type ConfettiLineConfig = {
  origin: SkPoint
  radius: number
  radiusGap: number
  lineNumber: number
  startAngle: number
  lineGapAngle: number
  duration: number
  colorsWithBreakpoints: ColorSchema
  startAtprogressOrchestration: number
  destructAtFrontProgress: number
  strokeWidth: StrokeWidthToken
}

export type ConfettiLoopConfig = {
  origin: SkPoint
  radius: number
  radiusGap: number
  rotateAngle: number
  loopFacing: 'up' | 'down'
  numberOfLoops: 1 | 2
  loopOffsetSteps: number
  gridStepsBetweenLoops?: number
  loopStart: number
  duration: number
  colorsWithBreakpoints: ColorSchema
  startAtprogressOrchestration: number
  destructAtFrontProgress: number
  strokeWidth: StrokeWidthToken
}

export class PointsCollection {
  private confettiConfig: ConfettiSparkConfig[] = []

  addLine({
    origin,
    radius,
    radiusGap,
    lineNumber,
    startAngle,
    lineGapAngle,
    duration,
    colorsWithBreakpoints,
    startAtprogressOrchestration,
    destructAtFrontProgress,
    strokeWidth,
  }: ConfettiLineConfig): PointsCollection {
    const newLines = createLineCollection({
      origin,
      radius,
      radiusGap,
      lineNumber,
      lineGapAngle,
      startAngle,
    })

    this.confettiConfig.push(
      ...newLines.map(points => ({
        points,
        duration,
        colorsWithBreakpoints,
        startAtprogressOrchestration,
        destructAtFrontProgress,
        strokeWidth,
      })),
    )

    return this
  }

  addLoopedLine({
    origin,
    radius,
    radiusGap,
    rotateAngle,
    loopFacing,
    numberOfLoops,
    loopOffsetSteps,
    gridStepsBetweenLoops = 0,
    loopStart,
    duration,
    colorsWithBreakpoints,
    startAtprogressOrchestration,
    destructAtFrontProgress,
    strokeWidth,
  }: ConfettiLoopConfig): PointsCollection {
    const loopedLine = createLoopedLine({
      origin,
      radius,
      radiusGap,
      rotateAngle,
      loopFacing,
      numberOfLoops,
      gridStepsBetweenLoops,
      loopOffsetSteps,
      loopStart,
    })

    this.confettiConfig.push({
      points: loopedLine,
      duration,
      colorsWithBreakpoints,
      startAtprogressOrchestration,
      destructAtFrontProgress,
      strokeWidth,
    })

    return this
  }

  getConfettiConfig() {
    return this.confettiConfig
  }
}
