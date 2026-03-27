import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { decimal2digitWithCommas } from '../../../../utils/FormatUtil';

const Item = ({children, style}) => <View style={style}>{children}</View>;

const SummaryDetail = (props) => {
  let {
    totalItems,
    totalQty,
    totalPrice,
    totalFree,
    totalDiscount,
    totalVat,
    netPrice,
    EXP_B4_VAT,
    VDI_AF_ROUND,
    VDI_AF_ROUND_V,
  } = props.orderProductSummary;

  const {orderType, userToken, printType, processResult} = props;
  // console.log('SummaryDetail processResult', JSON.stringify(processResult));
  let amountQTY = 0;
  let amountFree = 0;

  if (processResult && processResult.TRANSTKD) {
    console.log('IN1 ');
    for (let i in processResult.TRANSTKD) {
      amountQTY += parseInt(processResult.TRANSTKD[i].TRD_QTY);
      amountFree += parseInt(processResult.TRANSTKD[i].TRD_Q_FREE);
    }
  } else {
    console.log('OUT1 ');
    amountQTY = -1;
    amountFree = -1;
  }

  return (
    <ScrollView style={{flex: 0.8, flexDirection: 'column', padding: 5}}>
      {orderType !== 'โอนย้ายสินค้า' ? (
        <View style={{flex: 1, padding: 5}}>
          <View style={styles.lineSection}>
            <Text
              style={{flex: 0.2, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              รวมรายการ
            </Text>
            <Item
              style={[
                {
                  flex: 0.3,
                  paddingVertical: 11,
                  paddingRight: 5,
                  justifyContent: 'flex-end',
                },
                styles.itemSection,
              ]}>
              <Text
                style={{
                  fontSize: hp('1.7%'),
                  textAlign: 'right',
                  color: '#000000',
                }}>
                {decimal2digitWithCommas(
                  parseFloat(processResult?.DOCINFO?.DI_ITEMS),
                )}
              </Text>
            </Item>

            <Text
              style={{flex: 0.2, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              รวมยอด
            </Text>
            <Item
              style={[
                {
                  flex: 0.3,
                  paddingVertical: 11,
                  paddingRight: 5,
                  justifyContent: 'flex-end',
                },
                styles.itemSection,
              ]}>
              <Text
                style={{
                  fontSize: hp('1.7%'),
                  textAlign: 'right',
                  color: '#000000',
                }}>
                {processResult.ARDETAIL
                  ? decimal2digitWithCommas(
                      parseFloat(processResult.ARDETAIL.ARD_G_KEYIN),
                    )
                  : decimal2digitWithCommas(
                      parseFloat(processResult.AROE.AROE_G_KEYIN),
                    )}
              </Text>
            </Item>
          </View>

          <View style={styles.lineSection}>
            <Text
              style={{flex: 0.2, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              รวมจำนวน
            </Text>
            <Item
              style={[
                {
                  flex: 0.3,
                  paddingVertical: 11,
                  paddingRight: 5,
                  justifyContent: 'flex-end',
                },
                styles.itemSection,
              ]}>
              <Text
                style={{
                  fontSize: hp('1.7%'),
                  textAlign: 'right',
                  color: '#000000',
                }}>
                {decimal2digitWithCommas(parseFloat(amountQTY))}
              </Text>
            </Item>

            <Text
              style={{flex: 0.2, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              ส่วนลดรวม
            </Text>
            <Item
              style={[
                {
                  flex: 0.3,
                  paddingVertical: 11,
                  paddingRight: 5,
                  justifyContent: 'flex-end',
                },
                styles.itemSection,
              ]}>
              <Text
                style={{
                  fontSize: hp('1.7%'),
                  textAlign: 'right',
                  color: '#000000',
                }}>
                {processResult.ARDETAIL
                  ? decimal2digitWithCommas(
                      parseFloat(processResult.ARDETAIL.ARD_TDSC_KEYINV),
                    )
                  : decimal2digitWithCommas(
                      parseFloat(processResult.AROE.AROE_TDSC_KEYINV),
                    )}
              </Text>
            </Item>
          </View>

          <View style={styles.lineSection}>
            <Text
              style={{flex: 0.2, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              รวมแถม
            </Text>
            <Item
              style={[
                {
                  flex: 0.3,
                  paddingVertical: 11,
                  paddingRight: 5,
                  justifyContent: 'flex-end',
                },
                styles.itemSection,
              ]}>
              <Text
                style={{
                  fontSize: hp('1.7%'),
                  textAlign: 'right',
                  color: '#000000',
                }}>
                {decimal2digitWithCommas(parseFloat(amountFree))}
              </Text>
            </Item>

            <Text
              style={{flex: 0.2, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              มูลค่าสินค้า
            </Text>
            <Item
              style={[
                {
                  flex: 0.3,
                  paddingVertical: 11,
                  paddingRight: 5,
                  justifyContent: 'flex-end',
                },
                styles.itemSection,
              ]}>
              <Text
                style={{
                  fontSize: hp('1.7%'),
                  textAlign: 'right',
                  color: '#000000',
                }}>
                {decimal2digitWithCommas(
                  parseFloat(
                    processResult.VATTABLE
                      ? processResult.VATTABLE.VAT_SV
                      : processResult.AROE.AROE_N_SV,
                  ),
                )}
              </Text>
            </Item>
          </View>

          <View
            style={[
              styles.lineSection,
              {flexDirection: 'row', justifyContent: 'flex-end'},
            ]}>
            <Text
              style={{flex: 0.2, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              ภาษีมูลค่าเพิ่ม
            </Text>
            <Item
              style={[
                {
                  flex: 0.3,
                  paddingVertical: 11,
                  paddingRight: 5,
                  justifyContent: 'flex-end',
                },
                styles.itemSection,
              ]}>
              <Text
                style={{
                  fontSize: hp('1.7%'),
                  textAlign: 'right',
                  color: '#000000',
                }}>
                {decimal2digitWithCommas(
                  parseFloat(
                    processResult.VATTABLE
                      ? processResult.VATTABLE.VAT_VAT
                      : processResult.AROE.AROE_N_VAT,
                  ),
                )}
              </Text>
            </Item>
          </View>

          <View
            style={[
              styles.lineSection,
              {flexDirection: 'row', justifyContent: 'flex-end'},
            ]}>
            <Text
              style={{flex: 0.2, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              ราคาสุทธิ
            </Text>
            <Item
              style={[
                {
                  flex: 0.3,
                  paddingVertical: 11,
                  paddingRight: 5,
                  justifyContent: 'flex-end',
                },
                styles.itemSection,
              ]}>
              <Text
                style={{
                  fontSize: hp('1.7%'),
                  textAlign: 'right',
                  color: '#000000',
                }}>
                {decimal2digitWithCommas(
                  parseFloat(processResult.DOCINFO.DI_AMOUNT),
                )}
              </Text>
            </Item>
          </View>

          {userToken &&
          userToken.VANCONFIG &&
          userToken.VANCONFIG.VANCNF_ROUND &&
          userToken.VANCONFIG.VANCNF_ROUND != 0.0 &&
          (printType === 'cash' || printType === 'returnCash') ? (
            <View>
              {VDI_AF_ROUND_V !== null && VDI_AF_ROUND_V !== 0 ? (
                <View
                  style={[
                    styles.lineSection,
                    {flexDirection: 'row', justifyContent: 'flex-end'},
                  ]}>
                  <Text
                    style={{flex: 0.2, fontSize: hp('1.6%')}}
                    allowFontScaling={false}>
                    ปัดเศษ
                  </Text>
                  <Item
                    style={[
                      {
                        flex: 0.3,
                        paddingVertical: 11,
                        paddingRight: 5,
                        justifyContent: 'flex-end',
                      },
                      styles.itemSection,
                    ]}>
                    <Text
                      style={{
                        fontSize: hp('1.7%'),
                        textAlign: 'right',
                        color: '#000000',
                      }}>
                      {decimal2digitWithCommas(VDI_AF_ROUND_V)}
                    </Text>
                  </Item>
                </View>
              ) : null}
              {VDI_AF_ROUND !== null && VDI_AF_ROUND !== netPrice ? (
                <View
                  style={[
                    styles.lineSection,
                    {flexDirection: 'row', justifyContent: 'flex-end'},
                  ]}>
                  <Text
                    style={{flex: 0.2, fontSize: hp('1.6%')}}
                    allowFontScaling={false}>
                    หลังปัดเศษ
                  </Text>
                  <Item
                    style={[
                      {
                        flex: 0.3,
                        paddingVertical: 11,
                        paddingRight: 5,
                        justifyContent: 'flex-end',
                      },
                      styles.itemSection,
                    ]}>
                    <Text
                      style={{
                        fontSize: hp('1.7%'),
                        textAlign: 'right',
                        color: '#000000',
                      }}>
                      {decimal2digitWithCommas(VDI_AF_ROUND)}
                    </Text>
                  </Item>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      ) : (
        <View style={styles.lineSection}>
          <Text
            style={{flex: 0.2, fontSize: hp('1.6%')}}
            allowFontScaling={false}>
            รวมรายการ
          </Text>
          <Item
            style={[
              {
                flex: 0.3,
                paddingVertical: 11,
                paddingRight: 5,
                justifyContent: 'flex-end',
              },
              styles.itemSection,
            ]}>
            <Text
              style={{
                fontSize: hp('1.7%'),
                textAlign: 'right',
                color: '#000000',
              }}>
              {processResult
                ? decimal2digitWithCommas(
                    parseFloat(processResult.DOCINFO.DI_ITEMS),
                  )
                : decimal2digitWithCommas(totalItems)}
            </Text>
          </Item>

          <Text
            style={{flex: 0.2, fontSize: hp('1.6%')}}
            allowFontScaling={false}>
            รวมจำนวน
          </Text>
          <Item
            style={[
              {
                flex: 0.3,
                paddingVertical: 11,
                paddingRight: 5,
                justifyContent: 'flex-end',
              },
              styles.itemSection,
            ]}>
            <Text
              style={{
                fontSize: hp('1.7%'),
                textAlign: 'right',
                color: '#000000',
              }}>
              {amountQTY != -1
                ? decimal2digitWithCommas(parseFloat(amountQTY))
                : decimal2digitWithCommas(totalQty)}
            </Text>
          </Item>
        </View>
      )}
    </ScrollView>
  );
};

export default SummaryDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: 200,
  },
  sectionInline: {
    height: 40,
    flexDirection: 'row',
  },
  input: {
    textAlign: 'right',
    fontSize: hp('1.6%'),
    // height: 35,
    paddingTop: 5,
    paddingBottom: 5,
  },
  lineSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemSection: {
    borderBottomColor: 'black',
  },
});
