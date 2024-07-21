import type {
  SkContourMeasure,
  SkHostRect,
  SkPath,
  SkPoint,
  SkRect,
  Vector,
} from '@shopify/react-native-skia'
import {
  fitbox,
  processTransform2d,
  rect,
  Skia,
} from '@shopify/react-native-skia'

const fitRect = (src: SkRect, dst: SkRect) =>
  processTransform2d(fitbox('contain', src, dst))

interface Point {
  x: number
  y: number
}
function getPointsFromPath(path: SkPath): Point[] {
  const points: Point[] = []
  const pathData = path.toSVGString()
  const commands = pathData.match(/[a-df-z][^a-df-z]*/gi)

  if (!commands) return points

  for (const command of commands) {
    const values = command
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(parseFloat)
    for (let i = 0; i < values.length; i += 2) {
      points.push({ x: values[i], y: values[i + 1] })
    }
  }

  return points
}

function findBottommostPoint(points: Point[]): Point {
  return points.reduce(
    (bottommost, point) => (point.y > bottommost.y ? point : bottommost),
    points[0],
  )
}

function translateSkPathToPosition(
  path: SkPath,
  targetX: number,
  targetY: number,
): SkPath {
  const points = getPointsFromPath(path)
  if (!points.length) return path

  const bottommostPoint = findBottommostPoint(points)
  const dx = targetX - bottommostPoint.x
  const dy = targetY - bottommostPoint.y

  const matrix = Skia.Matrix()
  matrix.translate(dx, dy)

  const transformedPath = Skia.Path.Make()
  transformedPath.addPath(path, matrix)

  return transformedPath
}

export class PathGeometry {
  private totalLength = 0
  private contour: SkContourMeasure
  public path: SkPath

  constructor(svg: string, origin: SkPoint, size: SkPoint) {
    let path = Skia.Path.MakeFromSVGString(svg)!
    const src = path.computeTightBounds()
    const m3 = fitRect(src, rect(0, 0, size.x, size.y))

    path.transform(m3)
    path = translateSkPathToPosition(path, origin.x, origin.y)

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

  private findTangent = (
    points: Float32Array,
    intersection: Float32Array,
    strokeWidth: number,
  ) => {
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

    const expansionFactor = strokeWidth / 2
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

  public findIntersections = (
    points: Float32Array,
    distances: Float32Array,
    strokeWidth: number,
    expectedIntersections: number = 10,
  ) => {
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

      const tangent = this.findTangent(currentPoints, intersection, strokeWidth)
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
}
