import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { MainTheme } from "../../constant/lov"

const ITextWithLabel = (props) => {
    const { label, value, isDisplay, style } = props

    const renderDom = (
        <View style={[styles.container, style && style.container ? style.container : null]}>
            <Text style={[styles.label, style && style.label ? style.label : null]} allowFontScaling={false} >{label}</Text>
            <Text style={[styles.text, style && style.text ? style.text : null]} allowFontScaling={false} >{value}</Text>
        </View>
    )

    return isDisplay ? renderDom : null;
} 

export default ITextWithLabel

const styles = StyleSheet.create({
    container: {
        height: 50, 
        paddingVertical: 5, 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center'},
    iconStyle: {

    },
    label: {
        flex: 0.2, 
        color: MainTheme.colorPrimary
    },
    text: {
        flex: 0.8
    }
})