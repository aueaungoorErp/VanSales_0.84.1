//import React from 'react';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import QRCode from 'react-native-qrcode-svg';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IButtonGroupCustom from '../../../../component/button/IButtonGroupCustom';
import IDatePicker from '../../../../component/input/IDatePicker';
import ILoading from '../../../../component/loading/ILoading';
import ITextWithErrorMessage from '../../../../component/text/ITextWithErrorMessage';
import ITextWithSuccessMessage from '../../../../component/text/ITextWithSuccessMessage';
import { MainTheme } from '../../../../constant/lov';

const Container = ({children}) => <View style={{flex: 1}}>{children}</View>;
const Content = ({children}) => <ScrollView>{children}</ScrollView>;
const Form = ({style, children}) => <View style={style}>{children}</View>;
const Item = ({style, children}) => (
  <View style={[{flexDirection: 'row', alignItems: 'center'}, style]}>{children}</View>
);
const Input = ({style, ...props}) => (
  <TextInput
    {...props}
    style={[
      {flex: 1, color: '#000000', paddingVertical: 8, paddingHorizontal: 0},
      style,
    ]}
  />
);



const PaymentForm = (props) => {
  const {
    paymentType,
    groupofpaymentType,
    setPaymentType,
    buttonListItems,
    renderItem,
    renderItemRemainOption,
    totalPrice,
    successMessage,
    errorMessage,
    isLoading,
    bankFileListItems,
    bankAccountListItems,
    setBankFileItem,
    setBankAccountItem,
    setBankAccountItemName,

    qrContentListItem,
    setqrContentItem,

    qrContentItem,


    bankFileItem,
    bankAccountItem,


    setAmttranferin,
    setAmtcashin,
    setAmtQrin,
    setAmtchequein,
    setAmtOtherin,


    setqrConfirm,
    setremainConfirm,
    setotherPaymentItem,
    otherPaymentItem,

    setremainoptionItem,
    remainoptiontItem,

    otherPaymentType,
    listbankAccountItem,
    setBankAccountTransferItem,
    bankAccountTransferItem,


    setChequeDate,
    setChequeNo,
    chequeDate,
    chequeNo,
    bankFileItemEnabled,
    bankAccountItemEnabled,
    chequeDateDisabled,
    chequeNoEditable,
    setState,
    isQRCodeDialogOpen,
    isDialogOpen,
    qrCode,
    qrLogo,
    userToken,
    // cashin,
    // setcashin,
    remainOptionItem,
    differBy,
    differValue
  } = props;
  // const [isDialogOpen, setisDialogOpen] =  useState(false);

  //console.log("remainOption >>", remainOptionItem)
  // console.log("bankAccountItem >>", listbankAccountItem)
  console.log("remainOptionItem >>", remainOptionItem)

  const remainoption = remainOptionItem.map((item) => ({
    label: item.SYSLKUP_T_DESC,
    value: item.SYSLKUP_KEY,
  }));

  console.log("remainoption >>", remainoption)


  const bankFiles = bankFileListItems.filter(item => !item.BANK_T_NAME.includes("(ยกเลิก)")).sort((a, b) => {
    if (a.BANK_T_NAME < b.BANK_T_NAME) return -1;
    if (a.BANK_T_NAME > b.BANK_T_NAME) return 1;
    return 0;
  }).map((item) => ({
    label: item.BANK_T_NAME,
    value: item.BANK_KEY,
  }));
 // console.log("bankAccount4 >>", bankFiles)

  const bankAccount = Object.values(listbankAccountItem.sort((a, b) => {
    if (a.BNKAC_CODE < b.BNKAC_CODE) return -1;
    if (a.BNKAC_CODE > b.BNKAC_CODE) return 1;
    return 0;
  }).map((item) => ({
    label: item.BNKAC_CODE + "." + item.BNKAC_NAME,
    value: item.BNKAC_CODE,
  })));


  const qrCodeContent = Object.values(qrContentListItem.map((item) => ({
    label: item.QRCT_NAME,
    value: item.QRCT_KEY,
  }))
  );


  const otherPayment = Object.values(otherPaymentType.map((item) => ({
    label: item.PMT_NAME,
    value: item.PMT_KEY,
  }))
  );

  const [checkedItems, setCheckedItems] = useState({
    item1: false,
    item2: false,
    item3: false,
    item4: false,
    item5: false,
  });

  const toggleCheckBox = (item) => {


    setCheckedItems((prevState) => ({
      ...prevState,
      [item]: !prevState[item],
    }));

    //console.log('Bazzz groupofpaymentType prevState >', prevState);


  };

  const nottoggleCheckBox = (item, notitem) => {
    console.log('=============================');
    console.log("groupofpaymentType>", groupofpaymentType);

    console.log('Bazzz groupofpaymentType item >', item);
    console.log('Bazzz groupofpaymentType notitem >', notitem);
    //console.log('checkedItems1 >', checkedItems);

    // setremainConfirm(false);
    // setremainoptionItem(null);


    if (item == "item2" && groupofpaymentType.has("transfer") || item == "item3" && groupofpaymentType.has("qrcode")) {
      setCheckedItems((prevState) => ({
        ...prevState,
        [item]: false,
        [notitem]: false
      }));
    } else {
      setCheckedItems((prevState) => ({
        ...prevState,
        [item]: !prevState[item],
        [notitem]: prevState[item]
      }));
    }



    console.log('checkedItems2 >', checkedItems.item2);
    console.log('checkedItems3 >', checkedItems.item3);

    console.log('=============================');


  };

  // const [cashin, setcashin] = useState(totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  // const [tranFerin, settranFerin] = useState(totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  // const [qRCodein, setqRCodein] = useState(totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  // const [chequein, setchequein] = useState(totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  // const [otherin, setotherin] = useState(totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));

  //const [cashin, setcashin] = useState(totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  const [cashin, setcashin] = useState(0);
  const [tranFerin, settranFerin] = useState(0);
  const [qRCodein, setqRCodein] = useState(0);
  const [chequein, setchequein] = useState(0);
  const [otherin, setotherin] = useState(0);






  //const cleanedValue = item.replace(/-$/, '').replace(/\.$/, '');

  // const setTextcashin = (item) => { setcashin(item); setAmtcashin(item); };
  // const setTexttranFerin = (item) => { settranFerin(item); setAmttranferin(item); };
  // const setTextqRCodein = (item) => { setqRCodein(item); setAmtQrin(item); };
  // const setTextchequein = (item) => { setchequein(item); setAmtchequein(item); };
  // const setTextotherin = (item) => { setotherin(item); setAmtOtherin(item); };

  const setTextcashin = (item) => { setcashin(item); setAmtcashin(item.replace(/,/g, '').replace(/-$/, '').replace(/\.$/, '')); };
  const setTexttranFerin = (item) => { settranFerin(item); setAmttranferin(item.replace(/,/g, '').replace(/-$/, '').replace(/\.$/, '')); };
  const setTextqRCodein = (item) => { setqRCodein(item); setAmtQrin(item.replace(/,/g, '').replace(/-$/, '').replace(/\.$/, '')); };
  const setTextchequein = (item) => { setchequein(item); setAmtchequein(item.replace(/,/g, '').replace(/-$/, '').replace(/\.$/, '')); };
  const setTextotherin = (item) => { setotherin(item); setAmtOtherin(item.replace(/,/g, '').replace(/-$/, '').replace(/\.$/, '')); };





  const handleBlur = (param) => {





    let numericValue1 = groupofpaymentType.has('cash') ? isNaN(parseFloat((cashin || '').replace(/,/g, ''))) ? 0 : parseFloat((cashin || '').replace(/,/g, '')) : 0;
    let numericValue2 = groupofpaymentType.has('transfer') ? isNaN(parseFloat((tranFerin || '').replace(/,/g, ''))) ? 0 : parseFloat((tranFerin || '').replace(/,/g, '')) : 0;
    let numericValue3 = groupofpaymentType.has('qrcode') ? isNaN(parseFloat((qRCodein || '').replace(/,/g, ''))) ? 0 : parseFloat((qRCodein || '').replace(/,/g, '')) : 0;
    let numericValue4 = groupofpaymentType.has('cheque') ? isNaN(parseFloat((chequein || '').replace(/,/g, ''))) ? 0 : parseFloat((chequein || '').replace(/,/g, '')) : 0;
    let numericValue5 = groupofpaymentType.has('other') ? isNaN(parseFloat((otherin || '').replace(/,/g, ''))) ? 0 : parseFloat((otherin || '').replace(/,/g, '')) : 0;

    console.log("numericValue5 >> ", numericValue5);
    console.log("numericValue4 >> ", numericValue4);
    console.log("numericValue3 >> ", numericValue3);
    console.log("numericValue2 >> ", numericValue2);
    console.log("numericValue1 >> ", numericValue1);
    console.log(numericValue5 + numericValue4 + numericValue3 + numericValue2 + numericValue1);
    console.log(totalPrice);
    console.log("groupofpaymentType>", groupofpaymentType);


    let payin = numericValue5 + numericValue4 + numericValue3 + numericValue2 + numericValue1;


    switch (param) {
      case 'cash':


        if (numericValue5 + numericValue4 + numericValue3 + numericValue2 + numericValue1 >= totalPrice + differBy) {

          if (numericValue1 <= (totalPrice + differBy - numericValue2 - numericValue3 - numericValue4 - numericValue5)) {
            numericValue1 = (totalPrice + differBy - numericValue2 - numericValue3 - numericValue4 - numericValue5);
            console.log("numericValue1 1 >> ", numericValue1);
          } else {
            numericValue1 = (totalPrice) - numericValue2 - numericValue3 - numericValue4 - numericValue5
            console.log("numericValue1 2 >> ", numericValue1);
          }
        }


        if (!isNaN(numericValue1) && numericValue1 > 0) {
          setcashin(numericValue1.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')); // ฟอร์แมตให้มี 2 ตำแหน่งทศนิยม
          setAmtcashin(numericValue1);

        } else {
          setcashin(''); // ถ้าไม่ใช่ตัวเลขให้เคลียร์ค่า
          setAmtcashin(0);

        }
        break; // Exit the switch
      case 'transfer':

        if (numericValue5 + numericValue4 + numericValue3 + numericValue2 + numericValue1 >= totalPrice + differBy) {

          if (numericValue2 <= (totalPrice + differBy - numericValue1 - numericValue3 - numericValue4 - numericValue5)) {
            numericValue2 = (totalPrice + differBy - numericValue1 - numericValue3 - numericValue4 - numericValue5);
            console.log("numericValue2 1 >> ", numericValue2);
          } else {
            numericValue2 = (totalPrice) - numericValue1 - numericValue3 - numericValue4 - numericValue5
            console.log("numericValue2 2 >> ", numericValue2);
          }
        }



        if (!isNaN(numericValue2) && numericValue2 > 0) {
          settranFerin(numericValue2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')); // ฟอร์แมตให้มี 2 ตำแหน่งทศนิยม
          setAmttranferin(numericValue2);
        } else {
          settranFerin(''); // ถ้าไม่ใช่ตัวเลขให้เคลียร์ค่า
          setAmttranferin(0);
        }

        break; // Exit the switch
      case 'qrcode':
        if (numericValue5 + numericValue4 + numericValue3 + numericValue2 + numericValue1 >= totalPrice + differBy) {
          if (numericValue3 <= (totalPrice + differBy - numericValue1 - numericValue2 - numericValue4 - numericValue5)) {
            numericValue3 = (totalPrice + differBy - numericValue1 - numericValue2 - numericValue4 - numericValue5);
            console.log("numericValue3 1 >> ", numericValue3);
          } else {
            numericValue3 = (totalPrice) - numericValue1 - numericValue2 - numericValue4 - numericValue5
            console.log("numericValue3 2 >> ", numericValue3);
          }
        }
        if (!isNaN(numericValue3) && numericValue3 > 0) {
          setqRCodein(numericValue3.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')); // ฟอร์แมตให้มี 2 ตำแหน่งทศนิยม
          setAmtQrin(numericValue3);
          if ((numericValue3 > 0) && (numericValue3 <= totalPrice + differBy)) {
            setState('qrCode', numericValue3.toString())
          }

        } else {
          setqRCodein(''); // ถ้าไม่ใช่ตัวเลขให้เคลียร์ค่า
          setAmtQrin(0);
          setState('qrCode', '0')
          // setState('isQRCodeDialogOpen', false)
        }
        break; // Exit the switch
      case 'cheque':
        if (numericValue5 + numericValue4 + numericValue3 + numericValue2 + numericValue1 >= totalPrice + differBy) {
          if (numericValue4 <= (totalPrice + differBy - numericValue2 - numericValue3 - numericValue1 - numericValue5)) {
            numericValue4 = (totalPrice + differBy - numericValue2 - numericValue3 - numericValue1 - numericValue5);
            console.log("numericValue4 1 >> ", numericValue4);
          } else {
            numericValue4 = (totalPrice) - numericValue1 - numericValue2 - numericValue3 - numericValue5
            console.log("numericValue4 2 >> ", numericValue4);
          }
        }

        if (!isNaN(numericValue4) && numericValue4 > 0) {
          setchequein(numericValue4.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')); // ฟอร์แมตให้มี 2 ตำแหน่งทศนิยม
          setAmtchequein(numericValue4);
        } else {
          setchequein(''); // ถ้าไม่ใช่ตัวเลขให้เคลียร์ค่า
          setAmtchequein(0);

        }
        break; // Exit the switch
      case 'other':
        if (numericValue5 + numericValue4 + numericValue3 + numericValue2 + numericValue1 >= totalPrice + differBy) {
          if (numericValue5 <= (totalPrice + differBy - numericValue2 - numericValue3 - numericValue1 - numericValue4)) {
            numericValue5 = (totalPrice + differBy - numericValue2 - numericValue3 - numericValue1 - numericValue4);
            console.log("numericValue5 1 >> ", numericValue5);
          } else {
            numericValue5 = (totalPrice) - numericValue2 - numericValue3 - numericValue1 - numericValue4
            console.log("numericValue5 2 >> ", numericValue5);
          }
        }
        if (!isNaN(numericValue5) && numericValue5 > 0) {
          setotherin(numericValue5.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')); // ฟอร์แมตให้มี 2 ตำแหน่งทศนิยม
          setAmtOtherin(numericValue5);
        } else {
          setotherin(''); // ถ้าไม่ใช่ตัวเลขให้เคลียร์ค่า
          setAmtOtherin(0);
        }
    }
  };

  _onCancel = () => {
    // this._setState('errorMessage', '');
    setState('isQRCodeDialogOpen', false)
  }



  _onPress = async (item) => {
    this._setState('errorMessage', '');
    // console.log("item methodType", item.methodType)
    // console.log("item item.methodName", item.methodName)

    //this.state.paymentType = "qrcode"   // เอาออกด้วย
    if (item.methodType === 'function') {
      if (item.methodName === 'confirm') {
        if (this.state.groupofpaymentType.size === 0) {
          this._setState('errorMessage', 'กรุณาเลือกวิธีการชำระเงิน');
          return;
        }

        if (

          this.state.groupofpaymentType.has('cash') ||
          this.state.groupofpaymentType.has('cheque') ||
          this.state.groupofpaymentType.has('qrcode') ||
          this.state.groupofpaymentType.has('transfer') ||
          this.state.groupofpaymentType.has('other')

        ) {
          console.log("_orderCash", item.methodType)
          await this._orderCash();
        } //else if (this.state.groupofpaymentType.has('qrcode')) {
        // await this._qrcodePayment();
        //console.log('this.state.qrin', this.state.qrin ? this.state.qrin.toString() : "0");
        //await this._requestQrCode(this.state.qrin ? this.state.qrin.toString() : "0");
        // await this._setState('qrCode', this.state.qrin ? this.state.qrin.toString() : "0");
        // await this._setState('isQRCodeDialogOpen', true);
        //await this._orderCash();
        // return;
        // }
      } else if (item.methodName === 'cancel') {
        Navigator.back();
      }
    }
    Keyboard.dismiss();
  };

  const checkpayment = (amount, promptPay) => {
    console.log("promptPay promptPay =>", promptPay);
    if (promptPay === null) return
    if (amount === null) return
    const result = qrContentListItem.filter(item => item.QRCT_KEY == promptPay)[0]?.QRCT_SOURCE || "";
    console.log("QRCT_SOURCE =>", result);
    if (result.toString() === "4") {
      return genQrPaymentFromQrCode(amount, promptPay)
    } else {
      return genQrPayment(amount, promptPay);
    }
  };




  const genQrPaymentFromQrCode = (amount, promptPay) => {
    // console.log("genQrPaymentFromQrCode =>", amount);
    // console.log("genQrPaymentFromQrCode =>", promptPay);

    let pp_amount = "";
    let pp_chksum = "";

    //console.log("promptPay pp_str =>", promptPay);
    if (promptPay === null) return
    if (amount === null) return

    const qrCode = qrContentListItem.filter(item => item.QRCT_KEY == promptPay)[0]?.QRCT_CONTENT || "";

    //console.log("promptPay pp_str =>", qrCode);

    const startIndex = qrCode.indexOf("5303764");
    const endIndex = qrCode.indexOf("5802TH");
    if (startIndex === -1 || endIndex === -1) {
      return null;
    }
    const part1 = qrCode.substring(0, startIndex + "5303764".length);
    const part2 = qrCode.substring(endIndex, qrCode.length - 4);

    // process amount
    if (amount !== "") {
      pp_amount = "54" + ("0" + amount.length).slice(-2) + amount;
    }
    // build pp string
    let pp_str = part1 + pp_amount + part2;
    // process checksum
    pp_chksum = checksumCRC16(pp_str);
    pp_str += pp_chksum;
    // console.log("genQrPaymentFromQrCode pp_str =>", pp_str);
    return pp_str;
  }

  const genQrPayment = (amount, promptPay) => {
    // console.log("genQrPayment =>", amount);
    // console.log("genQrPayment =>", promptPay);




    //console.log("promptPay pp_str =>", promptPay);
    if (promptPay === null) return
    if (amount === null) return

    const result = qrContentListItem.filter(item => item.QRCT_KEY == promptPay)[0]?.QRCT_CONTENT || "";

    //console.log("promptPay pp_str =>", result);


    let pp_acc_id = "";
    let pp_amount = "";
    let pp_chksum = "";

    // process acc_id
    let acc_id = result; //3130200142805
    if (acc_id.length === 15) {
      // truemoney e-wallet
      pp_acc_id = "0315" + acc_id;
    } else if (acc_id.length === 13) {
      // card-id
      pp_acc_id = "0213" + acc_id;
    } else if (acc_id.length === 10) {
      // tel-no
      pp_acc_id = "01130066" + acc_id.substring(1);
    } else {
      // invalid acc_id
      return null;
    }

    // process amount

    if (amount !== "") {
      pp_amount = "54" + ("0" + amount.length).slice(-2) + amount;
    }

    // build pp string
    let field_29 = "0016A000000677010111" + pp_acc_id;
    let pp_str =
      "000201010211" +
      "29" +
      field_29.length +
      field_29 +
      "5303764" +
      pp_amount +
      "5802TH" +
      "6304";

    // process checksum
    pp_chksum = checksumCRC16(pp_str);
    pp_str += pp_chksum;
    //console.log("genQrPayment pp_str =>", pp_str);
    return pp_str;
  }

  checksumCRC16 = (input) => {
    let crc = 0xffff; // initial value
    let polynomial = 0x1021; // 0001 0000 0010 0001  (0, 5, 12)
    let bytes = new Uint8Array(input.length);
    for (let i = 0; i < input.length; i++) {
      bytes[i] = input.charCodeAt(i);
    }
    for (let b of bytes) {
      for (let i = 0; i < 8; i++) {
        let bit = ((b >> (7 - i)) & 1) == 1;
        let c15 = ((crc >> 15) & 1) == 1;
        crc <<= 1;
        if (c15 !== bit) crc ^= polynomial;
      }
    }
    crc &= 0xffff;
    return ("0000" + crc.toString(16).toUpperCase()).slice(-4);
  }

  return (
    <Container>
      <Content>
        <Item style={styles.titleSection}>
          <AntDesign
            name="pay-circle-o1"
            color={MainTheme.colorSenary}
            size={20}
          />

          <Text style={{ fontSize: hp('2%') }} allowFontScaling={false}>
            การชำระเงิน ยอดเงินทั้งหมด{' '}
            {totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </Text>
        </Item>

        {userToken.VANCONFIG.VANCNF_ENABLE_CASH === 2 ? (
          <>
            <Item style={[styles.checkBoxSection,
            { backgroundColor: checkedItems.item1 ? '#f0ffff' : 'white', }
            ]}>
              <Item style={{ flex: 0.3, borderBottomWidth: 0 }}>
                <CheckBox
                  title="เงินสด"
                  //checked={paymentType === 'cash'}
                  checked={checkedItems.item1}
                  checkedColor={MainTheme.colorTertiary}
                  containerStyle={[styles.checkBoxStyle,
                  { backgroundColor: checkedItems.item1 ? '#f0ffff' : 'white', }]}
                  textStyle={{ fontSize: hp('1.6%') }}
                  onPress={() => {
                    setPaymentType ? setPaymentType('cash') && toggleCheckBox('item1') : null;
                    setremainConfirm(false);
                    setremainoptionItem(null);
                     setAmtcashin(0);
                     setcashin(0);
                  }}
                />
              </Item>


              <Item style={[styles.inputSection,
              { backgroundColor: checkedItems.item1 ? '#f0ffff' : 'white', }
              ]}>
                <Input
                  editable={checkedItems.item1}
                  placeholder="ยอดเงิน"
                  //placeholderTextColor={MainTheme.placeholerTextInput}
                  placeholderTextColor={checkedItems.item1 ? '#808080' : MainTheme.placeholerTextInput}

                  value={(checkedItems.item1 === true) ? cashin : ""}  // Number(cashin).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ""} //.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null}
                  maxLength={14}
                  style={{ fontSize: 14, paddingVertical: 0, height: 30 }}
                  keyboardType="numeric"
                  onBlur={() => handleBlur("cash")}
                  onChangeText={(value) => {
                    setTextcashin(value);
                    setremainConfirm(false);
                    setremainoptionItem(null);
                
                  }}
                />
              </Item>
            </Item>

          </>
        ) : null}
        <View style={styles.line} />


        {/* transfer is locked 24/09/2019 */}

        {
          userToken.VANCONFIG.VANCNF_BANK_TRANSFER_USE !== 2 ?
            (
              <>
                <Item style={[styles.checkBoxSection,
                { backgroundColor: checkedItems.item2 ? '#f0ffff' : 'white', }
                ]}>
                  <Item style={{ flex: 0.3, borderBottomWidth: 0 }}>
                    <CheckBox
                      title='โอน'
                      // checked={paymentType === 'transfer'}
                      checked={checkedItems.item2}
                      checkedColor={MainTheme.colorTertiary}
                      containerStyle={[styles.checkBoxStyle,
                      { backgroundColor: checkedItems.item2 ? '#f0ffff' : 'white', }]}
                      textStyle={{ fontSize: hp('1.6%') }}
                      onPress={() => {
                        setPaymentType ? setPaymentType('transfer') && nottoggleCheckBox('item2', 'item3') : null;
                        setremainConfirm(false);
                        setremainoptionItem(null);
                        setAmttranferin(0);
                        settranFerin(0);
                      }} />
                  </Item>


                  <Item style={[styles.inputSection,
                  { backgroundColor: checkedItems.item2 ? '#f0ffff' : 'white', }
                  ]}>
                    <Input
                      editable={checkedItems.item2}
                      placeholder="ยอดเงิน"
                      placeholderTextColor={checkedItems.item2 ? '#808080' : MainTheme.placeholerTextInput}
                      //value={checkedItems.item2 == true ? (Number(totalPrice) - Number(tranFerin) - Number(cashin)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null}
                      value={(checkedItems.item2 === true) ? tranFerin : ""}
                      maxLength={14}
                      style={{ fontSize: 14, paddingVertical: 0, height: 30 }}
                      keyboardType="numeric"
                      onBlur={() => handleBlur("transfer")}
                      onChangeText={(value) => {
                        setTexttranFerin(value);
                        setremainConfirm(false);
                        setremainoptionItem(null);
                      }}
                    />
                  </Item>

                </Item>


                {
                  userToken.VANCONFIG.VANCNF_BANK_QRCODE_USE !== 2 ?
                    <Item style={[styles.checkBoxSection, { backgroundColor: checkedItems.item3 ? '#f0ffff' : 'white', }]}>
                      <Item style={{ flex: 0.3, borderBottomWidth: 0 }}>
                        <CheckBox
                          title='QRCode'
                          //checked={paymentType === 'qrcode'}
                          checked={checkedItems.item3}
                          checkedColor={MainTheme.colorTertiary}
                          containerStyle={[styles.checkBoxStyle,
                          { backgroundColor: checkedItems.item3 ? '#f0ffff' : 'white', }]}

                          textStyle={{ fontSize: hp('1.6%') }}
                          onPress={() => {
                            setPaymentType ? setPaymentType('qrcode') && nottoggleCheckBox('item3', 'item2') : null;
                            setremainConfirm(false);
                            setremainoptionItem(null);
                            setAmtQrin(0);
                            setqRCodein(0)


                          }} />

                      </Item>
                      <Item style={[styles.inputSection,
                      { backgroundColor: checkedItems.item3 ? '#f0ffff' : 'white', }
                      ]}>
                        <Input
                          editable={checkedItems.item3}
                          placeholder="ยอดเงิน"
                          placeholderTextColor={checkedItems.item3 ? '#808080' : MainTheme.placeholerTextInput}
                          //disabled = { setState ? setState('isDialogOpen', false) : null; }   {setqrConfirm}
                          //value={checkedItems.item3 == true ? totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null}
                          value={(checkedItems.item3 === true) ? qRCodein : ""}  // Number(cashin).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ""} //.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null}
                          maxLength={14}
                          style={{ fontSize: 14, paddingVertical: 0, height: 30 }}
                          keyboardType="numeric"
                          onBlur={() => handleBlur("qrcode")}
                          onChangeText={(value) => {
                            setTextqRCodein(value);
                            setremainConfirm(false);
                            setremainoptionItem(null);
                          }}
                        />
                      </Item>
                    </Item> : null
                }
                <View style={styles.line} />






                <Item style={[styles.inputSection,
                { backgroundColor: checkedItems.item2 ? '#f0ffff' : checkedItems.item3 ? '#f0ffff' : 'white', }
                ]}>
                  <Form style={[styles.inputSection2, { borderBottomColor: '#d6d7da', borderBottomWidth: 0.5, height: 40, padding: 0 }]}>
                    <RNPickerSelect
                      items={checkedItems.item2 == true ? bankAccount : checkedItems.item3 == true ? qrCodeContent : ""}
                      disabled={checkedItems.item2 == true ? !checkedItems.item2 : checkedItems.item3 == true ? !checkedItems.item3 : true}
                      onValueChange={(value) => {

                        console.log("valuevalue", value);

                        checkedItems.item2 == true ?
                          (setBankAccountItem ? setBankAccountItem(value) : null)
                          :
                          checkedItems.item3 == true ?
                            (setqrContentItem ? setqrContentItem(value) : null)
                            : null
                      }
                      }
                      value={checkedItems.item2 == true ? bankAccountItem : checkedItems.item3 == true ? qrContentItem : null}
                      style={{
                        iconContainer: { top: -3, right: 0, },
                        inputAndroid: { color: '#000000', }
                      }}
                      placeholder={{ label: 'เลือก', value: null }}
                      placeholderTextColor={checkedItems.item2 ? '#808080' : MainTheme.placeholerTextInput}
                      textInputProps={{ underlineColorAndroid: 'cyan', underlineColor: 'yellow' }}
                      useNativeAndroidPickerStyle={false}
                      Icon={() => {
                        return <AntDesign
                          name='down'
                          size={20} color={MainTheme.colorPrimary} style={{marginTop: 5}} />
                      }} />



                  </Form>
                </Item>

              </>
            ) : null}
        <View style={styles.line} />




        {/* qrcode is locked 24/09/2019 */}



        {userToken.VANCONFIG.VANCNF_CHEQUE === 2 ? (
          <>
            <Item style={[styles.checkBoxSection,
            { backgroundColor: checkedItems.item4 ? '#f0ffff' : 'white', }
            ]}>
              <Item style={{ flex: 0.3, borderBottomWidth: 0 }}>
                <CheckBox
                  title="เช็ค"
                  //checked={paymentType === 'cheque'}
                  checked={checkedItems.item4}
                  checkedColor={MainTheme.colorTertiary}
                  containerStyle={[styles.checkBoxStyle,
                  { backgroundColor: checkedItems.item4 ? '#f0ffff' : 'white', }]}
                  textStyle={{ fontSize: hp('1.6%') }}
                  onPress={() => {
                    setPaymentType ? setPaymentType('cheque') && toggleCheckBox('item4') : null;
                    setremainConfirm(false);
                    setremainoptionItem(null);
                    setAmtchequein(0);
                    setchequein(0);
                  }}
                />
              </Item>

              <Item style={[styles.inputSection,
              { backgroundColor: checkedItems.item4 ? '#f0ffff' : 'white', }
              ]}>
                <Input
                  editable={checkedItems.item4}
                  placeholder="ยอดเงิน"
                  placeholderTextColor={checkedItems.item4 ? '#808080' : MainTheme.placeholerTextInput}
                  //value={checkedItems.item4 == true ? totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null}
                  value={(checkedItems.item4 === true) ? chequein : ""}  // Number(cashin).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ""} //.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null}
                  maxLength={14}
                  style={{ fontSize: 14, paddingVertical: 0, height: 30 }}
                  keyboardType="numeric"
                  onBlur={() => handleBlur("cheque")}
                  onChangeText={(value) => {
                    setTextchequein(value);
                    setremainConfirm(false);
                    setremainoptionItem(null);
                  }}
                />
              </Item>
            </Item>
            <Item style={[styles.inputSection,
            { backgroundColor: checkedItems.item4 ? '#f0ffff' : 'white', }
            ]}>
              <Form style={[styles.inputSection2, { borderBottomColor: '#d6d7da', borderBottomWidth: 0.5, height: 40, padding: 0 }]}>
                <RNPickerSelect
                  items={bankFiles}
                  disabled={!checkedItems.item4}
                  onValueChange={(value) => { setBankFileItem ? setBankFileItem(value) : null }}
                  value={checkedItems.item4 == true ? bankFileItem : null}
                  style={{
                    iconContainer: { top: -3, right: 0, },
                    inputAndroid: { color: '#000000', }
                  }}
                  placeholder={{ label: 'เลือก', value: null }}
                  placeholderTextColor={checkedItems.item4 ? '#808080' : MainTheme.placeholerTextInput}
                  textInputProps={{ underlineColorAndroid: 'cyan', underlineColor: 'yellow' }}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => {
                    return <AntDesign
                      name='down'
                      size={20} color={MainTheme.colorPrimary} style={{marginTop: 5}} />
                  }} />
              </Form>
            </Item>

            <Item style={[styles.checkBoxSection,
            { backgroundColor: checkedItems.item4 ? '#f0ffff' : 'white', }
            ]}>
              <Item style={{ flex: 0.3, borderBottomWidth: 0 }}></Item>
              <Item style={styles.inputSection}>
                <Input
                  //editable={chequeNoEditable}
                  placeholder="เลขที่เช็ค"
                  placeholderTextColor={checkedItems.item4 ? '#808080' : MainTheme.placeholerTextInput}

                  value={chequeNo}
                  maxLength={8}
                  style={{ fontSize: 14, paddingVertical: 0, height: 35 }}
                  keyboardType="numeric"
                  onChangeText={(value) => {
                    setChequeNo ? setChequeNo(value) : null;
                  }}
                />
              </Item>
            </Item>

            <Item style={[styles.checkBoxSection,
            { backgroundColor: checkedItems.item4 ? '#f0ffff' : 'white', }
            ]}>
              <Item style={{ flex: 0.3, borderBottomWidth: 0 }}></Item>
              <Item style={[styles.inputSection, { borderBottomColor: 'white', borderWidth: 0, height: 35 }]} >
                <View style={{ flex: 1 }}>
                  <IDatePicker
                    disabled={!checkedItems.item4}
                    value={chequeDate}
                    onDateChange={setChequeDate}
                    style={{ fontSize: 14, paddingVertical: 0 }}
                  />
                </View>
              </Item>
            </Item>


          </>
        ) : null}
        <View style={styles.line} />

        {
          userToken.VANCONFIG.VANCNF_BANK_TRANSFER_USE !== 2 ?
            (
              <>
                <Item style={[styles.checkBoxSection,
                { backgroundColor: checkedItems.item5 ? '#f0ffff' : 'white', }
                ]}>
                  <Item style={{ flex: 0.3, borderBottomWidth: 0 }}>
                    <CheckBox
                      title='อื่นๆ'
                      // checked={paymentType === 'other'}
                      checked={checkedItems.item5}
                      checkedColor={MainTheme.colorTertiary}
                      containerStyle={[styles.checkBoxStyle,
                      { backgroundColor: checkedItems.item5 ? '#f0ffff' : 'white', }]}
                      textStyle={{ fontSize: hp('1.6%') }}
                      onPress={() => {
                        setPaymentType ? setPaymentType('other') && toggleCheckBox('item5') : null;
                        setremainConfirm(false);
                        setremainoptionItem(null);
                        setAmtOtherin(0);
                        setotherin(0)
                      }} />
                  </Item>

                  <Item style={[styles.inputSection,
                  { backgroundColor: checkedItems.item5 ? '#f0ffff' : 'white', }
                  ]}>
                    <Input
                      editable={checkedItems.item5}
                      placeholder="ยอดเงิน"
                      placeholderTextColor={checkedItems.item5 ? '#808080' : MainTheme.placeholerTextInput}

                      //value={checkedItems.item5 == true ? totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null}
                      value={(checkedItems.item5 === true) ? otherin : ""}  // Number(cashin).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ""} //.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null}
                      maxLength={14}
                      style={{ fontSize: 14, paddingVertical: 0, height: 30 }}
                      keyboardType="numeric"
                      onBlur={() => handleBlur('other')}
                      onChangeText={(value) => {
                        setTextotherin(value);
                        setremainConfirm(false);
                        setremainoptionItem(null);
                      }}
                    />
                  </Item>
                </Item>
                <Item style={[styles.checkBoxSection,
                { backgroundColor: checkedItems.item5 ? '#f0ffff' : 'white', }
                ]}>
                  {/* <Item style={{ flex: 0.3, borderBottomWidth: 0 }}>
                  </Item> */}
                  <Form style={[styles.inputSection2, { borderBottomColor: '#d6d7da', borderBottomWidth: 0.5, height: 40, padding: 0 }]}>
                    <RNPickerSelect
                      items={otherPayment}
                      disabled={!checkedItems.item5}
                      onValueChange={(value) => {
                        setotherPaymentItem ? setotherPaymentItem(value) : null
                      }}
                      style={{
                        iconContainer: {
                          top: -5,
                          right: 0,
                        },
                        inputAndroid: {
                          color: '#000000',
                        }
                      }}
                      value={checkedItems.item5 == true ? otherPaymentItem : null}
                      placeholder={{
                        label: 'เลือก',
                        value: null
                      }}
                      textInputProps={{ underlineColorAndroid: 'cyan', underlineColor: 'yellow' }}
                      useNativeAndroidPickerStyle={false}
                      Icon={() => {
                        return <AntDesign
                          name='down'
                          size={20} color={MainTheme.colorPrimary} style={{marginTop: 5}} />
                      }} />
                  </Form>
                </Item>







              </>
            ) : null}
        <View style={styles.line} />










        {/* {userToken.VANCONFIG.VANCNF_ENABLE_CASH === 2 ? (
          <Item style={styles.checkBoxSection}>
            <Item style={{flex: 0.3, borderBottomWidth: 0}}>
              <CheckBox
                title="คิวอาร์โค๊ด (KTB DSCF)"
                checked={paymentType === 'ktb'}
                checkedColor={MainTheme.colorTertiary}
                containerStyle={styles.checkBoxStyle}
                textStyle={{fontSize: hp('1.6%')}}
                onPress={() => {
                  setPaymentType ? setPaymentType('ktb') : null;
                }}
              />
            </Item>
          </Item>
        ) : null} */}

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



        <Modal
          transparent={true}
          visible={isDialogOpen}
          onRequestClose={() => { setState ? setState('isDialogOpen', false) : null; }}
        >
          <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.30)', alignItems: 'center', justifyContent: 'center', }}>
            <View style={{ width: '80%', height: '25%', backgroundColor: '#FFFFFF', borderRadius: 5, }}>
              <View style={{
                flex: 0.1, backgroundColor: '#2554C7', borderTopRightRadius: 5, borderTopLeftRadius: 5, alignItems: 'center', padding: 10, alignItems:
                  'center', justifyContent: 'center',
              }}>
                <Text style={{ fontSize: hp('1.7%'), color: '#FFFFFF' }} allowFontScaling={false}>
                  ระบุหมายเหตุการชำระ{differValue < 0 ? "ขาด" : "เกิน"}  {Math.abs(differValue).toFixed(2)} บาท
                </Text>
              </View>
              <View style={{ flex: 0.5, alignItems: 'center', padding: 3, alignItems: 'baseline', justifyContent: 'flex-start', }}>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                {
                  (
                    <>
                      <Item style={[styles.inputSection2, { backgroundColor: checkedItems.item2 ? '#f0ffff' : 'white', }]}>
                        <Form style={[styles.inputSection2, { borderBottomColor: '#d6d7da', borderBottomWidth: 0.5, height: 40, padding: 0 }]}>
                          <RNPickerSelect
                            items={remainoption}
                            //disabled={!true}
                            onValueChange={(value) => {
                              setremainoptionItem ? setremainoptionItem(value) : null;
                            }}
                            value={remainoptiontItem}
                            style={{
                              iconContainer: { top: -3, right: 0, },
                              inputAndroid: { color: '#000000', }
                            }}
                            placeholder={{ label: 'เลือก', value: null }}
                            placeholderTextColor={'#808080'}
                            textInputProps={{ underlineColorAndroid: 'cyan', underlineColor: 'yellow' }}
                            useNativeAndroidPickerStyle={false}
                            Icon={() => {
                              return <AntDesign
                                name='down'
                                size={20} color={MainTheme.colorPrimary} style={{marginTop: 5}} />
                            }}
                          />
                        </Form>
                      </Item>
                    </>
                  )
                }

              </View>
              <IButtonGroupCustom
                listItems={buttonListItems}
                renderItem={renderItemRemainOption}
                style={iButtonGroupCustomStyles}
              />
            </View>
          </View>
        </Modal>



        <Modal
          animationType="fade"
          transparent={true}
          visible={isQRCodeDialogOpen}
          onRequestClose={() => {
            setState ? setState('isQRCodeDialogOpen', false) : null;
          }}>
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.30)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '80%',
                height: '80%',
                backgroundColor: '#FFFFFF',
                borderRadius: 5,
              }}>
              <View
                style={{
                  flex: 0.1,
                  // width: '100%',
                  backgroundColor: '#2554C7',
                  borderTopRightRadius: 5,
                  borderTopLeftRadius: 5,
                  alignItems: 'center',
                  padding: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{ fontSize: hp('1.7%'), color: '#FFFFFF' }}
                  allowFontScaling={false}>
                  Thai QR Payment
                </Text>
              </View>
              <View
                style={{
                  flex: 0.1,
                  alignItems: 'center',
                  padding: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false}>
                  Thai QR Payment
                </Text>
              </View>
              <View
                style={{
                  flex: 0.6,
                  // width: '100%',
                  backgroundColor: '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // paddingTop: 15,
                  // paddingBottom: 30,
                }}>
                {/* <View style={{ position: 'absolute', zIndex: 998, width: 60, height: 60, borderRadius: 60/2, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{  }}>QR</Text>
                                    </View> */}
                {/* <Text style={{  }}>{qrCode}</Text> */}
                <QRCode
                  value={checkpayment(qrCode, qrContentItem)}
                  //value={qrCode}
                  size={240}
                  logo={qrLogo}
                  logoSize={60}
                  logoBackgroundColor="transparent"
                />
                {/* <View style={{ flex: 0.6, borderWidth: 1, backgroundColor: 'red' }}>
                                        <QRCode
                                            value={qrCode}
                                            size={240}
                                            bgColor='#000000'
                                            fgColor='white'/>
                                    </View> */}
              </View>
              <View
                style={{
                  flex: 0.2,
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  paddingBottom: 30,
                  borderBottomRightRadius: 5,
                  borderBottomLeftRadius: 5,
                }}>
                {/* <View style={{
                                    flexDirection: 'row', 
                                    justifyContent: 'space-between', 
                                    marginHorizontal:10,
                                    paddingVertical: 10, 
                                    borderBottomWidth: 0.3, 
                                    borderTopWidth: 0.3 
                                }}>
                                    <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >เลขที่บัญชี</Text>
                                    <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false} >260-210-5460</Text>
                                </View> */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginHorizontal: 10,
                    paddingVertical: 10,
                    borderBottomWidth: 0.3,
                  }}>
                  <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false}>
                    จำนวนเงิน
                  </Text>
                  <Text style={{ fontSize: hp('1.7%') }} allowFontScaling={false}>
                    {Number(qrCode).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    {' '}
                    บาท
                  </Text>

                </View>
                {/* <IButtonGroupCustom
                listItems={buttonListItems}
                renderItem={renderItemRemainOption}
                style={iButtonGroupCustomStyles}
              /> */}

                <View

                
                  style={{
                    flex: 1.9,
                    flexDirection: 'row',
                    // width: '100%',
                    //backgroundColor: '#2554C7',
                    borderTopRightRadius: 5,
                    borderTopLeftRadius: 5,
                    alignItems: 'center',
                    padding: 10,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>






                  <Button
                    //  key={key}
                    large
                    buttonStyle={{
                      backgroundColor: MainTheme.colorPrimary,
                      height: 40,
                      width: 110,
                      borderRadius: 0,
                      borderColor: MainTheme.colorQuaternary,
                      borderWidth: 0.3,
                    }}
                    //size={50}
                    title={'ตกลง'}
                    // title={item.title}
                    // titleStyle={item.titleStyle}
                    onPress={() => {
                      (setqrConfirm ? setqrConfirm(true) : false);
                      setState ? setState('isQRCodeDialogOpen', false) : null;
                      // setState ? setState('qrConfirm', true) : null;
                      // setqrConfirm
                      //this._onPress(item);
                    }}
                  // disabled={item.title === 'ตกลง' ? this.state.buttonDisabled : false}
                  />

                  <Button
                    //  key={key}
                    large
                    buttonStyle={
                      {
                        backgroundColor: MainTheme.colorSecondary,
                        height: 40,
                        borderRadius: 0,
                        // borderColor: "#E5E4E2",
                        width: 110,
                        borderColor: MainTheme.colorButtonBorder,
                        borderWidth: 0.3
                      }
                    }
                    //size={50}
                    title={'ยกเลิก'}
                    //containerStyle={{ flex: 1 }}
                    containerStyle={{ marginLeft: 1 }} // กำหนดระยะห่างระหว่างปุ่มที่ 100px
                    titleStyle={{ color: '#000000' }}
                    onPress={() => { setState ? setState('isQRCodeDialogOpen', false) : null; }} />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </Content>
    </Container>
  );
};

export default PaymentForm;

const styles = StyleSheet.create({
  container: {},
  messageBox: {
    marginTop: 15,
    // height: 30
  },
  titleSection: {
    borderBottomWidth: 0,
    marginLeft: 0,
    paddingLeft: 15,
    flexDirection: 'row',
    backgroundColor: MainTheme.colorSeptenary,
    height: 40,
    alignItems: 'center',
  },
  bodySection: {
    marginTop: 5,
  },
  checkBoxSection: {
    borderBottomWidth: 0,
    borderColor: '#d6d7da',
    flexDirection: 'row',
    marginRight: 10,
  },
  checkBoxStyle: {
    flex: 1,
    //backgroundColor: MainTheme.colorSecondary,
    paddingTop: 3,
    paddingBottom: 3,

    paddingLeft: 0.5,
    borderWidth: 0,
    marginRight: 0,
  },
  inputSection: {

    flex: 0.8,
  },
  inputSection2: {
    marginStart: 15,
    flex: 1,
  },
  dateIcon: {
    position: 'absolute',
    right: 0,
    top: 4,
    marginLeft: 0,
    height: 22,
  },
  dateInput: {
    height: 35,
    borderWidth: 0,
    borderColor: '#d6d7da',
    borderBottomWidth: 1,
    // paddingTop: 2,
    // paddingBottom: 2,
    // justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  disabled: {
    backgroundColor: '#FFF',
  },
  line: {
    height: 0,
    backgroundColor: '#E5E4E2', // Line color
    width: '60%',             // Adjust the width as needed
    alignSelf: 'center',      // Center align the line
    marginVertical: 0,       // Space above and below the line
  },
});

const iButtonGroupCustomStyles = StyleSheet.create({
  container: {
    flex: null,
    height: 50,
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-evenly',
    marginTop: 5,
  },
});
