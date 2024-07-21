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
  to = 1,
  repeat = false,
  waitUntilRun = true,
  waitUntilProgress = null,
}: {
  duration: number
  easing: EasingFunction
  to?: number
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
      progress: 0,
    },
  )
  const {
    values: { progress },
    initializeGenerator,
  } = useAnimation(animation, pause)

  return {
    progress,
    pause: () => {
      pause.value = !pause.value
    },
    run: () => {
      runOnUI(initializeGenerator)()
      toValue.value = 1
      progress.value = 0
      run.value = true
    },
    runInverse: () => {
      runOnUI(initializeGenerator)()
      toValue.value = 0
      progress.value = 1
      run.value = true
    },
    reset: () => {
      runOnUI(initializeGenerator)()
      run.value = !waitUntilRun
      progress.value = to
    },
  }
}
