import React from 'react'
import { View, StyleSheet } from 'react-native'
import { mainContainer } from '../../../../../constant/lov'
import CTHeaderDetail from '../container/CTHeaderDetail'
import CTForm from '../container/CTForm'
import CTButtonGroup from '../../container/CTButtonGroup'

const Index = (props) => {
    return (
        <View style={styles.container}>
            <View style={{flex: 0.3}}>
                <CTHeaderDetail />
            </View>
            <View style={{flex: 0.7}}>
                <CTForm />
                <CTButtonGroup />
            </View>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: mainContainer
})