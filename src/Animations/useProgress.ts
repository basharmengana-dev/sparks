import { runOnUI, useSharedValue } from 'react-native-reanimated'
import { makeAnimation, timing, useAnimation } from './utils'
import { EasingFunction } from 'react-native'

export const useProgress = ({
  duration,
  easing,
  repeat = false,
  waitUntilRun = true,
}: {
  duration: number
  easing: EasingFunction
  repeat?: boolean
  waitUntilRun?: boolean
}) => {
  const pause = useSharedValue(false)
  const run = useSharedValue(!waitUntilRun)
  const to = useSharedValue(1)

  const animation = makeAnimation(
    function* ({ progress }) {
      'worklet'

      while (run.value) {
        yield* timing(progress, {
          to: to.value,
          duration,
          easing,
        })
        if (repeat) {
          to.value = to.value === 1 ? 0 : 1
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
      to.value = 1
      progress.value = 0
      run.value = true
    },
    runInverse: () => {
      runOnUI(initializeGenerator)()
      to.value = 0
      progress.value = 1
      run.value = true
    },
  }
}
