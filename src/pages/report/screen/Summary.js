import React from 'react'
import { StyleSheet, View } from 'react-native'
import CTListItems from '../container/CTListItems'
import CTSearchForm from '../container/CTSearchForm'

const Summary = (props) => {

    return (
        <View style={styles.container}>
            <View style={styles.searchSection}>
                <CTSearchForm />
            </View>
            <View style={styles.listSection}>
                <CTListItems />
            </View>
        </View>
    )
}

export default Summary

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#F4F8F5'
    },
    searchSection: {
        zIndex: 1,
    },
    listSection: {
        flex: 1,
        paddingTop: 4,
    }
})