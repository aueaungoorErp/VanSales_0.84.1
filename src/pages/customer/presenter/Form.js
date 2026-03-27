import React from 'react'
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { mainContainer, MainTheme } from '../../../constant/lov'
import { strings } from '../../../locales/i18n'

const Form = ({ style, children }) => <View style={style}>{children}</View>
const Item = ({ style, children }) => <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>
const Label = ({ style, children, ...props }) => <Text {...props} style={style}>{children}</Text>
const Input = ({ style, ...props }) => <TextInput {...props} style={[{ flex: 1, color: '#000000', paddingVertical: 8, paddingHorizontal: 0 }, style]} />

const IForm = (props) => {
    const {
        tempCus,
        setTempCus,
        masterData,
        onProvinceChange,
        onDistrictChange,
        onSubDistrictChange,
        onARPriceTabItemsChange,
        arPriceTab,
        vancnfArprbMode } = props
    const provinceListItems = masterData.province.listItems.map((item) => ({ label: item.NameInThai, value: item.Id }))
    const districtListItems = masterData.district.listItems.map((item) => ({ label: item.NameInThai, value: item.Id }))
    const subDistrictListItems = masterData.subDistrict.listItems.map((item) => ({ label: item.NameInThai, value: item.Id }))
    const arPriceTabItems = arPriceTab.map((item) => ({ label: item.ARPRB_CODE + ' ' + item.ARPRB_NAME, value: item.ARPRB_CODE }))

    const ARVATTYListItems = [
        { label: 'ไม่มี', value: 0 },
        { label: 'อัตราศูนย์', value: 1 },
        { label: 'อัตราทั่วไป', value: 2 }
    ]

    return (
        <View>
            <View style={styles.titleSection} >

                <Image
                    style={{ width: 35, height: 35, alignSelf: 'center' }}
                    resizeMode='contain'
                    source={require('../../../images/customer_add.png')} />

                <Text style={{ color: MainTheme.colorQuaternary, fontSize: hp('2.2%') }} allowFontScaling={false} > {strings('customer.add')} </Text>
            </View>
            <ScrollView style={{ height: '85%' }}>
                <Form>
                    <Item inlineLabel>
                        <Label style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{strings('customer.label_name')}</Label>
                        <Input
                            value={tempCus.NAME}
                            style={{ fontSize: hp('1.7%') }}
                            allowFontScaling={false}
                            onChangeText={setTempCus ? (value) => setTempCus('NAME', value) : null} />
                    </Item>
                    <Item inlineLabel>
                        <Label style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{strings('customer.label_tax_id')}</Label>
                        <Input
                            value={tempCus.TAXID}
                            onChangeText={setTempCus ? (value) => setTempCus('TAXID', value) : null}
                            maxLength={13}
                            style={{ fontSize: hp('1.7%') }}
                            allowFontScaling={false}
                            keyboardType={'numeric'} />
                    </Item>
                    <Item inlineLabel>
                        <Label style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{strings('customer.label_address1')}</Label>
                        <Input
                            value={tempCus.ADDRESS1}
                            style={{ fontSize: hp('1.7%') }}
                            allowFontScaling={false}
                            onChangeText={(value) => setTempCus ? setTempCus('ADDRESS1', value) : null} />
                    </Item>
                    <View style={styles.lineSection}>
                        <Label style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{strings('customer.label_province')}</Label>
                        <View style={{ flex: 1 }}>
                            <RNPickerSelect
                                items={provinceListItems}
                                onValueChange={(value) => onProvinceChange ? onProvinceChange(value) : null}
                                style={{
                                    iconContainer: {
                                        top: 2,
                                        right: 15
                                    },
                                    inputAndroid: {
                                        color: '#000000',
                                    }
                                }}
                                value={tempCus.PROVINCE}
                                placeholder={{
                                    label: 'เลือก',
                                    value: null
                                }}
                                textInputProps={{ underlineColorAndroid: 'cyan', underlineColor: 'yellow' }}
                                useNativeAndroidPickerStyle={false}
                                Icon={() => {
                                    return <AntDesign
                                        name='down'
                                        size={25} color={MainTheme.colorPrimary} style={{ marginTop: 10 }} />
                                }} />
                        </View>
                    </View>
                    <View style={styles.lineSection}>
                        <Label style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{strings('customer.label_address3')}</Label>
                        <View style={{ flex: 1 }}>
                            <RNPickerSelect
                                items={districtListItems}
                                onValueChange={(value) => onDistrictChange ? onDistrictChange(value) : null}
                                style={{
                                    iconContainer: {
                                        top: 2,
                                        right: 15
                                    },
                                    inputAndroid: {
                                        color: '#000000',
                                    }
                                }}
                                value={tempCus.ADDRESS3}
                                placeholder={{
                                    label: 'เลือก',
                                    value: null
                                }}
                                textInputProps={{ underlineColorAndroid: 'cyan', underlineColor: 'yellow' }}
                                useNativeAndroidPickerStyle={false}
                                Icon={() => {
                                    return <AntDesign
                                        name='down'
                                        size={25} color={MainTheme.colorPrimary} style={{ marginTop: 10 }} />
                                }} />
                        </View>
                    </View>
                    <View style={styles.lineSection}>
                        <Label style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{strings('customer.label_address2')}</Label>
                        <View style={{ flex: 1 }}>
                            <RNPickerSelect
                                items={subDistrictListItems}
                                onValueChange={(value) => onSubDistrictChange ? onSubDistrictChange(value) : null}
                                style={{
                                    iconContainer: {
                                        top: 2,
                                        right: 15
                                    },
                                    inputAndroid: {
                                        color: '#000000',
                                    }
                                }}
                                value={tempCus.ADDRESS2}
                                placeholder={{
                                    label: 'เลือก',
                                    value: null
                                }}
                                textInputProps={{ underlineColorAndroid: 'cyan', underlineColor: 'yellow' }}
                                useNativeAndroidPickerStyle={false}
                                Icon={() => {
                                    return <AntDesign
                                        name='down'
                                        size={25} color={MainTheme.colorPrimary} style={{ marginTop: 10 }} />
                                }} />
                        </View>
                    </View>
                    <Item inlineLabel>
                        <Label style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{strings('customer.label_post_code')}</Label>
                        <Input
                            value={tempCus.POSTCODE}
                            onChangeText={(value) => setTempCus ? setTempCus('POSTCODE', value) : null}
                            style={{ fontSize: hp('1.7%') }}
                            allowFontScaling={false}
                            maxLength={5}
                            keyboardType={'numeric'}
                            editable={false} />
                    </Item>
                    <Item inlineLabel>
                        <Label style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{strings('customer.label_contact_name')}</Label>
                        <Input
                            value={tempCus.CONTACTNAME}
                            style={{ fontSize: hp('1.7%') }}
                            allowFontScaling={false}
                            onChangeText={setTempCus ? (value) => setTempCus('CONTACTNAME', value) : null} />
                    </Item>
                    <Item inlineLabel>
                        <Label style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{strings('customer.label_tel')}</Label>
                        <Input
                            value={tempCus.TEL}
                            style={{ fontSize: hp('1.7%') }}
                            allowFontScaling={false}
                            onChangeText={setTempCus ? (value) => setTempCus('TEL', value) : null}
                            keyboardType={'numeric'} />
                    </Item>
                    <Item inlineLabel>
                        <Label style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{strings('customer.label_fax')}</Label>
                        <Input
                            value={tempCus.FAX}
                            style={{ fontSize: hp('1.7%') }}
                            allowFontScaling={false}
                            onChangeText={setTempCus ? (value) => setTempCus('FAX', value) : null}
                            keyboardType={'numeric'} />
                    </Item>
                    {/*
                    <Item inlineLabel>
                        <Label style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{strings('customer.label_arc_name')}</Label>
                        <Input 
                            value={tempCus.ARC_NAME} 
                            style={{ fontSize: hp('1.7%') }}
                            allowFontScaling={false} 
                            onChangeText={ setTempCus ? (value) => setTempCus('ARC_NAME', value) : null } />
                    </Item>
                    */}
                    {/*
                    <Item inlineLabel>
                        <Label style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{strings('customer.label_arc_payment_period')}</Label>
                        <Input 
                            value={tempCus.ARC_PAYMENT_PERIOD} 
                            style={{ fontSize: hp('1.7%') }}
                            allowFontScaling={false} 
                            maxLength={3}
                            onChangeText={ setTempCus ? (value) => setTempCus('ARC_PAYMENT_PERIOD', value) : null }
                            keyboardType={'numeric'} /> 
                         <View style={{flex: 1}}>
                            <IDatePicker
                                value={tempCus.ARC_PAYMENT_PERIOD}
                                hideBorder
                                onConfirm={setTempCus ? (value) => setTempCus('ARC_PAYMENT_PERIOD', value) : nul} />
                        </View> 
                    </Item> */}
                    {/* 
                    <View style={styles.lineSection}>
                        <Label style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{strings('customer.label_arc_vat_ty')}</Label>
                        <View style={{ flex: 1 }}>
                            <RNPickerSelect
                                items={ARVATTYListItems}
                                onValueChange={(value) => { setTempCus ? setTempCus('ARC_VAT_TY', value) : null }}
                                style={{
                                    iconContainer: {
                                        top: 2,
                                        right: 15
                                    }, 
                                    inputAndroid: {
                                        color: '#000000',
                                    }
                                }}
                                value={tempCus.ARC_VAT_TY}
                                placeholder={{
                                    label: 'เลือก',
                                    value: null
                                }}
                                textInputProps={{ underlineColorAndroid: 'cyan' }}
                                useNativeAndroidPickerStyle={false}
                                textInputProps={{ underlineColor: 'yellow' }}
                                Icon={() => {
                                    return <NBIcon 
                                                name='down' 
                                                type='AntDesign' 
                                                size={25} style= {{ color: MainTheme.colorPrimary, marginTop: 10 }} />
                                }} />
                        </View>
                    </View>
                    */}
                    {/* {
                        vancnfArprbMode == 1 ? 
                        <View style={styles.lineSection}>
                            <Label style={{ color: '#000000', fontSize: hp('1.7%') }} allowFontScaling={false} >{strings('customer.label_ar_price_tab')}</Label>
                            <View style={{ flex: 1 }}>
                                <RNPickerSelect
                                    items={arPriceTabItems}
                                    onValueChange={(value) => onARPriceTabItemsChange ? onARPriceTabItemsChange(value) : null}
                                    style={{
                                        iconContainer: {
                                            top: 2,
                                            right: 15
                                        }, 
                                        inputAndroid: {
                                            color: '#000000',
                                        }
                                    }}
                                    value={tempCus.PRICETABCODE}
                                    placeholder={{
                                        label: 'เลือก',
                                        value: null
                                    }}
                                    textInputProps={{ underlineColorAndroid: 'cyan' }}
                                    useNativeAndroidPickerStyle={false}
                                    textInputProps={{ underlineColor: 'yellow' }}
                                    Icon={() => {
                                        return <NBIcon 
                                                    name='down' 
                                                    type='AntDesign' 
                                                    size={25} style= {{ color: MainTheme.colorPrimary, marginTop: 10 }} />
                                    }} />
                            </View>
                        </View>
                        :
                        null
                    } */}
                </Form>
            </ScrollView>
        </View>
    )
}

export default IForm

const styles = StyleSheet.create({
    container: mainContainer,
    titleSection: {
        paddingLeft: 15,
        flexDirection: 'row',
        borderBottomColor: MainTheme.colorQuaternary,
        borderBottomWidth: 0.5,
        height: 50,
        alignItems: 'center'
    },
    lineSection: {
        marginLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#d6d7da',
        borderBottomWidth: 0.5
    }
})