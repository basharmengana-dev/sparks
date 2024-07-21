import { Path } from '../Path'
import { SkPoint } from '@shopify/react-native-skia'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Dimensions } from 'react-native'
import { Easing, SharedValue } from 'react-native-reanimated'
import { useProgress } from '../Animations/useProgress'

const { width, height } = Dimensions.get('window')

export interface TailRef {
  readyToRun: () => void
}

interface TailProps {
  progressOrchestration: SharedValue<number>
  isPaused: boolean
  bottomPadding?: number
}

export const Tail = forwardRef<TailRef, TailProps>(
  ({ progressOrchestration, bottomPadding = 0, isPaused }, ref) => {
    const [startFrontAtValue, _setStartFrontV] = useState(0)
    const [startBackAtValue, _setStartBackValue] = useState(0.5)
    const [colorBreakpoints, _setColorBreakpoints] = useState([
      { breakpoint: 0.0, color: [1.0, 1.0, 1.0, 1.0] },
      { breakpoint: 0.6, color: [1.0, 1.0, 0.878, 0.9] },
      { breakpoint: 0.75, color: [0.596, 0.984, 0.596, 0.8] },
      { breakpoint: 0.9, color: [0.866, 0.627, 0.866, 0.7] },
      { breakpoint: 1, color: [0.0, 0.0, 0.0, 0.0] },
    ])
    const [svg, _setSvg] = useState(
      'M 37.5 403.5 C 37.47 403.49 13.36 298.54 11.94 247.48 C 12.65 204.93 51 159 54 124 C 56 80 41.73 56.72 31.5 10.5',
    )

    const {
      progress: progressFront,
      pause: pauseFront,
      readyToRun: readyToRunFront,
    } = useProgress({
      to: 1,
      from: 0,
      easing: Easing.out(Easing.ease),
      duration: 1500,
      waitUntilProgress: {
        progress: progressOrchestration,
        isValue: startFrontAtValue,
      },
      waitUntilRun: false,
    })

    const {
      progress: progressBack,
      pause: pauseBack,
      readyToRun: readyToRunBack,
    } = useProgress({
      to: 1,
      from: 0,
      easing: Easing.out(Easing.ease),
      duration: 2000,
      waitUntilProgress: {
        progress: progressOrchestration,
        isValue: startBackAtValue,
      },
      waitUntilRun: false,
    })

    const [origin, _setOrigin] = useState<SkPoint>({
      x: width / 2,
      y: height - bottomPadding,
    })
    const [size, _setSize] = useState<SkPoint>({ x: 250, y: 250 })

    useEffect(() => {
      pauseFront(isPaused)
      pauseBack(isPaused)
    }, [isPaused])

    useImperativeHandle(ref, () => ({
      readyToRun() {
        readyToRunBack()
        readyToRunFront()
      },
    }))

    return (
      <Path
        svg={svg}
        maxIntersectionsAllowed={2}
        strokeWidth={3}
        colorBreakpoints={colorBreakpoints}
        origin={origin}
        size={size}
        progressFront={progressFront}
        progressBack={progressBack}
      />
    )
  },
)

// loop svg
// `M 249.59,549.25
// C 291.31,495.02 370.50,406.50 417.00,424.50
//   464.14,437.49 385.86,503.36 359.44,469.29
//   336.50,437.31 403.84,326.12 446.35,304.40
//   489.58,284.45 520.79,350.95 467.90,362.92
//   405.40,358.17 428.68,223.56 441.50,205.13`
