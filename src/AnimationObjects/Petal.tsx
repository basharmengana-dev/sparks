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
} from '@shopify/react-native-skia'
import { Grid } from '../Grid'
import {
  useDerivedValue,
  SharedValue,
  useAnimatedReaction,
} from 'react-native-reanimated'

type PetalProps = {
  pos: SkPoint
  width: number
  height: number
  grid: Grid
  startAngle: number
  endAngle: number
  progress: SharedValue<number>
}

export const Petal: React.FC<PetalProps> = ({
  pos,
  width,
  height,
  grid,
  startAngle,
  endAngle,
  progress,
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

  return (
    <Path path={path} matrix={transform}>
      <Paint>
        <LinearGradient
          start={gradientStart}
          end={gradientEnd}
          colors={['#ff0000', '#00ff00']}
        />
      </Paint>
    </Path>
  )
}
