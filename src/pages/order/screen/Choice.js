import React from 'react'
import { StyleSheet, View } from 'react-native'
import { mainContainer } from '../../../constant/lov'
import CTDetail from '../../customer/container/CTDetail'
import CTChoiceGroup from '../container/CTChoiceGroup'

const Choice = (props) => {
console.log('eeee')
  return (
    <View style={styles.container}>
      <View style={{ flex: 0.3 }}>
        <CTDetail />
      </View>
      <View style={{ flex: 0.7 }}>
        <CTChoiceGroup />
      </View>
    </View>
  )
}

export default Choice

const styles = StyleSheet.create({
  container: mainContainer
})
