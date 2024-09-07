import React, { useRef, useState, useMemo } from 'react'
import {
  FlatList,
  Text,
  View,
  Image,
  StyleSheet,
  ListRenderItem,
  SafeAreaView,
  Button,
} from 'react-native'
import { Canvas, Circle } from '@shopify/react-native-skia'
import { Grid } from '../Grid'
import { useSharedValue } from 'react-native-reanimated'
import { RGBA } from '../AnimationObjects/utils'
import {
  ConfettiOrchestrator,
  ConfettiOrchestratorRef,
} from '../Confetti/ConfettiOrchestration'
import { getConfetti } from '../ConfettiResource/AvatarListItem'

interface ListItem {
  key: string
  value: string
  recipient: string
}

const grid = new Grid({
  gridWidth: 100,
  gridHeight: 100,
  cellWidth: 4,
  cellHeight: 2,
  radius: 1,
})

export const List: React.FC = () => {
  const data: ListItem[] = [
    {
      key: '1',
      value: '90',
      recipient: 'John Doe',
    },
    {
      key: '2',
      value: '15',
      recipient: 'Jane Smith',
    },
    {
      key: '3',
      value: '100',
      recipient: 'Sam Johnson',
    },
  ]

  const [positions, setPositions] = useState<{ x: number; y: number }[]>([])

  const confettiOrchestrator = useRef<ConfettiOrchestratorRef>(null)
  const gridColor = useSharedValue<RGBA>([0.0, 0.0, 0.0, 1.0])
  const confetti = useMemo(() => {
    return getConfetti({
      keepTrail: false,
      origin: grid.getCenter(),
    })
  }, [])

  const renderItem: ListRenderItem<ListItem> = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{
          uri: `https://api.dicebear.com/9.x/initials/jpg?seed=${item.recipient}`,
        }}
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.value}>£{item.value}</Text>
        <Text style={styles.recipient}>{item.recipient}</Text>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.key}
          style={styles.flatList}
        />
      </SafeAreaView>

      <View style={styles.canvas}>
        <Canvas style={{ flex: 1 }}>
          {grid.generateCircles({
            dotColor: gridColor,
            printAnchorDots: false,
          })}

          <ConfettiOrchestrator
            confetti={confetti}
            grid={grid}
            paused={useSharedValue(false)}
            ref={confettiOrchestrator}
          />

          {positions.length > 0 && (
            <Circle
              cx={positions[0].x}
              cy={positions[0].y}
              r={5}
              color={'red'}
            />
          )}
        </Canvas>
      </View>

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
              gridColor.value = [0.0, 0.0, 0.0, 1.0]
            }
          }}
          color={'white'}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeAreaContainer: {
    flex: 1,
  },
  flatList: {
    flex: 1,
    paddingTop: 100,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingLeft: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipient: {
    fontSize: 14,
    color: '#666',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
})
