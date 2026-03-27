import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { MainTheme, MOBILE5INCH } from '../../../../../constant/lov'
import { toBuddhistYear } from '../../../../../utils/Date'

const fontSizeFirst = Dimensions.get('window').width > MOBILE5INCH ? 20 : 18
const fontSizeSecond = Dimensions.get('window').width > MOBILE5INCH ? 15 : 13

const HeaderDetail = (props) => {
    const { header, customer, outstandingBalance } = props
    const { INFO,} = customer
 
    return (
        <View style={styles.container}>
            <View style={styles.slide1}>
                <Text style={[styles.title, { textAlign: 'center' } ]} allowFontScaling={false} >{header.AR_ORDER_TYPE}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={[styles.content,{ fontSize: hp('2%')}]} allowFontScaling={false} >
                        เลขที่เอกสาร </Text>
                     <Text style={[styles.content,{color:"#cfc732" , fontSize: hp('2%')}]} allowFontScaling={false} >
                        {
                            outstandingBalance.header.VPH_USER_REF ? ' ' + outstandingBalance.header.VPH_USER_REF : ' - '
                        }
                    </Text>
                    <Text style={styles.content} allowFontScaling={false}>วันที่ {toBuddhistYear(outstandingBalance.header.VPH_DATE)}</Text>
                </View>
                <Text style={styles.content} allowFontScaling={false} >รหัสลูกค้า {header.AR_CODE}</Text>
                <Text style={styles.content} allowFontScaling={false} >ชื่อ {header.AR_NAME}</Text>
                <Text style={styles.content} allowFontScaling={false} >
                    ที่อยู่
                    { INFO.ADDB_ADDB_1 ? " " + INFO.ADDB_ADDB_1 + " " : null }
                    { INFO.ADDB_ADDB_2 ? INFO.ADDB_ADDB_2 + " " : null }
                    { INFO.ADDB_ADDB_3 ? INFO.ADDB_ADDB_3 + " " : null }
                    { INFO.ADDB_SUB_DISTRICT ? INFO.ADDB_SUB_DISTRICT + " " : null }
                    { INFO.ADDB_DISTRICT ? INFO.ADDB_DISTRICT + " " : null }
                    { INFO.ADDB_PROVINCE ? INFO.ADDB_PROVINCE + " " : null }
                    { INFO.ADDB_POST ? INFO.ADDB_POST + " " : null }
                </Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.content} allowFontScaling={false} >
                        จำนวนบิลชำระ 
                        {
                            outstandingBalance.header.VPH_COUNT ? ' ' + outstandingBalance.header.VPH_COUNT + ' ' : ' - '
                        } 
                        รายการ
                    </Text>
                    <Text style={styles.content} allowFontScaling={false} >
                        ยอดรวม 
                        {
                            outstandingBalance.header.VPH_TOTAL ? ' ' + outstandingBalance.header.VPH_TOTAL.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ' : ' - '
                        } 
                        บาท
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default HeaderDetail

const styles = StyleSheet.create({
    container: {
        // height: 250
        flex: 1
    },
    slide1: {
        flex: 1,
        padding: 10,    
        justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: MainTheme.colorQuinary,
    },
    title: {
      color: '#fff',
      fontSize: hp('2.5%'),
    },
    content: {
      color: '#fff',
      fontSize: hp('2%'),
      fontWeight: 'bold',
    }
})