import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { AndroidBackHandler } from '../../../../component/AndroidBackHandler'
import { mainContainer, MOBILE5INCH } from '../../../../constant/lov'
import Navigator from '../../../../services/Navigator'
import CTHeaderDetail from '../../container/CTHeaderDetail'
import CTDropPointHeaderDetail from '../../../stock/container/drop-point/CTHeaderDetail'
import CTSummaryListItems from '../container/CTSummaryListItems'
import CTSummaryDetail from '../container/CTSummaryDetail'
import CTSummaryButtonGroup from '../container/CTSummaryButtonGroup'

const Summary = (props) => {

    const _onBackButtonPressAndroid = () => {

        const { routes, index } = Navigator.getCurrentRoute()
        const { printType } = routes[index].params

        if (printType !== 'transfer') {
            Navigator.navigate('OrderChoice')
        } else {
            Navigator.navigate('Home')
        }

        return true
    }

    const { routes, index } = Navigator.getCurrentRoute()
    const { printType, processResult } = routes[index].params
    console.log("Summary processResult", processResult);
    return (
        <AndroidBackHandler onBackPress={_onBackButtonPressAndroid}>
            <View style={styles.container} >
                <View style={{ flex: 0.3 }}>
                    {
                        printType !== 'transfer' ? <CTHeaderDetail /> : <CTDropPointHeaderDetail />
                    }
                </View>
                <View style={{ flex: 0.7 }}>
                    <CTSummaryListItems />
                    <CTSummaryDetail />
                </View>
                <CTSummaryButtonGroup />
            </View>
        </AndroidBackHandler>
    )
}

export default Summary

const styles = StyleSheet.create({
    container: mainContainer
})