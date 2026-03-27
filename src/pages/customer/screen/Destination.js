import React from 'react'
import { View, StyleSheet } from 'react-native'
import { mainContainer } from '../../../constant/lov' 
import CTDestinationMap from '../container/CTDestinationMap'

const Index = () => {

    return (
        <View style={[styles.container]}>
            <CTDestinationMap />
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: mainContainer
})