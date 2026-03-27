import React from 'react'
import IList from '../../../component/list/IList'

const DetailListItems = (props) => {
    const { renderItem, listItems } = props
    return (
        <IList 
            renderItem={renderItem}
            data={listItems}   />
    )
}

export default DetailListItems