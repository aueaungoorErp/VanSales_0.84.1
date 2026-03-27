import React from 'react'
import { View, StyleSheet } from "react-native"
import { MainTheme } from '../../../constant/lov'
import CTHeader from '../../user/container/CTHeader'
import CTMenuItems from '../container/CTMenuItems'

const Index = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <CTHeader />
            </View>
            <View style={styles.body}>
                <CTMenuItems />
            </View>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        flexDirection: 'column', 
        backgroundColor: MainTheme.colorSecondary
    },
    header: {
        flex: 0.3, 
        flexDirection: 'column',
        backgroundColor: MainTheme.colorQuinary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    body: {
        flex: 0.7
    }
})