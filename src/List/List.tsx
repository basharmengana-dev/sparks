import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import {
  FlatList,
  View,
  StyleSheet,
  SafeAreaView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native'
import { Canvas } from '@shopify/react-native-skia'
import { Grid } from '../Grid'
import { useSharedValue } from 'react-native-reanimated'
import { RGBA } from '../AnimationObjects/ColorSchemas'
import {
  Confetti,
  ConfettiOrchestrator,
  ConfettiOrchestratorRef,
} from '../Confetti/ConfettiOrchestration'
import { getConfetti as getSimple1Confetti } from '../ConfettiResource/AvatarListItem'
import { getConfetti as getLoop1Confetti } from '../ConfettiResource/Playground'
import { useTheme, Button, Icon } from '@ui-kitten/components'
import { ListItem } from './types'
import { ItemComponent } from './ItemComponent'
import { getRandomFirstName } from './getRandomFirstName'

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
}

const grid = new Grid({
  gridWidth: 100,
  gridHeight: 100,
  cellWidth: 4,
  cellHeight: 2,
  radius: 1,
})

export const List: React.FC = () => {
  const theme = useTheme()

  const flatListRef = useRef<FlatList<ListItem>>(null)
  const [loading, setLoading] = useState(false)
  const confettiOrchestrator = useRef<ConfettiOrchestratorRef>(null)
  const firstItemRef = useRef<View | null>(null)

  const [newlyAddedKey, setNewlyAddedKey] = useState<string | null>(null)
  const gridColor = useSharedValue<RGBA>([0.0, 0.0, 0.0, 0.0])
  const [confetti, setConfetti] = useState<Confetti[]>([])

  const [data, setData] = useState<ListItem[]>([
    { key: '1', item: 'Carlos', description: 'Brother' },
    { key: '2', item: 'Carnita', description: 'Sister' },
    { key: '3', item: 'Lupin', description: 'Dad' },
    { key: '4', item: 'Lapida', description: 'Mom' },
  ])

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme['color-primary-100'] },
    safeAreaContainer: { flex: 1 },
    flatList: { flex: 1 },
    button: {
      margin: 2,
      height: 80,
      marginBottom: -1,
      width: '110%',
      alignSelf: 'center',
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

  const measureFirstItemPosition = () => {
    if (firstItemRef.current) {
      firstItemRef.current.measureInWindow((x, y, width, height) => {
        const convertedToGridPoint = grid.convertToGridCoordinates(
          x + width / 2,
          y + height / 2,
        )

        setConfetti(
          getLoop1Confetti({
            origin: {
              x: convertedToGridPoint.x,
              y: convertedToGridPoint.y,
            },
            keepTrail: false,
          }),
        )
      })
    }
  }

  useEffect(() => {
    setTimeout(() => {
      measureFirstItemPosition()
    }, 100)
  }, [data])

  const handleAddItem = () => {
    setLoading(true)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    const newItem: ListItem = {
      key: String(data.length + 1),
      item: getRandomFirstName(),
      description: 'Friend',
    }

    setData(prevData => [...prevData, newItem])
    setNewlyAddedKey(newItem.key)

    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: data.length, animated: true })
    }, 800)
    setTimeout(() => {
      confettiOrchestrator.current?.run()
      setLoading(false)
    }, 1500)
  }

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      return (
        <ItemComponent
          item={item}
          loading={loading}
          firstItemRef={firstItemRef}
          newlyAddedKey={newlyAddedKey}
        />
      )
    },
    [newlyAddedKey, loading],
  )

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <FlatList
          ref={flatListRef} // Attach the ref to FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.key}
          style={styles.flatList}
          inverted
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}
          ListHeaderComponent={<View style={{ height: 200 }} />} // Add 100px at the top
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
        </Canvas>
      </View>
      <Button
        style={styles.button}
        disabled={loading}
        accessoryLeft={<Icon fill="white" name="plus" />}
        onPress={handleAddItem}>
        ADD FRIEND
      </Button>
    </View>
  )
}
