import type {
  SkContourMeasure,
  SkHostRect,
  SkPath,
  SkRect,
} from '@shopify/react-native-skia'
import { fitbox, processTransform2d, Skia } from '@shopify/react-native-skia'
import { Dimensions } from 'react-native'

const fitRect = (src: SkRect, dst: SkRect) =>
  processTransform2d(fitbox('contain', src, dst))

export class PathGeometry {
  private totalLength = 0
  private contour: SkContourMeasure
  public path: SkPath

  constructor(svg: string, dst: SkHostRect) {
    const path = Skia.Path.MakeFromSVGString(svg)!
    const src = path.computeTightBounds()
    const m3 = fitRect(src, dst)
    path.transform(m3)

    // const { width, height } = Dimensions.get('window')
    // path.transform(
    //   processTransform2d([{ translateY: height * 0.6 }, { scale: 0.2 }]),
    // )

    const it = Skia.ContourMeasureIter(path, false, 1)
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
