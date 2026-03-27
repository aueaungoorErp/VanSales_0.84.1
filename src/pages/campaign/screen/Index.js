import React from 'react'
import { View, StyleSheet } from 'react-native'
import { mainContainer } from '../../../constant/lov'
import CTListItems from '../container/CTListItems'

const Index = (props) => {

    return (
        <View style={[styles.container]}>
            <CTListItems />
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: mainContainer,
    
})