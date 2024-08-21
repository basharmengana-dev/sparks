import type {
  SkContourMeasure,
  SkPath,
  SkPoint,
} from '@shopify/react-native-skia'
import { Skia } from '@shopify/react-native-skia'
import { line, curveNatural } from 'd3-shape'
import { Grid } from '../Grid'

export class PathGeometry {
  private totalLength = 0
  private contour: SkContourMeasure
  public path: SkPath

  constructor({ points, grid }: { points: SkPoint[]; grid: Grid }) {
    const svg = this.createSmoothSVGPath({
      grid,
      points,
    })
    const path = Skia.Path.MakeFromSVGString(svg)!
    const it = Skia.ContourMeasureIter(path, false, 1)
    const contour: SkContourMeasure = it.next()!

    this.totalLength = contour.length()
    this.contour = contour
    this.path = path
  }

  public getTotalLength = () => {
    return this.totalLength
  }

  public getPointAtLength = (length: number) => {
    const [pos] = this.contour.getPosTan(length)
    return pos
  }

  private findPathIntersectionWithDistance = (
    points: Float32Array,
    distances: Float32Array,
  ): Float32Array => {
    const n = points.length / 2
    let minDistance = Infinity

    const intersection = new Float32Array(3)

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const x1 = points[2 * i]
        const y1 = points[2 * i + 1]
        const x2 = points[2 * j]
        const y2 = points[2 * j + 1]

        const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))

        if (distance < minDistance) {
          minDistance = distance
          intersection[0] = x2
          intersection[1] = y2
          intersection[2] = distances[j]
        }
      }
    }

    return intersection
  }

  private findTangent = ({
    points,
    intersection,
    expansionFactor,
  }: {
    points: Float32Array
    intersection: Float32Array
    expansionFactor: number
  }) => {
    const intersectionX = intersection[0]
    const intersectionY = intersection[1]
    let minDistance = Infinity
    let closestIndex = -1

    for (let i = 0; i < points.length / 2; i++) {
      const x = points[2 * i]
      const y = points[2 * i + 1]
      const distance = Math.sqrt(
        Math.pow(intersectionX - x, 2) + Math.pow(intersectionY - y, 2),
      )

      if (distance < minDistance && distance < 0.1) {
        minDistance = distance
        closestIndex = i
      }
    }

    let p1: [number, number], p2: [number, number]
    if (closestIndex === 0) {
      p1 = [points[0], points[1]]
      p2 = [points[2], points[3]]
    } else if (closestIndex === points.length / 2 - 1) {
      p1 = [points[2 * (closestIndex - 1)], points[2 * (closestIndex - 1) + 1]]
      p2 = [points[2 * closestIndex], points[2 * closestIndex + 1]]
    } else {
      p1 = [points[2 * closestIndex], points[2 * closestIndex + 1]]
      p2 = [points[2 * (closestIndex + 1)], points[2 * (closestIndex + 1) + 1]]
    }

    const direction = [p2[0] - p1[0], p2[1] - p1[1]]
    const length = Math.sqrt(direction[0] ** 2 + direction[1] ** 2)
    const normalizeDirection = [direction[0] / length, direction[1] / length]

    const extendedP1 = [
      intersection[0] - normalizeDirection[0] * length * expansionFactor,
      intersection[1] - normalizeDirection[1] * length * expansionFactor,
    ]
    const extendedP2 = [
      intersection[0] + normalizeDirection[0] * length * expansionFactor,
      intersection[1] + normalizeDirection[1] * length * expansionFactor,
    ]

    return { p1: extendedP1, p2: extendedP2 }
  }

  public findIntersections = ({
    points,
    distances,
    expectedIntersections = 10,
    expansionFactor,
  }: {
    points: Float32Array
    distances: Float32Array
    expectedIntersections: number
    expansionFactor: number
  }) => {
    const intersections = []

    // Clone the points and distances arrays to avoid mutating the originals
    let currentPoints = points.slice()
    let currentDistances = distances.slice()

    for (let k = 0; k < expectedIntersections; k++) {
      if (currentPoints.length < 4) break // Need at least 2 points to form an intersection

      const intersection = this.findPathIntersectionWithDistance(
        currentPoints,
        currentDistances,
      )

      if (intersection[2] === Infinity) break // No more intersections

      const tangent = this.findTangent({
        points: currentPoints,
        intersection,
        expansionFactor,
      })
      intersections.push([intersection[2], ...tangent.p1, ...tangent.p2])

      // Remove the points that were part of the intersection
      const newPoints = []
      const newDistances = []
      for (let i = 0; i < currentPoints.length / 2; i++) {
        const x = currentPoints[2 * i]
        const y = currentPoints[2 * i + 1]
        if (x !== intersection[0] || y !== intersection[1]) {
          newPoints.push(x, y)
          newDistances.push(currentDistances[i])
        }
      }

      currentPoints = new Float32Array(newPoints)
      currentDistances = new Float32Array(newDistances)
    }

    return intersections.flat()
  }

  private createSmoothSVGPath({
    points,
    grid,
  }: {
    points: SkPoint[]
    grid: Grid
  }): string {
    if (points.length === 0) {
      return ''
    }

    const newPoints = points.map(p => grid.gridToPixelCoordinates(p))

    const lineGenerator = line<SkPoint>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(curveNatural)

    const pathData = lineGenerator(newPoints)

    if (!pathData) {
      return ''
    }

    return pathData
  }
}
