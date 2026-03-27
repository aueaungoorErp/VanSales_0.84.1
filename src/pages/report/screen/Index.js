import React from 'react'
import { View, StyleSheet } from 'react-native'
import { mainContainer } from '../../../constant/lov'
import CTMenuListItems from '../container/CTMenuListItems'

const Index = (props) => {

    return (
        <View style={styles.container}>
            <CTMenuListItems />
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: mainContainer
})