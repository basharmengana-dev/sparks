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
    origin: { x: origin.x + 8, y: origin.y - 5 },
    radius: 2,
    radiusGap: 1,
    lineNumber: 12,
    startAngle: 10,
    lineGapAngle: 30,
    strokeWidth: 'stroke/2',
    duration: 400,
    startAtprogressOrchestration: 0.4,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: [
      { breakpoint: 0, color: [250 / 255, 145 / 255, 238 / 255, 0] },
      { breakpoint: 0.5, color: [245 / 255, 0, 114 / 255, 0] },
      { breakpoint: 1, color: [163 / 255, 0, 76 / 255, 1] },
    ],
    lineType: 'line',
  },
  {
    origin: { x: origin.x + 15, y: origin.y - 1 },
    radius: 2.4,
    radiusGap: 1,
    lineNumber: 12,
    startAngle: 30,
    lineGapAngle: 30,
    strokeWidth: 'stroke/3',
    duration: 400,
    startAtprogressOrchestration: 0.55,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: [
      { breakpoint: 0, color: [7 / 255, 176 / 255, 43 / 255, 1] },
      { breakpoint: 0.5, color: [44 / 255, 135 / 255, 8 / 255, 1] },
      { breakpoint: 1, color: [80 / 255, 142 / 255, 41 / 255, 1] },
    ],
    lineType: 'line',
  },
  {
    origin: { x: origin.x + 7, y: origin.y + 1 },
    radius: 2.2,
    radiusGap: 1,
    lineNumber: 12,
    startAngle: 40,
    lineGapAngle: 30,
    strokeWidth: 'stroke/3',
    duration: 400,
    startAtprogressOrchestration: 0.15,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: [
      { breakpoint: 0, color: [80 / 255, 142 / 255, 249 / 255, 1] },
      { breakpoint: 0.5, color: [40 / 255, 84 / 255, 246 / 255, 1] },
      { breakpoint: 1, color: [31 / 255, 48 / 255, 132 / 255, 1] },
    ],
    lineType: 'line',
  },
  {
    origin: { x: origin.x + 1, y: origin.y - 3 },
    radius: 2.3,
    radiusGap: 1.5,
    lineNumber: 12,
    startAngle: 70,
    lineGapAngle: 30,
    strokeWidth: 'stroke/2',
    duration: 400,
    startAtprogressOrchestration: 0.25,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: [
      { breakpoint: 0, color: [247 / 255, 222 / 255, 38 / 255, 1] },
      { breakpoint: 1, color: [202 / 255, 122 / 255, 13 / 255, 1] },
    ],
    lineType: 'line',
  },
]
