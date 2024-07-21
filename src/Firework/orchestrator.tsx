import { Button, View } from 'react-native'
import { useProgress } from '../Animations/useProgress'
import { Tail, TailRef } from './tail'
import { Canvas } from '@shopify/react-native-skia'
import { Easing, useAnimatedReaction } from 'react-native-reanimated'
import { useRef, useState } from 'react'

export const FireworkOrchestrator = () => {
  const [isPaused, setIsPaused] = useState(false)
  const tailRef = useRef<TailRef>(null)

  const {
    progress: progressOrchestration,
    pause: pauseOrchestration,
    readyToRun: runOrchestration,
  } = useProgress({
    to: 1,
    from: 0,
    easing: Easing.out(Easing.ease),
    duration: 1500,
  })

  return (
    <>
      <Canvas style={{ flex: 1, backgroundColor: 'black' }}>
        <Tail
          progressOrchestration={progressOrchestration}
          isPaused={isPaused}
          bottomPadding={120}
          ref={tailRef}
        />
      </Canvas>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          padding: 20,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          columnGap: 10,
        }}>
        <Button
          title={'⏸️'}
          onPress={() => {
            setIsPaused(!isPaused)
          }}
          color={'white'}
        />
        <Button
          title={'🎊'}
          onPress={() => {
            tailRef.current?.readyToRun()
            runOrchestration()
          }}
          color={'white'}
        />
      </View>
    </>
  )
}
