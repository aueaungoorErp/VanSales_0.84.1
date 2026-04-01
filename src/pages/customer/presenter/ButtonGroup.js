import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { ConfirmDialog, ProgressDialog } from 'react-native-simple-dialogs'
import IButtonGroupCustom from '../../../component/button/IButtonGroupCustom'
import ILoading from '../../../component/loading/ILoading'
import ITextWithErrorMessage from '../../../component/text/ITextWithErrorMessage'
import ITextWithSuccessMessage from '../../../component/text/ITextWithSuccessMessage'

const Item = ({ children, style }) => <View style={style}>{children}</View>

const Input = React.forwardRef(({ value, style, ...props }, ref) => (
    <TextInput
        ref={ref}
        value={value === null || value === undefined ? '' : String(value)}
        style={style}
        underlineColorAndroid="transparent"
        {...props}
    />
))

const ButtonGroup = (props) => {

    const { 
        listItems, 
        renderItem, 
        setState, 
        errorMessage, 
        isLoading, 
        loadingMessage, 
        isOpenReasonDialog, 
        closeReason,
        closeCustomerAccount,
        successCloseReasonMessage,
        isOpenSuccessCloseReasonDialog,
        errorCloseReasonMessage,
        isCloseReasonLoading } = props

    return (
        <View style={styles.footerWrap}>
            <IButtonGroupCustom listItems={listItems} renderItem={renderItem} style={iButtonGroupCustomStyles} />

            <ProgressDialog
                visible={loadingMessage !== null && loadingMessage !== ''}
                message={loadingMessage}
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }} />
                
            <ProgressDialog
                visible={isLoading}
                message={'กำลังโหลดข้อมูล...'}
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
            
            <ConfirmDialog
                title={'ประกาศ'}
                visible={isOpenSuccessCloseReasonDialog}
                positiveButton={{
                    title: 'ตกลง',
                    titleStyle: { color: '#000000' },
                    onPress: () => setState('isOpenSuccessCloseReasonDialog', false)
                }}
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }} >

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>ปิดบัญชีลูกค้าเรียบร้อย</Text>
                </View>

            </ConfirmDialog>

            <ConfirmDialog
                title={'คุณแน่ใจว่าต้องการปิดบัญชีลูกค้า'}
                visible={isOpenReasonDialog}
                positiveButton={{
                    title: 'ตกลง',
                    titleStyle: { color: '#000000' },
                    onPress: () => closeCustomerAccount()
                }}
                negativeButton={{
                    title: 'ยกเลิก',
                    titleStyle: { color: '#000000' },
                    onPress: () => setState('isOpenReasonDialog', false)
                }}
                animationType={'fade'}
                dialogStyle={{ borderRadius: 5 }} >
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>เหตุผล</Text>
                            <Item style={{ flex: 1, borderBottomColor: 'black'  }}>
                                <Item>
                                    <Input 
                                        value={closeReason} 
                                        onChangeText={(value) => setState('closeReason', value)} />
                                </Item>
                            </Item>
                        </View>
                        <View style={{ height: 30, margin: 15}}>
                            <ITextWithSuccessMessage message={successCloseReasonMessage} />
                            <ITextWithErrorMessage message={errorCloseReasonMessage} />
                            <ILoading isLoading={isCloseReasonLoading} />
                        </View>
                    </View>
            </ConfirmDialog>

        </View>
    )
}

export default ButtonGroup

const styles = StyleSheet.create({
    footerWrap: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 8,
        borderWidth: 1,
        borderColor: '#DFE6DF'
    },
    messageBox: {
        marginVertical: 15,
        // height: 30
    }
})

const iButtonGroupCustomStyles = StyleSheet.create({
    container: {
        flex: null,
        minHeight: 60,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})
