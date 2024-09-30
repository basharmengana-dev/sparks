// The util code below is from this repo
// https://github.com/wcandillon/can-it-be-done-in-react-native/blob/master/bonuses/skia-examples/src/Generators/Animations.ts

import { useEffect, useState } from 'react'
import type { SharedValue } from 'react-native-reanimated'
import {
  interpolate,
  useSharedValue,
  useFrameCallback,
  makeMutable,
  cancelAnimation,
  runOnUI,
} from 'react-native-reanimated'

export function* timeSincePreviousFrame() {
  'worklet'
  const time: number = yield
  return time
}

export type EasingFunction = (value: number) => number
interface TimingConfig {
  to: number
  easing: EasingFunction
  duration: number
}
export function* timing(value: SharedValue<number>, config: TimingConfig) {
  'worklet'
  const from = value.value
  const { to, easing, duration } = { ...config }
  const start: number = yield
  const end = start + duration
  for (let current = start; current < end; ) {
    const progress = easing((current - start) / duration)
    const val = interpolate(progress, [0, 1], [from, to])
    value.value = val
    current += yield* timeSincePreviousFrame()
  }
  value.value = to
}

type AnimationValues<S> = {
  [K in keyof S]: SharedValue<S[K]>
}
type AnimationState = Record<string, unknown>
type Animation<S extends AnimationState> = {
  animation: (state: AnimationValues<S>) => Generator
  state: S
}

export function* waitUntil({
  value,
  isValue,
}: {
  value: SharedValue<number>
  isValue: number
}) {
  'worklet'
  while (value.value <= isValue) {
    yield
  }
}

export function* wait(duration: number) {
  'worklet'
  const from: number = yield
  const to = from + duration
  for (let current = from; current < to; ) {
    current += yield* timeSincePreviousFrame()
  }
}

export const makeAnimation = <S extends AnimationState>(
  animation: (state: AnimationValues<S>) => Generator,
  state: S,
) => {
  return {
    animation,
    state,
  }
}

const useSharedValues = <S extends AnimationState>(state: S) => {
  const [mutable] = useState(() => {
    const values = {} as AnimationValues<S>
    for (const key in state) {
      values[key] = makeMutable(state[key])
    }
    return values
  })
  useEffect(() => {
    return () => {
      Object.keys(mutable).forEach(element => {
        cancelAnimation(mutable[element])
      })
    }
  }, [mutable])
  return mutable
}

export const useAnimation = <S extends AnimationState>(
  input: Animation<S> | (() => Generator),
  pause?: SharedValue<boolean>,
) => {
  const offset = useSharedValue(0)
  const { animation, state } =
    typeof input === 'function' ? { animation: input, state: {} as S } : input
  const values = useSharedValues(state)
  const gen = useSharedValue<null | Generator>(null)

  const initializeGenerator = () => {
    'worklet'
    gen.value = animation(values)
  }

  useFrameCallback(({ timeSincePreviousFrame: ts }) => {
    if (gen.value === null) {
      initializeGenerator()
    }
    if (pause?.value) {
      offset.value += ts ?? 0
    } else {
      gen.value?.next(ts)
    }
  })

  useEffect(() => {
    runOnUI(initializeGenerator)()

    return () => {
      cancelAnimation(offset)
      cancelAnimation(gen)
    }
  }, [])

  return { values, initializeGenerator }
}
