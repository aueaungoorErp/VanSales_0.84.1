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
  const docInfo = processResult?.DOCINFO ?? null;
  const arDetail = processResult?.ARDETAIL ?? null;
  const arOe = processResult?.AROE ?? null;
  const vatTable = processResult?.VATTABLE ?? null;
  const displayTotalItems = docInfo?.DI_ITEMS ?? totalItems ?? 0;
  const displayTotalPrice = arDetail?.ARD_G_KEYIN ?? arOe?.AROE_G_KEYIN ?? totalPrice ?? 0;
  const displayTotalDiscount = arDetail?.ARD_TDSC_KEYINV ?? arOe?.AROE_TDSC_KEYINV ?? totalDiscount ?? 0;
  const displayGoodsValue = vatTable?.VAT_SV ?? arOe?.AROE_N_SV ?? EXP_B4_VAT ?? netPrice ?? 0;
  const displayVatValue = vatTable?.VAT_VAT ?? arOe?.AROE_N_VAT ?? totalVat ?? 0;
  const displayNetPrice = docInfo?.DI_AMOUNT ?? netPrice ?? 0;
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
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      {orderType !== 'โอนย้ายสินค้า' ? (
        <View style={styles.summaryCard}>
          <View style={styles.lineSection}>
            <Text
              style={styles.labelText}
              allowFontScaling={false}>
              รวมรายการ
            </Text>
            <Item
              style={[
                {
                  flex: 0.3,
                  paddingVertical: 12,
                  paddingRight: 5,
                  justifyContent: 'flex-end',
                },
                styles.itemSection,
              ]}>
              <Text
                style={styles.valueText}>
                {decimal2digitWithCommas(parseFloat(displayTotalItems || 0))}
              </Text>
            </Item>

            <Text
              style={styles.labelText}
              allowFontScaling={false}>
              รวมยอด
            </Text>
            <Item
              style={[
                {
                  flex: 0.3,
                  paddingVertical: 12,
                  paddingRight: 5,
                  justifyContent: 'flex-end',
                },
                styles.itemSection,
              ]}>
              <Text style={styles.valueText}>
                {decimal2digitWithCommas(parseFloat(displayTotalPrice || 0))}
              </Text>
            </Item>
          </View>

          <View style={styles.lineSection}>
            <Text
              style={styles.labelText}
              allowFontScaling={false}>
              รวมจำนวน
            </Text>
            <Item
              style={[
                {
                  flex: 0.3,
                  paddingVertical: 12,
                  paddingRight: 5,
                  justifyContent: 'flex-end',
                },
                styles.itemSection,
              ]}>
              <Text style={styles.valueText}>
                {decimal2digitWithCommas(parseFloat(amountQTY))}
              </Text>
            </Item>

            <Text
              style={styles.labelText}
              allowFontScaling={false}>
              ส่วนลดรวม
            </Text>
            <Item
              style={[
                {
                  flex: 0.3,
                  paddingVertical: 12,
                  paddingRight: 5,
                  justifyContent: 'flex-end',
                },
                styles.itemSection,
              ]}>
              <Text style={styles.valueText}>
                {decimal2digitWithCommas(parseFloat(displayTotalDiscount || 0))}
              </Text>
            </Item>
          </View>

          <View style={styles.lineSection}>
            <Text
              style={styles.labelText}
              allowFontScaling={false}>
              รวมแถม
            </Text>
            <Item
              style={[
                {
                  flex: 0.3,
                  paddingVertical: 12,
                  paddingRight: 5,
                  justifyContent: 'flex-end',
                },
                styles.itemSection,
              ]}>
              <Text style={styles.valueText}>
                {decimal2digitWithCommas(parseFloat(amountFree))}
              </Text>
            </Item>

            <Text
              style={styles.labelText}
              allowFontScaling={false}>
              มูลค่าสินค้า
            </Text>
            <Item
              style={[
                {
                  flex: 0.3,
                  paddingVertical: 12,
                  paddingRight: 5,
                  justifyContent: 'flex-end',
                },
                styles.itemSection,
              ]}>
              <Text style={styles.valueText}>
                {decimal2digitWithCommas(parseFloat(displayGoodsValue || 0))}
              </Text>
            </Item>
          </View>

          <View
            style={[
              styles.lineSection,
              {flexDirection: 'row', justifyContent: 'flex-end'},
            ]}>
            <Text
              style={styles.labelText}
              allowFontScaling={false}>
              ภาษีมูลค่าเพิ่ม
            </Text>
            <Item
              style={[
                {
                  flex: 0.3,
                  paddingVertical: 12,
                  paddingRight: 5,
                  justifyContent: 'flex-end',
                },
                styles.itemSection,
              ]}>
              <Text style={styles.valueText}>
                {decimal2digitWithCommas(parseFloat(displayVatValue || 0))}
              </Text>
            </Item>
          </View>

          <View
            style={[
              styles.lineSection,
              {flexDirection: 'row', justifyContent: 'flex-end'},
            ]}>
            <Text
              style={styles.labelText}
              allowFontScaling={false}>
              ราคาสุทธิ
            </Text>
            <Item
              style={[
                {
                  flex: 0.3,
                  paddingVertical: 12,
                  paddingRight: 5,
                  justifyContent: 'flex-end',
                },
                styles.itemSection,
              ]}>
              <Text style={[styles.valueText, styles.netValueText]}>
                {decimal2digitWithCommas(parseFloat(displayNetPrice || 0))}
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
                    style={styles.labelText}
                    allowFontScaling={false}>
                    ปัดเศษ
                  </Text>
                  <Item
                    style={[
                      {
                        flex: 0.3,
                          paddingVertical: 12,
                        paddingRight: 5,
                        justifyContent: 'flex-end',
                      },
                      styles.itemSection,
                    ]}>
                    <Text style={styles.valueText}>
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
                    style={styles.labelText}
                    allowFontScaling={false}>
                    หลังปัดเศษ
                  </Text>
                  <Item
                    style={[
                      {
                        flex: 0.3,
                          paddingVertical: 12,
                        paddingRight: 5,
                        justifyContent: 'flex-end',
                      },
                      styles.itemSection,
                    ]}>
                    <Text style={[styles.valueText, styles.netValueText]}>
                      {decimal2digitWithCommas(VDI_AF_ROUND)}
                    </Text>
                  </Item>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      ) : (
        <View style={styles.summaryCard}>
        <View style={styles.lineSection}>
          <Text
            style={styles.labelText}
            allowFontScaling={false}>
            รวมรายการ
          </Text>
          <Item
            style={[
              {
                flex: 0.3,
                paddingVertical: 12,
                paddingRight: 5,
                justifyContent: 'flex-end',
              },
              styles.itemSection,
            ]}>
            <Text style={styles.valueText}>
              {processResult
                ? decimal2digitWithCommas(parseFloat(displayTotalItems || 0))
                : decimal2digitWithCommas(totalItems)}
            </Text>
          </Item>

          <Text
            style={styles.labelText}
            allowFontScaling={false}>
            รวมจำนวน
          </Text>
          <Item
            style={[
              {
                flex: 0.3,
                paddingVertical: 12,
                paddingRight: 5,
                justifyContent: 'flex-end',
              },
              styles.itemSection,
            ]}>
            <Text style={styles.valueText}>
              {amountQTY != -1
                ? decimal2digitWithCommas(parseFloat(amountQTY))
                : decimal2digitWithCommas(totalQty)}
            </Text>
          </Item>
        </View>
        </View>
      )}
    </ScrollView>
  );
};

export default SummaryDetail;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 0.8,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3E8E6',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  lineSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  labelText: {
    flex: 0.2,
    fontSize: hp('1.6%'),
    color: '#4B5B52',
    fontWeight: '600',
  },
  itemSection: {
    backgroundColor: '#F8FBF9',
    borderRadius: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E4ECE8',
    marginRight: 8,
  },
  valueText: {
    fontSize: hp('1.7%'),
    textAlign: 'right',
    color: '#000000',
  },
  netValueText: {
    color: '#1C8365',
    fontWeight: '700',
  },
});
