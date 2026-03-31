import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'

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
    container: {
        flex: 1,
        backgroundColor: '#F4F6F8',
    },
})