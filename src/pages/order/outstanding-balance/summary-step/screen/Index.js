import React from 'react'
import { View, StyleSheet } from 'react-native'
import { AndroidBackHandler } from '../../../../../component/AndroidBackHandler'
import { mainContainer } from '../../../../../constant/lov'
import Navigator from '../../../../../services/Navigator'
import CTHeaderDetail from '../container/CTHeaderDetail'
import CTForm from '../container/CTForm'
import CTButtonGroup from '../../container/CTButtonGroup'

const Index = () => {

    const _onBackButtonPressAndroid = () => {
        Navigator.navigate('OrderChoice')
        return true
    }

    return (
        <AndroidBackHandler onBackPress={_onBackButtonPressAndroid}>
            <View style={styles.container}>
                <View style={{flex: 0.3}}>
                    <CTHeaderDetail />
                </View>
                <View style={{flex: 0.7}}>
                    <CTForm />
                    <CTButtonGroup />
                </View>
            </View>
        </AndroidBackHandler>
    )
}

export default Index

const styles = StyleSheet.create({
    container: mainContainer
})
