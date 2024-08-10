import { Path } from '../Path'
import { SkPoint } from '@shopify/react-native-skia'
import { forwardRef, useImperativeHandle } from 'react'
import { Easing, SharedValue, useSharedValue } from 'react-native-reanimated'
import { useProgress } from '../AnimationCore/useProgress'
import { Grid } from '../Grid'
import { Petal } from '../AnimationObjects/Petal'

export interface FlowerBudRef {
  run: () => void
  reset: () => void
}

interface FlowerBudProps {
  origin: SkPoint
  paused: SharedValue<boolean>
  grid: Grid
}

export const FlowerBud = forwardRef<FlowerBudRef, FlowerBudProps>(
  ({ origin, paused, grid }, ref) => {
    const { progress, run, reset } = useProgress({
      to: 1,
      from: 0,
      easing: Easing.out(Easing.ease),
      duration: 2000,
      waitUntilRun: true,
      paused,
    })

    useImperativeHandle(ref, () => ({
      run,
      reset,
    }))

    const gradient = [
      { color: '#98FF98', pos: 0 }, // Light Mint Green
      { color: '#B2FFC8', pos: 0.25 }, // Soft Mint Pastel
      { color: '#D0FFD8', pos: 0.5 }, // Mint Cream
      { color: '#E0FFE6', pos: 0.75 }, // Pastel Mint
      { color: '#F0FFF4', pos: 1 }, // Very Pale Mint
    ]

    return (
      <Petal
        pos={origin}
        width={5}
        height={4}
        grid={grid}
        startAngle={0}
        endAngle={90}
        progress={progress}
        gradient={gradient}
      />
    )
  },
)
