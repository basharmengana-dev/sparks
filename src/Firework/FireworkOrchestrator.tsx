import { Button, Dimensions, View } from 'react-native'
import { useProgress } from '../Animations/useProgress'
import { Spark, SparkRef } from './Spark'
import { Canvas } from '@shopify/react-native-skia'
import { Easing } from 'react-native-reanimated'
import { useRef, useState } from 'react'
import { Grid } from '../Grid'
import { createLineWithOrigin } from '../Grid/utils'

const { width, height } = Dimensions.get('window')

export const FireworkOrchestrator = () => {
  const [paused, setPaused] = useState(false)
  const sparkRef = useRef<SparkRef>(null)

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
        <Spark
          points={createLineWithOrigin([
            grid.getBottomCenter(),
            { x: 1, y: 7 },
            { x: 1, y: 14 },
            { x: -1, y: 20 },
          ])}
          colorsWithBreakpoints={[
            { breakpoint: 0.0, color: [1.0, 1.0, 1.0, 1.0] },
            { breakpoint: 0.6, color: [1.0, 1.0, 0.878, 0.9] },
            { breakpoint: 0.75, color: [0.596, 0.984, 0.596, 0.8] },
            { breakpoint: 0.9, color: [0.866, 0.627, 0.866, 0.7] },
            { breakpoint: 1, color: [0.0, 0.0, 0.0, 0.0] },
          ]}
          strokeWidth={3}
          progressOrchestration={progressOrchestration}
          paused={paused}
          ref={sparkRef}
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
            sparkRef.current?.readyToRun()
            runOrchestration()
          }}
          color={'white'}
        />
      </View>
    </>
  )
}
