import { Button, Dimensions, View } from 'react-native'
import { useProgress } from '../Animations/useProgress'
import { Spark, SparkRef } from './Spark'
import { Canvas } from '@shopify/react-native-skia'
import { Easing } from 'react-native-reanimated'
import { useRef, useState } from 'react'
import { Grid } from '../Grid'
import { add, createLineWithOrigin, getLast } from '../Grid/utils'
import { c } from './utils'

const { width, height } = Dimensions.get('window')

export const FireworkOrchestrator = () => {
  const [paused, setPaused] = useState(false)
  const sparkRefCollection = Array.from({ length: 2 }, () =>
    useRef<SparkRef>(null),
  )

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

  const stem = createLineWithOrigin(
    grid.getBottomCenter(),
    { x: 1, y: 7 },
    { x: 1, y: 14 },
    { x: -1, y: 20 },
  )

  const spark1 = createLineWithOrigin(
    add(getLast(stem), 0, 1),
    { x: 2, y: 2 },
    { x: 4, y: 5 },
    { x: 5, y: 10 },
  )

  return (
    <>
      <Canvas style={{ flex: 1, backgroundColor: 'black' }}>
        <Spark
          points={stem}
          colorsWithBreakpoints={[
            { breakpoint: 0.0, color: c(1.0, 1.0, 1.0, 1.0) },
            { breakpoint: 0.6, color: c(1.0, 1.0, 0.878, 0.9) },
            { breakpoint: 0.75, color: c(0.596, 0.984, 0.596, 0.8) },
            { breakpoint: 0.9, color: c(0.866, 0.627, 0.866, 0.7) },
            { breakpoint: 1, color: c(0.0, 0.0, 0.0, 0.0) },
          ]}
          strokeWidth={3}
          progressOrchestration={progressOrchestration}
          startAtprogressOrchestration={0.0}
          destructAtFrontProgress={0.2}
          paused={paused}
          ref={sparkRefCollection[0]}
          grid={grid}
        />
        <Spark
          points={spark1}
          colorsWithBreakpoints={[
            {
              breakpoint: 0.0,
              color: c(0.6275, 0.1255, 0.9412, 0.3),
            },
            {
              breakpoint: 0.6,
              color: c(0.6275, 0.1255, 0.9412, 1),
            },
            {
              breakpoint: 1,
              color: c(0.6275, 0.1255, 0.9412, 0.3),
            },
          ]}
          strokeWidth={3}
          progressOrchestration={progressOrchestration}
          startAtprogressOrchestration={0.99}
          destructAtFrontProgress={0.2}
          withDelay={700}
          paused={paused}
          ref={sparkRefCollection[1]}
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
            sparkRefCollection.forEach(ref => {
              ref?.current?.readyToRun()
            })
            runOrchestration()
          }}
          color={'white'}
        />
      </View>
    </>
  )
}
