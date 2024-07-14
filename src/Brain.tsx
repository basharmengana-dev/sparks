import {
  Canvas,
  Paint,
  PaintStyle,
  Path,
  SkPoint,
  SkRect,
  Skia,
  TileMode,
  Shader,
  Fill,
  dist,
  fitbox,
  processTransform2d,
  rect,
  vec,
  StrokeJoin,
  StrokeCap,
} from '@shopify/react-native-skia'
import { Dimensions, StyleSheet } from 'react-native'
import { PathGeometry, getPointAtLength } from './Geometry'
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { useEffect } from 'react'
import { svgPathProperties } from 'svg-path-properties'

export const fitRect = (src: SkRect, dst: SkRect) =>
  processTransform2d(fitbox('contain', src, dst))

const pad = 75
const { width, height } = Dimensions.get('window')
export const dst = rect(pad, pad, width - pad * 2, height - pad * 2)

const tolerance = StyleSheet.hairlineWidth
const tessellate = (
  geo: PathGeometry,
  t0: number,
  t1: number,
): { p1: SkPoint; p2: SkPoint; length: number }[] => {
  const p0 = geo.getPointAtLength(t0)
  const p1 = geo.getPointAtLength(t1)
  const t05 = (t0 + t1) / 2
  const p05 = getPointAtLength(0.5 * dist(p0, p1), p0, p1)
  const c05 = geo.getPointAtLength(t05)
  const d = dist(p05, c05)
  if (d > tolerance || dist(p0, p1) > 40) {
    return [...tessellate(geo, t0, t05), ...tessellate(geo, t05, t1)]
  } else {
    return [{ p1: p0, p2: p1, length: t0 }]
  }
}

export const prepare = (svg: string) => {
  const path = Skia.Path.MakeFromSVGString(svg)!
  const src = path.computeTightBounds()
  const m3 = fitRect(src, dst)
  path.transform(m3)
  const geo = new PathGeometry(path)
  const totalLength = geo.getTotalLength()
  const lines = tessellate(geo, 0, totalLength)
  return lines
}

const hello = prepare(
  // 'M10 10 C 20 20, 40 20, 50 10',
  // 'M 100,50 C 75,50 75,100 100,100 S 125,150 100,150 C 50,150 50,100 100,100 S 150,50 100,50',
  'M13.63 248.31C13.63 248.31 51.84 206.67 84.21 169.31C140.84 103.97 202.79 27.66 150.14 14.88C131.01 10.23 116.36 29.88 107.26 45.33C69.7 108.92 58.03 214.33 57.54 302.57C67.75 271.83 104.43 190.85 140.18 193.08C181.47 195.65 145.26 257.57 154.53 284.39C168.85 322.18 208.22 292.83 229.98 277.45C265.92 252.03 288.98 231.22 288.98 200.45C288.98 161.55 235.29 174.02 223.3 205.14C213.93 229.44 214.3 265.89 229.3 284.14C247.49 306.28 287.67 309.93 312.18 288.46C337 266.71 354.66 234.56 368.68 213.03C403.92 158.87 464.36 86.15 449.06 30.03C446.98 22.4 440.36 16.57 432.46 16.26C393.62 14.75 381.84 99.18 375.35 129.31C368.78 159.83 345.17 261.31 373.11 293.06C404.43 328.58 446.29 262.4 464.66 231.67C468.66 225.31 472.59 218.43 476.08 213.07C511.33 158.91 571.77 86.19 556.46 30.07C554.39 22.44 547.77 16.61 539.87 16.3C501.03 14.79 489.25 99.22 482.76 129.35C476.18 159.87 452.58 261.35 480.52 293.1C511.83 328.62 562.4 265.53 572.64 232.86C587.34 185.92 620.94 171.58 660.91 180.29C616 166.66 580.86 199.67 572.64 233.16C566.81 256.93 573.52 282.16 599.25 295.77C668.54 332.41 742.8 211.69 660.91 180.29C643.67 181.89 636.15 204.77 643.29 227.78C654.29 263.97 704.29 268.27 733.08 256',
)

export const Brain = () => {
  const progress = useSharedValue(0.6)

  const pathProgress = useDerivedValue(() => {
    const partOfPath = hello.slice(0, Math.floor(progress.value * hello.length))

    return partOfPath.reduce((acc, line) => {
      return `${acc} M${line.p1.x} ${line.p1.y} L${line.p2.x} ${line.p2.y}`
    }, '')
  })
  const strokeWidth = 8

  const pathProperties = new svgPathProperties(pathProgress.value)
  const totalLength = pathProperties.getTotalLength()

  // Number of samples along the path
  const numSamples = 300
  const points = new Float32Array(numSamples * 2) // Array for storing x and y coordinates
  const distances = new Float32Array(numSamples) // Array for storing distances

  for (let i = 0; i < numSamples; i++) {
    const t = i / (numSamples - 1) // Normalized position [0, 1]
    const point = pathProperties.getPointAtLength(t * totalLength)
    points[i * 2] = point.x
    points[i * 2 + 1] = point.y
    distances[i] = t * totalLength
  }

  // Flatten arrays for passing to the shader
  const flattenedPoints = Array.from(points)
  const flattenedDistances = Array.from(distances)
  const searchThreshold = Math.floor(strokeWidth / 2)

  const colorThreshold = 0.65

  const uniforms = [
    totalLength,
    ...flattenedPoints,
    ...flattenedDistances,
    searchThreshold,
    colorThreshold,
  ]

  const source = Skia.RuntimeEffect.Make(`
    uniform float u_totalLength;
    uniform float u_points[600]; // 100 samples * 2 coordinates (x and y)
    uniform float u_distances[300];
    uniform float u_searchThreshold;
    uniform float u_colorThreshold; 
  
    float distanceSquared(vec2 p1, vec2 p2) {
      vec2 diff = p1 - p2;
      return dot(diff, diff);
    }

    float getClosestDistance(vec2 pos) {
      float minDistSq = distanceSquared(pos, vec2(u_points[0], u_points[1]));
      float bestDist = u_distances[0];

      for (int i = 1; i < 300; i++) {
        vec2 point = vec2(u_points[2 * i], u_points[2 * i + 1]);
        float distSq = distanceSquared(pos, point);

        if (distSq < minDistSq) {
          minDistSq = distSq;
          bestDist = u_distances[i];

          if (distSq < u_searchThreshold * u_searchThreshold) {
            break;
          }
        }
      }

      return bestDist;
    }
  
    vec4 main(vec2 pos) {
      float distanceAlongPath = getClosestDistance(pos);
      
      vec4 color;
      if (distanceAlongPath < u_colorThreshold * u_totalLength) {
        color = vec4(1, 0, 0, 1); // Red 
      } else {
        color = vec4(0, 1, 0, 1); // Green
      }
      
      return color;
    }
  `)!

  // useEffect(() => {
  //   'worklet'
  //   progress.value = withRepeat(
  //     withTiming(1, {
  //       duration: 1000,
  //       easing: Easing.linear,
  //     }),
  //     -1,
  //   )
  // }, [])

  const shader = source.makeShader(uniforms)

  const paint = Skia.Paint()
  paint.setStrokeWidth(strokeWidth)
  paint.setStyle(PaintStyle.Stroke)
  paint.setShader(shader)
  paint.setStrokeCap(StrokeCap.Round)
  return (
    <Canvas style={{ flex: 1 }}>
      <Path path={pathProgress} style="stroke" paint={paint} />
    </Canvas>
  )
}
