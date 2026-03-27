import React from 'react'
import { View } from 'react-native'
import IList from '../../../component/list/IList'
import ErrorMessage from '../../../component/announce/ErrorMessage'
import SnackBar from 'react-native-snackbar-component'

const ListItems = (props) => {
    const { listItems, renderItem, style, refreshing, onScroll, onRefresh, isNotFound, isError, isSnackBarVisible, actionHandler } = props
    
    const _renderList = () => {
        return (
            <IList 
                data={listItems} 
                renderItem={renderItem} 
                style={style}
                refreshing={refreshing}
                onScroll={onScroll}
                onRefresh={onRefresh} />
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {
                !isNotFound && !isError ? _renderList() : null
            }

            <SnackBar visible={isSnackBarVisible} textMessage="Network not available!" actionHandler={()=> actionHandler ? actionHandler() : null} actionText="close"/>
            <ErrorMessage isDisplaying={isNotFound} iconName='account-search' iconType='MaterialCommunityIcons' />
            <ErrorMessage isDisplaying={isError} message='Network not available' iconName='account-search' iconType='MaterialCommunityIcons' />
        </View>
    )
}

export default ListItems