import { runOnUI, useSharedValue } from 'react-native-reanimated'
import { makeAnimation, timing, useAnimation } from './utils'
import { EasingFunction } from 'react-native'

export const useProgress = ({
  duration,
  easing,
  to = 1,
  repeat = false,
  waitUntilRun = true,
}: {
  duration: number
  easing: EasingFunction
  to?: number
  repeat?: boolean
  waitUntilRun?: boolean
}) => {
  const pause = useSharedValue(false)
  const run = useSharedValue(!waitUntilRun)
  const toValue = useSharedValue(to)

  const animation = makeAnimation(
    function* ({ progress }) {
      'worklet'

      while (run.value) {
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
