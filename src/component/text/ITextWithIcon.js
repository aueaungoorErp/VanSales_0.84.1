import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements'
import { MainTheme } from "../../constant/lov"

const ITextWithIcon = (props) => {
    const { iconName, iconType, iconSize, value, isDisplay, style } = props

    const renderDom = (
        <View style={[styles.container, style && style.container ? style.container : null]} > 
            <Icon 
                name={iconName} 
                type={iconType}
                size={iconSize ? iconSize : 20}
                color={MainTheme.colorPrimary} 
                iconStyle={[styles.iconStyle, style && style.iconStyle ? style.iconStyle : null]} />

            <Text style={[styles.textStyle, style && style.textStyle ? style.textStyle : null]}>{value}</Text>
        </View>
    )

    return isDisplay ? renderDom : null;
} 

export default ITextWithIcon

const styles = StyleSheet.create({
    container: {
        height: 40, 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 5
    },
    iconStyle: {

    },
    textStyle: {
        marginLeft: 5
    }
})