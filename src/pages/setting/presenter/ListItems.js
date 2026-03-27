import React from 'react'
import IList from '../../../component/list/IList'

const ListItems = (props) => {
    const { header, listItems, renderItem } = props

    return (
        <IList
            header={header} 
            data={listItems} 
            renderItem={renderItem}
            stickyHeaderIndices={[0]} />
    )
}

export default ListItems