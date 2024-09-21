import { Circle } from '@shopify/react-native-skia'
import { SharedValue } from 'react-native-reanimated'
import { RGBA } from '../AnimationObjects/ColorSchemas'
import { heightPercentageToDP, widthPercentageToDP } from './utils'

export type GridOptions = {
  gridWidth: number
  gridHeight: number
  cellWidth: number
  cellHeight: number
  radius?: number
}

export class Grid {
  gridWidth: number
  gridHeight: number
  cellWidth: number
  cellHeight: number
  radius: number

  constructor({
    gridWidth,
    gridHeight,
    cellWidth,
    cellHeight,
    radius = 2,
  }: GridOptions) {
    this.gridWidth = widthPercentageToDP(gridWidth)
    this.gridHeight = heightPercentageToDP(gridHeight)
    this.cellWidth = widthPercentageToDP(cellWidth)
    this.cellHeight = heightPercentageToDP(cellHeight)
    this.radius = radius
  }

  calculatePosition(xRatio: number, yRatio: number) {
    return { x: this.gridWidth * xRatio, y: this.gridHeight * yRatio }
  }

  convertToGridCoordinates(x: number, y: number) {
    return {
      x: x / this.cellWidth,
      y: (this.gridHeight - y) / this.cellHeight,
    }
  }

  public gridToPixelSize(size: { width: number; height: number }) {
    return {
      width: size.width * this.cellWidth,
      height: size.height * this.cellHeight,
    }
  }

  public gridToPixelCoordinates(point: { x: number; y: number }) {
    return {
      x: point.x * this.cellWidth,
      y: this.gridHeight - point.y * this.cellHeight,
    }
  }

  getBottomCenter() {
    const pos = this.calculatePosition(0.5, 1)
    return this.convertToGridCoordinates(pos.x, pos.y)
  }

  getCenter() {
    const pos = this.calculatePosition(0.5, 0.5)
    return this.convertToGridCoordinates(pos.x, pos.y)
  }

  getTopCenter() {
    const pos = this.calculatePosition(0.5, 0)
    return this.convertToGridCoordinates(pos.x, pos.y)
  }

  getCenterLeft() {
    const pos = this.calculatePosition(0, 0.5)
    return this.convertToGridCoordinates(pos.x, pos.y)
  }

  getCenterRight() {
    const pos = this.calculatePosition(1, 0.5)
    return this.convertToGridCoordinates(pos.x, pos.y)
  }

  generateCircles({
    dotColor,
    printAnchorDots,
  }: {
    dotColor: SharedValue<RGBA> | string
    printAnchorDots: boolean
  }) {
    const gridColumns = this.gridWidth / this.cellWidth
    const gridRows = this.gridHeight / this.cellHeight

    const circles = []

    for (let i = 0; i <= gridColumns; i++) {
      for (let j = 0; j < gridRows; j++) {
        const gridPosition = { x: i, y: j }
        const { x: cx, y: cy } = this.gridToPixelCoordinates(gridPosition)

        circles.push(
          <Circle
            cx={cx}
            cy={cy}
            r={this.radius}
            color={dotColor}
            key={`${i}-${j}`}
          />,
        )
      }
    }

    if (!printAnchorDots) return circles

    // NOTE: Add guiding points
    const gridCenter = this.gridToPixelCoordinates(this.getCenter())
    circles.push(
      <Circle
        cx={gridCenter.x}
        cy={gridCenter.y}
        r={2}
        color={'red'}
        key={'center'}
      />,
    )

    const gridBottomCenter = this.gridToPixelCoordinates(this.getBottomCenter())
    circles.push(
      <Circle
        cx={gridBottomCenter.x}
        cy={gridBottomCenter.y}
        r={2}
        color={'red'}
        key={'bottom-center'}
      />,
    )

    const gridTopCenter = this.gridToPixelCoordinates(this.getTopCenter())
    circles.push(
      <Circle
        cx={gridTopCenter.x}
        cy={gridTopCenter.y}
        r={2}
        color={'red'}
        key={'top-center'}
      />,
    )

    const gridCenterLeft = this.gridToPixelCoordinates(this.getCenterLeft())
    circles.push(
      <Circle
        cx={gridCenterLeft.x}
        cy={gridCenterLeft.y}
        r={2}
        color={'red'}
        key={'center-left'}
      />,
    )

    const gridCenterRight = this.gridToPixelCoordinates(this.getCenterRight())
    circles.push(
      <Circle
        cx={gridCenterRight.x}
        cy={gridCenterRight.y}
        r={2}
        color={'red'}
        key={'center-right'}
      />,
    )

    return circles
  }
}
