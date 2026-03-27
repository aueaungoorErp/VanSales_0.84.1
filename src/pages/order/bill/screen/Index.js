import React from 'react'
import { View, StyleSheet } from 'react-native'
import { mainContainer } from '../../../../constant/lov'
import CTDetail from '../../container/CTHeaderDetail'
import CTSearchForm from '../container/CTSearchForm'
import CTListItems from '../container/CTListItems'

const Index = (props) => {
    return (
        <View style={styles.container}>
            <View style={{flex: 0.3}}>
                <CTDetail />
            </View>
            <View style={{flex: 0.7}}>
                <CTSearchForm />
                <CTListItems />
            </View>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: mainContainer
})
