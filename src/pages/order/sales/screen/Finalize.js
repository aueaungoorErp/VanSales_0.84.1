import React from 'react'
import { StyleSheet, View } from 'react-native'
import { mainContainer } from '../../../../constant/lov'
import BackHandlerHOC from '../../../../hoc/BackHandlerHOC'
import Navigator from '../../../../services/Navigator'
import CTDropPointHeaderDetail from '../../../stock/container/drop-point/CTHeaderDetail'
import CTHeaderDetail from '../../container/CTHeaderDetail'
import CTFinalizeDetail from '../container/CTFinalizeDetail'

const Finalize = (props) => {
    const { routes, index } = Navigator.getCurrentRoute()
    const { orderType } = routes[index].params

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