import {
  Easing,
  runOnUI,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated'
import { makeAnimation, timing, useAnimation } from './utils'

export const useProgressWithPause = (
  options: { repeat: boolean } = { repeat: false },
) => {
  const pause = useSharedValue(false)

  const animation = makeAnimation(
    function* ({ progress }) {
      'worklet'
      let to = 1

      while (true) {
        yield* timing(progress, {
          to,
          duration: 400,
          easing: Easing.linear,
        })
        if (options.repeat) {
          to = to === 1 ? 0 : 1
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
    rerun: () => {
      progress.value = 0
      runOnUI(initializeGenerator)()
    },
    isPaused: pause.value,
  }
}
