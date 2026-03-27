import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { AndroidBackHandler } from '../../../../component/AndroidBackHandler'
import { mainContainer, MOBILE5INCH } from '../../../../constant/lov'
import CTHeaderDetail from '../../container/CTHeaderDetail'
import CTSummaryForm from '../container/CTSummaryForm'
import CTButtonGroup from '../container/CTButtonGroup'
import Navigator from '../../../../services/Navigator'

const Finalize = (props) => {
    const { routes, index } = Navigator.getCurrentRoute()
    const { orderType } = routes[index].params

    const _onBackButtonPressAndroid = () => {
        const { routes, index } = Navigator.getCurrentRoute()
        const { onBackFromAnother } = routes[index].params
        onBackFromAnother && onBackFromAnother()

        return false
    }

    return (
        <AndroidBackHandler onBackPress={_onBackButtonPressAndroid}>
            <View style={styles.container} >
                <View style={{flex: Dimensions.get('window').width > MOBILE5INCH ? 0.2 : 0.3}}>
                    <CTHeaderDetail />
                </View>
                <View style={{flex: Dimensions.get('window').width > MOBILE5INCH ? 0.8 : 0.7}}>
                    <CTSummaryForm />
                    <CTButtonGroup screen={'Summary'} />
                </View>
            </View>
        </AndroidBackHandler>
    )
}

export default Finalize

const styles = StyleSheet.create({
    container: mainContainer
})