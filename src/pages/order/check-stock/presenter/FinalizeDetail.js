import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IButtonGroupCustom from '../../../../component/button/IButtonGroupCustom';
import IDatePicker from '../../../../component/input/IDatePicker';
import ILoading from '../../../../component/loading/ILoading';
import ITextWithErrorMessage from '../../../../component/text/ITextWithErrorMessage';
import ITextWithSuccessMessage from '../../../../component/text/ITextWithSuccessMessage';
import { MainTheme } from '../../../../constant/lov';

const Form = ({style, children}) => <View style={style}>{children}</View>;

const Input = ({style, ...props}) => (
  <TextInput
    {...props}
    style={[
      {color: '#000000', paddingVertical: 8, paddingHorizontal: 0},
      style,
    ]}
  />
);

const FinalizeDetail = (props) => {
  const {
    setVDIRemark,
    setDisBill1,
    setDisBill2,
    changePaymentType,
    buttonListItems,
    renderItem,
    successMessage,
    errorMessage,
    isLoading,
    paymentItems,
    paymentType,
    setPaymentType,
    arOrderType,
    vdiRemark,
    setShipDate,
    shipDate,
    setReturnType,
    returnType,
    returnItems,
    saleDisable,
    returnDisable,
    editableDisBill,
    orderProductSummaryProcessed,
    setDisType1,
    setDisType2,
    processResult,
  } = props;

  const {
    totalItems,
    totalQty,
    totalPrice,
    DIS_BILL_1,
    DIS_BILL_2,
    DIS_BILL_1_AFTER_DISCOUNT,
    DIS_BILL_2_AFTER_DISCOUNT,
    DIS_BILL_FINALIZE,
    VDI_REMARK,
    totalFree,
    DIS_COUNT_TYPE1,
    DIS_COUNT_TYPE2,
    ORDER_PROCESS_FAIL
  } = props.orderProductSummary;
  // console.log('processResult FinalizeDetail', processResult);
  // console.log('processResult successMessage', successMessage);
  // console.log('processResult errorMessage', errorMessage);
  console.log(
    'processResult props.orderProductSummary',
    props.orderProductSummary,
  );
    // console.log('DIS_BILL_1 >>> ', DIS_BILL_1);
    // console.log('DIS_BILL_2 >>> ', DIS_BILL_2);
    // console.log('DIS_COUNT_TYPE1 >>> ', DIS_COUNT_TYPE1);
    // console.log('DIS_COUNT_TYPE2 >>> ', DIS_COUNT_TYPE2);

    // return;
  const toggleSwitch = async () => {
    // console.log('------------------ ');
    // console.log('DIS_COUNT_TYPE1 ', DIS_COUNT_TYPE1);
    // console.log('DIS_COUNT_TYPE2 ', DIS_COUNT_TYPE2);
    await setDisType1(!DIS_COUNT_TYPE1);
    await setDisType2(!DIS_COUNT_TYPE2);
    let c = '';
    await setDisBill1(c);
    await setDisBill2(c);
    // console.log('DIS_COUNT_TYPE1 ', DIS_COUNT_TYPE1);
    // console.log('DIS_COUNT_TYPE2 ', DIS_COUNT_TYPE2);

    // console.log('arOrderType ', arOrderType);
  };
     // Code ชิน
     if (arOrderType === 'ขายสินค้า') {
      //  console.log('paymentType', paymentType)
       if (paymentType == null && paymentItems.length > 0 && paymentItems[0].value) {
         try {
           setPaymentType(paymentItems[0].value)
         } catch (error) {

         }
       }
     } else if (arOrderType === 'รับคืนสินค้า') {
      //  console.log('returnType', returnType)
       if (returnType == null && returnItems.length > 0 && returnItems[0].value) {
         try {
           setReturnType(returnItems[0].value)
         } catch (error) {

         }
       }
     }

    console.log('orderProductSummaryProcessed', orderProductSummaryProcessed);

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1, padding: 5}}>
          <View>
            {arOrderType === 'จองสินค้า' ? (
              <View style={styles.lineSection}>
                <Text
                  style={{flex: 0.2, fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  วันที่ส่งของ
                </Text>
                <View style={{flex: 0.8}}>
                  <IDatePicker value={shipDate} onDateChange={setShipDate} />
                </View>
              </View>
            ) : null}

            <View style={styles.lineSection}>
              <Text
                style={{flex: 0.2, fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                {arOrderType !== 'โอนย้ายสินค้า' ? 'รวมก่อนลด' : 'รวมยอด'}
              </Text>
              <Form
                style={[{flex: 0.8, paddingVertical: 13}, styles.itemSection]}>
                <Text
                  style={{
                    fontSize: hp('1.7%'),
                    textAlign: 'right',
                    color: '#000000',
                  }}>
                  {processResult && processResult != null && processResult?.AROE
                    ? processResult?.AROE?.AROE_G_KEYIN
                      ? JSON.parse(processResult?.AROE?.AROE_G_KEYIN)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      : JSON.parse(processResult?.AROE?.ARD_G_KEYIN)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : processResult &&
                      processResult != null &&
                      processResult.ARDETAIL
                    ? JSON.parse(processResult.ARDETAIL.ARD_G_KEYIN)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : props.orderProductSummary && props.orderProductSummary.totalPrice
                    ? JSON.parse(props.orderProductSummary.totalPrice)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : '0.00'}
                </Text>
              </Form>
            </View>
            {arOrderType !== 'โอนย้ายสินค้า' ? (
              <View style={[styles.lineSection, {marginTop: 10}]}>
                <Text
                  style={{
                    fontSize: hp('1.7%'),
                    textAlign: 'right',
                    color: '#000000',
                  }}>
                  ลด(%)
                </Text>

                <Switch
                  trackColor={{false: '#D6D7DA', true: '#D6D7DA'}}
                  thumbColor={'#47BA8F'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={!DIS_COUNT_TYPE1}
                />
                <Text
                  style={{
                    fontSize: hp('1.7%'),
                    textAlign: 'right',
                    color: '#000000',
                  }}>
                  ลด(บาท)
                </Text>
              </View>
            ) : null}
            {DIS_COUNT_TYPE2 && arOrderType !== 'โอนย้ายสินค้า' ? (
              <>
                <View style={styles.lineSection}>
                  <Text
                    style={{flex: 0.2, fontSize: hp('1.7%')}}
                    allowFontScaling={false}>
                    ลด(บาท)
                  </Text>
                  <Form style={[{flex: 0.4}, styles.itemSection]}>
                    <Input
                      value={
                        DIS_COUNT_TYPE1
                          ? null
                          : DIS_BILL_1
                          ? DIS_BILL_1.toString()
                          : null
                      }
                      editable={editableDisBill}
                      onChangeText={(value) => {
                        console.log(value);
                        setDisBill1(value);
                      }}
                      style={{fontSize: hp('1.7%'), textAlign: 'right'}}
                      keyboardType="numeric"
                      placeholderTextColor="#D6D7DA"
                    />
                  </Form>
                  <Form
                    style={[{flex: 0.4, marginLeft: 3, paddingVertical: 13}]}>
                    <Text
                      style={{
                        fontSize: hp('1.7%'),
                        textAlign: 'right',
                        color: '#000000',
                      }}>
{
                     !toggleSwitch ?

                      processResult && processResult.AROE
                        ? processResult.AROE.AROE_TDSC_KEYINV
                          ? parseFloat(processResult.AROE.AROE_TDSC_KEYINV)
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          : '0.00'
                        : processResult && processResult.ARDETAIL
                        ? parseFloat(processResult.ARDETAIL.ARD_TDSC_KEYINV)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : '0.00'
                        :
                      DIS_BILL_1 &&
                        parseFloat(DIS_BILL_1)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                           
                    </Text>
                  </Form>
                </View>
              </>
            ) : (
              <>
                {arOrderType !== 'โอนย้ายสินค้า' ? (
                  <View style={styles.lineSection}>
                    <Text
                      style={{flex: 0.2, fontSize: hp('1.7%')}}
                      allowFontScaling={false}>
                      ลด(%)
                    </Text>
                    <Form style={[{flex: 0.4}, styles.itemSection]}>
                      <Input
                        value={DIS_BILL_1 ? DIS_BILL_1.toString() : null}
                        editable={editableDisBill}
                        onChangeText={(value) => {
                          setDisBill1(value);
                        }}
                        style={{fontSize: hp('1.7%'), textAlign: 'right'}}
                        keyboardType="numeric"
                      />
                    </Form>
                    <Form
                      style={[{flex: 0.4, marginLeft: 3, paddingVertical: 13}]}>
                      <Text
                        style={{
                          fontSize: hp('1.7%'),
                          textAlign: 'right',
                          color: '#000000',
                        }}>
                       
                        {/* {console.log('FinalizeDetail.js -Bazz processResult- ', processResult )} */}
                        {processResult &&
                        processResult != null &&
                        processResult?.ARDETAIL
                          ? 
                           ((DIS_BILL_1 / 100) *
                              parseFloat(processResult?.ARDETAIL?.ARD_G_KEYIN||0)                              
                            )
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')                              
                              : (
                              (DIS_BILL_1 / 100) *
                               parseFloat(processResult?.AROE?.AROE_G_KEYIN||0)
                            )
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',') 
                            }
                      </Text>
                    </Form>
                  </View>
                ) : null}
                {arOrderType !== 'โอนย้ายสินค้า' ? (
                  <View style={styles.lineSection}>
                    <Text
                      style={{flex: 0.2, fontSize: hp('1.7%')}}
                      allowFontScaling={false}>
                      ลด(%)
                    </Text>
                    <Form style={[{flex: 0.4}, styles.itemSection]}>
                      <Input
                        value={DIS_BILL_2 ? DIS_BILL_2.toString() : null}
                        editable={editableDisBill}
                        onChangeText={(value) => {
                          setDisBill2(value);
                        }}
                        style={{fontSize: hp('1.7%'), textAlign: 'right'}}
                        keyboardType="numeric"
                      />
                    </Form>
                    <Form
                      style={[{flex: 0.4, marginLeft: 0, paddingVertical: 13}]}>
                      <Text
                        style={{
                          fontSize: hp('1.7%'),
                          textAlign: 'right',
                          color: '#000000',
                        }}>
                       {
                         processResult && processResult != null &&
                           processResult ?.AROE &&
                           processResult ?.AROE ?.AROE_G_KEYIN ?
                           (
                             (DIS_BILL_2 / 100) *
                             (parseFloat(processResult ?.AROE ?.AROE_G_KEYIN) -
                               (DIS_BILL_1 / 100) *
                               parseFloat(processResult ?.AROE.AROE_G_KEYIN))
                           )
                           .toFixed(2)
                           .replace(/\B(?=(\d{3})+(?!\d))/g, ',') :
                           (
                             (DIS_BILL_2 / 100) *
                             (parseFloat(processResult ?.ARDETAIL?.ARD_G_KEYIN) -
                               (DIS_BILL_1 / 100) *
                               parseFloat(processResult ?.ARDETAIL.ARD_G_KEYIN))
                           )
                           .toFixed(2)
                           .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                       }
                      </Text>
                    </Form>
                  </View>
                ) : null}
              </>
            )}

            {orderProductSummaryProcessed.VDI_DISC_CP === null ||
            orderProductSummaryProcessed.VDI_DISC_CP > 0 ? (
              <View style={styles.lineSection}>
                <Text
                  style={{flex: 0.2, fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  ส่วนลดการตลาด
                </Text>
                <Form
                  style={[
                    {flex: 0.8, paddingVertical: 13},
                    styles.itemSection,
                  ]}>
                  <Text
                    style={{
                      fontSize: hp('1.7%'),
                      textAlign: 'right',
                      color: '#000000',
                    }}>
                    {orderProductSummaryProcessed.VDI_DISC_CP
                      ? orderProductSummaryProcessed.VDI_DISC_CP.toFixed(
                          2,
                        ).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      : null}
                  </Text>
                </Form>
              </View>
            ) : null}

            {arOrderType !== 'โอนย้ายสินค้า' ? (
              <View style={styles.lineSection}>
                <Text
                  style={{flex: 0.2, fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  รวมหลังลด
                </Text>
                <Form
                  style={[
                    {flex: 0.8, paddingVertical: 13},
                    styles.itemSection,
                  ]}>
                  <Text
                    style={{
                      fontSize: hp('1.7%'),
                      textAlign: 'right',
                      color: '#000000',
                    }}>
                    {processResult
                      ? JSON.parse(processResult.DOCINFO.DI_AMOUNT)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      : '0.00'}
                  </Text>
                </Form>
              </View>
            ) : null}

            <View style={styles.lineSection}>
              <Text
                style={{flex: 0.2, fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                รวมรายการ
              </Text>
              <Form
                style={[{flex: 0.8, paddingVertical: 13}, styles.itemSection]}>
                <Text
                  style={{
                    fontSize: hp('1.7%'),
                    textAlign: 'right',
                    color: '#000000',
                  }}>
                  {orderProductSummaryProcessed.orderProductSummary &&
                  orderProductSummaryProcessed.orderProductSummary.totalItems
                    ? orderProductSummaryProcessed.orderProductSummary.totalItems
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : '0.00'}
                </Text>
              </Form>
            </View>

            <View style={styles.lineSection}>
              <Text
                style={{flex: 0.2, fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                รวมชิ้น
              </Text>
              <Form
                style={[{flex: 0.8, paddingVertical: 13}, styles.itemSection]}>
                <Text
                  style={{
                    fontSize: hp('1.7%'),
                    textAlign: 'right',
                    color: '#000000',
                  }}>
                  {orderProductSummaryProcessed.orderProductSummary &&
                  orderProductSummaryProcessed.orderProductSummary.totalQty
                    ? orderProductSummaryProcessed.orderProductSummary.totalQty
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : '0.00'}
                </Text>
              </Form>
            </View>

            {
              arOrderType !== 'โอนย้ายสินค้า' ? (
              <View style={styles.lineSection}>
                <Text
                  style={{flex: 0.2, fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  แถม
                </Text>
                <Form
                  style={[
                    {flex: 0.8, paddingVertical: 13},
                    styles.itemSection,
                  ]}>
                  <Text
                    style={{
                      fontSize: hp('1.7%'),
                      textAlign: 'right',
                      color: '#000000',
                    }}>
                    {orderProductSummaryProcessed.orderProductSummary &&
                    orderProductSummaryProcessed.orderProductSummary.totalFree
                      ? orderProductSummaryProcessed.orderProductSummary.totalFree
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      : '0.00'}
                  </Text>
                </Form>
              </View>
            ) : null
            }

            {arOrderType === 'รับคืนสินค้า' ? (
              <View style={styles.lineSection}>
                <Text
                  style={{flex: 0.2, fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  ประเภทรับคืน
                </Text>
                <Form
                  style={{
                    flex: 0.8,
                    borderBottomColor: 'black',
                    borderBottomWidth: 0.5,
                  }}>
                  <RNPickerSelect
                    disabled={returnDisable}
                    items={returnItems}
                    placeholder={{
                      label: 'เลือก',
                      value: null,
                      color: '#9EA0A4',
                    }}
                    onValueChange={(value) => {
                      setReturnType ? setReturnType(value) : null;
                    }}
                    style={{
                      iconContainer: {
                        top: 5,
                        right: 15,
                      },
                      inputAndroid: {
                        color: '#000000',
                      },
                    }}
                    value={returnType}
                    textInputProps={{underlineColor: 'yellow', underlineColorAndroid: 'cyan'}}
                    useNativeAndroidPickerStyle={false}
                    Icon={() => {
                      return (
                        <AntDesign
                          name="down"
                          size={25}
                          color={MainTheme.colorPrimary}
                          style={{marginTop: 5}}
                        />
                      );
                    }}
                  />
                </Form>
              </View>
            ) : null}

            <View style={styles.lineSection}>
              <Text
                style={{flex: 0.2, fontSize: hp('1.7%')}}
                allowFontScaling={false}>
                หมายเหตุ
              </Text>
              <Form style={[{flex: 0.8}, styles.itemSection]}>
                <Input
                  value={vdiRemark}
                  onChangeText={setVDIRemark}
                  style={{fontSize: hp('1.7%')}}
                />
              </Form>
            </View>

            {arOrderType === 'ขายสินค้า' ? (
              <View style={styles.lineSection}>
                <Text
                  style={{flex: 0.2, fontSize: hp('1.7%')}}
                  allowFontScaling={false}>
                  ประเภทการชำระ
                </Text>
                <Form
                  style={{
                    flex: 0.8,
                    borderBottomColor: 'black',
                    borderBottomWidth: 0.5,
                  }}>
                  <RNPickerSelect
                    items={paymentItems}
                    disabled={saleDisable}
                    onValueChange={(value) => {
                      console.log('onValueChange value', value);

                    //  console.log('renderItem value', renderItem({"buttonStyle": {"backgroundColor": "#FFFFFF", "borderColor": "#D9D9D9", "borderRadius": 0, "borderWidth": 0.3, "height": 60}, "containerStyle": {"flex": 1}, "methodName": "process", "methodType": "function", "screen": null, "size": 50, "title": "คำนวณ", "titleStyle": {"color": "#2FBA74"}},0));


                      setPaymentType ? setPaymentType(value) : null;
                      changePaymentType(value);

                    //  renderItem  =  {"buttonStyle": {"backgroundColor": "#FFFFFF", "borderColor": "#D9D9D9", "borderRadius": 0, "borderWidth": 0.3, "height": 60}, "containerStyle": {"flex": 1}, "methodName": "process", "methodType": "function", "screen": null, "size": 50, "title": "คำนวณ", "titleStyle": {"color": "#2FBA74"}};
                    //  console.log('onValueChange value 2', value);
                    }}
                    style={{
                      iconContainer: {
                        top: 5,
                        right: 15,
                      },
                      inputAndroid: {
                        color: '#000000',
                      },
                    }}
                    value={paymentType}
                    placeholder={{
                      label: 'เลือก',
                      value: null,
                    }}
                    textInputProps={{underlineColor: 'yellow', underlineColorAndroid: 'cyan'}}
                    useNativeAndroidPickerStyle={false}
                    Icon={() => {
                      return (
                        <AntDesign
                          name="down"
                          size={25}
                          color={MainTheme.colorPrimary}
                          style={{marginTop: 5}}
                        />
                      );
                    }}
                  />
                </Form>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <View style={styles.messageBox}>
        <ITextWithSuccessMessage message={successMessage} />
        <ITextWithErrorMessage message={errorMessage} />
        <ILoading isLoading={isLoading} />
      </View>

      <IButtonGroupCustom
        listItems={buttonListItems}
        renderItem={renderItem}
        style={iButtonGroupCustomStyles}
      />
    </View>
  );
};

export default FinalizeDetail;

const styles = StyleSheet.create({
  inputSection: {
    flexDirection: 'column',
  },
  sectionInline: {
    height: 40,
    flexDirection: 'row',
  },
  messageBox: {
    marginBottom: 15,
    height: 35,
  },
  lineSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemSection: {
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
  },
});

const iTextInputStylesInline = StyleSheet.create({
  container: {
    height: 40,
    flex: 0.5,
  },
  label: {
    flex: 0.4,
  },
  textInput: {
    flex: 0.6,
  },
});

const iTextInputWithoutLabelStyles = StyleSheet.create({
  container: {
    height: 40,
    flex: 0.5,
  },
  text: {
    flex: 0.05,
  },
  textInput: {
    flex: 0.95,
  },
});

const iButtonGroupCustomStyles = StyleSheet.create({
  container: {
    flex: null,
    height: 60,
    flexDirection: 'row',
    justifyContent: null,
  },
});

const iTextInputStyles = StyleSheet.create({
  container: {
    height: 40,
    flex: 1,
  },
  label: {
    flex: 0.2,
  },
  textInput: {
    flex: 0.8,
  },
});
