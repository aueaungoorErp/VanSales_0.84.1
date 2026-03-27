import React from "react"
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

const Item = ({ children, style }) => <View style={style}>{children}</View>

const Input = React.forwardRef(({ value, style, ...props }, ref) => (
    <TextInput
        ref={ref}
        value={value === null || value === undefined ? '' : String(value)}
        style={style}
        underlineColorAndroid="transparent"
        {...props}
    />
))

const ITextInputWithLabel = (props) => {
    const { 
        label, 
        placeholder, 
        keyboardType, 
        value, 
        editable, 
        maxLength, 
        onChange, 
        onChangeText, 
        multiline, 
        numberOfLines, 
        style, 
        getRef,
        returnKeyType,
        onSubmitEditing } = props

    return (
        <Item style={[
            styles.container, 
            style && style.container ? style.container : null
            ]}>
            <Item style={[styles.label, style && style.label ? style.label : null]}>
                <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >{label}</Text>
            </Item>
            <Input 
                ref={ (ref) => getRef ? getRef(ref): null }
                style={[styles.textInput, { fontSize: hp('1.7%') }, style && style.textInput ? style.textInput : null]} 
                allowFontScaling={false} 
                underlineColorAndroid="transparent"
                placeholder={placeholder ? placeholder : null}
                keyboardType={keyboardType ? keyboardType : 'default'}
                value={value} 
                editable={editable} 
                maxLength={maxLength}
                multiline={multiline}
                numberOfLines={numberOfLines ? numberOfLines : null}
                onChange={onChange ? (value) => onChange(value) : null}
                onChangeText={onChangeText ? (value) => onChangeText(value) : null}
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing ? () => onSubmitEditing() : null} />
        </Item>
    )
}

export default ITextInputWithLabel

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 0,
        borderColor: '#d6d7da',
        flexDirection: 'row'
    },
    label: {
        flex: 0.2,
        borderBottomWidth: 0
    },
    textInput: {
        flex: 0.8, 
        borderBottomWidth: 0, 
        alignItems: 'center', 
        padding: 0
    },
    itemSection: { 
        borderBottomColor: '#d6d7da'
    }
})