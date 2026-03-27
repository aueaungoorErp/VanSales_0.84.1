import React from 'react'
import { View, StyleSheet } from 'react-native'
import { mainContainer } from '../../../constant/lov'
import CTForm from '../container/CTForm'
import CTButtonGroup from '../container/CTButtonGroup'

const Index = (props) => {

    return (
        <View style={styles.container}>
            <View style={{ flex: 1}}>
                <CTForm />
            </View>
            <CTButtonGroup screen={'add'} />
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: mainContainer
})