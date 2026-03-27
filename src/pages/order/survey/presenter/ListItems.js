import React from 'react'
import { View } from 'react-native'
import IList from '../../../../component/list/IList'
import ErrorMessage from '../../../../component/announce/ErrorMessage'

const ListItems = (props) => {
    const { listItems, renderItem, header, refreshing, onRefresh, errorMessage } = props

    const _renderList = () => {
        return (
            <IList 
                header={header}
                data={listItems} 
                renderItem={renderItem}
                refreshing={refreshing}
                onRefresh={onRefresh} />
        )
    }

    return (
        <View style={{ flex: 1, padding: 5 }}>
            {
                !errorMessage ? _renderList() : null
            }
            
            <ErrorMessage isDisplaying={errorMessage} message={errorMessage} iconName='warning' type='font-awesome' />
        </View>
    )
}

export default ListItems