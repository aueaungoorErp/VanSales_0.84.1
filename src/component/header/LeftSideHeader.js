import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Navigator from '../../services/Navigator'
import { MainTheme } from '../../constant/lov'

const LeftSideHeader = (props) => {
    const { onSettingPress } = props

    const _onSettingPress = () => {
        Navigator.navigate('Setting')
    } 

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                onPress={_onSettingPress}
                style={styles.touchable}>
                <Icon 
                    name="settings" 
                    size={24} 
                    color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    )
}

export default LeftSideHeader

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 60
    },
    touchable: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
})