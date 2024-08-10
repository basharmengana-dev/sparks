import React from 'react'
import {
  Skia,
  Canvas,
  Paint,
  Path,
  LinearGradient,
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
  const newPos = {
    x: pos.x * grid.cellWidth,
    y: grid.gridHeight - pos.y * grid.cellHeight,
  }

  const newWidth = width * grid.cellWidth
  const newHeight = height * grid.cellHeight

  const path = Skia.Path.Make()
  path.moveTo(newPos.x, newPos.y - newHeight / 2)
  path.quadTo(
    newPos.x + newWidth / 2,
    newPos.y - newHeight,
    newPos.x + newWidth,
    newPos.y - newHeight / 2,
  )
  path.quadTo(
    newPos.x + newWidth / 2,
    newPos.y,
    newPos.x,
    newPos.y - newHeight / 2,
  )
  path.close()

  const transform = useDerivedValue(() => {
    const currentAngle = startAngle + (endAngle - startAngle) * progress.value
    const angleInRadians = (currentAngle * Math.PI) / 180
    const centerX = newPos.x
    const centerY = newPos.y - newHeight / 2

    return processTransform2d([
      { translateX: centerX },
      { translateY: centerY },
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
