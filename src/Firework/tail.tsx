import { Path } from '../Path'
import { rect, SkPoint } from '@shopify/react-native-skia'
import { useState } from 'react'
import { Dimensions } from 'react-native'
import {
  Easing,
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated'
import { useProgress } from '../Animations/useProgress'

const svg =
  'M 37.5 403.5 C 37.47 403.49 13.36 298.54 11.94 247.48 C 12.65 204.93 51 159 54 124 C 56 80 41.73 56.72 31.5 10.5'
const colorBreakpoints = [
  { breakpoint: 0.0, color: [1.0, 1.0, 1.0] },
  { breakpoint: 0.6, color: [1.0, 1.0, 0.878] },
  { breakpoint: 0.7, color: [0.596, 0.984, 0.596] },
  { breakpoint: 0.8, color: [0.866, 0.627, 0.866] },
  { breakpoint: 1.0, color: [0.0, 0.0, 0.0] },
]
const { width, height } = Dimensions.get('window')

export const Tail = ({
  progressOrchestration,
  bottomPadding = 0,
}: {
  progressOrchestration: SharedValue<number>
  bottomPadding?: number
}) => {
  const startAtValue = useSharedValue(0.5)

  const {
    progress: progressFront,
    pause: pauseFront,
    run: runFront,
  } = useProgress({
    easing: Easing.out(Easing.ease),
    duration: 1500,
    waitUntilProgress: {
      progress: progressOrchestration,
      isValue: startAtValue,
    },
    waitUntilRun: false,
  })

  useAnimatedReaction(
    () => progressFront.value,
    value => {
      console.log('progressFront ', value)
    },
  )

  const {
    progress: progressBack,
    reset: resetBack,
    pause: pauseBack,
    run: runBack,
  } = useProgress({
    to: 0,
    easing: Easing.out(Easing.ease),
    duration: 2000,
  })

  const [origin, _setOrigin] = useState<SkPoint>({
    x: width / 2,
    y: height - bottomPadding,
  })
  const [size, _setSize] = useState<SkPoint>({ x: 250, y: 250 })

  return (
    <Path
      svg={svg}
      strokeWidth={3}
      colorBreakpoints={colorBreakpoints}
      origin={origin}
      size={size}
      progressFront={progressFront}
      progressBack={progressBack}
    />
  )
}
