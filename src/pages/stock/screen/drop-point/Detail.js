import React from 'react'
import { View, StyleSheet } from 'react-native'
import { mainContainer } from '../../../../constant/lov'
import CTDetailForm from '../../container/drop-point/CTDetailForm'
import CTListItems from '../../container/drop-point/CTListItems'

const Detail = (props) => {
    return (
        <View style={[styles.container, {padding: 5}]}>
            <CTDetailForm />
            <CTListItems actionType={'drop-point'}/>
        </View>
    )
}

export default Detail

const styles = StyleSheet.create({
    container: mainContainer
})