import React from 'react'
import {
  Skia,
  Path,
  vec,
  SkPoint,
  processTransform2d,
  Shader,
} from '@shopify/react-native-skia'
import { Grid } from '../Grid'
import { useDerivedValue, SharedValue } from 'react-native-reanimated'
import { shaderSource } from '../Flower/Shader'

type GradientStop = {
  color: string
  pos: number
}

type PetalProps = {
  pos: SkPoint
  width: number
  height: number
  grid: Grid
  startAngle: number
  endAngle: number
  progress: SharedValue<number>
  gradient: GradientStop[]
}

export const Petal: React.FC<PetalProps> = ({
  pos,
  width,
  height,
  grid,
  startAngle,
  endAngle,
  progress,
  gradient,
}) => {
  const newPos = grid.gridToPixelCoordinates(pos)

  const { width: newWidth, height: newHeight } = grid.gridToPixelSize({
    width,
    height,
  })

  const path = Skia.Path.Make()

  // Start at the bottom-center of the petal
  path.moveTo(newPos.x, newPos.y - newHeight / 2)

  // First curve: from bottom-center to top-right
  path.cubicTo(
    newPos.x + newWidth / 3, // First control point x
    newPos.y - newHeight * 1.2, // First control point y (less exaggerated)
    newPos.x + (2 * newWidth) / 3, // Second control point x
    newPos.y - newHeight * 1.2, // Second control point y (less exaggerated)
    newPos.x + newWidth, // End point x (right edge)
    newPos.y - newHeight / 2, // End point y (top-right)
  )

  // Second curve: from top-right back to bottom-center
  path.cubicTo(
    newPos.x + (2 * newWidth) / 3, // First control point x
    newPos.y + newHeight * 0.2, // First control point y (less exaggerated)
    newPos.x + newWidth / 3, // Second control point x
    newPos.y + newHeight * 0.2, // Second control point y (less exaggerated)
    newPos.x, // End point x (bottom-center)
    newPos.y - newHeight / 2, // End point y (bottom-center)
  )

  const transform = useDerivedValue(() => {
    const currentAngle = startAngle + (endAngle - startAngle) * progress.value
    const angleInRadians = (currentAngle * Math.PI) / 180
    const centerX = newPos.x
    const centerY = newPos.y - newHeight / 2

    return processTransform2d([
      { translateX: centerX },
      { translateY: centerY },
      { translateY: newHeight / 2 },
      { rotate: -angleInRadians },
      { translateX: -centerX },
      { translateY: -centerY },
    ])
  })

  const gradientStart = vec(newPos.x, newPos.y - newHeight / 2)
  const gradientEnd = vec(newPos.x + newWidth, newPos.y - newHeight / 2)

  // Extract colors and positions, pad to 10 elements
  const colors = gradient.map(stop => Skia.Color(stop.color))
  const positions = gradient.map(stop => stop.pos)
  const paddedColors = [
    ...colors,
    ...Array(10 - colors.length).fill(Skia.Color('black')),
  ]
  const paddedPositions = [
    ...positions,
    ...Array(10 - positions.length).fill(1),
  ]

  const uniforms = useDerivedValue(() => ({
    start: gradientStart,
    end: gradientEnd,
    colors: paddedColors,
    positions: paddedPositions,
    numStops: gradient.length,
    progress: progress.value,
  }))

  return (
    <Path path={path} matrix={transform}>
      <Shader source={shaderSource} uniforms={uniforms} />
    </Path>
  )
}
