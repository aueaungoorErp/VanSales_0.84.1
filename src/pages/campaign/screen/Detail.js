import React from 'react'
import { View, StyleSheet } from 'react-native'
import { mainContainer } from '../../../constant/lov'
import CTDetailForm from '../container/CTDetailForm'
import CTDetailListItems from '../container/CTDetailListItems'

const Index = (props) => {

    return (
        <View style={[styles.container]}>
            <CTDetailForm />
            <CTDetailListItems />
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: mainContainer,
    
})