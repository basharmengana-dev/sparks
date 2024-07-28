import { Button, Dimensions, View } from 'react-native'
import { useProgress } from '../Animations/useProgress'
import { Tail, TailRef } from './Tail'
import { Canvas } from '@shopify/react-native-skia'
import { Easing } from 'react-native-reanimated'
import { useRef, useState } from 'react'
import { Grid } from '../Grid'

const { width, height } = Dimensions.get('window')

export const FireworkOrchestrator = () => {
  const [paused, setPaused] = useState(false)
  const tailRef = useRef<TailRef>(null)

  const grid = new Grid({
    gridWidth: width,
    gridHeight: height,
    cellWidth: 20,
    cellHeight: 20,
    color: 'chartreuse',
    radius: 1,
  })

  const { progress: progressOrchestration, readyToRun: runOrchestration } =
    useProgress({
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
          paused={paused}
          ref={tailRef}
          grid={grid}
        />
        {grid.generateCircles()}
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
            setPaused(!paused)
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
