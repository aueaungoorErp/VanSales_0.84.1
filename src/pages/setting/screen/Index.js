import React from 'react'
import { View, StyleSheet } from 'react-native'
import { MainTheme } from '../../../constant/lov'
import CTListItem from '../container/CTListItems'

const Index = (props) => {
    return (
        <View style={styles.container}>
            <CTListItem />
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: MainTheme.colorSecondary
    }
})