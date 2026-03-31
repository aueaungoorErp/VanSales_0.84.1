import React from 'react'
import { View } from 'react-native'
import ErrorMessage from '../../../../../component/announce/ErrorMessage'
import IList from '../../../../../component/list/IList'

const ListItems = (props) => {
    const { header, listItems, renderItem, errorMessage } = props
    
    const _renderList = () => {
        return (
            <IList 
                header={header}
                data={listItems} 
                stickyHeaderIndices={[0]}
                renderItem={renderItem} />
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {
                !errorMessage ? _renderList() : null
            }

            <ErrorMessage isDisplaying={errorMessage} message={errorMessage} iconName='search1' iconType='AntDesign' />
        </View>
    )
}

export default ListItems