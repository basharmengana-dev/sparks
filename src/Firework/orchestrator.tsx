import { Button, View } from 'react-native'
import { useProgress } from '../Animations/useProgress'
import { Tail } from './tail'
import { Canvas, rect } from '@shopify/react-native-skia'
import { Easing, runOnJS } from 'react-native-reanimated'

export const FireworkOrchestrator = () => {
  const {
    progress: progressFront,
    pause: pauseFront,
    run: runFront,
  } = useProgress({
    easing: Easing.out(Easing.ease),
    duration: 1500,
  })

  const {
    progress: progressBack,
    reset: resetBack,
    pause: pauseBack,
    run: runBack,
  } = useProgress({
    to: 0,
    easing: Easing.out(Easing.ease),
    duration: 2000,
  })

  return (
    <>
      <Canvas style={{ flex: 1, backgroundColor: 'black' }}>
        <Tail progressFront={progressFront} progressBack={progressBack} />
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
            pauseFront()
            pauseBack()
          }}
          color={'white'}
        />
        <Button
          title={'▶️'}
          onPress={() => {
            resetBack()
            runFront()
          }}
          color={'white'}
        />
        <Button
          title={'◀️'}
          onPress={() => {
            runBack()
          }}
          color={'white'}
        />
        <Button
          title={'🎊'}
          onPress={() => {
            resetBack()
            runFront()
            setTimeout(() => {
              runOnJS(runBack)()
            }, 200)
          }}
          color={'white'}
        />
      </View>
    </>
  )
}
