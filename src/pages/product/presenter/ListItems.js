import React from 'react'
import { View } from 'react-native'
import SnackBar from 'react-native-snackbar-component'
import ErrorMessage from '../../../component/announce/ErrorMessage'
import IList from '../../../component/list/IList'

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
            <ErrorMessage isDisplaying={isNotFound} iconName='search1' iconType='AntDesign' />
            <ErrorMessage isDisplaying={isError} message='Network not available' iconName='search1' iconType='AntDesign' />
        </View>
    )
}

export default ListItems