import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Swiper from 'react-native-swiper';
import { MainTheme } from '../../../constant/lov';
import { strings } from '../../../locales/i18n';
import { toBuddhistYear } from '../../../utils/Date';
const Detail = props => {
  const { customer = {} } = props;
  console.log('customeraaa', customer);
  const {
    INFO = {},
    AR_SUMMARY = {},
    CUS_ADDB,
    LST_VISIT_DOC,
    LST_BILL_DOC,
    CUS_PAY_INF,
    CREDIT_LIM,
  } = customer;

  console.log('INFOaaa', INFO);
  return (
    <View style={styles.container}>
      <Swiper
        paginationStyle={{
          bottom: 10,
        }}
        dot={
          <View
            style={{
              backgroundColor: MainTheme.colorQuinary,
              borderColor: MainTheme.colorSecondary,
              borderWidth: 0.5,
              width: 8,
              height: 8,
              borderRadius: 4,
              marginLeft: 3,
              marginRight: 3,
              marginTop: 3,
              marginBottom: 3,
            }}
          />
        }
        activeDot={
          <View
            style={{
              backgroundColor: MainTheme.colorSecondary,
              width: 8,
              height: 8,
              borderRadius: 4,
              marginLeft: 3,
              marginRight: 3,
              marginTop: 3,
              marginBottom: 3,
            }}
          />
        }
      >
        <View style={styles.slide1}>
          <Text style={styles.content} allowFontScaling={false}>
            {INFO.AR_CODE || '-'}
          </Text>
          <Text style={styles.content} allowFontScaling={false}>
            {INFO.AR_NAME || '-'}
          </Text>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={styles.content} allowFontScaling={false}>
              {strings('customer.label_address1')}
              {INFO.ADDB_ADDB_1 ? ' ' + INFO.ADDB_ADDB_1 + ' \n' : null}
              {INFO.ADDB_ADDB_2 ? INFO.ADDB_ADDB_2 + ' \n' : null}
              {INFO.ADDB_ADDB_3 ? INFO.ADDB_ADDB_3 + ' \n' : null}
              {INFO.ADDB_SUB_DISTRICT ? INFO.ADDB_SUB_DISTRICT + ' \n' : null}
              {INFO.ADDB_DISTRICT ? INFO.ADDB_DISTRICT + ' \n' : null}
              
            </Text>
            <Text style={styles.content} allowFontScaling={false}>
              {INFO.ADDB_PROVINCE ? INFO.ADDB_PROVINCE + ' \n' : null}
              {INFO.ADDB_POST ? INFO.ADDB_POST + ' ' : null}
              {!INFO.ADDB_ADDB_1 &&
              !INFO.ADDB_ADDB_2 &&
              !INFO.ADDB_ADDB_3 &&
              !INFO.ADDB_SUB_DISTRICT &&
              !INFO.ADDB_DISTRICT &&
              !INFO.ADDB_PROVINCE &&
              !INFO.ADDB_POST
                ? ' - '
                : null}
            </Text>
          </View>
        </View>

        <View style={styles.slide2}>
          <View>
            <Text style={styles.content} allowFontScaling={false}>
              {strings('customer.last_visit')}{' '}
              {AR_SUMMARY && AR_SUMMARY.LST_VISIT_DOC
                ? toBuddhistYear(AR_SUMMARY.LST_VISIT_DOC, '-', 2)
                : null}
            </Text>
            <Text style={styles.content} allowFontScaling={false}>
              {strings('customer.last_sell_date')}{' '}
              {AR_SUMMARY && AR_SUMMARY.LAST_DI_DATE
                ? toBuddhistYear(AR_SUMMARY.LAST_DI_DATE, '-', 2)
                : null}
            </Text>
            <Text style={styles.content} allowFontScaling={false}>
              {strings('customer.last_bill_no')}{' '}
              {AR_SUMMARY && AR_SUMMARY.LAST_DI_REF
                ? AR_SUMMARY.LAST_DI_REF
                : null}
            </Text>
            <Text style={styles.content} allowFontScaling={false}>
              {strings('customer.last_sell_amount')}{' '}
              {AR_SUMMARY && AR_SUMMARY.LAST_DI_AMT
                ? parseFloat(AR_SUMMARY.LAST_DI_AMT)
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : null}
            </Text>
            <Text style={styles.content} allowFontScaling={false}>
              {strings('customer.credit_limit')}{' '}
              {AR_SUMMARY && AR_SUMMARY.ARS_CRE_LIM
                ? parseFloat(AR_SUMMARY.ARS_CRE_LIM)
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' '
                : null}
            </Text>
            <Text style={styles.content} allowFontScaling={false}>
              {strings('customer.credit_balance')}{' '}
              {CREDIT_LIM === 1 || CREDIT_LIM === 2
                ? AR_SUMMARY &&
                  (AR_SUMMARY.ARS_CRE_LIM === '0'
                    ? '0.00'
                    : AR_SUMMARY.ARS_CRE_REMAIN_NPDC)
                  ? //   ? (parseFloat(AR_SUMMARY.ARS_CRE_REMAIN_NPDC) - parseFloat(AR_SUMMARY.SUM_ARD_NET) < 0) ? parseFloat(AR_SUMMARY.ARS_CRE_REMAIN_NPDC).toFixed(2)
                    //     .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ' : parseFloat(AR_SUMMARY.ARS_CRE_LIM)
                    //       .toFixed(2)
                    //       .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' '
                    //   : null

                    // :
                    parseFloat(
                      AR_SUMMARY.ARS_CRE_LIM === '0'
                        ? '0'
                        : AR_SUMMARY.ARS_CRE_REMAIN_NPDC,
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' '
                  : null
                : null}
              {/* {AR_SUMMARY && AR_SUMMARY.ARS_CRE_REMAIN_NPDC
                ? (parseFloat(AR_SUMMARY.ARS_CRE_LIM) >= parseFloat(AR_SUMMARY.ARS_CRE_REMAIN_NPDC) ? parseFloat(AR_SUMMARY.ARS_CRE_LIM) : parseFloat(AR_SUMMARY.ARS_CRE_REMAIN_NPDC))
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' '
                : null}  */}
            </Text>
            <Text style={styles.content} allowFontScaling={false}>
              ยอดหนี้คงค้าง{' '}
              {AR_SUMMARY && AR_SUMMARY.SUM_ARD_NET
                ? parseFloat(AR_SUMMARY.SUM_ARD_NET)
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' '
                : null}
            </Text>
          </View>
        </View>
      </Swiper>
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MainTheme.colorQuinary,
  },
  slide1: {
    flex: 1,
    padding: 25,
    backgroundColor: MainTheme.colorQuinary,
  },
  slide2: {
    flex: 1,
    padding: 25,
    backgroundColor: MainTheme.colorQuinary,
  },
  content: {
    color: '#fff',
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
  },
});
