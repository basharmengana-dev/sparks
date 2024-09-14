import React, { useState, useCallback, useRef, useMemo } from 'react'
import {
  FlatList,
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Button,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
} from 'react-native'
import { Canvas } from '@shopify/react-native-skia'
import { Grid } from '../Grid'
import { useSharedValue } from 'react-native-reanimated'
import { RGBA } from '../AnimationObjects/ColorSchemas'
import {
  ConfettiOrchestrator,
  ConfettiOrchestratorRef,
} from '../Confetti/ConfettiOrchestration'
import { getConfetti } from '../ConfettiResource/AvatarListItem'

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

interface ListItem {
  key: string
  value: string
  recipient: string
}

const ListItemComponent: React.FC<{ item: ListItem }> = React.memo(
  ({ item }) => {
    return (
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
  },
)

const NewItemComponent: React.FC<{
  item: ListItem
  loading: boolean
}> = React.memo(({ item, loading }) => {
  return (
    <View style={[styles.itemContainer, styles.newItemContainer]}>
      {loading ? (
        <View style={styles.avatarLoading}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        </View>
      ) : (
        <Image
          source={{
            uri: `https://api.dicebear.com/9.x/initials/jpg?seed=${item.recipient}`,
          }}
          style={styles.avatar}
        />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.value}>£{item.value}</Text>
        <Text style={styles.recipient}>{item.recipient}</Text>
      </View>
    </View>
  )
})

export const List: React.FC = () => {
  const [data, setData] = useState<ListItem[]>([
    { key: '1', value: '90', recipient: 'John Doe' },
    { key: '2', value: '15', recipient: 'Jane Smith' },
    { key: '3', value: '100', recipient: 'Sam Johnson' },
  ])
  const [newlyAddedKey, setNewlyAddedKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAddItem = () => {
    // Trigger layout animation immediately
    setLoading(true)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    const newItem = {
      key: String(data.length + 1),
      value: String(Math.floor(Math.random() * 100)),
      recipient: 'New Recipient',
    }

    setData(prevData => [...prevData, newItem])
    setNewlyAddedKey(newItem.key)

    setTimeout(() => {
      confettiOrchestrator.current?.run()
      setLoading(false)
    }, 2000)
  }

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.key === newlyAddedKey) {
        return <NewItemComponent item={item} loading={loading} />
      } else {
        return <ListItemComponent item={item} />
      }
    },
    [newlyAddedKey, loading],
  )

  const [confettiPoint, setConfettiPoint] = useState({ x: 4.2, y: 41.55 })
  const confettiOrchestrator = useRef<ConfettiOrchestratorRef>(null)
  const gridColor = useSharedValue<RGBA>([0.0, 0.0, 0.0, 0.0])
  const confetti = useMemo(() => {
    return getConfetti({
      keepTrail: false,
      origin: confettiPoint,
    })
  }, [])

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.key}
          style={styles.flatList}
          inverted
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-end',
            top: -50,
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

      <View style={styles.controls}>
        <Button title={'🆕'} onPress={handleAddItem} />
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
  container: { flex: 1 },
  safeAreaContainer: { flex: 1 },
  flatList: { flex: 1, paddingTop: 100 },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingLeft: 40,
    alignItems: 'center',
  },
  newItemContainer: {
    backgroundColor: 'rgba(0, 255, 0, 0.2)', // Highlight for new items
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  avatarLoading: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    marginRight: 10,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingLeft: 2,
  },
  textContainer: { flex: 1, flexDirection: 'column' },
  value: { fontSize: 16, fontWeight: 'bold' },
  recipient: { fontSize: 14, color: '#666' },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    columnGap: 10,
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
