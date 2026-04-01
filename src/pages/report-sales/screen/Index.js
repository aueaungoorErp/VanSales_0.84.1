import React from 'react'
import { StyleSheet, View } from 'react-native'
import CTDetailForm from '../container/CTDetailForm'
import CTSearchForm from '../container/CTSearchForm'

const Index = (props) => {

    return (
        <View style={styles.container}>
            <CTSearchForm />
            <CTDetailForm />
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#F4F8F5',
        paddingVertical: 8
    }
})
