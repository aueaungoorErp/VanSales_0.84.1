import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-elements'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { MainTheme } from '../../constant/lov'

const ITextWithSucessMessage = (props) => {
    const { message, style } = props
    
    const renderDom = (
        <View style={[styles.Containner, style && style.container ? style.container : null]} >
            <Text style={styles.TextStyle} allowFontScaling={false} > {message} </Text>
        </View>
    )

    return message ? renderDom : null;
}

export default ITextWithSucessMessage

const styles = StyleSheet.create({
    Containner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    TextStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: hp('1.7%'),
        color: MainTheme.colorTertiary
    }
})
