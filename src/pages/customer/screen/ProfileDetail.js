import React from 'react'
import { View, StyleSheet } from 'react-native'
import { mainContainer } from '../../../constant/lov'
import CTProfileDetailForm from '../container/CTProfileDetailForm'
import CTButtonGroup from '../container/CTButtonGroup'

const Form = (props) => {
    return (
        <View style={styles.container}>
            <CTProfileDetailForm />
            <CTButtonGroup screen={'prfile'} />
        </View>
    )
}

export default Form

const styles = StyleSheet.create({
    container: mainContainer
})