import React from 'react'
import { View, StyleSheet } from 'react-native'
import { mainContainer } from '../../../../constant/lov'
import CTSearchForm from '../../../product/container/CTSearchForm'
import CTListItems from '../../../product/container/CTListItems'

const Index = (props) => {

    return (
        <View style={[styles.container]}>
            <CTSearchForm screen={'Stock'} />
            <CTListItems screen={'Stock'} />
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: mainContainer
})