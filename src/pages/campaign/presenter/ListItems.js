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
        style, 
        refreshing, 
        onScroll, 
        onRefresh, 
        isNotFound, 
        errorMessage, 
        isSnackBarVisible, 
        actionHandler,
        header,
        onButtonPress,
        isCampaignLoading,
        campaignErrorMessage,
        setCampaignErrorMessage } = props
    console.log("ListItems props ",props);
    const _renderList = () => {
        return (
            <IList 
                header={header}
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
                !isNotFound && !errorMessage ? _renderList() : null
            }

            <SnackBar visible={isSnackBarVisible} textMessage="Network not available!" actionHandler={()=> actionHandler ? actionHandler() : null} actionText="close"/>

            <ErrorMessage 
                isDisplaying={errorMessage} 
                buttonTitle={'ลองอีกครั้ง'}
                onButtonPress={onButtonPress}
                message={errorMessage} 
                iconName='search1' 
                iconType='AntDesign' />

            <ProgressDialog
                visible={isCampaignLoading}
                message='กำลังโหลดข้อมูลลูกค้า'
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }} />
                
            <ConfirmDialog
                title='เกิดข้อผิดพลาด'
                visible={campaignErrorMessage !== null}
                // onTouchOutside={() => setErrorMessage('errorMessage', null)}
                positiveButton={{
                    title: 'ตกลง',
                    titleStyle: { color: '#000000' },
                    onPress: () => setCampaignErrorMessage(null)
                }}
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }} >
                <View>
                    <Text>{ campaignErrorMessage }</Text>
                </View>
            </ConfirmDialog>
        </View>
    )
}

export default ListItems