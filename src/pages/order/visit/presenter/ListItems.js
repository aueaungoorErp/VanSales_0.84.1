import React from 'react'
import IGrid from '../../../../component/grid/IGrid'

const ListItems = (props) => {
    const { listItems, renderItem, numColumns, listStyle } = props
    
    return (
        <IGrid 
            itemDimension={130}
            sections={[{data: listItems}]} 
            renderItem={renderItem} 
            style={listStyle} />
    )
}

export default ListItems