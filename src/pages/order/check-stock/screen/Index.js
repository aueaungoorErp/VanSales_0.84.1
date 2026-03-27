import React from 'react'
import { View, StyleSheet,Text } from 'react-native'
import { mainContainer } from '../../../../constant/lov'
import CTHeaderDetail from '../../container/CTHeaderDetail'
import CTButtonGroup from '../container/CTButtonGroup'
import CTListItems from '../container/CTListItems'

const Index = (props) => {
console.log('48524425')
    return (
        <View style={styles.container} >
            <View style={{flex: 0.3}}>
                <CTHeaderDetail />
            </View>
            <View style={{flex: 0.7}}>
                <CTButtonGroup screen={'Index'} position={'top'} />
                <CTListItems />
                <CTButtonGroup screen={'Index'} position={'bottom'} />
            </View>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: mainContainer
})