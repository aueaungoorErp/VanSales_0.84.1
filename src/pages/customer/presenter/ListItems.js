import React from 'react'
import { Text, View } from 'react-native'
import { ConfirmDialog, ProgressDialog } from 'react-native-simple-dialogs'
import SnackBar from 'react-native-snackbar-component'
import ErrorMessage from '../../../component/announce/ErrorMessage'
import IList from '../../../component/list/IList'

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
            <ErrorMessage isDisplaying={isNotFound} iconName='search1' iconType='AntDesign' />
            <ErrorMessage isDisplaying={isError} message='Customer Not Found.' iconName='search1' iconType='AntDesign' />

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
