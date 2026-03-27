import React from 'react'
import { View, StyleSheet } from 'react-native'

const IButtonGroupCustom = (props) => {
    const { renderItem, listItems, style } = props
// console.log('listItems', listItems)
    return (
        <View style={[styles.container, style && style.container ? style.container : null]}>
            {
                listItems.map((item, key) => 
                    renderItem(item, key)
                )
            }
        </View>
    )
}

export default IButtonGroupCustom

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        flexDirection: 'column', 
        justifyContent: 'space-evenly'
    }
})