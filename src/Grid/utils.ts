import { SkPoint } from '@shopify/react-native-skia'
import { Dimensions } from 'react-native'

export const createLineWithOrigin = (...points: SkPoint[]): SkPoint[] => {
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

export const getLast = (points: SkPoint[]): SkPoint => {
  if (points.length === 0) {
    throw new Error('Points array cannot be empty')
  }

  return points[points.length - 1]
}

export const add = (a: SkPoint, b: SkPoint): SkPoint => ({
  x: a.x + b.x,
  y: a.y + b.y,
})

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export const widthPercentageToDP = (widthPercent: number) =>
  (screenWidth * widthPercent) / 100

export const heightPercentageToDP = (heightPercent: number) =>
  (screenHeight * heightPercent) / 100
