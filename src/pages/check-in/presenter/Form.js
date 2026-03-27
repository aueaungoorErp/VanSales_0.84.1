import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import moment from 'moment'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import IUpload from '../../../component/upload/IUpload'

const Form = (props) => {

    const { photo, ontakePicturePress, customer, position, dialogMessage, setMessage } =  props
    const { INFO, CUS_ADDB, LST_VISIT_DOC, LST_BILL_DOC } = customer

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}>
                
                <View style={[styles.detailSection, { backgroundColor: '#FFFFC2' }]}>
                    <View style={styles.leftContent}>
                    {
                    // 
                    //     <IUpload 
                    //         photo={photo} 
                    //         ontakePicturePress={ontakePicturePress} />
                    // 
                    }
                    </View>
                    <View style={styles.rightContent}>
                        <Text style={styles.textDetailStyle} allowFontScaling={false} >ข้อมูลลูกค้า</Text>
                        <Text style={styles.textDetailStyle} allowFontScaling={false} >รหัส: {INFO.AR_KEY} </Text>
                        <Text style={styles.textDetailStyle} allowFontScaling={false} >ชื่อลูกค้า: {INFO.AR_NAME} </Text>
                        <Text style={styles.textDetailStyle} allowFontScaling={false} >
                            ที่อยู่: { INFO.ADDB_ADDB_1 ? INFO.ADDB_ADDB_1 + " " : null }
                            { INFO.ADDB_ADDB_2 ? INFO.ADDB_ADDB_2 + " " : null }
                            { INFO.ADDB_ADDB_3 ? INFO.ADDB_ADDB_3 + " " : null } 
                            { INFO.ADDB_SUB_DISTRICT ? INFO.ADDB_SUB_DISTRICT + " " : null }
                            { INFO.ADDB_DISTRICT ? INFO.ADDB_DISTRICT + " " : null }
                            { INFO.ADDB_PROVINCE ? INFO.ADDB_PROVINCE + " " : null }
                            { INFO.ADDB_POST ? INFO.ADDB_POST + " " : null }
                        </Text>
                    </View>
                </View>
                
                <View style={[styles.detailSection, { backgroundColor: '#FFFFC2' }]}>
                    <View style={styles.leftContent}>
                        <Text style={styles.textDetailStyle} allowFontScaling={false} >
                            เยี่ยมครั้งสุดท้าย: 
                            {
                                LST_VISIT_DOC && LST_VISIT_DOC.DI_DATE ? moment(LST_VISIT_DOC.DI_DATE).format('DD-MM-YYYY') : null
                            }
                        </Text>
                        <Text style={styles.textDetailStyle} allowFontScaling={false} >
                            ขายครั้งสุดท้าย: {LST_BILL_DOC && LST_BILL_DOC.DI_DATE ? moment(LST_BILL_DOC.DI_DATE).format('DD-MM-YYYY') : null}
                        </Text>
                        <Text style={styles.textDetailStyle} allowFontScaling={false} >
                            เลขบิลสุดท้าย: {LST_BILL_DOC && LST_BILL_DOC.DI_REF ? LST_BILL_DOC.DI_REF : null}
                        </Text>
                        <Text style={styles.textDetailStyle} allowFontScaling={false} >
                            ยอดขายสุดท้าย: {LST_BILL_DOC && LST_BILL_DOC.DI_AMOUNT ? LST_BILL_DOC.DI_AMOUNT.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : null}
                        </Text>
                    </View>
                    <View style={styles.rightContent}>
                        <Text style={styles.textDetailStyle} allowFontScaling={false} >พิกัด</Text>
                        <Text style={styles.textDetailStyle} allowFontScaling={false} >
                            ละติจูด: {position.latitude}
                        </Text>
                        <Text style={styles.textDetailStyle} allowFontScaling={false} >
                            ลองติจูด: {position.longitude}
                        </Text>
                        <Text style={styles.textDetailStyle}  allowFontScaling={false}> </Text>
                    </View>
                </View>
            </ScrollView>
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
        flexGrow: 1
    },
    leftContent: {
        padding: 10,
        height: '70%',
        flex: 0.5
    },
    rightContent: {
        padding: 10,
        flex: 0.5,
        height: '70%',
        borderLeftWidth: 1,
        borderColor: '#000000'
    },
    textDetailStyle: {
        fontSize: hp('1.7%')
    },
    detailSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    gpsSection: {
        flex:0.4,
        borderTopWidth: 1,
        borderColor: '#D6D7DA',
        justifyContent: 'center',
        marginHorizontal: 5
    }
})