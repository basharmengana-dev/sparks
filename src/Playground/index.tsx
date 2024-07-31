import { Button, Dimensions, View } from 'react-native'
import { Canvas } from '@shopify/react-native-skia'
import { useRef, useState } from 'react'
import { Grid } from '../Grid'
import { FireworkOrchestrator, FireworkOrchestratorRef } from '../Firework'

const { width, height } = Dimensions.get('window')

export const Playground = () => {
  const [paused, setPaused] = useState(false)
  const [visibleGrid, setVisibleGrid] = useState(true)
  const fireworkOchestration = useRef<FireworkOrchestratorRef>(null)

  const grid = new Grid({
    gridWidth: width,
    gridHeight: height,
    cellWidth: 20,
    cellHeight: 20,
    color: 'chartreuse',
    radius: 1,
  })

  return (
    <>
      <Canvas style={{ flex: 1, backgroundColor: 'black' }}>
        <FireworkOrchestrator
          grid={grid}
          paused={paused}
          ref={fireworkOchestration}
        />
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
          title={paused ? '▶️' : '⏸️'}
          onPress={() => {
            setPaused(!paused)
          }}
          color={'white'}
        />
        <Button
          title={'🎊'}
          onPress={() => {
            fireworkOchestration.current?.readyToRun()
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
