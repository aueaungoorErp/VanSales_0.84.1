import React from 'react'
import { View, Text, StyleSheet} from 'react-native'
import { Button, Icon } from 'react-native-elements'
import { MainTheme } from '../../constant/lov'
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons'

const ErrorMessage = (props) => {
    const { isDisplaying, message, containerStyle, textStyle, iconName, iconType, iconColor, iconSize, type, onButtonPress, buttonTitle } = props
    const _message = 'Data not found'

    const IconProcess = () => {
        if(!iconType){
            return (
                <Icon 
                    name={iconName ? iconName : 'search'} 
                    color={iconColor ? iconColor : '#463E3F'} 
                    size={iconSize ? iconSize : 120}
                    type={type} />
            )
        // } else (iconType && iconType == 'MaterialCommunityIcons') {
        } else {
            return ( 
                <MaterialCommunityIcons 
                    name={iconName ? iconName : 'search'} 
                    color={iconColor ? iconColor : '#463E3F'} 
                    size={iconSize ? iconSize : 120} />
            )
        }

    }

    const _buttonPressRender = () => {
        return (
            <Button
                title={buttonTitle}
                titleStyle={{ color: '#463E3F', fontSize: 12 }}
                onPress={ () => onButtonPress ? onButtonPress() : null }
                buttonStyle={{ backgroundColor: MainTheme.colorSecondary, marginTop: 10, borderColor: MainTheme.colorPrimary, borderRadius: 5 }}
                type='outline'
                containerStyle={{}}
            />
        )
    }

    const renderDom = (
        <View style={[styles.Container, containerStyle]}>
            <IconProcess />
            <Text style={[styles.TextStyle, textStyle]}> {message ? message : _message} </Text>
            {
                onButtonPress ? _buttonPressRender() : null
            }
        </View>
    )

    return isDisplaying ? renderDom : null
}

export default ErrorMessage

const styles = StyleSheet.create({
    Container: {
        flex: 1, 
        backgroundColor: MainTheme.colorSecondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    TextStyle: {
        fontSize: 15
    }
})