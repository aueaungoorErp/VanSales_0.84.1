import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { ConfirmDialog, ProgressDialog } from 'react-native-simple-dialogs'
import SnackBar from 'react-native-snackbar-component'
import ErrorMessage from '../../../../component/announce/ErrorMessage'
import IList from '../../../../component/list/IList'

const ListItems = (props) => {
    const { 
        header, 
        listItems, 
        renderItem, 
        refreshing, 
        onRefresh, 
        onScroll, 
        isSnackBarVisible, 
        actionHandler, 
        isNotFound, 
        isError, 
        setState,
        isLoading,
        loadingMessage,
        errorMessage,
        successMessage } = props
    
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

            <ProgressDialog
                visible={isLoading}
                message={loadingMessage}
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }} />

            <ConfirmDialog
                title='เกิดข้อผิดพลาด'
                visible={errorMessage !== null}
                positiveButton={{
                    title: 'ตกลง',
                    titleStyle: { color: '#000000' },
                    onPress: () => setState('errorMessage', null)
                }}
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }} >
                <View>
                    <Text>{errorMessage}</Text>
                </View>
            </ConfirmDialog>

            <ConfirmDialog
                title='ประกาศ'
                visible={successMessage !== null}
                positiveButton={{
                    title: 'ตกลง',
                    titleStyle: { color: '#000000' },
                    onPress: () => setState('successMessage', null)
                }}
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }} >
                <View>
                    <Text>{successMessage}</Text>
                </View>
            </ConfirmDialog>

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