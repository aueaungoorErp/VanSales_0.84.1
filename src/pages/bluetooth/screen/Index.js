import React, { Component } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import CTForm from '../container/CTForm'
import CTListItems from '../container/CTListItems'

class Index extends Component {
    constructor(props) {
        super(props)
        
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <CTForm />
                <CTListItems />
            </ScrollView>
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