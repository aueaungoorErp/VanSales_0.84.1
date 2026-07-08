import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { ConfirmDialog, ProgressDialog } from 'react-native-simple-dialogs'
import IButtonGroupCustom from '../../../component/button/IButtonGroupCustom'
import ITextWithErrorMessage from '../../../component/text/ITextWithErrorMessage'

const Form = (props) => {

    const {
        buttonListItems,
        renderItem,
        errorMessage,
        isLoading,
        loadingMessage,
        resultDialogTitle,
        resultDialogMessage,
        onCloseResultDialog,
    } = props

    return (
        <View style={styles.container} >
            <View style={styles.messageBox}>
                <ITextWithErrorMessage message={errorMessage} />
            </View>
            <IButtonGroupCustom 
                listItems={buttonListItems} 
                renderItem={renderItem} 
                style={iButtonGroupCustomStyles} />

            <ProgressDialog
                visible={isLoading === true}
                message={loadingMessage || 'กำลังบันทึกเลขไมล์...'}
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }}
            />

            <ConfirmDialog
                title={resultDialogTitle || 'แจ้งเตือน'}
                visible={resultDialogMessage !== null && resultDialogMessage !== undefined}
                positiveButton={{
                    title: 'ตกลง',
                    titleStyle: { color: '#000000' },
                    onPress: onCloseResultDialog,
                }}
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }}>
                <View>
                    <Text allowFontScaling={false}>{resultDialogMessage}</Text>
                </View>
            </ConfirmDialog>
        </View>
    )
}

export default Form

const styles = StyleSheet.create({
    container: {

    },
    messageBox: {
        marginVertical: 15,
    }
})

const iButtonGroupCustomStyles = StyleSheet.create({
    container: {
        flex: null,
        height: 60, 
        flexDirection: 'row',
        justifyContent: null
    }
})
