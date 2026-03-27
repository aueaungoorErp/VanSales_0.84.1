import React from 'react'
import { View, StyleSheet } from 'react-native'
import { mainContainer } from '../../../constant/lov'
import CTMap from '../container/CTMap'

const RouteMap = () => {
    
    return (
        <View style={styles.container}>
            <CTMap />
        </View>
    )
}

export default RouteMap

const styles = StyleSheet.create({
    container: mainContainer
})