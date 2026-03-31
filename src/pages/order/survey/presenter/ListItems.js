import React from 'react'
import { View } from 'react-native'
import ErrorMessage from '../../../../component/announce/ErrorMessage'
import IList from '../../../../component/list/IList'

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
            
            <ErrorMessage isDisplaying={errorMessage} message={errorMessage} iconName='warning' type='antdesign' />
        </View>
    )
}

export default ListItems