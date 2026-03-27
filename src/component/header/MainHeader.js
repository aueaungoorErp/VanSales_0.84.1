import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import LeftSideHeader from "./LeftSideHeader"
import RightSideHeader from "./RightSideHeader"
import { MainTheme } from '../../constant/lov'
import Navigator from '../../services/Navigator'

class MainHeader extends React.Component {
  constructor(props) {
    super(props)

    const { routes, index } = Navigator.getCurrentRoute()
    this._title = routes[index].params && routes[index].params.title ? routes[index].params.title : null
  }

  render() {
    return (
        <View style={styles.container}>
          <LeftSideHeader />
          <Text style={styles.title} allowFontScaling={false} >{ this._title }</Text>
          <RightSideHeader />
        </View>
    )
  }
}

export default MainHeader

const styles = StyleSheet.create({
  container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: MainTheme.colorPrimary,
      height: 60,
      paddingHorizontal: 10,
  },
  IconStyle: {
    margin: 5
  },
  title: {
    flex: 1,
    color: '#FFF',
    fontSize: hp('2%'),
    textAlign: 'center'
  }
})
