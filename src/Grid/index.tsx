import { Dimensions } from 'react-native'
import { Circle } from '@shopify/react-native-skia'

const { width, height } = Dimensions.get('window')

export type GridOptions = {
  gridWidth: number
  gridHeight: number
  cellWidth: number
  cellHeight: number
  color?: string
  radius?: number
}

export class Grid {
  gridWidth: number
  gridHeight: number
  cellWidth: number
  cellHeight: number
  color: string
  radius: number

  constructor({
    gridWidth,
    gridHeight,
    cellWidth,
    cellHeight,
    color = 'white',
    radius = 2,
  }: GridOptions) {
    this.gridWidth = gridWidth
    this.gridHeight = gridHeight
    this.cellWidth = cellWidth
    this.cellHeight = cellHeight
    this.color = color
    this.radius = radius
  }

  convertToGridCoordinates(x: number, y: number) {
    return {
      x: Math.ceil(x / this.cellWidth),
      y: Math.ceil((this.gridHeight - y) / this.cellHeight),
    }
  }

  calculatePosition(xRatio: number, yRatio: number) {
    return { x: width * xRatio, y: height * yRatio }
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

  getBottomQuarterCenter() {
    const pos = this.calculatePosition(0.25, 1)
    return this.convertToGridCoordinates(pos.x, pos.y)
  }

  // Method to generate grid circles
  generateCircles() {
    const gridColumns = Math.ceil(this.gridWidth / this.cellWidth)
    const gridRows = Math.ceil(this.gridHeight / this.cellHeight)

    const circles = []

    for (let i = 0; i < gridColumns; i++) {
      for (let j = 0; j < gridRows; j++) {
        const cx = i * this.cellWidth
        const cy = j * this.cellHeight
        circles.push(
          <Circle
            cx={cx}
            cy={cy}
            r={this.radius}
            color={this.color}
            key={`${i}-${j}`}
          />,
        )
      }
    }

    return circles
  }
}
