import React from 'react'
import { Dimensions } from 'react-native'
import IGrid from '../../../component/grid/IGrid'

const ChoiceGroup =   (props) => {

    const { listItems, renderItem, numColumns } = props
    const spacing = 12
    const columns = numColumns || 2
    const windowWidth = Dimensions.get('window').width
    const itemDimension = Math.floor((windowWidth - spacing * (columns + 1)) / columns)
    return (
        <IGrid 
            itemDimension={itemDimension}
            spacing={spacing}
            fixed
            maxItemsPerRow={numColumns}
            sections={[{data: listItems}]} 
            renderItem={renderItem} />
    )
}

export default ChoiceGroup
