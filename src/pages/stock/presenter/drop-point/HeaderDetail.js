import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { toBuddhistYear } from '../../../../utils/Date';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MainTheme } from '../../../../constant/lov';

const HeaderDetail = props => {
  const { header } = props;
  console.log('headerrr ', header);
  header.VDI_AF_DISC = '';
  return (
    <View style={styles.container}>
      <View style={styles.slide1}>
        <Text
          style={[styles.title, { textAlign: 'center', fontSize: hp('2%') }]}
          allowFontScaling={false}
        >
          {header.AR_ORDER_TYPE}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            fontSize: hp('2%'),
          }}
        >
          <Text
            style={[styles.content, { fontSize: hp('2%') }]}
            allowFontScaling={false}
          >
            เลขที่เอกสาร{' '}
          </Text>
          <Text
            style={[styles.content, { color: '#cfc732', fontSize: hp('2%') }]}
            allowFontScaling={false}
          >
            {header.VDI_USER_REF ? ' ' + header.VDI_USER_REF : ' - '}
          </Text>
          <Text
            style={[styles.content, { fontSize: hp('2%') }]}
            allowFontScaling={false}
          >
            วันที่ {toBuddhistYear(header.VDI_DATE, '-', 2)}
          </Text>
        </View>
        {header?.FROM?.WL_NAME ? (
          <>
            <Text
              style={[styles.content, { fontSize: hp('2%') }]}
              allowFontScaling={false}
            >
              จาก {header.FROM.WL_NAME} {'(' + header.FROM.WL_CODE + ')'}
            </Text>
            <Text
              style={[styles.content, { fontSize: hp('2%') }]}
              allowFontScaling={false}
            >
              ถึง {header.TO?.WL_NAME} {'(' + (header.TO?.WL_CODE || '') + ')'}
            </Text>
          </>
        ) : null}
        {/* <Text
          style={[styles.content, {fontSize: hp('2%')}]}
          allowFontScaling={false}>
          รหัสคลังสินค้า {header.AR_CODE}
        </Text>
        <Text
          style={[styles.content, {fontSize: hp('2%')}]}
          allowFontScaling={false}>
          ชื่อ {header.AR_NAME}
        </Text> */}
      </View>
    </View>
  );
};

export default HeaderDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide1: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    backgroundColor: MainTheme.colorQuinary,
  },
  title: {
    color: '#fff',
    fontSize: 20,
  },
  content: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
