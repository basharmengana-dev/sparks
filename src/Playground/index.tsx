import { Button, Dimensions, View } from 'react-native'
import { Canvas } from '@shopify/react-native-skia'
import { useRef, useState } from 'react'
import { Grid } from '../Grid'
import { FireworkOrchestrator, FireworkOrchestratorRef } from '../Firework'
import {
  useAnimatedReaction,
  useSharedValue,
  runOnJS,
  Easing,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { c, RGBA } from '../Firework/utils'
import { Line, LineRef } from '../AnimationObjects/Line'
import { add, createLineWithOrigin } from '../Grid/utils'
import { Petal } from '../AnimationObjects/Petal'

const { width, height } = Dimensions.get('window')

export const Playground = () => {
  const paused = useSharedValue(false)
  const gridColor = useSharedValue<RGBA>([0.596, 0.984, 0.596, 1.0])
  const [keepTrail, setKeepTrail] = useState(false)

  const [pausedAvatar, setPausedAvatar] = useState(false)
  const fireworkOchestration = useRef<FireworkOrchestratorRef>(null)
  const lineRef = useRef<LineRef>(null)

  const grid = new Grid({
    gridWidth: width,
    gridHeight: height,
    cellWidth: 20,
    cellHeight: 20,
    color: 'chartreuse',
    radius: 1,
  })

  useAnimatedReaction(
    () => paused.value,
    value => {
      runOnJS(setPausedAvatar)(value)
    },
  )

  const progress = useSharedValue(0)
  progress.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true)
  const gradient = [
    { color: '#98FF98', pos: 0 }, // Light Mint Green
    { color: '#B2FFC8', pos: 0.25 }, // Soft Mint Pastel
    { color: '#D0FFD8', pos: 0.5 }, // Mint Cream
    { color: '#E0FFE6', pos: 0.75 }, // Pastel Mint
    { color: '#F0FFF4', pos: 1 }, // Very Pale Mint
  ]

  return (
    <>
      <Canvas style={{ flex: 1, backgroundColor: 'black' }}>
        <FireworkOrchestrator
          grid={grid}
          paused={paused}
          ref={fireworkOchestration}
          keepTrail={keepTrail}
        />
        <Line
          points={createLineWithOrigin(
            add(grid.getBottomCenter(), { x: 0, y: 5 }),
            { x: 2, y: 10 },
            { x: -2, y: 15 },
            { x: -3, y: 10 },
            { x: 0, y: 10 },
            { x: 3, y: 20 },
          )}
          colorsWithBreakpoints={[
            { breakpoint: 0, color: c(0.0, 0.0, 1.0, 1.0) },
            { breakpoint: 0.5, color: c(0.0, 0.8, 0.7, 1.0) },
            { breakpoint: 1, color: c(0.0, 0.8, 0.7, 1.0) },
          ]}
          strokeWidth={3}
          grid={grid}
          paused={paused}
          easing={Easing.inOut(Easing.ease)}
          duration={1500}
          ref={lineRef}
        />
        {grid.generateCircles(gridColor)}
        <Petal
          pos={grid.getCenter()}
          width={5}
          height={4}
          grid={grid}
          startAngle={0}
          endAngle={90}
          progress={progress}
          gradient={gradient}
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
          title={pausedAvatar ? '▶️' : '⏸️'}
          onPress={() => {
            'worklet'
            paused.value = !paused.value
          }}
          color={'white'}
        />
        <Button
          title={'🎊'}
          onPress={() => {
            fireworkOchestration.current?.run()
          }}
          color={'white'}
        />
        <Button
          title={'📈'}
          onPress={() => {
            lineRef.current?.run()
          }}
          color={'white'}
        />
        <Button
          title={'🔳'}
          onPress={() => {
            if (gridColor.value[3] === 1) {
              gridColor.value = [0.0, 0.0, 0.0, 0.0]
            } else {
              gridColor.value = [0.596, 0.984, 0.596, 1.0]
            }
          }}
          color={'white'}
        />
        <Button
          title={'⏮️'}
          onPress={() => {
            lineRef.current?.reset()
            fireworkOchestration.current?.reset()
          }}
          color={'white'}
        />
        <Button
          title={keepTrail ? '🔴' : '⚪'}
          onPress={() => {
            setKeepTrail(!keepTrail)
          }}
          color={'white'}
        />
      </View>
    </>
  )
}
