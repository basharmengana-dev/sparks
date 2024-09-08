import React from 'react'
import { Button, View } from 'react-native'
import { Canvas } from '@shopify/react-native-skia'
import { useRef, useState } from 'react'
import { Grid } from '../Grid'
import { Easing, useSharedValue } from 'react-native-reanimated'
import { ColorSchemes, RGBA } from '../AnimationObjects/utils'
import {
  Confetti,
  ConfettiOrchestrator,
  ConfettiOrchestratorRef,
} from '../Confetti/ConfettiOrchestration'
import { getConfetti } from '../ConfettiResource/Playground'
import { Line, LineRef } from '../AnimationObjects/Line'
import { createLineWithOrigin } from '../Grid/utils'

export const Playground = () => {
  const paused = useSharedValue(false)
  const gridColor = useSharedValue<RGBA>([0.596, 0.984, 0.596, 1.0])
  const [keepTrail, setKeepTrail] = useState(false)
  const confettiOrchestrator = useRef<ConfettiOrchestratorRef>(null)
  const lineOrchestration = useRef<LineRef>(null)

  const grid = new Grid({
    gridWidth: 100,
    gridHeight: 100,
    cellWidth: 4,
    cellHeight: 2,
    radius: 1,
  })

  const confetti: Confetti[] = getConfetti({
    keepTrail,
    origin: grid.getCenter(),
  })
  const linePoints = createLineWithOrigin(
    grid.getCenter(),
    { x: 5, y: 5 },
    { x: 10, y: 10 },
  )

  return (
    <>
      <Canvas style={{ flex: 1, backgroundColor: 'black' }}>
        {grid.generateCircles({ dotColor: gridColor, printAnchorDots: true })}
        <ConfettiOrchestrator
          confetti={confetti}
          grid={grid}
          paused={paused}
          ref={confettiOrchestrator}
        />
        <Line
          ref={lineOrchestration}
          points={linePoints}
          colorsWithBreakpoints={ColorSchemes.createPinkColors()}
          strokeWidth={'stroke/2'}
          easing={Easing.out(Easing.ease)}
          duration={1000}
          paused={paused}
          grid={grid}
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
            'worklet'
            paused.value = !paused.value
          }}
          color={'white'}
        />
        <Button
          title={'🎊'}
          onPress={() => {
            confettiOrchestrator.current?.run()
          }}
          color={'white'}
        />
        <Button
          title={'📈'}
          onPress={() => {
            lineOrchestration.current?.run()
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
            confettiOrchestrator.current?.reset()
            lineOrchestration.current?.reset()
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
