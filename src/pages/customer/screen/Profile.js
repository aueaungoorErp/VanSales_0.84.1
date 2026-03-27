import React from 'react'
import { View, StyleSheet } from 'react-native'
import { mainContainer } from '../../../constant/lov'
import CTSearchForm from '../container/CTSearchForm'
import CTListItems from '../container/CTListItems'

const Form = (props) => {

    return (
        <View style={styles.container}>
            <CTSearchForm screen={'profile'} />
            <CTListItems screen={'profile'} />
        </View>
    )
}

export default Form

const styles = StyleSheet.create({
    container: mainContainer
})