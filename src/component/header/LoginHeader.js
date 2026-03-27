import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { MainTheme } from '../../constant/lov'
import Navigator from '../../services/Navigator'

class LoginHeader extends React.Component {

  constructor(props) {
    super(props)

    const { routes, index } = Navigator.getCurrentRoute()
    this._title = routes[index].params && routes[index].params.title ? routes[index].params.title : null
  }

  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{ this._title }</Text>
      </View>
    )
  }
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
