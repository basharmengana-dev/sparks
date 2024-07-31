import { Button, Dimensions, View } from 'react-native'
import { Canvas } from '@shopify/react-native-skia'
import { useState } from 'react'
import { Grid } from '../Grid'

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

  return (
    <>
      <Canvas style={{ flex: 1, backgroundColor: 'black' }}>
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
            // sparkRefCollection.forEach(ref => {
            //   ref?.current?.readyToRun()
            // })
            // runOrchestration()
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
