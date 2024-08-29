import React from 'react'
import { Button, View } from 'react-native'
import { Canvas } from '@shopify/react-native-skia'
import { useRef, useState } from 'react'
import { Grid } from '../Grid'
import { useSharedValue } from 'react-native-reanimated'
import { ColorSchemes, RGBA } from '../AnimationObjects/utils'
import {
  Confetti,
  ConfettiOrchestrator,
  ConfettiOrchestratorRef,
} from '../Confetti/ConfettiOrchestration'

export const Playground = () => {
  const paused = useSharedValue(false)
  const gridColor = useSharedValue<RGBA>([0.596, 0.984, 0.596, 1.0])
  const [keepTrail, setKeepTrail] = useState(false)
  const confettiOrchestrator = useRef<ConfettiOrchestratorRef>(null)

  const grid = new Grid({
    gridWidth: 100,
    gridHeight: 100,
    cellWidth: 4,
    cellHeight: 2,
    color: 'chartreuse',
    radius: 1,
  })

  const confetti: Confetti[] = [
    {
      origin: grid.getCenter(),
      radius: 2,
      radiusGap: 1,
      lineNumber: 3,
      startAngle: 45,
      lineGapAngle: 80,
      strokeWidth: 'stroke/2',
      duration: 800,
      startAtprogressOrchestration: 0,
      destructAtFrontProgress: keepTrail ? 1 : 0.4,
      colorsWithBreakpoints: ColorSchemes.createPinkColors(),
      lineType: 'line',
    },
    {
      origin: grid.getCenter(),
      radius: 3,
      radiusGap: 1,
      lineNumber: 2,
      startAngle: 180,
      lineGapAngle: 180,
      strokeWidth: 'stroke/3',
      duration: 500,
      startAtprogressOrchestration: 0.15,
      destructAtFrontProgress: keepTrail ? 1 : 0.4,
      colorsWithBreakpoints: ColorSchemes.createBlueColors(),
      lineType: 'line',
    },
    {
      origin: grid.getCenter(),
      radius: 3.5,
      radiusGap: 2,
      lineNumber: 3,
      startAngle: 70,
      lineGapAngle: 90,
      strokeWidth: 'stroke/2',
      duration: 600,
      startAtprogressOrchestration: 0.25,
      destructAtFrontProgress: keepTrail ? 1 : 0.4,
      colorsWithBreakpoints: ColorSchemes.createPurpleColors(),
      lineType: 'line',
    },
    {
      origin: grid.getCenter(),
      radius: 3.5,
      radiusGap: 1.5,
      lineNumber: 5,
      startAngle: -20,
      lineGapAngle: -50,
      strokeWidth: 'stroke/4',
      duration: 600,
      startAtprogressOrchestration: 0.3,
      destructAtFrontProgress: keepTrail ? 1 : 0.4,
      colorsWithBreakpoints: ColorSchemes.createYellowColors(),
      lineType: 'line',
    },
    {
      origin: grid.getCenter(),
      radius: 4,
      radiusGap: 1,
      rotateAngle: 30,
      loopFacing: 'up',
      numberOfLoops: 1,
      loopOffsetSteps: 1,
      loopStart: 0.4,
      strokeWidth: 'stroke/2',
      duration: 700,
      colorsWithBreakpoints: ColorSchemes.createRedColors(),
      startAtprogressOrchestration: 0.1,
      destructAtFrontProgress: keepTrail ? 1 : 0.3,
      lineType: 'loop',
    },
    {
      origin: grid.getCenter(),
      radius: 5,
      radiusGap: 1.5,
      rotateAngle: -100,
      loopFacing: 'down',
      numberOfLoops: 1,
      loopOffsetSteps: 1.3,
      strokeWidth: 'stroke/3',
      loopStart: 0.6,
      duration: 700,
      colorsWithBreakpoints: ColorSchemes.createSunsetColors(),
      startAtprogressOrchestration: 0.0,
      destructAtFrontProgress: keepTrail ? 1 : 0.4,
      lineType: 'loop',
    },
    {
      origin: grid.getCenter(),
      radius: 6,
      radiusGap: 1.25,
      rotateAngle: 100,
      loopFacing: 'up',
      numberOfLoops: 1,
      loopOffsetSteps: 2,
      strokeWidth: 'stroke/3',
      loopStart: 0.3,
      duration: 700,
      colorsWithBreakpoints: ColorSchemes.createOceanColors(),
      startAtprogressOrchestration: 0.0,
      destructAtFrontProgress: keepTrail ? 1 : 0.4,
      lineType: 'loop',
    },
    {
      origin: grid.getCenter(),
      radius: 5,
      radiusGap: 1.5,
      rotateAngle: 310,
      loopFacing: 'up',
      numberOfLoops: 1,
      loopOffsetSteps: 1,
      strokeWidth: 'stroke/1',
      loopStart: 0.2,
      duration: 800,
      colorsWithBreakpoints: ColorSchemes.createGreenColors(),
      startAtprogressOrchestration: 0.0,
      destructAtFrontProgress: keepTrail ? 1 : 0.5,
      lineType: 'loop',
    },
    {
      origin: grid.getCenter(),
      radius: 1,
      radiusGap: 4,
      lineNumber: 7,
      startAngle: 10,
      lineGapAngle: 50,
      strokeWidth: 'stroke/3',
      duration: 500,
      startAtprogressOrchestration: 0.9,
      destructAtFrontProgress: keepTrail ? 1 : 0.4,
      colorsWithBreakpoints: ColorSchemes.createPastelColors(),
      lineType: 'line',
    },
    {
      origin: grid.getCenter(),
      radius: 1,
      radiusGap: 3.8,
      lineNumber: 7,
      startAngle: 30,
      lineGapAngle: 50,
      strokeWidth: 'stroke/3',
      duration: 500,
      startAtprogressOrchestration: 0.9,
      destructAtFrontProgress: keepTrail ? 1 : 0.4,
      colorsWithBreakpoints: ColorSchemes.createTealColors(),
      lineType: 'line',
    },
    {
      origin: grid.getCenter(),
      radius: 1,
      radiusGap: 2.5,
      lineNumber: 7,
      startAngle: 40,
      lineGapAngle: 50,
      strokeWidth: 'stroke/2',
      duration: 500,
      startAtprogressOrchestration: 0.9,
      destructAtFrontProgress: keepTrail ? 1 : 0.4,
      colorsWithBreakpoints: ColorSchemes.createRedColors(),
      lineType: 'line',
    },
  ]

  return (
    <>
      <Canvas style={{ flex: 1, backgroundColor: 'black' }}>
        {grid.generateCircles(gridColor)}
        <ConfettiOrchestrator
          confetti={confetti}
          grid={grid}
          paused={paused}
          ref={confettiOrchestrator}
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
