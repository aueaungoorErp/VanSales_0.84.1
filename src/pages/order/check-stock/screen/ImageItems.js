import React from 'react'
import { View, StyleSheet } from 'react-native'
import { mainContainer } from '../../../../constant/lov'
import CTGridImage from '../container/CTGridImage'
import CTButtonGroup from '../container/CTButtonGroup'

const ImageItems = (props) => {

    return (
        <View style={styles.container} >
            <View style={{ flex: 1 }}>
                <CTGridImage />
            </View>
            <CTButtonGroup />
        </View>
    )
}

export default ImageItems

const styles = StyleSheet.create({
    container: mainContainer
})