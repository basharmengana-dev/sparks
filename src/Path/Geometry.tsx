import type {
  SkContourMeasure,
  SkPath,
  SkRect,
  Vector,
} from '@shopify/react-native-skia'
import {
  fitbox,
  processTransform2d,
  Skia,
  vec,
} from '@shopify/react-native-skia'

export const fitRect = (src: SkRect, dst: SkRect) =>
  processTransform2d(fitbox('contain', src, dst))

export class PathGeometry {
  private totalLength = 0
  private contour: SkContourMeasure
  public path: SkPath

  constructor(path: SkPath, resScale = 1) {
    const it = Skia.ContourMeasureIter(path, false, resScale)
    const contour: SkContourMeasure = it.next()!
    this.totalLength = contour.length()
    this.contour = contour
    this.path = path
  }

  getTotalLength() {
    return this.totalLength
  }

  getPointAtLength(length: number) {
    const [pos] = this.contour.getPosTan(length)
    return pos
  }
}
