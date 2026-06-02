import React from 'react'
import { View } from 'react-native'
import ErrorMessage from '../../../component/announce/ErrorMessage'
import IList from '../../../component/list/IList'

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

            <ErrorMessage isDisplaying={errorMessage} message={errorMessage} iconName='search1' iconType='AntDesign' />
        </View>
    )
}

export default ListItems