import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MainTheme, MOBILE5INCH } from '../../../constant/lov';
import { toBuddhistYear } from '../../../utils/Date';

const fontSizeFirst = Dimensions.get('window').width > MOBILE5INCH ? 20 : 18;
const fontSizeSecond = Dimensions.get('window').width > MOBILE5INCH ? 15 : 13;

const HeaderDetail = (props) => {
  const {header, customer} = props;
  const INFO = customer?.INFO ?? {};
  const orderHeader = header ?? {};
  // console.log("header >>>" , header )
  // console.log("customer >>>" , customer )



  return (
    <View style={styles.container}>
      <View style={styles.slide1}>
        <Text style={[styles.title, {textAlign: 'center'}]}>
          {orderHeader.AR_ORDER_TYPE || '-'}
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={[styles.content,{ fontSize: hp('2%')}]} allowFontScaling={false} >
                        เลขที่เอกสาร </Text>
        <Text style={[styles.content,{color:"#cfc732" , fontSize: hp('2%')}]} allowFontScaling={false} >
            {orderHeader.VDI_USER_REF ? ' ' + orderHeader.VDI_USER_REF : ' - '}
          </Text>
          <Text
            style={[styles.content, {fontSize: hp('2%')}]}
            allowFontScaling={false}>
            วันที่ {orderHeader.VDI_DATE ? toBuddhistYear(orderHeader.VDI_DATE, '-', 2) : '-'} {}{' '}
          </Text>
        </View>
        {orderHeader && orderHeader.FROM ? (
          <>
            <Text
              style={[styles.content, {fontSize: hp('2%')}]}
              allowFontScaling={false}>
              จาก {orderHeader.FROM.WL_NAME} {'(' + orderHeader.FROM.WL_CODE + ')'}
            </Text>
            <Text
              style={[styles.content, {fontSize: hp('2%')}]}
              allowFontScaling={false}>
              ถึง {orderHeader.TO.WL_NAME} {'(' + orderHeader.TO.WL_CODE + ')'}
            </Text>
          </>
        ) : (
          <>
            <Text
              style={[styles.content, {fontSize: hp('2%')}]}
              allowFontScaling={false}>
              รหัสลูกค้า {orderHeader.AR_CODE || '-'}
            </Text>
            <Text
              style={[styles.content, {fontSize: hp('2%')}]}
              allowFontScaling={false}>
              ชื่อ {orderHeader.AR_NAME || '-'}
            </Text>
            <Text
              style={[styles.content, {fontSize: hp('2%')}]}
              allowFontScaling={false}>
              ที่อยู่
              {INFO.ADDB_ADDB_1 ? ' ' + INFO.ADDB_ADDB_1 + ' ' : null}
              {INFO.ADDB_ADDB_2 ? INFO.ADDB_ADDB_2 + ' ' : null}
              {INFO.ADDB_ADDB_3 ? INFO.ADDB_ADDB_3 + ' ' : null}
              {INFO.ADDB_SUB_DISTRICT ? INFO.ADDB_SUB_DISTRICT + ' ' : null}
              {INFO.ADDB_DISTRICT ? INFO.ADDB_DISTRICT + ' ' : null}
              {INFO.ADDB_PROVINCE ? INFO.ADDB_PROVINCE + ' ' : null}
              {INFO.ADDB_POST ? INFO.ADDB_POST + ' ' : null}
              {!INFO.ADDB_ADDB_1 && !INFO.ADDB_ADDB_2 && !INFO.ADDB_ADDB_3 && !INFO.ADDB_SUB_DISTRICT && !INFO.ADDB_DISTRICT && !INFO.ADDB_PROVINCE && !INFO.ADDB_POST ? ' - ' : null}
            </Text>
          </>
        )}

       
      </View>
    </View>
  );
};

export default HeaderDetail;

const styles = StyleSheet.create({
  container: {
    // height: 250
    flex: 1,
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
    fontSize: fontSizeFirst,
  },
  content: {
    color: '#fff',
    fontSize: fontSizeSecond,
    fontWeight: 'bold',
  },
});
