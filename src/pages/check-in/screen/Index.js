import React from 'react'
import { View, StyleSheet } from 'react-native'
import { mainContainer, MainTheme } from '../../../constant/lov'
import CTForm from '../container/CTForm'
import CTButtonGroup from '../container/CTButtonGroup'
import CTMap from '../container/CTMap'
import CTHeader from '../../user/container/CTHeader'

const Index = (props) => {

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <CTHeader />
            </View>
            <View style={styles.body} >
                <View style={styles.mapSection}>
                    <CTMap />
                </View>
                <View style={styles.detailSection}>
                    <CTForm />
                </View>
            </View>
            
            <CTButtonGroup />
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: mainContainer,
    header: {
        flex: 0.3, 
        flexDirection: 'column',
        backgroundColor: MainTheme.colorQuinary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    body: {
        flex: 0.7
    },
    detailSection: {
        flex: 0.5,
        overflow: 'hidden'
    },
    mapSection: {
        flex: 0.5, 
        overflow: 'hidden'
    }
})
