import React from 'react'
import { StyleSheet, View } from 'react-native'
import { AndroidBackHandler } from '../../../../component/AndroidBackHandler'
import { mainContainer } from '../../../../constant/lov'
import Navigator from '../../../../services/Navigator'
import CTDropPointHeaderDetail from '../../../stock/container/drop-point/CTHeaderDetail'
import CTHeaderDetail from '../../container/CTHeaderDetail'
import CTSummaryButtonGroup from '../container/CTSummaryButtonGroup'
import CTSummaryDetail from '../container/CTSummaryDetail'
import CTSummaryListItems from '../container/CTSummaryListItems'

const Summary = (props) => {

    const _onBackButtonPressAndroid = () => {

        const { routes, index } = Navigator.getCurrentRoute()
        const { printType } = routes[index].params
        console.log('printTypeaaaaa', printType)

        if (printType !== 'transfer' && printType) {
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
                <View style={styles.headerSection}>
                    {
                        printType !== 'transfer' ? <CTHeaderDetail /> : <CTDropPointHeaderDetail />
                    }
                </View>
                <View style={styles.summaryContentSection}>
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
    container: {
        ...mainContainer,
        backgroundColor: '#F4F7F6',
    },
    headerSection: {
        flex: 0.28,
        paddingBottom: 6,
    },
    summaryContentSection: {
        flex: 0.72,
        paddingHorizontal: 8,
        paddingBottom: 8,
    },
})