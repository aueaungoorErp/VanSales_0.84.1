import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'

import { mainContainer } from '../../../constant/lov'

import CTForm from '../container/CTForm'
import CTListItems from '../container/CTListItems'

class Index extends Component {
    constructor(props) {
        super(props)
        
    }

    render() {
        return (
            <View style={styles.container}>
                <CTForm />
                <CTListItems />
            </View>
        )
    }
}

export default Index

const styles = StyleSheet.create({
    container: mainContainer
})