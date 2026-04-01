import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { MainTheme } from '../../../constant/lov';
import { strings } from '../../../locales/i18n';

const Input = ({ style, ...props }) => (
    <TextInput
        {...props}
        placeholderTextColor="#8A958D"
        style={[styles.textInput, style]}
    />
);

const SectionTitle = ({ eyebrow, title }) => (
    <View style={styles.heroCard}>
        <View style={styles.heroIconWrap}>
            <AntDesign name="adduser" size={24} color={MainTheme.colorPrimary} />
        </View>
        <View style={styles.heroTextWrap}>
            
            <Text style={styles.heroTitle} allowFontScaling={false}>
                {title}
            </Text>
            
        </View>
    </View>
);

const Field = ({ label, children, helper }) => (
    <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel} allowFontScaling={false}>
            {label}
        </Text>
        {children}
        {helper ? (
            <Text style={styles.fieldHelper} allowFontScaling={false}>
                {helper}
            </Text>
        ) : null}
    </View>
);

const renderPickerIcon = () => (
    <AntDesign name="down" size={18} color={MainTheme.colorPrimary} />
);

const getPickerStyles = (disabled = false) => ({
    viewContainer: {
        backgroundColor: disabled ? '#F1F3F1' : '#FFFFFF',
        borderWidth: 1,
        borderColor: disabled ? '#E1E5E1' : '#D7E0D8',
        borderRadius: 14,
        minHeight: 52,
        justifyContent: 'center',
    },
    inputAndroid: {
        color: disabled ? '#7F8882' : '#1D2B22',
        fontSize: hp('1.75%'),
        paddingVertical: 14,
        paddingHorizontal: 14,
        paddingRight: 38,
    },
    inputIOS: {
        color: disabled ? '#7F8882' : '#1D2B22',
        fontSize: hp('1.75%'),
        paddingVertical: 14,
        paddingHorizontal: 14,
        paddingRight: 38,
    },
    placeholder: {
        color: '#8A958D',
    },
    iconContainer: {
        top: 16,
        right: 14,
    },
});

const IForm = (props) => {
    const {
        tempCus,
        setTempCus,
        masterData,
        onProvinceChange,
        onDistrictChange,
        onSubDistrictChange,
    } = props;

    const provinceListItems = masterData.province.listItems.map((item) => ({
        label: item.NameInThai,
        value: item.Id,
    }));
    const districtListItems = masterData.district.listItems.map((item) => ({
        label: item.NameInThai,
        value: item.Id,
    }));
    const subDistrictListItems = masterData.subDistrict.listItems.map((item) => ({
        label: item.NameInThai,
        value: item.Id,
    }));

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
                <SectionTitle title={strings('customer.add')} />

                <View style={styles.formCard}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle} allowFontScaling={false}>
                            ข้อมูลพื้นฐาน
                        </Text>
                        <Text style={styles.sectionSubtitle} allowFontScaling={false}>
                            ชื่อร้าน เลขผู้เสียภาษี และที่อยู่สำหรับบันทึกลูกค้าใหม่
                        </Text>
                    </View>

                    <Field label={strings('customer.label_name')}>
                        <Input
                            value={tempCus.NAME}
                            style={styles.fieldInput}
                            allowFontScaling={false}
                            onChangeText={setTempCus ? (value) => setTempCus('NAME', value) : null}
                        />
                    </Field>

                    <Field label={strings('customer.label_tax_id')} helper="กรอกได้สูงสุด 13 หลัก">
                        <Input
                            value={tempCus.TAXID}
                            onChangeText={setTempCus ? (value) => setTempCus('TAXID', value) : null}
                            maxLength={13}
                            style={styles.fieldInput}
                            allowFontScaling={false}
                            keyboardType="numeric"
                        />
                    </Field>

                    <Field label={strings('customer.label_address1')}>
                        <Input
                            value={tempCus.ADDRESS1}
                            style={styles.fieldInput}
                            allowFontScaling={false}
                            multiline
                            onChangeText={(value) => (setTempCus ? setTempCus('ADDRESS1', value) : null)}
                        />
                    </Field>

                    <Field label={strings('customer.label_province')}>
                        <RNPickerSelect
                            items={provinceListItems}
                            onValueChange={(value) => (onProvinceChange ? onProvinceChange(value) : null)}
                            style={getPickerStyles()}
                            value={tempCus.PROVINCE}
                            placeholder={{
                                label: 'เลือก',
                                value: null,
                            }}
                            useNativeAndroidPickerStyle={false}
                            Icon={renderPickerIcon}
                        />
                    </Field>

                    <Field label={strings('customer.label_address3')}>
                        <RNPickerSelect
                            items={districtListItems}
                            onValueChange={(value) => (onDistrictChange ? onDistrictChange(value) : null)}
                            style={getPickerStyles()}
                            value={tempCus.ADDRESS3}
                            placeholder={{
                                label: 'เลือก',
                                value: null,
                            }}
                            useNativeAndroidPickerStyle={false}
                            Icon={renderPickerIcon}
                        />
                    </Field>

                    <Field label={strings('customer.label_address2')}>
                        <RNPickerSelect
                            items={subDistrictListItems}
                            onValueChange={(value) => (onSubDistrictChange ? onSubDistrictChange(value) : null)}
                            style={getPickerStyles()}
                            value={tempCus.ADDRESS2}
                            placeholder={{
                                label: 'เลือก',
                                value: null,
                            }}
                            useNativeAndroidPickerStyle={false}
                            Icon={renderPickerIcon}
                        />
                    </Field>

                    <Field label={strings('customer.label_post_code')} helper="ระบบจะเติมให้อัตโนมัติหลังเลือกตำบล">
                        <Input
                            value={tempCus.POSTCODE}
                            onChangeText={(value) => (setTempCus ? setTempCus('POSTCODE', value) : null)}
                            style={[styles.fieldInput, styles.disabledInput]}
                            allowFontScaling={false}
                            maxLength={5}
                            keyboardType="numeric"
                            editable={false}
                        />
                    </Field>
                </View>

                <View style={styles.formCard}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle} allowFontScaling={false}>
                            ข้อมูลติดต่อ
                        </Text>
                        <Text style={styles.sectionSubtitle} allowFontScaling={false}>
                            ระบุชื่อผู้ติดต่อและช่องทางติดต่อของลูกค้า
                        </Text>
                    </View>

                    <Field label={strings('customer.label_contact_name')}>
                        <Input
                            value={tempCus.CONTACTNAME}
                            style={styles.fieldInput}
                            allowFontScaling={false}
                            onChangeText={setTempCus ? (value) => setTempCus('CONTACTNAME', value) : null}
                        />
                    </Field>

                    <Field label={strings('customer.label_tel')}>
                        <Input
                            value={tempCus.TEL}
                            style={styles.fieldInput}
                            allowFontScaling={false}
                            onChangeText={setTempCus ? (value) => setTempCus('TEL', value) : null}
                            keyboardType="numeric"
                        />
                    </Field>

                    <Field label={strings('customer.label_fax')}>
                        <Input
                            value={tempCus.FAX}
                            style={styles.fieldInput}
                            allowFontScaling={false}
                            onChangeText={setTempCus ? (value) => setTempCus('FAX', value) : null}
                            keyboardType="numeric"
                        />
                    </Field>
                </View>
            </ScrollView>
        </View>
    );
};

export default IForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 20,
    },
    heroCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EAF6EF',
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#D6EAD9',
        marginBottom: 12,
    },
    heroIconWrap: {
        width: 52,
        height: 52,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    heroTextWrap: {
        flex: 1,
    },
    heroEyebrow: {
        fontSize: hp('1.3%'),
        color: '#6A8D76',
        fontWeight: '700',
        marginBottom: 3,
    },
    heroTitle: {
        fontSize: hp('2.2%'),
        color: '#1F3B2F',
        fontWeight: '700',
        marginBottom: 4,
    },
    heroDescription: {
        fontSize: hp('1.55%'),
        color: '#557164',
        lineHeight: 20,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E7E0',
    },
    sectionHeader: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: hp('1.95%'),
        color: '#21332A',
        fontWeight: '700',
        marginBottom: 3,
    },
    sectionSubtitle: {
        fontSize: hp('1.45%'),
        color: '#718178',
        lineHeight: 18,
    },
    fieldBlock: {
        marginBottom: 12,
    },
    fieldLabel: {
        fontSize: hp('1.6%'),
        color: '#425448',
        fontWeight: '700',
        marginBottom: 6,
    },
    fieldHelper: {
        fontSize: hp('1.35%'),
        color: '#86928A',
        marginTop: 4,
    },
    fieldInput: {
        fontSize: hp('1.75%'),
    },
    textInput: {
        color: '#1D2B22',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D7E0D8',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 13,
        minHeight: 52,
        textAlignVertical: 'top',
    },
    disabledInput: {
        backgroundColor: '#F1F3F1',
        color: '#7F8882',
    },
});