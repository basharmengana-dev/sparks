import { SkPoint } from '@shopify/react-native-skia'

const createLine = ({
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

const createLineCollection = ({
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
  private lines: SkPoint[][] = []

  addLine({
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
  }): PointsCollection {
    const newLines = Array.from({ length: lineNumber }, (_, i) =>
      createLine({
        origin,
        radius,
        rotateAngle: startAngle + i * lineGapAngle,
        radiusGap,
      }),
    )
    this.lines.push(...newLines)
    return this
  }

  getLines() {
    return this.lines
  }
}
