import React from 'react'
import { Text,View, StyleSheet } from 'react-native'
import BackHandlerHOC from '../../../../hoc/BackHandlerHOC'
import { mainContainer } from '../../../../constant/lov'
import Navigator from '../../../../services/Navigator'
import CTHeaderDetail from '../../container/CTHeaderDetail'
import CTDropPointHeaderDetail from '../../../stock/container/drop-point/CTHeaderDetail'
import CTButtonGroup from '../../container/CTButtonGroup'
import CTListItems from '../../container/CTListItems'

const Index = () => {
    const { routes, index } = Navigator.getCurrentRoute()
    const routeName = routes[index].name
 
    return (
        <View style={styles.container}>
            <View style={{flex: 0.3}}>
                {
                    routeName === 'OrderSales' ? <CTHeaderDetail /> : <CTDropPointHeaderDetail />
                }
                
            </View>
            <View style={{flex: 0.7}}>
                <CTButtonGroup />
                <CTListItems />
                <CTButtonGroup hasFooterButton />
            </View>
        </View>
    )
}

export default BackHandlerHOC(Index)

const styles = StyleSheet.create({
    container: mainContainer
})