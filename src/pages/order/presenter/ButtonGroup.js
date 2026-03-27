import React from 'react'
import { StyleSheet } from 'react-native'
import IButtonGroupCustom from '../../../component/button/IButtonGroupCustom'

const ButtonGroup = (props) => {

    const { listItems, renderItem} = props

    console.log(listItems)
    
    return (
        <IButtonGroupCustom listItems={listItems} renderItem={renderItem} style={iButtonGroupCustomStyles} />
    )
}

export default ButtonGroup

const iButtonGroupCustomStyles = StyleSheet.create({
    container: {
        flex: null,
        height: 60, 
        flexDirection: 'row',
        justifyContent: null
    }
})