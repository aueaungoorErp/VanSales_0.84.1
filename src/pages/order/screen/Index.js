import React from 'react'
import { View, StyleSheet } from 'react-native'
import { MainTheme, mainContainer } from '../../../constant/lov'
import CTSearchForm from '../../customer/container/CTSearchForm'
import CTListItems from '../../customer/container/CTListItems'
import BackHandlerHOC from '../../../hoc/BackHandlerHOC'

const Index = (props) => {
  return (
    <View style={[styles.container, { paddingTop: 5}]}>
      <CTSearchForm />
      <CTListItems />
    </View>
  )
}

export default BackHandlerHOC(Index)

const styles = StyleSheet.create({
  container: mainContainer,
  containerStyle: {
    width: '100%',
    height:40, 
    borderRadius: 6,
    borderColor: MainTheme.colorPrimary
  },
  buttonStyle: {
    backgroundColor: MainTheme.colorSecondary
  }
})
