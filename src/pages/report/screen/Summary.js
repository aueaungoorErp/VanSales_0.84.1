import React from 'react'
import { View, StyleSheet } from 'react-native'
import { MainTheme } from '../../../constant/lov'
import CTSearchForm from '../container/CTSearchForm'
import CTListItems from '../container/CTListItems'

const Summary = (props) => {

    return (
        <View style={styles.container}>
            <CTSearchForm />
            <CTListItems />
        </View>
    )
}

export default Summary

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: MainTheme.colorSecondary
    }
})