import _ from 'lodash'
import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { CheckBox } from 'react-native-elements'
import RNPickerSelect from 'react-native-picker-select'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IDatePicker from '../../component/input/IDatePicker'
import { MainTheme } from '../../constant/lov'

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

class IPatternChequePaymentItem extends React.Component {
    
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (!_.isEqual(nextProps.item, this.props.item)) {
            return true
        }   
        
        return false
    }

    render() {
        const { index, title, checkedItems, bankFiles, setCreateCheckedItemsCheque } = this.props
        console.log('checkedItems', checkedItems)
        return (
            <View style={{ flex: 1}}>
                <Item style={styles.checkBoxSection}>
                    <Item style={{flex: 0.3, borderBottomWidth: 0}}>
                        <CheckBox 
                            title={title} 
                            textStyle={{ fontSize: hp('1.7%') }}
                            checked={checkedItems.cheques[index].checked}
                            checkedColor={MainTheme.colorTertiary}
                            containerStyle={styles.checkBoxStyle}
                            onPress={() => { setCreateCheckedItemsCheque ? setCreateCheckedItemsCheque(index, 'checked', !checkedItems.cheques[index].checked) : null }} /> 
                    </Item>

                    <View style={{flex: 0.7, borderBottomWidth: 0.3, borderColor: '#d6d7da', paddingRight: 0}}>
                        <RNPickerSelect
                            items={bankFiles}
                            onValueChange={(value) => setCreateCheckedItemsCheque ? setCreateCheckedItemsCheque(index, 'bankFileItem', value) : null}
                            disabled={!checkedItems.cheques[index].checked}
                            style={{
                                iconContainer: {
                                    top: 5,
                                    right: 0
                                }, 
                                inputAndroid: {
                                    color: '#000000',
                                }
                            }}
                            value={checkedItems.cheques[index].bankFileItem}
                            placeholder={{
                                label: 'เลือก',
                                value: null
                            }}
                            textInputProps={{ underlineColorAndroid: 'cyan', underlineColor: 'yellow' }}
                            useNativeAndroidPickerStyle={false}
                            Icon={() => {
                                return <AntDesign 
                                            name='down' 
                                            size={25} style= {{ color: MainTheme.colorPrimary, marginTop: 10 }} />
                                        
                            }} />
                    </View> 
                </Item>
                <Item style={styles.checkBoxSection}>
                    <Item style={{flex: 0.3, borderBottomWidth: 0}}></Item>
                    <View style={{flex: 0.7, borderBottomWidth: 0.3, borderColor: '#d6d7da'}}>
                        <IDatePicker
                            disabled={!checkedItems.cheques[index].checked}
                            value={checkedItems.cheques[index].chequeDate}
                            onDateChange={(value) => { setCreateCheckedItemsCheque ? setCreateCheckedItemsCheque(index, 'chequeDate', value) : null }} />
                    </View>
                </Item>
                <Item style={styles.checkBoxSection}>
                    <Item style={{flex: 0.3, borderBottomWidth: 0}}>
                        
                    </Item>
                    <Item style={styles.inputSection}>
                        <Input 
                            editable={checkedItems.cheques[index].checked}
                            placeholder='เลขที่เช็ค' 
                            placeholderTextColor={MainTheme.placeholerTextInput}
                            value={checkedItems.cheques[index].chequeNo}
                            maxLength={8}
                            style={{ fontSize: 15, paddingVertical: 5, fontSize: hp('1.7%') }} 
                            keyboardType='numeric'
                            onChangeText={(value) => { setCreateCheckedItemsCheque ? setCreateCheckedItemsCheque(index, 'chequeNo', value) : null }} />
                    </Item>
                </Item>
                <Item style={styles.checkBoxSection}>
                    <Item style={{flex: 0.3, borderBottomWidth: 0}}>
                        
                    </Item>
                    <Item style={styles.inputSection}>
                        <Input 
                            editable={checkedItems.cheques[index].checked}
                            placeholder='ยอดเงิน' 
                            placeholderTextColor={MainTheme.placeholerTextInput}
                            value={checkedItems.cheques[index].pay}
                            style={{ fontSize: 15, paddingVertical: 5, fontSize: hp('1.7%') }} 
                            keyboardType='numeric'
                            onChangeText={(value) => { setCreateCheckedItemsCheque ? setCreateCheckedItemsCheque(index, 'pay', value) : null }} />
                    </Item>
                </Item>
            </View>
        )
    }
}

export default IPatternChequePaymentItem

const styles = StyleSheet.create({
    container: {

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
    }
})