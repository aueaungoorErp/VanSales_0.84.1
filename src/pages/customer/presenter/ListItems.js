import React from 'react'
import { View, Text } from 'react-native'
import IList from '../../../component/list/IList'
import ErrorMessage from '../../../component/announce/ErrorMessage'
import SnackBar from 'react-native-snackbar-component'
import { ProgressDialog, ConfirmDialog } from 'react-native-simple-dialogs'

const ListItems = (props) => {
    const { 
        listItems, 
        renderItem, 
        isNotFound, 
        isError, 
        refreshing, 
        onRefresh, 
        onScroll, 
        actionHandler, 
        isSnackBarVisible,
        errorMessage, 
        setErrorMessage,
        isLoading } = props

    const _renderList = () => {
        return (
            <IList 
                data={listItems} 
                renderItem={renderItem} 
                refreshing={refreshing}
                onRefresh={onRefresh}
                onScroll={onScroll} />
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {
                !isNotFound && !isError ? _renderList() : null
            }
            
            <SnackBar visible={isSnackBarVisible} textMessage="Customer Not Found!" actionHandler={()=> actionHandler ? actionHandler() : null} actionText="close"/>
            <ErrorMessage isDisplaying={isNotFound} iconName='account-search' iconType='MaterialCommunityIcons' />
            <ErrorMessage isDisplaying={isError} message='Customer Not Found.' iconName='account-search' iconType='MaterialCommunityIcons' />

            <ProgressDialog
                visible={isLoading}
                message='กำลังโหลดข้อมูลลูกค้า'
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }} />

            <ConfirmDialog
                title='เกิดข้อผิดพลาด'
                visible={errorMessage !== null}
                // onTouchOutside={() => setErrorMessage('errorMessage', null)}
                positiveButton={{
                    title: 'ตกลง',
                    titleStyle: { color: '#000000' },
                    onPress: () => setErrorMessage('errorMessage', null)
                }}
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }} >
                <View>
                    <Text>{errorMessage}</Text>
                </View>
            </ConfirmDialog>
        </View>
    )
}

export default ListItems
