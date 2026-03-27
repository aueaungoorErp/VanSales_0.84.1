import React from 'react'
import { View, StyleSheet } from 'react-native'
import { mainContainer } from '../../../constant/lov' 
import CTChoices from '../container/CTChoices'

const Index = (props) => {

    return (
        <View style={[styles.container]}>
            <CTChoices />
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: mainContainer
})