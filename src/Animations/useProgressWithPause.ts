import { Easing, useSharedValue } from 'react-native-reanimated'
import { makeAnimation, timing, useAnimation } from './utils'

export const useProgressWithPause = () => {
  const pause = useSharedValue(false)

  const animation = makeAnimation(
    function* ({ progress }) {
      'worklet'
      let to = 1

      while (true) {
        yield* timing(progress, {
          to,
          duration: 5000,
          easing: Easing.linear,
        })
        to = to === 1 ? 0 : 1
      }
    },
    {
      progress: 0,
    },
  )
  const { progress } = useAnimation(animation, pause)

  return {
    progress,
    pause: () => {
      pause.value = !pause.value
    },
    isPaused: pause.value,
  }
}
