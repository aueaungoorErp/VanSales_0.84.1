import React from 'react'
import IGrid from '../../../component/grid/IGrid'

const ChoiceGroup =   (props) => {

    const { listItems, renderItem } = props

    const itemDimension = listItems.length > 6 ? 130 : 170
    console.log(listItems)
    return (
        <IGrid 
            itemDimension={itemDimension}
            sections={[{data: listItems}]} 
            renderItem={renderItem} />
    )
}

export default ChoiceGroup