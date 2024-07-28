import { Path } from '../Path'
import { SkPoint } from '@shopify/react-native-skia'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Easing, SharedValue } from 'react-native-reanimated'
import { useProgress } from '../Animations/useProgress'
import { Grid } from '../Grid'
import { createLineWithOrigin } from '../Grid/utils'

export interface TailRef {
  readyToRun: () => void
}

interface TailProps {
  progressOrchestration: SharedValue<number>
  paused: boolean
  grid: Grid
}

export const Tail = forwardRef<TailRef, TailProps>(
  ({ progressOrchestration, paused, grid }, ref) => {
    const [startFrontAtValue, _setStartFrontV] = useState(0)
    const [startBackAtValue, _setStartBackValue] = useState(0.5)
    const [colorBreakpoints, _setColorBreakpoints] = useState([
      { breakpoint: 0.0, color: [1.0, 1.0, 1.0, 1.0] },
      { breakpoint: 0.6, color: [1.0, 1.0, 0.878, 0.9] },
      { breakpoint: 0.75, color: [0.596, 0.984, 0.596, 0.8] },
      { breakpoint: 0.9, color: [0.866, 0.627, 0.866, 0.7] },
      { breakpoint: 1, color: [0.0, 0.0, 0.0, 0.0] },
    ])

    const points: SkPoint[] = createLineWithOrigin([
      grid.getBottomCenter(),
      { x: 1, y: 7 },
      { x: 1, y: 14 },
      { x: -1, y: 20 },
    ])

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

    useEffect(() => {
      pauseFront(paused)
      pauseBack(paused)
    }, [paused])

    useImperativeHandle(ref, () => ({
      readyToRun() {
        readyToRunBack()
        readyToRunFront()
      },
    }))

    return (
      <Path
        points={points}
        cellHeight={grid.cellHeight}
        cellWidth={grid.cellWidth}
        maxIntersectionsAllowed={2}
        strokeWidth={3}
        colorBreakpoints={colorBreakpoints}
        progressFront={progressFront}
        progressBack={progressBack}
      />
    )
  },
)
