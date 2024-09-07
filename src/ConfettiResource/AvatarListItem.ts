import { ColorSchemes } from '../AnimationObjects/utils'
import { Confetti } from '../Confetti/ConfettiOrchestration'
import { Grid } from '../Grid'

export const getConfetti = ({
  keepTrail,
  grid,
}: {
  keepTrail: boolean
  grid: Grid
}): Confetti[] => [
  {
    origin: grid.getCenter(),
    radius: 1,
    radiusGap: 2,
    lineNumber: 7,
    startAngle: 10,
    lineGapAngle: 50,
    strokeWidth: 'stroke/3',
    duration: 500,
    startAtprogressOrchestration: 0.0,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: ColorSchemes.createPastelColors(),
    lineType: 'line',
  },
  {
    origin: grid.getCenter(),
    radius: 1,
    radiusGap: 1.8,
    lineNumber: 7,
    startAngle: 30,
    lineGapAngle: 50,
    strokeWidth: 'stroke/3',
    duration: 500,
    startAtprogressOrchestration: 0.0,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: ColorSchemes.createTealColors(),
    lineType: 'line',
  },
  {
    origin: grid.getCenter(),
    radius: 1,
    radiusGap: 2.3,
    lineNumber: 7,
    startAngle: 40,
    lineGapAngle: 50,
    strokeWidth: 'stroke/2',
    duration: 500,
    startAtprogressOrchestration: 0,
    destructAtFrontProgress: keepTrail ? 1 : 0.4,
    colorsWithBreakpoints: ColorSchemes.createRedColors(),
    lineType: 'line',
  },
]
