import React from 'react'
import { StyleSheet, View } from 'react-native'

const IButtonGroupCustom = (props) => {
    const { renderItem, listItems, style } = props
    return (
        <View style={{flexDirection:'row' , gap:6} }>
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
        flexDirection: 'row',
         
    }
})