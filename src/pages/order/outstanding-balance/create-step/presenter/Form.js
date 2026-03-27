import React from 'react'
import { ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { CheckBox } from 'react-native-elements'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import IPatternChequePaymentItem from '../../../../../component/item/IPatternChequePaymentItem'
import { MainTheme } from '../../../../../constant/lov'

const Container = ({ children }) => <View style={{ flex: 1 }}>{children}</View>
const Content = ({ children }) => <ScrollView>{children}</ScrollView>
const Item = ({ style, children }) => <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>
const Input = ({ style, ...props }) => <TextInput {...props} style={[{ flex: 1, color: '#000000', paddingVertical: 8, paddingHorizontal: 0 }, style]} />

const Form = (props) => {
    const { bankFileListItems, bankAccountListItems, checkedItems, setCreateCheckedItems, setCreateCheckedItemsCheque, userToken } = props
   
    console.log("bankFileListItems8" ,  bankFileListItems);
    const bankFiles= bankFileListItems.map( (item) => ({ label: item.BANK_T_NAME, value: item.BANK_KEY }))
    const bankAccounts = bankAccountListItems.map( (item) => ({ label: item.BNKAC_NAME, value: item.BNKAC_KEY }))

    return (
        <Container>
            <Content>
                {
                    userToken.VANCONFIG.VANCNF_ENABLE_CASH == 2 ?
                    <Item style={styles.checkBoxSection}>
                        <Item style={{flex: 0.3, borderBottomWidth: 0}}>
                            <CheckBox 
                                title='เงินสด' 
                                textStyle={{ fontSize: hp('1.7%') }}
                                checked={checkedItems.cash.checked}
                                checkedColor={MainTheme.colorTertiary}
                                containerStyle={styles.checkBoxStyle}
                                onPress={() => { setCreateCheckedItems ? setCreateCheckedItems('cash', 'checked', true) : null }} />
                        </Item>
                        <Item style={styles.inputSection}>
                            <Input 
                                editable={checkedItems.cash.checked}
                                placeholder='ยอดเงิน' 
                                placeholderTextColor={MainTheme.placeholerTextInput}
                                value={checkedItems.cash.pay}
                                maxLength={10}
                                style={{ fontSize: hp('1.7%'), paddingVertical: 5 }} 
                                keyboardType='numeric'
                                onChangeText={(value) => { setCreateCheckedItems ? setCreateCheckedItems('cash', 'pay', value) : null }} />
                        </Item>
                    </Item>
                    : null
                }
                
                {/* {
                    userToken.VANCONFIG.VANCNF_BANK_TRANSFER_USE === 2 ?
                    <View>
                        <Item style={styles.checkBoxSection}>
                            <Item style={{ flex: 0.3, borderBottomWidth: 0 }}>
                                <CheckBox 
                                    title='โอน' 
                                    textStyle={{ fontSize: hp('1.7%') }}
                                    checked={checkedItems.transfer.checked}
                                    checkedColor={MainTheme.colorTertiary}
                                    containerStyle={styles.checkBoxStyle}
                                    onPress={() => { setCreateCheckedItems ? setCreateCheckedItems('transfer', 'checked', true) : null }} />
                            </Item>
                            <Item style={{ flex: 0.7, paddingRight: 0 }}>
                                <View style={{ flex: 1, paddingRight: 0 }}>
                                    <RNPickerSelect
                                        items={bankAccounts}
                                        onValueChange={(value) => setCreateCheckedItems ? setCreateCheckedItems('transfer', 'bankAccountItem', value) : null }
                                        disabled={!checkedItems.transfer.checked}
                                        style={{
                                            iconContainer: {
                                                top: 15,
                                                right: 0
                                            }, 
                                            inputAndroid: {
                                                color: '#000000',
                                            }
                                        }}
                                        value={checkedItems.transfer.bankAccountItem}
                                        placeholder={{
                                            label: 'เลือก',
                                            value: null
                                        }}
                                        textInputProps={{ underlineColorAndroid: 'cyan' }}
                                        useNativeAndroidPickerStyle={false}
                                        textInputProps={{ underlineColor: 'yellow' }}
                                        Icon={() => {
                                            return <Icon 
                                                        name='down' 
                                                        type='AntDesign' 
                                                        size={25} style= {{ 
                                                            color: MainTheme.colorPrimary
                                                        }} />
                                        }} />
                                </View>
                            </Item>
                        </Item>
                        
                        <Item style={styles.checkBoxSection}>
                            <Item style={{flex: 0.3, borderBottomWidth: 0}}></Item>
                            <Item style={{ flex: 0.7 }}>
                                <Input 
                                    editable={checkedItems.transfer.checked}
                                    placeholder='ยอดเงิน' 
                                    placeholderTextColor={MainTheme.placeholerTextInput}
                                    value={checkedItems.transfer.pay}
                                    maxLength={10}
                                    style={{ fontSize: hp('1.7%'), paddingVertical: 5 }} 
                                    keyboardType='numeric'
                                    onChangeText={(value) => { setCreateCheckedItems ? setCreateCheckedItems('transfer', 'pay', value) : null }} />
                            </Item>
                        </Item>
                    </View>
                    : null
                } */}


                {
                    userToken.VANCONFIG.VANCNF_BANK_QRCODE_USE === 2 ?
                        <Item style={styles.checkBoxSection}>
                            <Item style={{flex: 0.3, borderBottomWidth: 0}}>
                                <CheckBox 
                                    title='QRCode' 
                                    textStyle={{ fontSize: hp('1.7%') }}
                                    checked={checkedItems.qrcode.checked}
                                    checkedColor={MainTheme.colorTertiary}
                                    containerStyle={styles.checkBoxStyle}
                                    onPress={() => { setCreateCheckedItems ? setCreateCheckedItems('qrcode', 'checked', true) : null }} />
                            </Item>
                            <Item style={styles.inputSection}>
                                <Input 
                                    editable={checkedItems.qrcode.checked}
                                    placeholder='ยอดเงิน' 
                                    placeholderTextColor={MainTheme.placeholerTextInput}
                                    value={checkedItems.qrcode.pay}
                                    maxLength={10}
                                    style={{fontSize: hp('1.7%'), paddingVertical: 5}} 
                                    keyboardType='numeric'
                                    onChangeText={(value) => { setCreateCheckedItems ? setCreateCheckedItems('qrcode', 'pay', value) : null }} />
                            </Item>
                        </Item> 
                        : null
                }

                {
                    userToken.VANCONFIG.VANCNF_CHEQUE === 2 ?
                        <View>
                            <IPatternChequePaymentItem 
                                index={0}
                                title={'เช็ค1'}
                                checkedItems={checkedItems}
                                bankFiles={bankFiles}
                                setCreateCheckedItemsCheque={setCreateCheckedItemsCheque} />

                            <IPatternChequePaymentItem 
                                index={1}
                                title={'เช็ค2'}
                                checkedItems={checkedItems}
                                bankFiles={bankFiles}
                                setCreateCheckedItemsCheque={setCreateCheckedItemsCheque} />

                            <IPatternChequePaymentItem 
                                index={2}
                                title={'เช็ค3'}
                                checkedItems={checkedItems}
                                bankFiles={bankFiles}
                                setCreateCheckedItemsCheque={setCreateCheckedItemsCheque} />
                        </View>
                        : null
                }

            </Content>
        </Container>
    )
}

export default Form

const styles = StyleSheet.create({
    container: {

    },
    messageBox: {
        marginTop: 15,
        // height: 30
    },
    titleSection: {
        borderBottomWidth: 0,
        marginLeft: 0,
        paddingLeft: 15,
        flexDirection: 'row',
        backgroundColor: MainTheme.colorSeptenary,
        height: 50,
        alignItems: 'center'
    },
    bodySection:{
        marginTop: 5,
    },
    checkBoxSection: {
        borderBottomWidth: 0,
        borderColor: '#d6d7da',
        flexDirection: 'row',
        marginRight: 10
    },
    checkBoxStyle: { 
        flex: 1,
        backgroundColor: MainTheme.colorSecondary, 
        borderWidth: 0,  
        marginRight: 0
    },
    inputSection: {
        flex: 0.7
    },
    dateIcon: {
        position: 'absolute',
        right: 0,
        top: 4,
        marginLeft: 0,
        height: 22
    },
    dateInput: {
        height: 35,
        borderWidth: 0,
        borderColor: '#d6d7da',
        borderBottomWidth: 1,
        // paddingTop: 2,
        // paddingBottom: 2,
        // justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    disabled: {
        backgroundColor: '#FFF'
    }
})