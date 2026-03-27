import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { Text } from 'react-native-elements'

const ILoading = (props) => {
    const { isLoading, message, style } = props
    
    const renderDom = (
        <View style={[styles.Containner, style && style.container ? style.container : null]} >
            <Image style={[styles.ImageStyle, style && style.image ? style.image : null]} 
                resizeMode='contain' 
                source={require('../../images/loading.gif')} />
            <Text style={[styles.TextStyle, style && style.text ? style.text : null]}>{message}</Text>
        </View>
    )

    return isLoading ? renderDom : null
}

export default ILoading

const styles = StyleSheet.create({
    Containner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    ImageStyle: {
        width: 30, 
        height:30
    },
    TextStyle: {
        marginLeft: 10,
        fontSize: 18,
    }
})
