import { SkPoint } from '@shopify/react-native-skia'
import { Confetti } from '../Confetti/ConfettiOrchestration'

export const getConfetti = ({
  origin,
  keepTrail,
}: {
  origin: SkPoint
  keepTrail: boolean
}): Confetti[] => [
  {
    origin,
    radius: 2.5,
    radiusGap: 1.7,
    lineNumber: 7,
    startAngle: 10,
    lineGapAngle: 50,
    strokeWidth: 'stroke/2',
    duration: 500,
    startAtprogressOrchestration: 0.15,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: [
      { breakpoint: 0, color: [250 / 255, 145 / 255, 238 / 255, 0] },
      { breakpoint: 0.5, color: [245 / 255, 0, 114 / 255, 0] },
      { breakpoint: 1, color: [163 / 255, 0, 76 / 255, 1] },
    ],
    lineType: 'line',
  },
  {
    origin,
    radius: 2.4,
    radiusGap: 1.4,
    lineNumber: 7,
    startAngle: 30,
    lineGapAngle: 50,
    strokeWidth: 'stroke/3',
    duration: 500,
    startAtprogressOrchestration: 0.0,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: [
      { breakpoint: 0, color: [7 / 255, 176 / 255, 43 / 255, 1] },
      { breakpoint: 0.5, color: [44 / 255, 135 / 255, 8 / 255, 1] },
      { breakpoint: 1, color: [80 / 255, 142 / 255, 41 / 255, 1] },
    ],
    lineType: 'line',
  },
  {
    origin,
    radius: 2.2,
    radiusGap: 2,
    lineNumber: 7,
    startAngle: 40,
    lineGapAngle: 50,
    strokeWidth: 'stroke/3',
    duration: 550,
    startAtprogressOrchestration: 0.3,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: [
      { breakpoint: 0, color: [80 / 255, 142 / 255, 249 / 255, 1] },
      { breakpoint: 0.5, color: [40 / 255, 84 / 255, 246 / 255, 1] },
      { breakpoint: 1, color: [31 / 255, 48 / 255, 132 / 255, 1] },
    ],
    lineType: 'line',
  },
  {
    origin,
    radius: 2.2,
    radiusGap: 3,
    lineNumber: 7,
    startAngle: 70,
    lineGapAngle: 50,
    strokeWidth: 'stroke/2',
    duration: 650,
    startAtprogressOrchestration: 0.4,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: [
      { breakpoint: 0, color: [247 / 255, 222 / 255, 38 / 255, 1] },
      { breakpoint: 1, color: [202 / 255, 122 / 255, 13 / 255, 1] },
    ],
    lineType: 'line',
  },
]
