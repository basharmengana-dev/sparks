import { useProgress } from '../AnimationCore/useProgress'
import { Easing, SharedValue } from 'react-native-reanimated'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { Grid } from '../Grid'
import { add, createLineWithOrigin, getLast } from '../Grid/utils'
import { Line, LineRef } from '../AnimationObjects/Line'
import { FlowerBud, FlowerBudRef } from './FlowerBud'
import { c } from '../Firework/utils'

export interface FlowerOrchestratorRef {
  run: () => void
  reset: () => void
}

interface FlowerOrchestratorProps {
  grid: Grid
  paused: SharedValue<boolean>
}

export const FlowerOrchestrator = forwardRef<
  FlowerOrchestratorRef,
  FlowerOrchestratorProps
>(({ grid, paused }, ref) => {
  const {
    progress: progressOrchestration,
    run: runOrchestration,
    reset: resetOrchestration,
  } = useProgress({
    to: 1,
    from: 0,
    easing: Easing.out(Easing.ease),
    duration: 1500,
    waitUntilRun: true,
    paused,
  })

  const lineRef = useRef<LineRef>(null)
  const flowerRef = useRef<FlowerBudRef>(null)

  useImperativeHandle(ref, () => ({
    run() {
      lineRef.current?.run()
      flowerRef.current?.run()
      runOrchestration()
    },
    reset() {
      lineRef.current?.reset()
      flowerRef.current?.reset()
      resetOrchestration()
    },
  }))

  const stemPoints = createLineWithOrigin(
    add(grid.getBottomCenter(), { x: 0, y: 5 }),
    { x: 2, y: 10 },
    { x: -2, y: 15 },
    { x: -3, y: 10 },
    { x: 0, y: 10 },
    { x: 0, y: 19 },
  )

  return (
    <>
      <Line
        points={stemPoints}
        colorsWithBreakpoints={[
          { breakpoint: 0, color: c(0.0, 0.0, 1.0, 1.0) },
          { breakpoint: 0.5, color: c(0.0, 0.8, 0.7, 1.0) },
          { breakpoint: 1, color: c(0.0, 0.8, 0.7, 1.0) },
        ]}
        progressOrchestration={progressOrchestration}
        startAtprogressOrchestration={0.0}
        strokeWidth={3}
        grid={grid}
        paused={paused}
        easing={Easing.inOut(Easing.ease)}
        duration={1000}
        ref={lineRef}
      />
      <FlowerBud
        origin={getLast(stemPoints)}
        grid={grid}
        paused={paused}
        progressOrchestration={progressOrchestration}
        startAtprogressOrchestration={0.81}
        ref={flowerRef}
      />
    </>
  )
})
