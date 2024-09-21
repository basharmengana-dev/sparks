import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import {
  FlatList,
  Text,
  View,
  Image,
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
import { getConfetti } from '../ConfettiResource/AvatarListItem'
import {
  Spinner,
  useTheme,
  Button,
  Icon,
  IconElement,
} from '@ui-kitten/components'

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
  item: string
  description: string
}

function getRandomFirstName(): string {
  const firstNames: string[] = [
    'Aaliyah',
    'Hiroshi',
    'Zara',
    'Mateo',
    'Fatima',
    'Luca',
    'Priya',
    'Ahmed',
    'Yara',
    'Dante',
    'Santiago',
    'Amara',
    'Kofi',
    'Mei',
    'Hassan',
    'Leila',
    'Akira',
    'Zainab',
    'Elio',
    'Tariq',
    'Indira',
    'Omar',
    'Sofia',
    'Anaya',
    'Nina',
    'Wei',
    'Juan',
    'Aria',
    'Mohammed',
    'Suki',
    'Aliyah',
    'Ibrahim',
    'Aminata',
    'Ezra',
    'Keiko',
    'Selim',
    'Mina',
    'Ayesha',
    'Zuri',
    'Ravi',
  ]

  const randomFirstName =
    firstNames[Math.floor(Math.random() * firstNames.length)]

  return randomFirstName
}

const AVATAR_SIZE = 60
const ItemComponent: React.FC<{
  item: ListItem
  loading: boolean
  firstItemRef: React.RefObject<View>
  newlyAddedKey: string | null
}> = React.memo(({ item, loading, firstItemRef, newlyAddedKey }) => {
  const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      paddingLeft: 40,
      alignItems: 'center',
      height: 80,
    },
    avatar: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: 25,
    },
    avatarLoading: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'darkgray',
      marginRight: 10,
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      paddingLeft: 2,
    },
    textContainer: { flex: 1, flexDirection: 'column', marginLeft: 10 },
    item: { fontSize: 16, fontWeight: 'bold' },
    description: { fontSize: 14, color: '#666' },
  })

  return (
    <View style={[styles.itemContainer]}>
      {newlyAddedKey === item.key && loading ? (
        <View style={styles.avatarLoading}>
          <View style={styles.loaderContainer}>
            <Spinner size="medium" status="basic" />
          </View>
        </View>
      ) : (
        <View ref={firstItemRef}>
          <Image
            source={{
              uri: `https://api.dicebear.com/9.x/avataaars/jpg?seed=${item.item}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
            }}
            style={styles.avatar}
          />
        </View>
      )}
      <View style={styles.textContainer}>
        <Text style={styles.item}>{item.item}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  )
})

export const List: React.FC = () => {
  const theme = useTheme()

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

  const [data, setData] = useState<ListItem[]>([
    { key: '1', item: 'Carlos', description: 'Brother' },
    { key: '2', item: 'Carnita', description: 'Sister' },
    { key: '3', item: 'Lupin', description: 'Dad' },
    { key: '4', item: 'Lapida', description: 'Mom' },
  ])
  const flatListRef = useRef<FlatList<ListItem>>(null) // Ref to control the FlatList

  const [newlyAddedKey, setNewlyAddedKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const confettiOrchestrator = useRef<ConfettiOrchestratorRef>(null)
  const gridColor = useSharedValue<RGBA>([0.0, 0.0, 0.0, 0.0])
  const [confetti, setConfetti] = useState<Confetti[]>([])

  const firstItemRef = useRef<View | null>(null)
  const measureFirstItemPosition = () => {
    if (firstItemRef.current) {
      firstItemRef.current.measureInWindow((x, y, width, height) => {
        const convertedToGridPoint = grid.convertToGridCoordinates(
          x + width / 2,
          y + height / 2,
        )
        setConfetti(
          getConfetti({
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

    measureFirstItemPosition()
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: data.length, animated: true })
    }, 500)
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
