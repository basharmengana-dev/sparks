import { Circle } from '@shopify/react-native-skia'

export type GridOptions = {
  gridWidth: number
  gridHeight: number
  cellWidth: number
  cellHeight: number
  color?: string
  radius?: number
}

export const Grid = ({
  gridWidth,
  gridHeight,
  cellWidth,
  cellHeight,
  color = 'white',
  radius = 2,
}: GridOptions) => {
  const gridColumns = Math.ceil(gridWidth / cellWidth)
  const gridRows = Math.ceil(gridHeight / cellHeight)

  const circles = []

  for (let i = 0; i < gridColumns; i++) {
    for (let j = 0; j < gridRows; j++) {
      const cx = i * cellWidth
      const cy = j * cellHeight
      circles.push(
        <Circle cx={cx} cy={cy} r={radius} color={color} key={`${i}-${j}`} />,
      )
    }
  }

  return circles
}
