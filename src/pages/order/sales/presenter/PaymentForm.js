//import React from 'react';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import QRCode from 'react-native-qrcode-svg';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IButtonGroupCustom from '../../../../component/button/IButtonGroupCustom';
import { Button, CheckBox } from '../../../../component/elements';
import IDatePicker from '../../../../component/input/IDatePicker';
import ILoading from '../../../../component/loading/ILoading';
import ITextWithErrorMessage from '../../../../component/text/ITextWithErrorMessage';
import ITextWithSuccessMessage from '../../../../component/text/ITextWithSuccessMessage';
import { MainTheme } from '../../../../constant/lov';

const runIfFunction = async (fn, ...args) => {
  if (typeof fn === 'function') {
    await fn(...args);
  }
};

const Container = ({children}) => <View style={styles.screen}>{children}</View>;
const Content = ({children}) => (
  <ScrollView
    style={styles.contentScroll}
    contentContainerStyle={styles.contentContainer}>
    {children}
  </ScrollView>
);
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
    qrAmount,
    qrLogo,
    userToken,
    // cashin,
    // setcashin,
    remainOptionItem,
    differBy,
    differValue
  } = props;
  // const [isDialogOpen, setisDialogOpen] =  useState(false);

  const safeRemainOptionItems = Array.isArray(remainOptionItem) ? remainOptionItem : [];
  const safeBankFileListItems = Array.isArray(bankFileListItems) ? bankFileListItems : [];
  const safeQrContentListItems = Array.isArray(qrContentListItem) ? qrContentListItem : [];
  const safeOtherPaymentType = Array.isArray(otherPaymentType) ? otherPaymentType : [];
  const safeListBankAccountItem = Array.isArray(listbankAccountItem) ? listbankAccountItem : [];
  const safeUserToken = userToken && userToken.VANCONFIG ? userToken : {
    VANCONFIG: {
      VANCNF_ENABLE_CASH: null,
      VANCNF_BANK_TRANSFER_USE: null,
      VANCNF_CHEQUE: null,
      VANCNF_BANK_QRCODE_USE: null,
    },
  };
  const safeTotalPrice = Number.isFinite(Number(totalPrice)) ? Number(totalPrice) : 0;

  //console.log("remainOption >>", remainOptionItem)
  // console.log("bankAccountItem >>", listbankAccountItem)

  const remainoption = safeRemainOptionItems.map((item) => ({
    label: item.SYSLKUP_T_DESC,
    value: item.SYSLKUP_KEY,
  }));

  const normalizeQrAmount = (amount) => {
    if (amount === null || amount === undefined || amount === '') {
      return null;
    }



const numericAmount = parseFloat(String(amount).replace(/[^\d.]/g, ''));
    if (numericAmount <= 0) {
      return null;
    }

    return numericAmount.toFixed(2);
  };


  const bankFiles = safeBankFileListItems.filter(item => !item.BANK_T_NAME.includes("(ยกเลิก)")).sort((a, b) => {
    if (a.BANK_T_NAME < b.BANK_T_NAME) return -1;
    if (a.BANK_T_NAME > b.BANK_T_NAME) return 1;
    return 0;
  }).map((item) => ({
    label: item.BANK_T_NAME,
    value: item.BANK_KEY,
  }));
 // console.log("bankAccount4 >>", bankFiles)

  const bankAccount = Object.values(safeListBankAccountItem.sort((a, b) => {
    if (a.BNKAC_CODE < b.BNKAC_CODE) return -1;
    if (a.BNKAC_CODE > b.BNKAC_CODE) return 1;
    return 0;
  }).map((item) => ({
    label: item.BNKAC_CODE + "." + item.BNKAC_NAME,
    value: item.BNKAC_CODE,
  })));


  const qrCodeContent = Object.values(safeQrContentListItems.map((item) => ({
    label: item.QRCT_NAME,
    value: item.QRCT_KEY,
  }))
  );


  const otherPayment = Object.values(safeOtherPaymentType.map((item) => ({
    label: item.PMT_NAME,
    value: item.PMT_KEY,
  }))
  );

  const getSelectedQrContent = (promptPay) => {
    if (promptPay === null || promptPay === undefined || promptPay === '') {
      return null;
    }

    return (
      safeQrContentListItems.find(
        item =>
          String(item.QRCT_KEY) === String(promptPay) ||
          String(item.QRCT_CODE) === String(promptPay),
      ) || null
    );
  };

  const defaultQrContent = safeQrContentListItems[0] || null;

  const isQrTemplatePayload = (content) => {
    const normalizedContent = String(content || '').trim();

    return (
      normalizedContent.startsWith('000201') ||
      (normalizedContent.includes('5303764') && normalizedContent.includes('5802TH'))
    );
  };

  const isDirectQrPayload = (content) => {
    const normalizedContent = String(content || '').trim();

    if (!normalizedContent) {
      return false;
    }

    if (isQrTemplatePayload(normalizedContent)) {
      return true;
    }

    return normalizedContent.length > 20;
  };

  const [checkedItems, setCheckedItems] = useState({
    item1: false,
    item2: false,
    item3: false,
    item4: false,
    item5: false,
  });

  const formattedTotalPrice = safeTotalPrice
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const showCashCard = safeUserToken.VANCONFIG.VANCNF_ENABLE_CASH === 2;
  const showTransferQrCard = safeUserToken.VANCONFIG.VANCNF_BANK_TRANSFER_USE !== 2;
  const showQrCodeOption = false;
  const showChequeCard = safeUserToken.VANCONFIG.VANCNF_CHEQUE === 2;
  const showOtherCard = safeUserToken.VANCONFIG.VANCNF_BANK_TRANSFER_USE !== 2;

  const getBorderlessPickerStyle = (enabled) => ({
    iconContainer: {
      top: 10,
      right: 0,
    },
    inputAndroid: {
      color: enabled ? '#000000' : '#808080',
      minHeight: 40,
      paddingVertical: 10,
      paddingRight: 28,
      textAlignVertical: 'center',
    },
    inputIOS: {
      color: enabled ? '#000000' : '#808080',
      minHeight: 40,
      paddingVertical: 10,
      paddingRight: 28,
    },
    placeholder: {
      color: '#808080',
    },
  });

  const toggleCheckBox = (item) => {


    setCheckedItems((prevState) => ({
      ...prevState,
      [item]: !prevState[item],
    }));



  };

  const nottoggleCheckBox = (item, notitem) => {


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

    let payin = numericValue5 + numericValue4 + numericValue3 + numericValue2 + numericValue1;


    switch (param) {
      case 'cash':


        if (numericValue5 + numericValue4 + numericValue3 + numericValue2 + numericValue1 >= totalPrice + differBy) {

          if (numericValue1 <= (totalPrice + differBy - numericValue2 - numericValue3 - numericValue4 - numericValue5)) {
            numericValue1 = (totalPrice + differBy - numericValue2 - numericValue3 - numericValue4 - numericValue5);
          } else {
            numericValue1 = (totalPrice) - numericValue2 - numericValue3 - numericValue4 - numericValue5
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
          } else {
            numericValue2 = (totalPrice) - numericValue1 - numericValue3 - numericValue4 - numericValue5
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
          } else {
            numericValue3 = (totalPrice) - numericValue1 - numericValue2 - numericValue4 - numericValue5
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
          } else {
            numericValue4 = (totalPrice) - numericValue1 - numericValue2 - numericValue3 - numericValue5
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
          } else {
            numericValue5 = (totalPrice) - numericValue2 - numericValue3 - numericValue1 - numericValue4
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
    const normalizedAmount = normalizeQrAmount(amount);
    if (!normalizedAmount) return null;

    const qrContent = getSelectedQrContent(promptPay) || defaultQrContent;
    const rawPromptPay = String(promptPay || '').trim();

    const result = String(qrContent?.QRCT_SOURCE || '').trim();
    const rawQrContent = String(qrContent?.QRCT_CONTENT || '').trim();
    const isUsableQrSeed = (value) => {
      const normalizedValue = String(value || '').trim();
      if (!normalizedValue || normalizedValue === '0') {
        return false;
      }

      if (isDirectQrPayload(normalizedValue) || isQrTemplatePayload(normalizedValue)) {
        return true;
      }

      if (/^qr\s*code$/i.test(normalizedValue) || /^qrcode$/i.test(normalizedValue)) {
        return false;
      }

      return /\d/.test(normalizedValue);
    };

    const fallbackQrSeed = [
      rawQrContent,
      qrContent?.BNKAC_CODE,
      qrContent?.QRCT_CODE,
      qrContent?.QRCT_NAME,
      qrContent?.BNKAC_NAME,
      !qrContent && isUsableQrSeed(rawPromptPay) ? rawPromptPay : null,
    ]
      .map(item => String(item || '').trim())
      .find(item => isUsableQrSeed(item));

    const qrSourceValue = fallbackQrSeed;

    if (!qrSourceValue || qrSourceValue === '0') {
      return null;
    }

    if (result === '4' || isQrTemplatePayload(qrSourceValue)) {
      return genQrPaymentFromQrCode(normalizedAmount, qrSourceValue) || qrSourceValue;
    }

    const generatedPromptPay = genQrPayment(normalizedAmount, qrSourceValue);
    if (generatedPromptPay) {
      return generatedPromptPay;
    }

    if (isDirectQrPayload(qrSourceValue)) {
      return qrSourceValue;
    }

    return qrSourceValue;
  };




  const genQrPaymentFromQrCode = (amount, qrTemplate) => {

    let pp_amount = "";
    let pp_chksum = "";

    //console.log("promptPay pp_str =>", qrTemplate);
    if (qrTemplate === null || qrTemplate === undefined) return null;
    if (!amount) return null;

    const qrCode = String(qrTemplate || '').trim();

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
    if (promptPay === null || promptPay === undefined) return null;
    if (!amount) return null;

    const result = String(promptPay || '').trim();



    let pp_acc_id = "";
    let pp_amount = "";
    let pp_chksum = "";

    // process acc_id
    let acc_id = result.replace(/[^0-9]/g, ''); //3130200142805
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

  console.log('qrCode',qrCode)

  const qrPaymentValue = isDirectQrPayload(qrCode)
    ? String(qrCode).trim()
    : checkpayment(qrAmount, qrContentItem) || checkpayment(qrAmount, qrCode);
  const qrDisplayAmount = normalizeQrAmount(qrAmount) || normalizeQrAmount(qrCode) || '0.00';

  console.log('qrPaymentValue',qrPaymentValue)

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
        <View style={styles.titleSection}>
          <View style={styles.titleIconWrap}>
            <MaterialDesignIcons
              name="credit-card-outline"
              color={MainTheme.colorSecondary}
              size={24}
            />
          </View>

          <View style={styles.titleCopyWrap}>
            <Text style={styles.titleEyebrow} allowFontScaling={false}>
              PAYMENT
            </Text>
            <Text style={styles.titleText} allowFontScaling={false}>
              การชำระเงิน
            </Text>
          </View>

          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeLabel} allowFontScaling={false}>
              ยอดทั้งหมด
            </Text>
            <Text style={styles.totalBadgeValue} allowFontScaling={false}>
              {formattedTotalPrice}
            </Text>
          </View>
        </View>

        {showCashCard ? (
          <View style={styles.paymentCard}>
            <View style={styles.paymentCardHeader}>
              <Text style={styles.paymentCardTitle} allowFontScaling={false}>
                เงินสด
              </Text>
             
            </View>
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
                  onPress={async () => {
                    await runIfFunction(setPaymentType, 'cash');
                    toggleCheckBox('item1');
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

          </View>
        ) : null}
        <View style={styles.line} />


        {/* transfer is locked 24/09/2019 */}

        {
          showTransferQrCard ?
            (
              <View style={styles.paymentCard}>
                <View style={styles.paymentCardHeader}>
                  <Text style={styles.paymentCardTitle} allowFontScaling={false}>
                    โอนและ QR Code
                  </Text>
                
                </View>
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
                      onPress={async () => {
                        await runIfFunction(setPaymentType, 'transfer');
                        nottoggleCheckBox('item2', 'item3');
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
                  showQrCodeOption && safeUserToken.VANCONFIG.VANCNF_BANK_QRCODE_USE !== 2 ?
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
                          onPress={async () => {
                            await runIfFunction(setPaymentType, 'qrcode');
                            nottoggleCheckBox('item3', 'item2');
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






                <Item style={[styles.otherPickerSection,
                { backgroundColor: checkedItems.item2 ? '#f0ffff' : checkedItems.item3 ? '#f0ffff' : 'transparent', }
                ]}>
                  <Form style={[styles.inputSection2, { borderBottomColor: 'transparent', borderBottomWidth: 0, height: 40, padding: 0 }]}>
                    <RNPickerSelect
                      items={checkedItems.item2 == true ? bankAccount : checkedItems.item3 == true && showQrCodeOption ? qrCodeContent : []}
                      disabled={checkedItems.item2 == true ? !checkedItems.item2 : checkedItems.item3 == true && showQrCodeOption ? !checkedItems.item3 : true}
                      onValueChange={(value) => {
                        checkedItems.item2 == true ?
                          (setBankAccountItem ? setBankAccountItem(value) : null)
                          :
                          checkedItems.item3 == true && showQrCodeOption ?
                            (setqrContentItem ? setqrContentItem(value) : null)
                            : null
                      }
                      }
                      value={checkedItems.item2 == true ? bankAccountItem : checkedItems.item3 == true && showQrCodeOption ? qrContentItem : null}
                      style={getBorderlessPickerStyle(checkedItems.item2 || (checkedItems.item3 && showQrCodeOption))}
                      placeholder={{ label: 'เลือก', value: null }}
                      placeholderTextColor={checkedItems.item2 ? '#808080' : MainTheme.placeholerTextInput}
                      textInputProps={{ underlineColorAndroid: 'transparent', underlineColor: 'transparent' }}
                      useNativeAndroidPickerStyle={false}
                      Icon={() => {
                        return <AntDesign
                          name='down'
                          size={20} color={MainTheme.colorPrimary} style={{marginTop: 0}} />
                      }} />



                  </Form>
                </Item>

              </View>
            ) : null}
        <View style={styles.line} />




        {/* qrcode is locked 24/09/2019 */}



        {showChequeCard ? (
          <View style={styles.paymentCard}>
            <View style={styles.paymentCardHeader}>
              <Text style={styles.paymentCardTitle} allowFontScaling={false}>
                เช็ค
              </Text>
              
            </View>
            {safeUserToken.VANCONFIG.VANCNF_CHEQUE === 2 ? (
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
                  onPress={async () => {
                    await runIfFunction(setPaymentType, 'cheque');
                    toggleCheckBox('item4');
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
            <Item style={[styles.otherPickerSection,
            { backgroundColor: checkedItems.item4 ? '#f0ffff' : 'transparent', }
            ]}>
              <Form style={[styles.inputSection2, { borderBottomColor: 'transparent', borderBottomWidth: 0, height: 40, padding: 0 }]}>
                <RNPickerSelect
                  items={bankFiles}
                  disabled={!checkedItems.item4}
                  onValueChange={(value) => { setBankFileItem ? setBankFileItem(value) : null }}
                  value={checkedItems.item4 == true ? bankFileItem : null}
                  style={getBorderlessPickerStyle(checkedItems.item4)}
                  placeholder={{ label: 'เลือก', value: null }}
                  placeholderTextColor={checkedItems.item4 ? '#808080' : MainTheme.placeholerTextInput}
                  textInputProps={{ underlineColorAndroid: 'transparent', underlineColor: 'transparent' }}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => {
                    return <AntDesign
                      name='down'
                      size={20} color={MainTheme.colorPrimary} style={{marginTop: 0}} />
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

          </View>
        ) : null}
        <View style={styles.line} />

        {showOtherCard ? (
          <View style={styles.paymentCard}>
            <View style={styles.paymentCardHeader}>
              <Text style={styles.paymentCardTitle} allowFontScaling={false}>
                ช่องทางอื่นๆ
              </Text>
             
            </View>
        {
          safeUserToken.VANCONFIG.VANCNF_BANK_TRANSFER_USE !== 2 ?
            (
              <>
                <Item style={[styles.checkBoxSection,
                { backgroundColor: checkedItems.item5 ? '#f0ffff' : 'white', }
                ]}>
                  <Item style={{ flex: 0.3, borderBottomWidth: 0 }}>
                    <CheckBox
                      title='อื่นๆ'
                      checked={checkedItems.item5}
                      checkedColor={MainTheme.colorTertiary}
                      containerStyle={[styles.checkBoxStyle,
                      { backgroundColor: checkedItems.item5 ? '#f0ffff' : 'white', }]}
                      textStyle={{ fontSize: hp('1.6%') }}
                      onPress={async () => {
                        await runIfFunction(setPaymentType, 'other');
                        toggleCheckBox('item5');
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
                <Item style={[styles.otherPickerSection,
                { backgroundColor: checkedItems.item5 ? '#f0ffff' : 'transparent', }
                ]}>
                  <Form style={[styles.inputSection2, { borderBottomColor: 'transparent', borderBottomWidth: 0, height: 40, padding: 0 }]}>
                    <RNPickerSelect
                      items={otherPayment}
                      disabled={!checkedItems.item5}
                      onValueChange={(value) => {
                        setotherPaymentItem ? setotherPaymentItem(value) : null
                      }}
                      style={getBorderlessPickerStyle(checkedItems.item5)}
                      value={checkedItems.item5 == true ? otherPaymentItem : null}
                      placeholder={{
                        label: 'เลือก',
                        value: null
                      }}
                      textInputProps={{ underlineColorAndroid: 'transparent', underlineColor: 'transparent' }}
                      useNativeAndroidPickerStyle={false}
                      Icon={() => {
                        return <AntDesign
                          name='down'
                          size={20} color={MainTheme.colorPrimary} style={{marginTop: 0}} />
                      }} />
                  </Form>
                </Item>







              </>
            ) : null}
          </View>
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

        <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems:'center',}}>
          

        <IButtonGroupCustom
          listItems={buttonListItems}
          renderItem={renderItem}
          style={{flexDirection: 'row', justifyContent: 'space-between'}}
        />
        </View>



        <Modal
          transparent={true}
          visible={isDialogOpen}
          onRequestClose={() => { setState ? setState('isDialogOpen', false) : null; }}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.remainModalCard}>
              <View style={styles.remainModalHeader}>
                <Text style={styles.remainModalHeaderText} allowFontScaling={false}>
                  ระบุหมายเหตุการชำระ{differValue < 0 ? "ขาด" : "เกิน"}  {Math.abs(differValue).toFixed(2)} บาท
                </Text>
              </View>
              <View style={styles.remainModalBody}>
                {
                  (
                    <>
                      <Item style={styles.remainModalPickerWrapper}>
                        <Form style={styles.remainModalPickerForm}>
                          <RNPickerSelect
                            items={remainoption}
                            //disabled={!true}
                            onValueChange={(value) => {
                              setremainoptionItem ? setremainoptionItem(value) : null;
                            }}
                            value={remainoptiontItem}
                            style={{
                              iconContainer: { top: -3, right: 0, },
                              inputAndroid: { color: '#000000', paddingRight: 28 },
                              inputIOS: { color: '#000000', paddingRight: 28 }
                            }}
                            placeholder={{ label: 'เลือก', value: null }}
                            placeholderTextColor={'#808080'}
                            textInputProps={{ underlineColorAndroid: 'transparent', underlineColor: 'transparent' }}
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
                style={remainOptionButtonGroupStyles}
              />
            </View>
          </View>
        </Modal>



        <Modal
          animationType="fade"
          transparent={true}
          visible={showQrCodeOption && isQRCodeDialogOpen}
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
                {qrPaymentValue ? (
                  <QRCode
                    value={qrPaymentValue}
                    size={240}
                    logo={qrLogo}
                    logoSize={60}
                    logoBackgroundColor="transparent"
                  />
                ) : (
                  <Text style={{fontSize: hp('1.7%'), color: '#666666'}} allowFontScaling={false}>
                    ไม่สามารถสร้าง QR Code ได้ กรุณาตรวจสอบข้อมูลการชำระ
                  </Text>
                )}
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
                    {Number(qrDisplayAmount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
                    borderTopRightRadius: 5,
                    borderTopLeftRadius: 5,
                    alignItems: 'center',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>






                  <Button
                    large
                    buttonStyle={{
                      backgroundColor: MainTheme.colorPrimary,
                      height: 40,
                      width: 110,
                      borderRadius: 0,
                      borderColor: MainTheme.colorQuaternary,
                      borderWidth: 0.3,
                    }}
                    title={'ตกลง'}
                   
                    onPress={() => {
                      (setqrConfirm ? setqrConfirm(true) : false);
                      setState ? setState('isQRCodeDialogOpen', false) : null;
                     
                    }}
                  />

                  <Button
                    large
                    buttonStyle={
                      {
                        backgroundColor: MainTheme.colorSecondary,
                        borderRadius: 0,
                        width: 110,
                        borderColor: MainTheme.colorButtonBorder,
                        borderWidth: 0.3
                      }
                    }
                    title={'ยกเลิก'}
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
  screen: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  contentScroll: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  contentContainer: {
    paddingBottom: 28,
  },
  container: {},
  modalBackdrop: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  remainModalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  remainModalHeader: {
    backgroundColor: '#2554C7',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainModalHeaderText: {
    fontSize: hp('1.9%'),
    color: '#FFFFFF',
    textAlign: 'center',
  },
  remainModalBody: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
  },
  remainModalPickerWrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#d6d7da',
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  remainModalPickerForm: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 0,
  },
  messageBox: {
    marginTop: 15,
    // height: 30
  },
  titleSection: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF2FF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D7E4FB',
  },
  titleIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: MainTheme.colorPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleCopyWrap: {
    flex: 1,
    paddingRight: 10,
  },
  titleEyebrow: {
    fontSize: hp('1.25%'),
    color: '#6C7A96',
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: 0.6,
  },
  titleText: {
    fontSize: hp('2.15%'),
    color: '#1D3557',
    fontWeight: '700',
  },
  totalBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: '#D7E4FB',
  },
  totalBadgeLabel: {
    fontSize: hp('1.2%'),
    color: '#6C7A96',
    fontWeight: '600',
    marginBottom: 1,
  },
  totalBadgeValue: {
    fontSize: hp('1.95%'),
    color: MainTheme.colorPrimary,
    fontWeight: '700',
  },
  bodySection: {
    marginTop: 5,
  },
  paymentCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    paddingTop: 14,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  paymentCardHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  paymentCardTitle: {
    fontSize: hp('2%'),
    color: '#1D3557',
    fontWeight: '700',
    marginBottom: 2,
  },
  paymentCardSubtitle: {
    fontSize: hp('1.45%'),
    color: '#6B7A90',
  },
  otherPickerSection: {
    marginHorizontal: 14,
    marginBottom: 10,
    paddingHorizontal: 14,
    minHeight: 48,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkBoxSection: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'stretch',
    marginHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E1E8EC',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  checkBoxStyle: {
    flex: 1,
    minHeight: 56,
    justifyContent: 'center',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 2,
    borderWidth: 0,
    marginRight: 0,
    marginLeft: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  inputSection: {
    flex: 0.8,
    minHeight: 56,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderLeftWidth: 1,
    borderLeftColor: '#E6EBF0',
  },
  inputSection2: {
    marginStart: 0,
    flex: 1,
    justifyContent: 'center',
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
    backgroundColor: 'transparent',
    width: '100%',
    alignSelf: 'center',
    marginVertical: 0,
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

const remainOptionButtonGroupStyles = StyleSheet.create({
  container: {
    flex: null,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 12,
    paddingBottom: 16,
    paddingTop: 4,
  },
});
