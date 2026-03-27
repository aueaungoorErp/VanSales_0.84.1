import React from 'react'
import { View, StyleSheet } from 'react-native'
import { mainContainer } from '../../../constant/lov'
import CTMapLine from '../container/CTMapLine'

const RouteMapLine = (props) => {
    
    return (
        <View style={styles.container}>
            <CTMapLine />
        </View>
    )
}

export default RouteMapLine

const styles = StyleSheet.create({
    container: mainContainer
})