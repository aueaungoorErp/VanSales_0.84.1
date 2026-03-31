import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { MainTheme } from '../../constant/lov'

const LoginHeader = (props) => {
  const title = props.route?.params?.title || null

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

export default LoginHeader

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: MainTheme.colorPrimary,
        height: 60
    },
    IconStyle: {
      margin: 5
    },
    title: {
      color: '#FFF'
    }
})
