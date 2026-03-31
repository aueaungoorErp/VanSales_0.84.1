import moment from 'moment'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Swiper from 'react-native-swiper'
import { MainTheme } from '../../../constant/lov'

const Form = (props) => {

    const { photo, ontakePicturePress, customer, position, dialogMessage, setMessage } =  props
    const INFO = customer && customer.INFO ? customer.INFO : {};
    const CUS_ADDB = customer && customer.CUS_ADDB ? customer.CUS_ADDB : {};
    const LST_VISIT_DOC = customer && customer.LST_VISIT_DOC ? customer.LST_VISIT_DOC : null;
    const LST_BILL_DOC = customer && customer.LST_BILL_DOC ? customer.LST_BILL_DOC : null;
    const address = [
        INFO.ADDB_ADDB_1,
        INFO.ADDB_ADDB_2,
        INFO.ADDB_ADDB_3,
        INFO.ADDB_SUB_DISTRICT,
        INFO.ADDB_DISTRICT,
        INFO.ADDB_PROVINCE,
        INFO.ADDB_POST,
    ].filter(Boolean).join(' ');

    return (
        <View style={styles.container}>
            <Swiper
                loop={false}
                showsButtons={false}
                paginationStyle={styles.pagination}
                dot={<View style={styles.dot} />}
                activeDot={<View style={styles.activeDot} />}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardEyebrow} allowFontScaling={false}>หน้า 1/2</Text>
                            <Text style={styles.cardTitle} allowFontScaling={false}>ข้อมูลลูกค้า</Text>
                        </View>

                        <View style={styles.infoBlock}>
                            <Text style={styles.labelText} allowFontScaling={false}>รหัสลูกค้า</Text>
                            <Text style={styles.valueText} allowFontScaling={false}>{INFO.AR_KEY || '-'}</Text>
                        </View>

                        <View style={styles.infoBlock}>
                            <Text style={styles.labelText} allowFontScaling={false}>ชื่อลูกค้า</Text>
                            <Text style={styles.valueText} allowFontScaling={false}>{INFO.AR_NAME || '-'}</Text>
                        </View>

                        <View style={styles.infoBlock}>
                            <Text style={styles.labelText} allowFontScaling={false}>ที่อยู่</Text>
                            <Text style={styles.valueText} allowFontScaling={false}>{address || '-'}</Text>
                        </View>
                    </View>
                </ScrollView>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardEyebrow} allowFontScaling={false}>หน้า 2/2</Text>
                            <Text style={styles.cardTitle} allowFontScaling={false}>ประวัติและพิกัด</Text>
                        </View>

                        <View style={styles.infoGrid}>
                            <View style={styles.infoCell}>
                                <Text style={styles.labelText} allowFontScaling={false}>เยี่ยมครั้งสุดท้าย</Text>
                                <Text style={styles.valueText} allowFontScaling={false}>
                                    {LST_VISIT_DOC && LST_VISIT_DOC.DI_DATE ? moment(LST_VISIT_DOC.DI_DATE).format('DD-MM-YYYY') : '-'}
                                </Text>
                            </View>

                            <View style={styles.infoCell}>
                                <Text style={styles.labelText} allowFontScaling={false}>ขายครั้งสุดท้าย</Text>
                                <Text style={styles.valueText} allowFontScaling={false}>
                                    {LST_BILL_DOC && LST_BILL_DOC.DI_DATE ? moment(LST_BILL_DOC.DI_DATE).format('DD-MM-YYYY') : '-'}
                                </Text>
                            </View>

                            <View style={styles.infoCell}>
                                <Text style={styles.labelText} allowFontScaling={false}>เลขบิลสุดท้าย</Text>
                                <Text style={styles.valueText} allowFontScaling={false}>{LST_BILL_DOC && LST_BILL_DOC.DI_REF ? LST_BILL_DOC.DI_REF : '-'}</Text>
                            </View>

                            <View style={styles.infoCell}>
                                <Text style={styles.labelText} allowFontScaling={false}>ยอดขายสุดท้าย</Text>
                                <Text style={styles.valueText} allowFontScaling={false}>
                                    {LST_BILL_DOC && LST_BILL_DOC.DI_AMOUNT ? LST_BILL_DOC.DI_AMOUNT.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.coordinateCard}>
                            <Text style={styles.coordinateTitle} allowFontScaling={false}>พิกัดปัจจุบัน</Text>
                            <Text style={styles.coordinateText} allowFontScaling={false}>ละติจูด: {position?.latitude ?? '-'}</Text>
                            <Text style={styles.coordinateText} allowFontScaling={false}>ลองติจูด: {position?.longitude ?? '-'}</Text>
                        </View>
                    </View>
                </ScrollView>
            </Swiper>
        </View>
    )
}

export default Form

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollView: {
        flex: 1
    },
    scrollContent: {
        flexGrow: 1,
        padding: 12,
        paddingBottom: 28,
    },
    pagination: {
        bottom: 4,
    },
    dot: {
        backgroundColor: '#B9D7C7',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
    },
    activeDot: {
        backgroundColor: MainTheme.colorPrimary,
        width: 18,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
    },
    card: {
        flex: 1,
        backgroundColor: '#FFF7C7',
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F0E3A2',
    },
    cardHeader: {
        marginBottom: 14,
    },
    cardEyebrow: {
        color: '#9C8F45',
        fontSize: hp('1.45%'),
        fontWeight: '700',
        marginBottom: 4,
    },
    cardTitle: {
        color: '#4F4A1F',
        fontSize: hp('2.2%'),
        fontWeight: '700',
    },
    infoBlock: {
        marginBottom: 14,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E8DFAE',
    },
    labelText: {
        fontSize: hp('1.55%'),
        color: '#8A7F47',
        marginBottom: 4,
    },
    valueText: {
        fontSize: hp('1.8%'),
        color: '#2F2B12',
        lineHeight: 24,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    infoCell: {
        width: '48%',
        marginBottom: 12,
        backgroundColor: '#FFFCE4',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#EFE3AF',
    },
    coordinateCard: {
        marginTop: 4,
        backgroundColor: '#FFFCE4',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#EFE3AF',
    },
    coordinateTitle: {
        fontSize: hp('1.8%'),
        color: '#4F4A1F',
        fontWeight: '700',
        marginBottom: 6,
    },
    coordinateText: {
        fontSize: hp('1.7%'),
        color: '#2F2B12',
        lineHeight: 22,
    }
})