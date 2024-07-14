import React from 'react'
import { Canvas } from '@shopify/react-native-skia'
import { Playground } from './src/Playground'

function App(): React.JSX.Element {
  return (
    <Canvas style={{ flex: 1 }}>
      <Playground />
    </Canvas>
  )
}

export default App
