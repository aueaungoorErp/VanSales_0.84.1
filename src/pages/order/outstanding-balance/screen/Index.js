import React from 'react'
import { View, StyleSheet } from 'react-native'
import { mainContainer } from '../../../../constant/lov'
import CTDetail from '../../container/CTHeaderDetail'
import CTSearchForm from '../container/CTSearchForm'
import CTListItems from '../container/CTListItems'
import CTButtonGroup from '../container/CTButtonGroup'

const Index = (props) => {
    return (
        <View style={styles.container}>
            <View style={{flex: 0.3}}>
                <CTDetail />
            </View>
            <View style={{flex: 0.7}}>
                <CTSearchForm />
                <CTListItems />
                <CTButtonGroup />
            </View>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: mainContainer
})
