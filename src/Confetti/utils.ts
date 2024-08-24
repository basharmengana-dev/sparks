import { SkPoint } from '@shopify/react-native-skia'
import { SparkProps } from '../AnimationObjects/Spark'
import { ColorSchemes } from '../AnimationObjects/utils'
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

export class PointsCollection {
  private confettiConfig: Pick<
    SparkProps,
    | 'points'
    | 'duration'
    | 'colorsWithBreakpoints'
    | 'startAtprogressOrchestration'
    | 'destructAtFrontProgress'
    | 'strokeWidth'
  >[] = []

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
  }: {
    origin: SkPoint
    radius: number
    radiusGap: number
    lineNumber: number
    startAngle: number
    lineGapAngle: number
    duration: number
    colorsWithBreakpoints: ReturnType<typeof ColorSchemes.createPinkColors>
    startAtprogressOrchestration: number
    destructAtFrontProgress: number
    strokeWidth: StrokeWidthToken
  }): PointsCollection {
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

  getConfettiConfig() {
    return this.confettiConfig
  }
}
