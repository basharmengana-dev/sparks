import { SkPoint } from '@shopify/react-native-skia'

export const createLineWithOrigin = (points: SkPoint[]): SkPoint[] => {
  if (points.length === 0) return []

  const [startPoint, ...rest] = points

  return [
    startPoint,
    ...rest.map(point => ({
      x: startPoint.x + point.x,
      y: startPoint.y + point.y,
    })),
  ]
}
