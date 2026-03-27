import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import IButtonGroupCustom from '../../component/button/IButtonGroupCustom'
import { ProgressDialog, ConfirmDialog } from 'react-native-simple-dialogs'

const IButtonGroupRNECustom = (props) => {

    const { listItems, renderItem, setState, errorMessage, loadingMessage } = props

    return (
        <View>
            <IButtonGroupCustom listItems={listItems} renderItem={renderItem} style={iButtonGroupCustomStyles} />

            <ProgressDialog
                visible={loadingMessage !== null && loadingMessage !== ''}
                message={loadingMessage}
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }} />
                
            <ConfirmDialog
                title='เกิดข้อผิดพลาด'
                visible={errorMessage !== null}
                // onTouchOutside={() => setErrorMessage('errorMessage', null)}
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
        </View>
    )
}

export default IButtonGroupRNECustom

const styles = StyleSheet.create({
    container: {

    },
    messageBox: {
        marginVertical: 15,
        // height: 30
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
