import { Button, View } from 'react-native'
import { useProgress } from '../Animations/useProgress'
import { Tail } from './tail'
import { Canvas } from '@shopify/react-native-skia'
import { Easing, useAnimatedReaction } from 'react-native-reanimated'

export const FireworkOrchestrator = () => {
  const {
    progress: progressOrchestration,
    pause: pauseOrchestration,
    run: runOrchestration,
  } = useProgress({
    easing: Easing.out(Easing.ease),
    duration: 1500,
  })

  useAnimatedReaction(
    () => progressOrchestration.value,
    value => {
      console.log('progressOrchestration ', value)
    },
  )

  return (
    <>
      <Canvas style={{ flex: 1, backgroundColor: 'black' }}>
        <Tail
          progressOrchestration={progressOrchestration}
          bottomPadding={120}
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
            // pauseFront()
            // pauseBack()
          }}
          color={'white'}
        />
        <Button
          title={'▶️'}
          onPress={() => {
            // resetBack()
            runOrchestration()
          }}
          color={'white'}
        />
        <Button
          title={'◀️'}
          onPress={() => {
            // runBack()
          }}
          color={'white'}
        />
        <Button
          title={'🎊'}
          onPress={() => {
            // resetBack()
            // runFront()
            // setTimeout(() => {
            //   runOnJS(runBack)()
            // }, 200)
          }}
          color={'white'}
        />
      </View>
    </>
  )
}
