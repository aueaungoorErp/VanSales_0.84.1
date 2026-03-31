import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { MainTheme } from '../../constant/lov'

const ITextWithErrorMessage = (props) => {
    const { message, style } = props
    const normalizedMessage = message instanceof Error
        ? message.message
        : typeof message === 'string'
            ? message
            : message != null
                ? String(message)
                : null
    
    const renderDom = (
        <View style={[styles.Containner, style && style.container ? style.container : null]} >
            <Text style={styles.TextStyle}> {normalizedMessage} </Text>
        </View>
    )

    return normalizedMessage ? renderDom : null;
}

export default ITextWithErrorMessage

const styles = StyleSheet.create({
    Containner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    TextStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        color: MainTheme.colorDanger
    }
})
