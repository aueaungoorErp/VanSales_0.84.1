import React from 'react'
import { View } from 'react-native'
import IList from '../../../component/list/IList'
import ErrorMessage from '../../../component/announce/ErrorMessage'

const ListItems = (props) => {
    const { listItems, renderItem, refreshing, onRefresh, errorMessage } = props
    
    const _renderList = () => {
        return (
            <IList 
                data={listItems} 
                renderItem={renderItem}
                refreshing={refreshing}
                onRefresh={onRefresh} />
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