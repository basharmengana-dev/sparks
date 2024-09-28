import { SkPoint } from '@shopify/react-native-skia'
import {
  ColorSchema,
  ColorSchemes,
  RGB,
  RGBA,
} from '../AnimationObjects/ColorSchemas'
import { Confetti } from '../Confetti/ConfettiOrchestration'

const nc = (...color: RGB) => [...color.map(value => value / 255), 1] as RGBA

export const getConfetti = ({
  origin,
  keepTrail,
}: {
  origin: SkPoint
  keepTrail: boolean
}): Confetti[] => [
  {
    origin,
    radius: 2,
    radiusGap: 2.2,
    lineNumber: 3,
    startAngle: 45,
    lineGapAngle: 80,
    strokeWidth: 'stroke/3',
    duration: 800,
    startAtprogressOrchestration: 0,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: [
      //green
      { breakpoint: 0, color: nc(74, 241, 143) },
      { breakpoint: 0.8, color: nc(8, 132, 8) },
    ],
    lineType: 'line',
  },
  {
    origin,
    radius: 2.5,
    radiusGap: 2.3,
    lineNumber: 2,
    startAngle: 180,
    lineGapAngle: 180,
    strokeWidth: 'stroke/3',
    duration: 500,
    startAtprogressOrchestration: 0.15,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: [
      // blue
      { breakpoint: 0, color: nc(108, 209, 243) },
      { breakpoint: 1, color: nc(108, 85, 243) },
    ],
    lineType: 'line',
  },
  {
    origin,
    radius: 2.7,
    radiusGap: 2.1,
    lineNumber: 3,
    startAngle: 75,
    lineGapAngle: 90,
    strokeWidth: 'stroke/3',
    duration: 600,
    startAtprogressOrchestration: 0.25,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: [
      // purple
      { breakpoint: 0, color: nc(252, 158, 248) },
      { breakpoint: 0.7, color: nc(189, 13, 191) },
      { breakpoint: 1, color: nc(179, 5, 147) },
    ],
    lineType: 'line',
  },
  {
    origin,
    radius: 6,
    radiusGap: 2.5,
    rotateAngle: 20,
    loopFacing: 'up',
    numberOfLoops: 1,
    loopOffsetSteps: 1,
    loopStart: 0.4,
    strokeWidth: 'stroke/3',
    duration: 700,
    colorsWithBreakpoints: [
      // baby pink
      { breakpoint: 0, color: nc(234, 214, 255) },
      { breakpoint: 0.5, color: nc(225, 0, 238) },
      { breakpoint: 1, color: nc(163, 0, 128) },
    ],
    startAtprogressOrchestration: 0.1,
    destructAtFrontProgress: keepTrail ? 1 : 0.3,
    lineType: 'loop',
  },
  {
    origin,
    radius: 5.5,
    radiusGap: 2,
    rotateAngle: -100,
    loopFacing: 'down',
    numberOfLoops: 1,
    loopOffsetSteps: 1.1,
    strokeWidth: 'stroke/3',
    loopStart: 0.5,
    duration: 700,
    colorsWithBreakpoints: [
      // green yellow
      { breakpoint: 0, color: nc(240, 211, 0) },
      { breakpoint: 0.4, color: nc(173, 204, 0) },
      { breakpoint: 0.8, color: nc(34, 184, 0) },
    ],
    startAtprogressOrchestration: 0.0,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    lineType: 'loop',
  },
  {
    origin,
    radius: 3.3,
    radiusGap: 2,
    rotateAngle: 100,
    loopFacing: 'up',
    numberOfLoops: 1,
    loopOffsetSteps: 0.7,
    strokeWidth: 'stroke/4',
    loopStart: 0.3,
    duration: 700,
    colorsWithBreakpoints: [
      // red green parrot
      { breakpoint: 0, color: nc(7, 138, 89) },
      { breakpoint: 0.5, color: nc(202, 97, 63) },
      { breakpoint: 1, color: nc(217, 19, 30) },
    ],
    startAtprogressOrchestration: 0.0,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    lineType: 'loop',
  },
  {
    origin,
    radius: 3.5,
    radiusGap: 2.5,
    rotateAngle: 310,
    loopFacing: 'up',
    numberOfLoops: 1,
    loopOffsetSteps: 1,
    strokeWidth: 'stroke/3',
    loopStart: 0.4,
    duration: 800,
    colorsWithBreakpoints: [
      // brat purple
      { breakpoint: 0, color: nc(153, 255, 51) },
      { breakpoint: 0.7, color: nc(173, 226, 93) },
      { breakpoint: 0.9, color: nc(206, 123, 234) },
    ],
    startAtprogressOrchestration: 0.0,
    destructAtFrontProgress: keepTrail ? 1 : 0.5,
    lineType: 'loop',
  },
  {
    origin,
    radius: 1.8,
    radiusGap: 3,
    lineNumber: 12,
    startAngle: 33,
    lineGapAngle: 30,
    strokeWidth: 'stroke/2',
    duration: 500,
    startAtprogressOrchestration: 0.3,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: [
      // turkois lipstick red
      { breakpoint: 0, color: nc(108, 226, 163) },
      { breakpoint: 0.9, color: nc(173, 31, 54) },
    ],
    lineType: 'line',
  },
]
