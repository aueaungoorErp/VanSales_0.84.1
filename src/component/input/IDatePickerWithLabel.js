import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { MainTheme } from "../../constant/lov"
import IDatePicker from './IDatePicker'

const IDatePickerWithLabel = (props) => {
    const { label, date, isDisplay, style, onDateChange, disabled, datePickerStyle, format } = props

    const renderDom = (
        <View style={[styles.container, style && style.container ? style.container : null]} >
            <Text style={[styles.label, style && style.label ? style.label : null]}>{label}</Text>
            <IDatePicker 
                format={format}
                date={date}
                style={[styles.datePicker, datePickerStyle ? datePickerStyle : null]}
                onDateChange={onDateChange ? onDateChange : null}
                disabled={disabled} />
        </View>
    )

    return isDisplay ? renderDom : null;
} 

export default IDatePickerWithLabel

const styles = StyleSheet.create({
    container: {
        height: 30, 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    label: {
        flex: 0.2, 
        color: MainTheme.colorPrimary
    },
    datePicker: {
        flex: 0.8
    }
})