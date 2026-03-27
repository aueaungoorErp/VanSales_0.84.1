import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import BackHandlerHOC from '../../../../hoc/BackHandlerHOC'
import { mainContainer, MOBILE5INCH } from '../../../../constant/lov'
import CTHeaderDetail from '../../container/CTHeaderDetail'
import CTDropPointHeaderDetail from '../../../stock/container/drop-point/CTHeaderDetail'
import CTFinalizeDetail from '../container/CTFinalizeDetail'
import Navigator from '../../../../services/Navigator'

const Finalize = (props) => {
    const { routes, index } = Navigator.getCurrentRoute()
    const { orderType } = routes[index].params

    console.log(orderType)

    return (
        <View style={styles.container} >
            {/* <View style={{flex: Dimensions.get('window').width > MOBILE5INCH ? 0.2 : 0.3}}> */}
            <View style={{ flex: 0.3 }}>
                {
                    orderType !== 'โอนย้ายสินค้า' ? <CTHeaderDetail /> : <CTDropPointHeaderDetail />
                }
            </View>
            {/* <View style={{ flex: Dimensions.get('window').width > MOBILE5INCH ? 0.8 : 0.7 }}> */}
            <View style={{ flex: 0.7 }}>
                <CTFinalizeDetail />
            </View>
        </View>
    )
}

export default BackHandlerHOC(Finalize)

const styles = StyleSheet.create({
    container: mainContainer
})