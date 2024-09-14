import { SkPoint } from '@shopify/react-native-skia'
import { ColorSchemes } from '../AnimationObjects/ColorSchemas'
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
    radius: 2.3,
    radiusGap: 1.7,
    lineNumber: 7,
    startAngle: 10,
    lineGapAngle: 50,
    strokeWidth: 'stroke/5',
    duration: 500,
    startAtprogressOrchestration: 0.0,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: ColorSchemes.createPinkColors(),
    lineType: 'line',
  },
  {
    origin,
    radius: 2.2,
    radiusGap: 1.4,
    lineNumber: 7,
    startAngle: 30,
    lineGapAngle: 50,
    strokeWidth: 'stroke/6',
    duration: 600,
    startAtprogressOrchestration: 0.0,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: ColorSchemes.createOceanColors(),
    lineType: 'line',
  },
  {
    origin,
    radius: 2.1,
    radiusGap: 2,
    lineNumber: 7,
    startAngle: 40,
    lineGapAngle: 50,
    strokeWidth: 'stroke/5',
    duration: 600,
    startAtprogressOrchestration: 0,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: ColorSchemes.createGreenColors(),
    lineType: 'line',
  },
]
