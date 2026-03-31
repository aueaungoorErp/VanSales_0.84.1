import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import SnackBar from 'react-native-snackbar-component'
import ErrorMessage from '../../../../component/announce/ErrorMessage'
import IList from '../../../../component/list/IList'
import IOverlay from '../../../../component/modal/IOverlay'

const ListItems = (props) => {
    const { 
        header, 
        listItems, 
        renderItem, 
        dialogMessage, 
        refreshing, 
        onRefresh, 
        onScroll, 
        isSnackBarVisible, 
        actionHandler, 
        isNotFound, 
        isError, 
        setState } = props
    
    const _renderList = () => {
        return (
            <ScrollView horizontal style={{flex: 1}}>
                <IList 
                    header={header}
                    data={listItems} 
                    onScroll={onScroll}
                    renderItem={renderItem} 
                    stickyHeaderIndices={[0]}
                    refreshing={refreshing}
                    onRefresh={onRefresh} />
            </ScrollView>
        )
    }

    return (
        <View style={{ flex: 1}}>
            {
                !isNotFound && !isError ? _renderList() : null
            }
            
            <IOverlay 
                visible={dialogMessage !== null}
                onClose={() => {
                    setState ? setState('dialogMessage', null) : null
                }}>
                <Text>{dialogMessage}</Text>
            </IOverlay>

            <SnackBar 
                visible={isSnackBarVisible} 
                textMessage="Network not available!" 
                actionHandler={()=> actionHandler ? actionHandler() : null} 
                actionText="close" />
            
            <ErrorMessage isDisplaying={isNotFound} iconName='search1' iconType='AntDesign' />
            <ErrorMessage isDisplaying={isError} message='Network not available' iconName='search1' iconType='AntDesign' />
        </View>
    )

}

export default ListItems