import React from 'react'
import {  StyleSheet } from 'react-native'
import IGrid from '../../../../component/grid/IGrid'
import { MainTheme } from '../../../../constant/lov'

const MenuItems = (props) => {
    
    const { itemDimension, listItems, renderItem } = props

    return (
        <IGrid 
            itemDimension={itemDimension}
            sections={[
                {data: listItems}
            ]} 
            renderItem={renderItem} />
    )
    
}

export default MenuItems;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: MainTheme.colorSecondary,
    
  }
})