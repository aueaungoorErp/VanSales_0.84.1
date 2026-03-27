import React from 'react'
import { View, StyleSheet } from 'react-native'
import { MainTheme } from '../../../constant/lov'
import CTSearchForm from '../container/CTSearchForm'
import DetailForm from '../presenter/DetailForm'

const Index = (props) => {

    return (
        <View style={styles.container}>
            <CTSearchForm />
            <DetailForm />
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: MainTheme.colorSecondary,
        padding: 5
    }
})
