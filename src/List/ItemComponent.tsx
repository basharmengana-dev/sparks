import { Image, StyleSheet, Text, View } from 'react-native'
import { type ListItem } from './types'
import React from 'react'
import { Spinner, Icon } from '@ui-kitten/components'

const AVATAR_SIZE = 60
const CHEVRON_SIZE = 20

export const ItemComponent: React.FC<{
  item: ListItem
  loading: boolean
  firstItemRef: React.RefObject<View>
  newlyAddedKey: string | null
}> = React.memo(({ item, loading, firstItemRef, newlyAddedKey }) => {
  const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      paddingLeft: 30,
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
    textContainer: {
      flex: 1,
      flexDirection: 'column',
      marginLeft: 10,
    },
    rightSideContainer: {
      flex: 1,
      flexDirection: 'row',
      marginRight: CHEVRON_SIZE,
    },
    chevron: {
      width: CHEVRON_SIZE,
      height: CHEVRON_SIZE,
    },
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
      <View style={styles.rightSideContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.item}>{item.item}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <Icon
          style={styles.chevron}
          fill="black"
          name="arrow-ios-forward-outline"
        />
      </View>
    </View>
  )
})
