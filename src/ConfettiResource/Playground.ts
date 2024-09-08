import { SkPoint } from '@shopify/react-native-skia'
import { ColorSchemes } from '../AnimationObjects/utils'
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
    radius: 2,
    radiusGap: 1,
    lineNumber: 3,
    startAngle: 45,
    lineGapAngle: 80,
    strokeWidth: 'stroke/2',
    duration: 800,
    startAtprogressOrchestration: 0,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: ColorSchemes.createPinkColors(),
    lineType: 'line',
  },
  {
    origin,
    radius: 3,
    radiusGap: 1,
    lineNumber: 2,
    startAngle: 180,
    lineGapAngle: 180,
    strokeWidth: 'stroke/3',
    duration: 500,
    startAtprogressOrchestration: 0.15,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: ColorSchemes.createBlueColors(),
    lineType: 'line',
  },
  {
    origin,
    radius: 3.5,
    radiusGap: 2,
    lineNumber: 3,
    startAngle: 70,
    lineGapAngle: 90,
    strokeWidth: 'stroke/2',
    duration: 600,
    startAtprogressOrchestration: 0.25,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: ColorSchemes.createPurpleColors(),
    lineType: 'line',
  },
  {
    origin,
    radius: 3.5,
    radiusGap: 1.5,
    lineNumber: 5,
    startAngle: -20,
    lineGapAngle: -50,
    strokeWidth: 'stroke/4',
    duration: 600,
    startAtprogressOrchestration: 0.3,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: ColorSchemes.createYellowColors(),
    lineType: 'line',
  },
  {
    origin,
    radius: 4,
    radiusGap: 1,
    rotateAngle: 30,
    loopFacing: 'up',
    numberOfLoops: 1,
    loopOffsetSteps: 1,
    loopStart: 0.4,
    strokeWidth: 'stroke/2',
    duration: 700,
    colorsWithBreakpoints: ColorSchemes.createRedColors(),
    startAtprogressOrchestration: 0.1,
    destructAtFrontProgress: keepTrail ? 1 : 0.3,
    lineType: 'loop',
  },
  {
    origin,
    radius: 5,
    radiusGap: 1.5,
    rotateAngle: -100,
    loopFacing: 'down',
    numberOfLoops: 1,
    loopOffsetSteps: 1.3,
    strokeWidth: 'stroke/3',
    loopStart: 0.6,
    duration: 700,
    colorsWithBreakpoints: ColorSchemes.createSunsetColors(),
    startAtprogressOrchestration: 0.0,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    lineType: 'loop',
  },
  {
    origin,
    radius: 6,
    radiusGap: 1.25,
    rotateAngle: 100,
    loopFacing: 'up',
    numberOfLoops: 1,
    loopOffsetSteps: 2,
    strokeWidth: 'stroke/3',
    loopStart: 0.3,
    duration: 700,
    colorsWithBreakpoints: ColorSchemes.createOceanColors(),
    startAtprogressOrchestration: 0.0,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    lineType: 'loop',
  },
  {
    origin,
    radius: 5,
    radiusGap: 1.5,
    rotateAngle: 310,
    loopFacing: 'up',
    numberOfLoops: 1,
    loopOffsetSteps: 1,
    strokeWidth: 'stroke/1',
    loopStart: 0.2,
    duration: 800,
    colorsWithBreakpoints: ColorSchemes.createGreenColors(),
    startAtprogressOrchestration: 0.0,
    destructAtFrontProgress: keepTrail ? 1 : 0.5,
    lineType: 'loop',
  },
  {
    origin,
    radius: 1,
    radiusGap: 4,
    lineNumber: 7,
    startAngle: 10,
    lineGapAngle: 50,
    strokeWidth: 'stroke/3',
    duration: 500,
    startAtprogressOrchestration: 0.9,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: ColorSchemes.createPastelColors(),
    lineType: 'line',
  },
  {
    origin,
    radius: 1,
    radiusGap: 3.8,
    lineNumber: 7,
    startAngle: 30,
    lineGapAngle: 50,
    strokeWidth: 'stroke/3',
    duration: 500,
    startAtprogressOrchestration: 0.9,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: ColorSchemes.createTealColors(),
    lineType: 'line',
  },
  {
    origin,
    radius: 1,
    radiusGap: 2.5,
    lineNumber: 7,
    startAngle: 40,
    lineGapAngle: 50,
    strokeWidth: 'stroke/2',
    duration: 500,
    startAtprogressOrchestration: 0.9,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: ColorSchemes.createRedColors(),
    lineType: 'line',
  },
]
