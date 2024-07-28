import { Button, Dimensions, View } from 'react-native'
import { useProgress } from '../Animations/useProgress'
import { Spark, SparkRef } from './Spark'
import { Canvas, SkPoint } from '@shopify/react-native-skia'
import { Easing } from 'react-native-reanimated'
import { useRef, useState } from 'react'
import { Grid } from '../Grid'
import { createLineWithOrigin, getLast } from '../Grid/utils'
import { c, ac, RGB } from './utils'

const { width, height } = Dimensions.get('window')

export const FireworkOrchestrator = () => {
  const [paused, setPaused] = useState(false)
  const [visibleGrid, setVisibleGrid] = useState(true)

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

  const stem = {
    points: createLineWithOrigin(
      grid.getBottomCenter(),
      { x: 1, y: 7 },
      { x: 1, y: 14 },
      { x: -1, y: 20 },
    ),
    color: c(1.0, 1.0, 0.878, 0.9),
  }

  const createSpark = (
    color: RGB,
    ...points: SkPoint[]
  ): { points: SkPoint[]; color: RGB } => {
    return {
      color,
      points: createLineWithOrigin(getLast(stem.points), ...points),
    }
  }
  const sparkCollection = [
    stem,
    createSpark(
      [0.6275, 0.1255, 0.9412],
      { x: 2, y: 2 },
      { x: 4, y: 5 },
      { x: 5, y: 10 },
    ),
    createSpark(
      [0.6275, 0.1255, 0.9412],
      { x: -2, y: 2 },
      { x: -3, y: 4 },
      { x: -4, y: 7 },
    ),
    createSpark(
      [0.6275, 0.1255, 0.9412],
      { x: -2, y: -1 },
      { x: -4, y: -1 },
      { x: -6, y: -1 },
    ),
    createSpark([0.6275, 0.1255, 0.9412], { x: -2, y: 0 }, { x: -5, y: 1 }),
    createSpark([0.6275, 0.1255, 0.9412], { x: 2, y: 0 }, { x: 4, y: 1 }),
    createSpark([0.6275, 0.1255, 0.9412], { x: 0, y: 0 }, { x: 1, y: 4 }),
  ]

  const sparkRefCollection = Array.from(
    { length: sparkCollection.length },
    () => useRef<SparkRef>(null),
  )

  return (
    <>
      <Canvas style={{ flex: 1, backgroundColor: 'black' }}>
        <Spark
          points={sparkCollection[0].points}
          colorsWithBreakpoints={[
            { breakpoint: 0.0, color: c(1.0, 1.0, 1.0, 1.0) },
            { breakpoint: 0.6, color: c(1.0, 1.0, 0.878, 0.9) },
            { breakpoint: 0.75, color: c(0.596, 0.984, 0.596, 0.8) },
            { breakpoint: 0.9, color: c(0.866, 0.627, 0.866, 0.7) },
            { breakpoint: 1, color: c(0.0, 0.0, 0.0, 0.0) },
          ]}
          easing={Easing.out(Easing.ease)}
          duration={2000}
          strokeWidth={3}
          progressOrchestration={progressOrchestration}
          startAtprogressOrchestration={0.0}
          destructAtFrontProgress={0.2}
          paused={paused}
          ref={sparkRefCollection[0]}
          grid={grid}
        />
        {sparkCollection.map((spark, index) => {
          if (index === 0) return null // The stem

          return (
            <Spark
              key={index}
              points={spark.points}
              colorsWithBreakpoints={[
                {
                  breakpoint: 0.0,
                  color: ac(0.3, spark.color as RGB),
                },
                {
                  breakpoint: 0.6,
                  color: ac(1.0, spark.color as RGB),
                },
                {
                  breakpoint: 1,
                  color: ac(0.3, spark.color as RGB),
                },
              ]}
              strokeWidth={3}
              progressOrchestration={progressOrchestration}
              easing={Easing.out(Easing.ease)}
              duration={1500}
              startAtprogressOrchestration={0.9}
              destructAtFrontProgress={0.2}
              withDelay={900}
              paused={paused}
              ref={sparkRefCollection[index]}
              grid={grid}
            />
          )
        })}

        {visibleGrid && grid.generateCircles()}
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
        <Button
          title={'🔳'}
          onPress={() => {
            setVisibleGrid(!visibleGrid)
          }}
          color={'white'}
        />
      </View>
    </>
  )
}
