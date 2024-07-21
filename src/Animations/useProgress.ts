import { runOnUI, SharedValue, useSharedValue } from 'react-native-reanimated'
import {
  EasingFunction,
  makeAnimation,
  timing,
  useAnimation,
  waitUntil,
} from './utils'

export const useProgress = ({
  duration,
  easing,
  to,
  from,
  repeat = false,
  waitUntilRun = true,
  waitUntilProgress = null,
}: {
  duration: number
  easing: EasingFunction
  to: number
  from: number
  repeat?: boolean
  waitUntilRun?: boolean
  waitUntilProgress?: {
    progress: SharedValue<number>
    isValue: SharedValue<number>
  } | null
}) => {
  const pause = useSharedValue(false)
  const run = useSharedValue(!waitUntilRun)
  const toValue = useSharedValue(to)

  const animation = makeAnimation(
    function* ({ progress }) {
      'worklet'

      while (run.value) {
        if (waitUntilProgress !== null) {
          yield* waitUntil({
            value: waitUntilProgress.progress,
            isValue: waitUntilProgress.isValue,
          })
        }

        yield* timing(progress, {
          to: toValue.value,
          duration,
          easing,
        })
        if (repeat) {
          toValue.value = toValue.value === 1 ? 0 : 1
        }
      }
    },
    {
      progress: from,
    },
  )
  const {
    values: { progress },
    initializeGenerator,
  } = useAnimation(animation, pause)

  return {
    progress,
    pause: (pauseState: boolean) => {
      pause.value = pauseState
    },
    readyToRun: () => {
      runOnUI(initializeGenerator)()
      toValue.value = to
      progress.value = from
      run.value = true
    },
  }
}
