import React from 'react'
import { View } from 'react-native'
import IList from '../../../../../component/list/IList'
import ErrorMessage from '../../../../../component/announce/ErrorMessage'

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

            <ErrorMessage isDisplaying={errorMessage} message={errorMessage} iconName='account-search' iconType='MaterialCommunityIcons' />
        </View>
    )
}

export default ListItems