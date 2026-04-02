import moment from 'moment';
import React, { Component } from 'react';
import { Keyboard, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { setIsSubmit as setCheckInIsSubmit } from '../../../../action/check-in';
import { getCurrentPosition } from '../../../../action/geolocation';
import { auth, getQRCode, postinvoice, subscription } from '../../../../action/ktb-payment';
import { setIsSubmit as setMileIsSubmit } from '../../../../action/mile';
import {
  createOrderSaleV3,
  orderAttachImage,
  orderCreateCash,
  orderUpdateCash,
  setHeaderProcessedVdiBankTransfer,
  setHeaderProcessedVdiChequeBank,
  setHeaderProcessedVdiChequeDate,
  setHeaderProcessedVdiChequeNo,
  setHeaderProcessedVdiQRRefer,
} from '../../../../action/order';
import {
  authForGetAccessToken,
  requestQrCodeSCB,
} from '../../../../action/qrcode-payment';
import { paymentButtonGroup } from '../../../../constant/lov';
import Navigator from '../../../../services/Navigator';
import { numberOnlyCanZeroFirst } from '../../../../utils/Culculate';
import {
  genenrateAttachImageToServer,
  genenrateOrderForCreateToServer
} from '../../../../utils/Order';
import { getLoginGuID, getUserToken } from '../../../../utils/Token';
import PaymentForm from '../presenter/PaymentForm';

import { BPAPUS_BPAPSV } from '../../../../../appConfig';
import { lookupErpV3Api } from '../../../../api/bPlusApi';
import {
  BPAPUS_LOOKUP_OT_REC_CODE,
  BPAPUS_LOOKUP_QR_CODE,
  BPAPUS_REMAIN_OPTION_OVER,
  BPAPUS_REMAIN_OPTION_UNDER
} from '../../../../constant/bPlusApi';





class CTPaymentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      successMessage: null,
      errorMessage: null,
      paymentType: null,
      groupofpaymentType: new Set(), // or {} or [],
      cashin: null,
      qrin: null,
      otherin: null,

      paymentTransfer: {
        tranFerin: null,
        bankAccountItem: null,
        bankAccountName: null,
        bankAccountItemEnabled: false,
      },
      paymentCheque: {
        bankFileItem: null,
        chequeDate: moment().format('DD/MM/YYYY'),
        chequeNo: null,
        bankFileItemEnabled: false,
        chequeDateDisabled: true,
        chequeNoEditable: false,
        chequein: null,
      },
      buttonDisabled: false,
      userToken: {
        VANCONFIG: {
          VANCNF_BANK_QRCODE_USE: null,
          VANCNF_BANK_TRANSFER_USE: null,
          VANCNF_ENABLE_CASH: null,
          VANCNF_CHEQUE: null,
        },
      },
      isQRCodeDialogOpen: false,
      isDialogOpen: false,

      qrCode: null,
      qrLogo: require('../../../../images/Icon_App.png'),
      qrContentItem: null,
      qrContentName: null,


      dscfTxnId: null,
      accessToken: null,
      otherPaymentType: [],
      listbankAccountItem: [],
      cashaccount: null,
      qrContent: [],
      qrConfirm: false,
      remainConfirm: false,
      otherPaymentItem: null,
      reMainOption_Under: [],
      reMainOption_Over: [],
      reMainOption1: [],
      remainoptiontItem: null,
      differBy: 1,  // จำนวนเงิน บวกลบ Remain Option
      differValue: 0
    };

    this._getUserToken();
    this._getOtherPaymentType();
    this._getbankAccount();
    this._getQRContent();
    this._getCashAccount();
     this._getRemainOtipn_Under();
     this._getRemainOtipn_Over();
  }

//   componentDidMount() {
//      this._getRemainOtipn_Under();
//      this._getRemainOtipn_Over();
// }

  _getUserToken = async () => {
    const userToken = await getUserToken();

    if (userToken) {
      await this.setState((oldState) => {
        return {
          userToken: userToken,
        };
      });
    }

    console.log('userToken', userToken);
  };


  _getOtherPaymentType = async () => {
    const LoginGUID = await getLoginGuID();


    let dataObj2 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': BPAPUS_LOOKUP_OT_REC_CODE,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    let WL_CODE = null;
    await lookupErpV3Api(dataObj2)
      .then(async (v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          console.log("responseData.Ps000103 1 ", JSON.parse(ResponseData));
          let responseData = JSON.parse(ResponseData);
          console.log("responseData.Ps000103 2", responseData.Ps000103);

          //this.state.otherPaymentType = Object.values(responseData.Ps000103);
          await this._setState('otherPaymentType', Object.values(responseData.Ps000103));
          console.log("responseData.Ps000103 3", Object.values(responseData.Ps000103));
          console.log("this.state.otherPaymentType", this.state.otherPaymentType);

        } else {
          //console.log('ERROR lookupErpV3Api', ReasonString);
        }
      })
      .catch((err) => {
        //console.log('ERROR lookupErpV3Api', err);
      });


    // const userToken = await getUserToken();

    // if (userToken) {
    //   await this.setState((oldState) => {
    //     return {
    //       otherPaymentType: userToken,
    //     };
    //   });
    // }
  };


  _getCashAccount = async () => {
    //21.หาสมุดเงินสด (Bk000500)
    const LoginGUID = await getLoginGuID();


    let dataObj2 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': "Bk000500",
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    await lookupErpV3Api(dataObj2)
      .then(async (v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          let responseData = JSON.parse(ResponseData);
          await this._setState('cashaccount', Object.values(responseData.Bk000500));
          console.log('_getCashAccount', Object.values(responseData.Bk000500));

        } else {
        }
      })
      .catch((err) => {
      });

  };


  _getQRContent = async () => {
    //24.หาประเภท QR Code (Bk000620)
    const LoginGUID = await getLoginGuID();
    let dataObj2 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': BPAPUS_LOOKUP_QR_CODE,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "and QRCT_KEY > 0",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    await lookupErpV3Api(dataObj2)
      .then(async (v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;

        if (ResponseCode == 200) {
          let responseData = JSON.parse(ResponseData);
          const qrContentItems = Object.values(responseData.Bk000620);
          await this._setState('qrContent', qrContentItems);
          if (!this.state.qrContentItem && qrContentItems.length > 0) {
            await this._setState('qrContentItem', qrContentItems[0].QRCT_KEY);
            await this._setState('qrContentName', qrContentItems[0].QRCT_NAME || '');
          }
          //     console.log("Bk000620" , result); // Log the result to see if it's null or has any issues
          //     console.log("Bk000620" , Object.values(responseData.Bk000620)); // Log the result to see if it's null or has any issues
          //  this.state.qrContent = Object.values(responseData.Bk000620);
        } else {
        }
      })
      .catch((err) => {
      });

  };



  _getRemainOtipn_Under = async () => {
    //82.วิธีจัดการการจ่ายชำระขาด (Rm001200)
    const LoginGUID = await getLoginGuID();


    let dataObj2 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': BPAPUS_REMAIN_OPTION_UNDER,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    await lookupErpV3Api(dataObj2)
      .then(async (v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          let responseData = JSON.parse(ResponseData);
          await this._setState('reMainOption_Under', Object.values(responseData.Rm001200));
        } else {
        }
      })
      .catch((err) => {
      });
  };



  _getRemainOtipn_Over = async () => {
    //83.วิธีจัดการการจ่ายชำระเกิน (Rm001300)
    const LoginGUID = await getLoginGuID();


    let dataObj2 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': BPAPUS_REMAIN_OPTION_OVER,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    await lookupErpV3Api(dataObj2)
      .then(async (v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          let responseData = JSON.parse(ResponseData);
          await this._setState('reMainOption_Over', Object.values(responseData.Rm001300));
        } else {
        }
      })
      .catch((err) => {
      });

  };


  _getbankAccount = async () => {
    const LoginGUID = await getLoginGuID();


    let dataObj2 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': "Bk000200",
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    let WL_CODE = null;
    await lookupErpV3Api(dataObj2)
      .then(async (v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          console.log("responseData.Bk000200 1 ", JSON.parse(ResponseData));
          let responseData = JSON.parse(ResponseData);
          // console.log("responseData.Bk000200 2", responseData.Bk000200);

          //this.state.otherPaymentType = Object.values(responseData.Ps000103);
          await this._setState('listbankAccountItem', Object.values(responseData.Bk000200));
          // console.log("responseData.Bk000200 3", Object.values(responseData.Bk000200));
          // console.log("this.state.otherPaymentType", this.state.otherPaymentType);

        } else {
          //console.log('ERROR lookupErpV3Api', ReasonString);
        }
      })
      .catch((err) => {
        //console.log('ERROR lookupErpV3Api', err);
      });



  };




  // let dataObj2 = {
  //   'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
  //   'BPAPUS-LOGIN-GUID': LoginGUID,
  //   'BPAPUS-FUNCTION': BPAPUS_FUNCTION_WH_CODE,
  //   'BPAPUS-PARAM': '',
  //   'BPAPUS-FILTER': "and WL_KEY = '" + vanConfig.VANCNF_WL + "'",
  //   'BPAPUS-ORDERBY': '',
  //   'BPAPUS-OFFSET': '0',
  //   'BPAPUS-FETCH': '0',
  // };
  // let WL_CODE = null;
  // await lookupErpV3Api(dataObj2)
  //   .then((v) => {
  //     const { ResponseData, ResponseCode, ReasonString } = v.data;
  //     if (ResponseCode == 200) {
  //       console.log(JSON.parse(ResponseData));
  //       let responseData = JSON.parse(ResponseData);
  //       WL_CODE = responseData.Wh000220
  //         ? responseData.Wh000220[0].WL_CODE
  //         : null;
  //     } else {
  //       console.log('ERROR lookupErpV3Api', ReasonString);
  //     }
  //   })
  //   .catch((err) => {
  //     console.log('ERROR lookupErpV3Api', err);
  //   });

  // _setcashin = async (value) => {

  //   console.log('Bazzz>', value);
  //   await this._setState('paymentType', value);
  //   console.log('Bazzz>', this.state.paymentType);

  //   this.state.paymentType === 'cheque'
  //     ? this._setEnabledPaymentCheque()
  //     : this._setDisabledPaymentCheque();
  //   this.state.paymentType === 'transfer'
  //     ? this._setEnabledPaymentTransfer()
  //     : this._setDisabledPaymentTransfer();
  // };

  _setPaymentType = async (value) => {
    const nextPaymentTypes = new Set(this.state.groupofpaymentType);

    if (nextPaymentTypes.has(value)) {
      nextPaymentTypes.delete(value);
    } else {
      nextPaymentTypes.add(value);
    }

    if (value === 'transfer') {
      nextPaymentTypes.delete('qrcode');
    }

    if (value === 'qrcode') {
      nextPaymentTypes.delete('transfer');
    }

    await this.setState({
      paymentType: nextPaymentTypes.has(value) ? value : null,
      groupofpaymentType: nextPaymentTypes,
    });

    // this.state.paymentType === 'cheque'
    //   ? this._setEnabledPaymentCheque()
    //   : this._setDisabledPaymentCheque();
    // this.state.paymentType === 'transfer'
    //   ? this._setEnabledPaymentTransfer()
    //   : this._setDisabledPaymentTransfer();
    // this.state.paymentType === 'qrcode'
    //   ? this._setEnabledPaymentTransfer()
    //   : this._setDisabledPaymentTransfer();
  };

  _getReadableErrorMessage = (error, fallbackMessage) => {
    if (!error) {
      return fallbackMessage;
    }

    if (typeof error === 'string') {
      return error;
    }

    if (typeof error?.message === 'string' && error.message.trim()) {
      return error.message.trim();
    }

    if (typeof error?.errorMessage === 'string' && error.errorMessage.trim()) {
      return error.errorMessage.trim();
    }

    return fallbackMessage;
  };

  _getCustomerTaxId = () => {
    const customerItem = this.props.customer?.item || {};
    const candidates = [
      customerItem.INFO?.ADDB_TAX_ID,
      customerItem.INFO?.TAXID,
      customerItem.CUS_ADDB?.ADDB_TAX_ID,
      customerItem.CUS_ADDB?.TAXID,
      customerItem.TEMP_CUS?.ADDB_TAX_ID,
      customerItem.TEMP_CUS?.TAXID,
    ]
      .map(value => String(value || '').trim())
      .filter(Boolean);

    return candidates.find(value => /\d{13}/.test(value)) || candidates[0] || null;
  };

  _logMissingCustomerTaxId = () => {
    const customerItem = this.props.customer?.item || {};
    console.log('_getCustomerTaxId missing', {
      infoAddbTaxId: customerItem.INFO?.ADDB_TAX_ID || null,
      infoTaxId: customerItem.INFO?.TAXID || null,
      cusAddbTaxId: customerItem.CUS_ADDB?.ADDB_TAX_ID || null,
      cusAddbTaxIdAlt: customerItem.CUS_ADDB?.TAXID || null,
      tempCusTaxId: customerItem.TEMP_CUS?.TAXID || null,
      tempCusAddbTaxId: customerItem.TEMP_CUS?.ADDB_TAX_ID || null,
    });
  };

  _prepareKtbSession = async ({ showError = false, setQrRefer = false } = {}) => {
    const customerTaxId = this._getCustomerTaxId();

    if (!customerTaxId) {
      this._logMissingCustomerTaxId();
      const errorMessage = 'ไม่พบ ADDB_TAX_ID';
      if (showError) {
        this._setState('errorMessage', errorMessage);
      }
      return { ok: false, errorMessage };
    }

    if (this.state.accessToken && this.state.dscfTxnId) {
      if (setQrRefer) {
        await this.props.setHeaderProcessedVdiQRRefer(this.state.dscfTxnId);
      }
      return { ok: true, accessToken: this.state.accessToken, dscfTxnId: this.state.dscfTxnId };
    }

    const auth = await this.props.auth();
    const { txnStatusCode, message, result } = auth || {};

    if (txnStatusCode !== 200 || !result?.accessToken) {
      const errorMessage = this._getReadableErrorMessage(message, 'ไม่สามารถเชื่อมต่อ KTB ได้');
      if (showError) {
        this._setState('errorMessage', errorMessage);
      }
      return { ok: false, errorMessage };
    }

    const accessToken = result.accessToken;
    await this._setState('accessToken', accessToken);

    const subscription = await this.props.subscription(
      {
        dealerTaxId: customerTaxId,
        sponsorTaxId: '9100990000161',
      },
      accessToken,
    );

    const dscfTxnId = subscription?.result?.dscfTxnId || null;
    await this._setState('dscfTxnId', dscfTxnId);

    if (!dscfTxnId) {
      const errorMessage = 'ลูกค้าไม่ได้เป็นสมาชิก';
      if (showError) {
        this._setState('errorMessage', errorMessage);
      }
      return { ok: false, errorMessage };
    }

    if (setQrRefer) {
      await this.props.setHeaderProcessedVdiQRRefer(dscfTxnId);
    }

    return { ok: true, accessToken, dscfTxnId };
  };

  _tryKtbQrFallback = async () => {
    const prepared = await this._prepareKtbSession({ setQrRefer: true });

    if (!prepared.ok) {
      console.log('_tryKtbQrFallback unavailable', prepared.errorMessage);
      return false;
    }

    console.log('_tryKtbQrFallback prepared', prepared.dscfTxnId);
    await this._qrcodeKTB();
    return true;
  };

  _checkKTBMember = async () => {
    this._setState('isLoading', true);
    this._setState('errorMessage', null);
    this._setState('successMessage', null);
    this._setState('buttonDisabled', true);

    const prepared = await this._prepareKtbSession({
      showError: this.state.paymentType === 'ktb',
      setQrRefer: this.state.paymentType === 'ktb',
    });

    if (prepared.ok) {
      this._setState('errorMessage', null);
      this._setState('buttonDisabled', false);
      this._setState('isLoading', false);
      // เวฟ
      const setting = await getSettingConfig();
      if (setting && setting.baseUrl) {
        Request.setHeaders({
          vanCNFMachine: setting.vanCNFMachine
        });
        Request.setBaseUrl(setting.baseUrl)
      }
      // เวฟ
      await this._orderCash1(null);
    } else if (prepared.errorMessage) {
      this._setState('buttonDisabled', false);
      this._setState('isLoading', false);
      return false;
    } else {
      await this._orderCash1(null)
    }
  };

  _qrcodeKTB = async () => {
    this._setState('isLoading', true);
    this._setState('errorMessage', null);
    this._setState('successMessage', null);
    this._setState('buttonDisabled', true);

    const { RESPONSE_DATETIME, RESULT_DATA } = this.props.processResult;
    const { RESULT } = RESULT_DATA;
    const { ITEMS } = RESULT;

    const customerTaxId = this._getCustomerTaxId();

    if (!customerTaxId) {
      this._logMissingCustomerTaxId();
      this._setState('errorMessage', 'ไม่พบ ADDB_TAX_ID');
      this._setState('buttonDisabled', false);
      this._setState('isLoading', false);
      return false;
    }

    if (!this.state.dscfTxnId) {
      this._setState('errorMessage', 'ลูกค้าไม่ได้เป็นสมาชิก');
      this._setState('buttonDisabled', false);
      this._setState('isLoading', false);
      return false;
    }

    const {
      VDI_REF,
      VDI_AF_DISC,
      VDI_AF_DISC_VAT_EXP_VAT,
      VDI_MACHINE,
    } = this.props.order.headerProcessed;
    if (this.state.dscfTxnId && VDI_REF) {
      console.log('VDI_REF+++ ', VDI_REF);

      const data = {
        amount: this.props.order.headerProcessed.VDI_AMOUNT,
        currencyCode: 'THB',
        dscfTxnId: this.state.dscfTxnId,
        ref2: VDI_REF,
      };
      const getQRCode = await this.props.getQRCode(
        data,
        this.state.accessToken,
      );
      const { txnStatusCode, statusCode } = getQRCode;
      if (txnStatusCode === 200 && statusCode === '10') {
        this._setState('buttonDisabled', false);
        this._setState('isLoading', false);

        const newArray = ITEMS.map((item) => {
          return {
            itemId: item.VTRD_CODE,
            itemName: item.VTRD_NAMES,
            taxTypeCode: item.VTRD_VAT_TY === 3 ? 'VAT' : 'FRE',
            taxRate: item.VTRD_VAT_TY === 3 ? 7 : 0,
            basisAmount: item.VTRD_AF_SELL,
            sellingUOM: item.sellingUOM,
            stockingQty: item.stockingQty,
            packSize: item.packsize,
            unitPrice: item.VTRD_U_PRC,
            quantity: item.VTRD_QTY,
            taxAmount: item.VTRD_VAT,
            totalAmount: item.VTRD_VALUES,
            itemUpc: item.VTRD_CODE,
            itemCat: 'ทดสอบ Cat',
          };
        });

        function yyyymmdd(RESPONSE_DATETIME) {
          var x = new Date(RESPONSE_DATETIME);
          var y = x.getFullYear().toString();
          var m = (x.getMonth() + 1).toString();
          var d = x.getDate().toString();
          d.length == 1 && (d = '0' + d);
          m.length == 1 && (m = '0' + m);
          var yyyymmdd = y + m + d;
          return yyyymmdd;
        }

        // const paymentDueTime = moment(RESPONSE_DATETIME)
        //   .format('LT')
        //   .replace(':', '');
        let s = new Date(RESPONSE_DATETIME);
        let hours = s.getHours().toString();
        let minutes = s.getMinutes().toString();

        if (hours.length == 1) {
          hours = '0' + hours;
        }
        if (minutes.length == 1) {
          minutes = '0' + minutes;
        }
        const paymentDueTime = hours + minutes;

        const paymentDueDate = yyyymmdd(RESPONSE_DATETIME);
        const issueDtm = moment(RESPONSE_DATETIME).format(
          'YYYY-MM-DD HH:mm:ss',
        );

        Navigator.navigate('QRCODE_KTB', {
          data: {
            dscfTxnId: this.state.dscfTxnId,
            edcInvoiceNumber: '',
            billerId: '',
            //  sponsorTaxId: this.state.userToken.COMPANYINFO.CMPNY_REG_NO,
            sponsorTaxId: '9100990000161',
            invoice: {
              invoiceHdr: {
                invoiceId: VDI_REF, // (Create-Response.json)
                outstandingAmount: VDI_AF_DISC, // (Create-Response.json)
                dealerTaxId: customerTaxId, // (Create-Response.json)
                invoiceTaxAmount: VDI_AF_DISC_VAT_EXP_VAT,
                //invoiceAmount: this.props.order.headerProcessed.VDI_AMOUNT,
                invoiceAmount: VDI_AF_DISC,
                terminalId: VDI_MACHINE,
                salesMethod: 'FF', // fix
                paidAmount: 0, // fix
                documentType: 'INV', // fix
                invoiceTaxRate: 7, // fix
                staffId: VDI_MACHINE,
                paymentDueTime: paymentDueTime,
                paymentDueDate: paymentDueDate,
                storeId: VDI_MACHINE,
                currencyCode: 'THB', //fix
                paidAmountDtl: [],
                issueDtm: issueDtm,
              },
              invoiceDtl: {
                items: newArray,
              },
            },
            ref3: this.state.dscfTxnId,
            ref2: '',
            ref1: this.state.dscfTxnId,
            edcApproveCode: '',
          },
          accessToken: this.state.accessToken,
          qrcodeVaule: getQRCode.result,
          totalPrice: this.props.order.headerProcessed.VDI_AF_DISC || 0,
        });
      }
    } else {
      this._setState('buttonDisabled', false);
      this._setState('isLoading', false);
    }
  };

  _renderItem = (item, key) => (
    <TouchableOpacity key={key} style={[item.buttonStyle, {justifyContent: "center", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16}]} onPress={() => {
        this._onPress(item);
      }} disabled={item.title === 'ตกลง' ? this.state.buttonDisabled : false} activeOpacity={0.7}>
              <Text style={item.titleStyle}>{item.title}</Text>
            </TouchableOpacity>
  );

  _renderItemRemainOption = (item, key) => (
    <TouchableOpacity key={key} style={[item.buttonStyle, {justifyContent: "center", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16}]} onPress={() => {
        this._onPressRemainOption(item);
      }} disabled={item.title === 'ตกลง' ? this.state.buttonDisabled : false} activeOpacity={0.7}>
              <Text style={item.titleStyle}>{item.title}</Text>
            </TouchableOpacity>
  );



  _onPress = async (item) => {

    const totalPrice = (this.props.order.header.VDI_AF_DISC !== null && this.props.order.header.VDI_AF_DISC !== undefined && !Number.isNaN(this.props.order.header.VDI_AF_DISC))
      ? this.props.order.header.VDI_AF_DISC
      : 0;


    this._setState('errorMessage', '');
    console.log("item methodType", item)

    console.log("item methodType", item.methodType)
    console.log("item item.methodName", item.methodName)
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


          let payin = (this.state.groupofpaymentType.has('cash') ? Number(this.state.cashin) : 0) +
            (this.state.groupofpaymentType.has('transfer') ? Number(this.state.paymentTransfer.tranFerin) : 0) +
            (this.state.groupofpaymentType.has('qrcode') ? Number(this.state.qrin) : 0) +
            (this.state.groupofpaymentType.has('cheque') ? Number(this.state.paymentCheque.chequein) : 0) +
            (this.state.groupofpaymentType.has('other') ? Number(this.state.otherin) : 0);


          if (this.state.remainoptiontItem === null) {
            if (
              Number(payin) > Number(this.props.order.header.VDI_AF_DISC) &&
              Number(this.props.order.header.VDI_AF_DISC - payin) <= Number(this.state.differBy)

            ) {
              await this._setState('reMainOption1', this.state.reMainOption_Over);
              await this._setState('differValue', (Number(payin - this.props.order.header.VDI_AF_DISC).toFixed(2)));
              if (this.state.remainConfirm == false) {
                await this._setState('isDialogOpen', true);
                return false;
              }
            } else if (
              Number(payin) < Number(this.props.order.header.VDI_AF_DISC) &&
              Number(this.state.differBy) >= Number(this.props.order.header.VDI_AF_DISC - payin)
            ) {
              await this._setState('reMainOption1', this.state.reMainOption_Under);
              await this._setState('differValue', (Number(payin - this.props.order.header.VDI_AF_DISC).toFixed(2)));
              if (this.state.remainConfirm == false) {
                await this._setState('isDialogOpen', true);
                return false;
              }
            } else if (Number(payin) === Number(this.props.order.header.VDI_AF_DISC)) {
              await this._setState('remainConfirm', false);
              if (this.state.remainConfirm == false) {
                await this._setState('isDialogOpen', false);
              }
            }
          }

          console.log('this.state.reMainOption OV ', this.state.reMainOption_Over);
          console.log('this.state.reMainOption UD ', this.state.reMainOption_Under);



          if (this.state.groupofpaymentType.has('qrcode') && this.state.qrConfirm == false) {

            if (
              this.state.groupofpaymentType.has('qrcode') && (this.state.qrin === null || Number(this.state.qrin) <= 0)
            ) {
              await this._setState('isQRCodeDialogOpen', false);

              this._setState('errorMessage', 'กรุณาระบุจำนวนเงิน (QrCode)');
              return false;
            }

            if (
              this.state.groupofpaymentType.has('qrcode') && (this.state.qrContentItem === null)
            ) {
              this._setState('errorMessage', 'กรุณาระบุธนาคาร (QrCode) ');
              return false;
            }
            const isValid = await this._validateAll(null);
          } else {
            console.log("_orderCash", item.methodType)
            if (this.state.remainConfirm == false) {
              const isValid = await this._validateAll(null);
              if (isValid) {
                await this._orderCash1(null);
              }
            }
          }

        }
        // else if (this.state.groupofpaymentType.has('qrcode')) {
        //   //  await this._requestQrCode();
        //   //   console.log('this.state.qrin', this.state.qrin ? this.state.qrin.toString() : "0");





        //   // await this._setState('qrCode', this.state.qrin ? this.state.qrin.toString() : "0");
        //   // await this._setState('isQRCodeDialogOpen', true);
        //   // await this._orderCash();
        //   // return;
        // }
      } else if (item.methodName === 'cancel') {

        Navigator.back();
      }
    }
    Keyboard.dismiss();
  };


  _onPressRemainOption = async (item) => {
    this._setState('errorMessage', '');
    console.log("this.state.remainoptiontItem", this.state.remainoptiontItem)
    // console.log("item item.methodName", item.methodName)

    //this.state.paymentType = "qrcode"   // เอาออกด้วย
    if (item.methodType === 'function') {
      if (item.methodName === 'confirm') {
        if (this.state.remainoptiontItem === null) {
          this._setState('errorMessage', 'กรุณาระบุหมายเหตุการชำระ');
          return;
        }

        if (

          this.state.groupofpaymentType.has('cash') ||
          this.state.groupofpaymentType.has('cheque') ||
          this.state.groupofpaymentType.has('qrcode') ||
          this.state.groupofpaymentType.has('transfer') ||
          this.state.groupofpaymentType.has('other')
        ) {
          // console.log("_orderCash", item.methodType)
          // await this._setState('remainoptiontItem', false);
        }

      } else if (item.methodName === 'cancel') {

        this._setState('remainoptiontItem', null);
        this._setState('remainConfirm', false);
        console.log("this.state.remainoptiontItem cancel", this.state.remainoptiontItem)
        console.log("remainConfirm cancel", this.state.remainConfirm)
        // this._removeSettingConfig();
      }
      await this._setState('isDialogOpen', false);
    }
    Keyboard.dismiss();
  };



  _getCurrentPosition = async () => {
    try {
      await getCurrentPosition();
    } catch (error) {
      this._setState('errorMessage', 'ไม่สามารถจับตำแหน่ง GPS ได้');
      return false;
    }

    return true;
  };


  _validateAll = async (_value) => {

      this._setState('errorMessage', '');

    if (
      this.state.groupofpaymentType.has('cash') && this.state.userToken.VANCONFIG.VANCNF_ENABLE_CASH == 1
    ) {
      console.log('_orderCash cash ');
      this._setState('errorMessage', 'ไม่สามารถชำระด้วยเงินสด');
      return false;
    }
    if (this.state.groupofpaymentType.has('cash') && (this.state.cashin === null || Number(this.state.cashin) <= 0)) {
     // await this._setState('remainConfirm', true);
      await this._setState('errorMessage', 'กรุณาระบุจำนวนเงิน (เงินสด)');
      return false;
    }


    if ( this.state.groupofpaymentType.has('transfer') && !this._validatePaymentByTransfer())
    {
      return false;
    }

    // alert (this.state.groupofpaymentType.has('qrcode') && (this.state.qrin === null || Number(this.state.qrin) <= 0))

    


    if (
      this.state.groupofpaymentType.has('cheque') &&
      this.state.userToken.VANCONFIG.VANCNF_CHEQUE == 1
    ) {
      this._setState('errorMessage', 'ไม่สามารถชำระด้วยเช็ค');
      return false;
    }

    if (
      this.state.groupofpaymentType.has('cheque') &&
      !this._validatePaymentByCheque()
    )
    return false;


    if (
      this.state.groupofpaymentType.has('other') &&
      !this._validatePaymentByOther()
    )
    return false;

      let payin = (this.state.groupofpaymentType.has('cash') ?  Number(this.state.cashin) : 0) +
      (this.state.groupofpaymentType.has('transfer') ? Number(this.state.paymentTransfer.tranFerin) : 0) +
      (this.state.groupofpaymentType.has('qrcode') ? Number(this.state.qrin) : 0) +
      (this.state.groupofpaymentType.has('cheque') ? Number(this.state.paymentCheque.chequein) : 0) +
      (this.state.groupofpaymentType.has('other') ? Number(this.state.otherin) : 0);

    console.log('_orderCash this.state.paymentType ', this.state.paymentType);
    console.log('SUNNNMMM payin', payin);
    console.log('SUNNNMMM Number(this.props.order.header.VDI_AF_DISC) - this.state.differBy', Number(this.props.order.header.VDI_AF_DISC) - this.state.differBy);
    console.log('SUNNNMMM VDI_AF_DISC', Number(this.props.order.header.VDI_AF_DISC));

    // if (this.state.groupofpaymentType.has('qrcode')) {
    //   await this._setState('isQRCodeDialogOpen', false);

    //   //await this._qrcodePayment();
    //   return;
    // }

    if (Number(payin) > Number(this.props.order.header.VDI_AF_DISC) + this.state.differBy) {

      this._setState('errorMessage', 'ไม่สามารถชำระเกินยอดเงินทั้งหมด ' + (Number(this.props.order.header.VDI_AF_DISC)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' บาท');
      setTimeout(() => {
      }, 5000); // หน่วงเวลา 5 วินาที
      return false;
    }

    if (Number(payin) < Number(this.props.order.header.VDI_AF_DISC) - this.state.differBy) {
      this._setState('errorMessage', 'ยอดชำระยังไม่ครบ กรุณาตรวจสอบ ');
            setTimeout(() => {
      }, 5000); // หน่วงเวลา 5 วินาที
      return false;
    }

    console.log('_remain_option1   ', (Number(payin).toFixed(2)));
    console.log('_remain_option1   ', (Number(this.props.order.header.VDI_AF_DISC).toFixed(2)));
    console.log('_remain_option1   ', (Number(payin - this.props.order.header.VDI_AF_DISC).toFixed(2)));

    // if ( this.state.remainConfirm == false) {
    //   await this._requestQrCode(this.state.qrin ? this.state.qrin.toString() : "0");
    // } else {
    //   await this._orderCash();
    // }


    if (this.state.groupofpaymentType.has('qrcode') && this.state.qrConfirm == false) {
      await this._requestQrCode(this.state.qrin ? this.state.qrin.toString() : '0');
      return false;
    }


    // Bazz เอาออกด้วย
    console.log('ผ่านทุกเงื่อนไข ');

    //return;
    // Bazz เอาออกด้วย
    return true; // ✅ ผ่านทุกเงื่อนไข
   
  }

  _orderCash1 = async () => {
    try {


      this._setState('isLoading', true);
      this._setState('errorMessage', null);
      this._setState('successMessage', null);
      this._setState('buttonDisabled', true);

      if (this.state.groupofpaymentType.has('cheque')) {
        await this.props.setHeaderProcessedVdiChequeBank(
          this.state.paymentCheque.bankFileItem,
        );

        console.log("this.state.paymentCheque.chequeDate >>>", JSON.stringify(this.state.paymentCheque.chequeDate));
        console.log("this.state.paymentCheque.chequeDate >>>", JSON.stringify(moment(this.state.paymentCheque.chequeDate, 'DD/MM/YYYY')
          .add(1, 'days')
          .toJSON()));

        await this.props.setHeaderProcessedVdiChequeDate(
          moment(this.state.paymentCheque.chequeDate, 'DD/MM/YYYY')
            .add(1, 'days')
            .toJSON(),
        );
        await this.props.setHeaderProcessedVdiChequeNo(
          this.state.paymentCheque.chequeNo,
        );
      }

      if (this.state.groupofpaymentType.has('transfer')) {
        await this.props.setHeaderProcessedVdiBankTransfer(
          this.state.paymentTransfer.bankAccountItem,
        );
      }

      if (this.state.groupofpaymentType.has('qrcode')) {
        await this.props.setHeaderProcessedVdiBankTransfer(
          this.state.qrContentItem,
        );
      }

      console.log('_orderCash this.state.dscfTxnId ', this.state.dscfTxnId);
      if (
        this.state.groupofpaymentType.has('cash') ||
        this.state.groupofpaymentType.has('cheque') ||
        this.state.groupofpaymentType.has('transfer') ||
        this.state.groupofpaymentType.has('other') ||
        this.state.groupofpaymentType.has('qrcode')
        //this.state.paymentType === 'cash' || this.state.paymentType === 'qrcode'
      ) {

        //console.log('_remain_option2 ', _remain_option);
        console.log('this.state.remainoptiontItem ', this.state.remainoptiontItem);


        const { VANCONFIG } = await getUserToken();
        const v3GUID = await getLoginGuID();

        // console.log("this.state.paymentCheque.chequeDate >>>", JSON.stringify(this.state.paymentCheque.chequeDate));
        // console.log("this.state.paymentCheque.chequeDate 4 >>>", moment(this.state.paymentCheque.chequeDate, "DD/MM/YYYY").utc().format("YYYYMMDDTHH:mm:ss.SSS[Z]"));

        // console.log("this.state.paymentCheque.>>>", JSON.stringify(this.state.paymentCheque));
        console.log("istbankAccountItem >>>", JSON.stringify(this.state.qrin ? this.state.qrContentItem : "0"));

        console.log("istbankAccountItem >>>", JSON.stringify(this.state.qrin ? this.state.qrin.toString() : "0"));
        console.log("istbankAccountItem qrContent >>>", JSON.stringify(this.state.qrContent));

        console.log("listbankAccountItem >>>", JSON.stringify(this.state.qrContent.filter(item => item.QRCT_KEY === this.state.qrContentItem)[0]?.BNKAC_CODE));
        console.log("listbankAccountItem >>>", JSON.stringify(this.state.qrContent.filter(item => item.QRCT_KEY === this.state.qrContentItem)[0]?.BNKAC_NAME));


        this.props.order.paymentMethod = [{
          "CASHAC_CODE": this.state.cashin > 0 ? this.state.cashaccount.filter(item => item.CASHAC_KEY === this.state.userToken.VANCONFIG.VANCNF_CASHAC)[0]?.CASHAC_CODE || "" : "",
          "CASHAC_NAME": this.state.cashin > 0 ? this.state.cashaccount.filter(item => item.CASHAC_KEY === this.state.userToken.VANCONFIG.VANCNF_CASHAC)[0]?.CASHAC_NAME || "" : "",
          "CASHAC_AMT": this.state.cashin > 0 ? this.state.cashin.toString() : "0",


          // "BNKAC_CODE": "",
          // "BNKAC_NAME":  "",
          // "BNKAC_AMT": "0",


          // "QRCT_CODE": this.state.paymentTransfer.tranFerin > 0 ? this.state.paymentTransfer.bankAccountItem : this.state.qrin > 0 ? this.state.qrContent.filter(item => item.QRCT_KEY === '103')[0].QRCT_CODE || "" : "",
          // "QRCT_NAME": this.state.paymentTransfer.tranFerin > 0 ? this.state.listbankAccountItem.filter(item => item.BNKAC_CODE === this.state.paymentTransfer.bankAccountItem)[0].BNKAC_NAME || "" : this.state.qrin > 0 ? this.state.qrContent.filter(item => item.QRCT_KEY === '103')[0].QRCT_NAME || "" : "", //;      [this.state.paymentTransfer.bankAccountItem] , //    "บัญชีกระแสรายวัน ธ.กรุงเทพฯ สาขาตลิ่งชัน #003-1-91234-5",
          // "QRCT_AMT": this.state.paymentTransfer.tranFerin > 0 ? this.state.paymentTransfer.tranFerin.toString() : this.state.qrin > 0 ? this.state.qrin.toString() : "0",

          "BNKAC_CODE": this.state.paymentTransfer.tranFerin > 0 ? this.state.paymentTransfer.bankAccountItem : this.state.qrin > 0 ? this.state.qrContent.filter(item => item.QRCT_KEY === this.state.qrContentItem)[0]?.BNKAC_CODE || "" : "",
          "BNKAC_NAME": this.state.paymentTransfer.tranFerin > 0 ? this.state.listbankAccountItem.filter(item => item.BNKAC_CODE === this.state.paymentTransfer.bankAccountItem)[0]?.BNKAC_NAME || "" : this.state.qrin > 0 ? this.state.qrContent.filter(item => item.QRCT_KEY === this.state.qrContentItem)[0]?.BNKAC_NAME || "" : "", //;      [this.state.paymentTransfer.bankAccountItem] , //    "บัญชีกระแสรายวัน ธ.กรุงเทพฯ สาขาตลิ่งชัน #003-1-91234-5",
          "BNKAC_AMT": this.state.paymentTransfer.tranFerin > 0 ? this.state.paymentTransfer.tranFerin.toString() : this.state.qrin > 0 ? this.state.qrin.toString() : "0",


          "QRCT_CODE": "",
          "QRCT_NAME": "",
          "QRCT_AMT": "0",

          // "QRCT_CODE": this.state.qrin > 0 ? this.state.qrContent.filter(item => item.QRCT_KEY === this.state.qrContentItem)[0]?.QRCT_KEY || "" : "",
          // "QRCT_NAME": this.state.qrin > 0 ? this.state.qrContent.filter(item => item.QRCT_KEY === this.state.qrContentItem)[0]?.QRCT_CONTENT || "" : "",
          // "QRCT_AMT": this.state.qrin > 0 ? this.state.qrin.toString() : "0",


          "CQIN_1_OWNER": this.state.paymentCheque.chequein > 0 ? this.props.order.header.AR_NAME.toString() : "",
          "CQIN_1_BANK_INTL": this.state.paymentCheque.chequein > 0 ? this.props.masterData.bankFileListItems.filter(item => item.BANK_KEY === this.state.paymentCheque.bankFileItem.toString())[0].BANK_INITIAL || "" : "",
          "CQIN_1_BRANCH": "",
          "CQIN_1_CHEQUE_NO": this.state.paymentCheque.chequein > 0 ? this.state.paymentCheque.chequeNo.toString() : "",
          "CQIN_1_CHEQUE_DD": (this.state.paymentCheque.chequein > 0 && this.state.paymentCheque.chequeDate) ? moment(this.state.paymentCheque.chequeDate, "DD/MM/YYYY").format("YYYYMMDDTHH:mm:ss.SSS[Z]") : "",
          "CQIN_1_AMT": this.state.paymentCheque.chequein > 0 ? this.state.paymentCheque.chequein.toString() : "0",

          "CQIN_2_OWNER": "",
          "CQIN_2_BANK_INTL": "",
          "CQIN_2_BRANCH": "",
          "CQIN_2_CHEQUE_NO": "",
          "CQIN_2_CHEQUE_DD": "",
          "CQIN_2_AMT": "0",
          "CQIN_3_OWNER": "",
          "CQIN_3_BANK_INTL": "",
          "CQIN_3_BRANCH": "",
          "CQIN_3_CHEQUE_NO": "",
          "CQIN_3_CHEQUE_DD": "",
          "CQIN_3_AMT": "0",

          "PMT_1_CODE": this.state.otherin > 0 ? this.state.otherPaymentType.filter(item => item.PMT_KEY === this.state.otherPaymentItem)[0]?.PMT_CODE || "" : "", // "002",
          "PMT_1_NAME": this.state.otherin > 0 ? this.state.otherPaymentType.filter(item => item.PMT_KEY === this.state.otherPaymentItem)[0]?.PMT_NAME || "" : "", //  "คูปองส่งเสริมการขาย",
          "PMT_1_AMT": this.state.otherin > 0 ? this.state.otherin.toString() : "0",
          "PMT_2_CODE": "",
          "PMT_2_NAME": "",
          "PMT_2_AMT": "0",

          "REMAIN_OPTION": this.state.remainoptiontItem != null ? this.state.remainoptiontItem : ""
        }];

        console.log('_remain_option3 ', this.state.remainoptiontItem);
        console.log("this.props.order.paymentMethod >>>", JSON.stringify(this.props.order.paymentMethod));

        // Bazz เอาออกด้วย
        //return;
        // Bazz เอาออกด้วย


        await this.props.createOrderSaleV3(
          genenrateOrderForCreateToServer(
            this.props.order,
            this.props.mile.item.mileage,
            this.props.geolocation.position,
            // null,
          ),
          v3GUID,
          VANCONFIG,
          'สด'
        );
      } else {
        console.log('_orderCash asdassa ', this.state.dscfTxnId);
        await this.props.orderCreateCash(
          genenrateOrderForCreateToServer(
            this.props.order,
            this.props.mile.item.mileage,
            this.props.geolocation.position,
            this.state.dscfTxnId,
          ),
        );
      }

      // if (this.props.order.header.VDI_USER_REF === null) {
      //   await this.props.orderCreateCash(
      //     genenrateOrderForCreateToServer(
      //       this.props.order,
      //       this.props.mile.item.mileage,
      //       this.props.geolocation.position,
      //     ),
      //   );
      // } else {
      //   await this.props.orderUpdateCash(
      //     genenrateOrderForUpdateToServer(
      //       genenrateOrderForCreateToServer(
      //         this.props.order,
      //         this.props.mile.item.mileage,
      //         this.props.geolocation.position,
      //       ),
      //       this.props.order.header,
      //     ),
      //   );
      // }

      if (
        this.props.checkin.item.photo !== null &&
        this.props.checkin.item.isSubmit === false
      ) {
        await this._orderAttachImage();
      }

      if (
        this.props.mile.item.photo !== null &&
        this.props.mile.item.isSubmit === false
      ) {
        await this._orderMileAttachImage();
      }

      // if (this.state.paymentType === 'ktb') {
      //   console.log(' await this._qrcodeKTB(); ');
      //   await this._qrcodeKTB();
      //   return;
      // }

      if (this.state.dscfTxnId) {
        console.log('_orderCash this.state.dscfTxnId ', this.state.dscfTxnId);
        const {
          VDI_REF,
          VDI_AF_DISC,
          VDI_AF_DISC_VAT_EXP_VAT,
          VDI_MACHINE,
        } = this.props.order.headerProcessed;

        const { RESPONSE_DATETIME, RESULT_DATA } = this.props.processResult;
        const { RESULT } = RESULT_DATA;
        const { ITEMS } = RESULT;

        if (VDI_REF) {
          console.log('_orderCash VDI_REF');
          console.log('ITEMS', ITEMS);
          const newArray = ITEMS.map((item) => {
            return {
              itemId: item.VTRD_CODE,
              itemName: item.VTRD_NAMES,
              taxTypeCode: item.VTRD_VAT_TY === 3 ? 'VAT' : 'FRE',
              taxRate: item.VTRD_VAT_TY === 3 ? 7 : 0,
              basisAmount: item.VTRD_AF_SELL,
              sellingUOM: item.sellingUOM,
              stockingQty: item.stockingQty,
              packSize: item.packsize,
              unitPrice: item.VTRD_U_PRC,
              quantity: item.VTRD_QTY,
              taxAmount: item.VTRD_VAT,
              totalAmount: item.VTRD_VALUES,
              itemUpc: item.VTRD_CODE,
              itemCat: 'ทดสอบ Cat',
            };
          });

          console.log('RESPONSE_DATETIME: ', RESPONSE_DATETIME);

          function yyyymmdd(RESPONSE_DATETIME) {
            var x = new Date(RESPONSE_DATETIME);
            var y = x.getFullYear().toString();
            var m = (x.getMonth() + 1).toString();
            var d = x.getDate().toString();
            d.length == 1 && (d = '0' + d);
            m.length == 1 && (m = '0' + m);
            var yyyymmdd = y + m + d;
            return yyyymmdd;
          }

          let s = new Date(RESPONSE_DATETIME);
          let hours = s.getHours().toString();
          let minutes = s.getMinutes().toString();

          if (hours.length == 1) {
            hours = '0' + hours;
          }
          if (minutes.length == 1) {
            minutes = '0' + minutes;
          }
          const paymentDueTime = hours + minutes;
          // moment.locale('th');
          // const paymentDueTime = moment(RESPONSE_DATETIME)
          //   .format('hh:mm')
          //   .replace(':', '');
          // console.log('paymentDueTime ', paymentDueTime);

          const paymentDueDate = yyyymmdd(RESPONSE_DATETIME);
          const issueDtm = moment(RESPONSE_DATETIME).format(
            'YYYY-MM-DD HH:mm:ss',
          );

          const customerTaxId = this._getCustomerTaxId();

          const data = {
            //accessToken: this.state.accessToken,
            //totalPrice: this.props.order.headerProcessed.VDI_AMOUNT || 0,
            dscfTxnId: this.state.dscfTxnId,
            edcInvoiceNumber: '',
            billerId: '',
            //  sponsorTaxId: this.state.userToken.COMPANYINFO.CMPNY_REG_NO,
            sponsorTaxId: '9100990000161',
            invoice: {
              invoiceHdr: {
                invoiceId: VDI_REF, // (Create-Response.json)
                outstandingAmount: 0, // fix
                dealerTaxId: customerTaxId, // (Create-Response.json)
                invoiceTaxAmount: VDI_AF_DISC_VAT_EXP_VAT,
                invoiceAmount: this.props.order.headerProcessed.VDI_AMOUNT,
                terminalId: VDI_MACHINE,
                salesMethod: 'FF', // fix
                paidAmount: VDI_AF_DISC,
                documentType: 'INV', // fix
                invoiceTaxRate: 7, // fix
                staffId: VDI_MACHINE,
                paymentDueTime: paymentDueTime,
                paymentDueDate: paymentDueDate,
                storeId: VDI_MACHINE,
                currencyCode: 'THB', //fix
                paidAmountDtl: [
                  {
                    methodCode: '001',
                    methodDesc: 'Cash',
                    amount: VDI_AF_DISC,
                  },
                ],
                issueDtm: issueDtm,
              },
              invoiceDtl: {
                items: newArray,
              },
            },
            ref3: this.state.dscfTxnId,
            ref2: '',
            ref1: this.state.dscfTxnId,
            //edcApproveCode: '',
          };

          console.log('data: ', data);
          console.log(
            'data.invoice.invoiceDtl.items ',
            data.invoice.invoiceDtl.items,
          );
          console.log(
            'data.invoice.invoiceHdr.paidAmountDtl ',
            data.invoice.invoiceHdr.paidAmountDtl,
          );
          const postinvoice = await this.props.postinvoice(
            data,
            this.state.accessToken,
          );
          console.log('postinvoice: ', postinvoice);
          const { txnStatusCode } = postinvoice;
          if (txnStatusCode === 200) {
            Navigator.navigate('OrderSalesSummary', {
              actionType: 'orderProductSummaryProcessed',
              printType: 'cash',
            });
            this._setState('successMessage', 'ส่งรายการเรียบร้อย');
          } else {
            Navigator.navigate('OrderSalesSummary', {
              actionType: 'orderProductSummaryProcessed',
              printType: 'cash',
            });

            this._setState('successMessage', 'ส่งรายการเรียบร้อย');
          }
        } else {
          this._setState('buttonDisabled', false);
          this._setState('isLoading', false);
        }
      } else {
        Navigator.navigate('OrderSalesSummary', {
          actionType: 'orderProductSummaryProcessed',
          printType: 'cash',
          processResult: this.props.processResult,
        });

        this._setState('successMessage', 'ส่งรายการเรียบร้อย');
      }
    } catch (error) {
      this._setState('errorMessage', error);
      this._setState('buttonDisabled', false);
    }

    this._setState('isLoading', false);
  };


  // _orderCash_BK = async () => {
  //   try {
  //     console.log('_orderCash this.state.paymentType ', this.state.paymentType);

  //     // this.state.groupofpaymentType.has('cash') ||
  //     // this.state.groupofpaymentType.has('cheque') ||
  //     // this.state.groupofpaymentType.has('transfer') ||
  //     // this.state.groupofpaymentType.has('other') ||
  //     // this.state.groupofpaymentType.has('qrcode')



  //     if (this.state.paymentType == null) {
  //       this._setState('errorMessage', 'กรุณาเลือกวิธีการชำระเงิน');
  //       return;
  //     }
  //     if (
  //       this.state.paymentType === 'cash' &&
  //       this.state.userToken.VANCONFIG.VANCNF_ENABLE_CASH == 1
  //     ) {
  //       console.log('_orderCash cash ');
  //       this._setState('errorMessage', 'ไม่สามารถชำระด้วยเงินสด');
  //       return;
  //     }

  //     if (
  //       this.state.paymentType === 'cheque' &&
  //       this.state.userToken.VANCONFIG.VANCNF_CHEQUE == 1
  //     ) {
  //       this._setState('errorMessage', 'ไม่สามารถชำระด้วยเช็ค');
  //       return;
  //     }

  //     if (
  //       this.state.paymentType === 'cheque' &&
  //       !this._validatePaymentByCheque()
  //     )
  //       return;

  //     if (
  //       this.state.paymentType === 'transfer' &&
  //       !this._validatePaymentByTransfer()
  //     )
  //       return;

  //     if (this.state.paymentType === 'qrcode') {
  //       await this._requestQrCode(this.state.qrin ? this.state.qrin.toString() : "0");

  //       // await this._qrcodePayment();
  //       //return;
  //     }


  //     if (
  //       this.state.paymentType === 'other' &&
  //       !this._validatePaymentByTransfer()
  //     )
  //       return;


  //     this._setState('isLoading', true);
  //     this._setState('errorMessage', null);
  //     this._setState('successMessage', null);
  //     this._setState('buttonDisabled', true);

  //     if (this.state.paymentType === 'cheque') {
  //       await this.props.setHeaderProcessedVdiChequeBank(
  //         this.state.paymentCheque.bankFileItem,
  //       );
  //       await this.props.setHeaderProcessedVdiChequeDate(
  //         moment(this.state.paymentCheque.chequeDate, 'DD/MM/YYYY')
  //           .add(1, 'days')
  //           .toJSON(),
  //       );
  //       await this.props.setHeaderProcessedVdiChequeNo(
  //         this.state.paymentCheque.chequeNo,
  //       );
  //     }

  //     if (this.state.paymentType === 'transfer') {
  //       await this.props.setHeaderProcessedVdiBankTransfer(
  //         this.state.paymentTransfer.bankAccountItem,
  //       );
  //     }

  //     console.log('_orderCash this.state.dscfTxnId ', this.state.dscfTxnId);
  //     if (
  //       this.state.groupofpaymentType.has('cash') ||
  //       this.state.groupofpaymentType.has('cheque') ||
  //       this.state.groupofpaymentType.has('transfer') ||
  //       this.state.groupofpaymentType.has('other') ||
  //       this.state.groupofpaymentType.has('qrcode')
  //       //this.state.paymentType === 'cash' || this.state.paymentType === 'qrcode'
  //     ) {
  //       const { VANCONFIG } = await getUserToken();
  //       const v3GUID = await getLoginGuID();
  //       // await this.props.orderCreateCash(
  //       await this.props.createOrderSaleV3(

  //         genenrateOrderForCreateToServer(
  //           this.props.order,
  //           this.props.mile.item.mileage,
  //           this.props.geolocation.position,
  //           // null,
  //         ),
  //         v3GUID,
  //         VANCONFIG,
  //         'สด'
  //       );
  //     } else {
  //       console.log('_orderCash asdassa ', this.state.dscfTxnId);
  //       await this.props.orderCreateCash(
  //         genenrateOrderForCreateToServer(
  //           this.props.order,
  //           this.props.mile.item.mileage,
  //           this.props.geolocation.position,
  //           this.state.dscfTxnId,
  //         ),
  //       );
  //     }

  //     // if (this.props.order.header.VDI_USER_REF === null) {
  //     //   await this.props.orderCreateCash(
  //     //     genenrateOrderForCreateToServer(
  //     //       this.props.order,
  //     //       this.props.mile.item.mileage,
  //     //       this.props.geolocation.position,
  //     //     ),
  //     //   );
  //     // } else {
  //     //   await this.props.orderUpdateCash(
  //     //     genenrateOrderForUpdateToServer(
  //     //       genenrateOrderForCreateToServer(
  //     //         this.props.order,
  //     //         this.props.mile.item.mileage,
  //     //         this.props.geolocation.position,
  //     //       ),
  //     //       this.props.order.header,
  //     //     ),
  //     //   );
  //     // }

  //     if (
  //       this.props.checkin.item.photo !== null &&
  //       this.props.checkin.item.isSubmit === false
  //     ) {
  //       await this._orderAttachImage();
  //     }

  //     if (
  //       this.props.mile.item.photo !== null &&
  //       this.props.mile.item.isSubmit === false
  //     ) {
  //       await this._orderMileAttachImage();
  //     }

  //     // if (this.state.paymentType === 'ktb') {
  //     //   console.log(' await this._qrcodeKTB(); ');
  //     //   await this._qrcodeKTB();
  //     //   return;
  //     // }

  //     if (this.state.dscfTxnId) {
  //       console.log('_orderCash this.state.dscfTxnId ', this.state.dscfTxnId);
  //       const {
  //         VDI_REF,
  //         VDI_AF_DISC,
  //         VDI_AF_DISC_VAT_EXP_VAT,
  //         VDI_MACHINE,
  //       } = this.props.order.headerProcessed;
  //       console.log(' _orderCash VDI_REF:', VDI_REF);

  //       console.log('_orderCash processResult: ', this.props.processResult);
  //       const { RESPONSE_DATETIME, RESULT_DATA } = this.props.processResult;
  //       const { RESULT } = RESULT_DATA;
  //       const { ITEMS } = RESULT;

  //       if (VDI_REF) {
  //         console.log('_orderCash VDI_REF');
  //         console.log('ITEMS', ITEMS);
  //         const newArray = ITEMS.map((item) => {
  //           return {
  //             itemId: item.VTRD_CODE,
  //             itemName: item.VTRD_NAMES,
  //             taxTypeCode: item.VTRD_VAT_TY === 3 ? 'VAT' : 'FRE',
  //             taxRate: item.VTRD_VAT_TY === 3 ? 7 : 0,
  //             basisAmount: item.VTRD_AF_SELL,
  //             sellingUOM: item.sellingUOM,
  //             stockingQty: item.stockingQty,
  //             packSize: item.packsize,
  //             unitPrice: item.VTRD_U_PRC,
  //             quantity: item.VTRD_QTY,
  //             taxAmount: item.VTRD_VAT,
  //             totalAmount: item.VTRD_VALUES,
  //             itemUpc: item.VTRD_CODE,
  //             itemCat: 'ทดสอบ Cat',
  //           };
  //         });

  //         console.log('RESPONSE_DATETIME: ', RESPONSE_DATETIME);

  //         function yyyymmdd(RESPONSE_DATETIME) {
  //           var x = new Date(RESPONSE_DATETIME);
  //           var y = x.getFullYear().toString();
  //           var m = (x.getMonth() + 1).toString();
  //           var d = x.getDate().toString();
  //           d.length == 1 && (d = '0' + d);
  //           m.length == 1 && (m = '0' + m);
  //           var yyyymmdd = y + m + d;
  //           return yyyymmdd;
  //         }

  //         let s = new Date(RESPONSE_DATETIME);
  //         let hours = s.getHours().toString();
  //         let minutes = s.getMinutes().toString();

  //         if (hours.length == 1) {
  //           hours = '0' + hours;
  //         }
  //         if (minutes.length == 1) {
  //           minutes = '0' + minutes;
  //         }
  //         const paymentDueTime = hours + minutes;
  //         // moment.locale('th');
  //         // const paymentDueTime = moment(RESPONSE_DATETIME)
  //         //   .format('hh:mm')
  //         //   .replace(':', '');
  //         // console.log('paymentDueTime ', paymentDueTime);

  //         const paymentDueDate = yyyymmdd(RESPONSE_DATETIME);
  //         const issueDtm = moment(RESPONSE_DATETIME).format(
  //           'YYYY-MM-DD HH:mm:ss',
  //         );

  //         const { ADDB_TAX_ID } = this.props.customer.item.INFO;

  //         const data = {
  //           //accessToken: this.state.accessToken,
  //           //totalPrice: this.props.order.headerProcessed.VDI_AMOUNT || 0,
  //           dscfTxnId: this.state.dscfTxnId,
  //           edcInvoiceNumber: '',
  //           billerId: '',
  //           //  sponsorTaxId: this.state.userToken.COMPANYINFO.CMPNY_REG_NO,
  //           sponsorTaxId: '9100990000161',
  //           invoice: {
  //             invoiceHdr: {
  //               invoiceId: VDI_REF, // (Create-Response.json)
  //               outstandingAmount: 0, // fix
  //               dealerTaxId: ADDB_TAX_ID, // (Create-Response.json)
  //               invoiceTaxAmount: VDI_AF_DISC_VAT_EXP_VAT,
  //               invoiceAmount: this.props.order.headerProcessed.VDI_AMOUNT,
  //               terminalId: VDI_MACHINE,
  //               salesMethod: 'FF', // fix
  //               paidAmount: VDI_AF_DISC,
  //               documentType: 'INV', // fix
  //               invoiceTaxRate: 7, // fix
  //               staffId: VDI_MACHINE,
  //               paymentDueTime: paymentDueTime,
  //               paymentDueDate: paymentDueDate,
  //               storeId: VDI_MACHINE,
  //               currencyCode: 'THB', //fix
  //               paidAmountDtl: [
  //                 {
  //                   methodCode: '001',
  //                   methodDesc: 'Cash',
  //                   amount: VDI_AF_DISC,
  //                 },
  //               ],
  //               issueDtm: issueDtm,
  //             },
  //             invoiceDtl: {
  //               items: newArray,
  //             },
  //           },
  //           ref3: this.state.dscfTxnId,
  //           ref2: '',
  //           ref1: this.state.dscfTxnId,
  //           //edcApproveCode: '',
  //         };

  //         console.log('data: ', data);
  //         console.log(
  //           'data.invoice.invoiceDtl.items ',
  //           data.invoice.invoiceDtl.items,
  //         );
  //         console.log(
  //           'data.invoice.invoiceHdr.paidAmountDtl ',
  //           data.invoice.invoiceHdr.paidAmountDtl,
  //         );
  //         const postinvoice = await this.props.postinvoice(
  //           data,
  //           this.state.accessToken,
  //         );
  //         console.log('postinvoice: ', postinvoice);
  //         const { txnStatusCode } = postinvoice;
  //         if (txnStatusCode === 200) {
  //           Navigator.navigate('OrderSalesSummary', {
  //             actionType: 'orderProductSummaryProcessed',
  //             printType: 'cash',
  //           });
  //           this._setState('successMessage', 'ส่งรายการเรียบร้อย');
  //         } else {
  //           Navigator.navigate('OrderSalesSummary', {
  //             actionType: 'orderProductSummaryProcessed',
  //             printType: 'cash',
  //           });

  //           this._setState('successMessage', 'ส่งรายการเรียบร้อย');
  //         }
  //       } else {
  //         this._setState('buttonDisabled', false);
  //         this._setState('isLoading', false);
  //       }
  //     } else {
  //       Navigator.navigate('OrderSalesSummary', {
  //         actionType: 'orderProductSummaryProcessed',
  //         printType: 'cash',
  //         processResult: this.props.processResult,
  //       });

  //       this._setState('successMessage', 'ส่งรายการเรียบร้อย');
  //     }
  //   } catch (error) {
  //     this._setState('errorMessage', error);
  //     this._setState('buttonDisabled', false);
  //   }

  //   this._setState('isLoading', false);
  // };

  _qrcodePayment = async () => {
    this._setState('isLoading', true);
    this._setState('errorMessage', null);
    this._setState('successMessage', null);
    this._setState('buttonDisabled', true);

    try {
      const latestUserToken = await getUserToken();

      if (latestUserToken) {
        await this._setState('userToken', latestUserToken);
      }

      await this._requestQrCode(this.state.qrin ? this.state.qrin.toString() : '0');
    } catch (error) {
      console.log('_qrcodePayment error', error);
      this._setState('errorMessage', error);
    }

    this._setState('isLoading', false);
    this._setState('buttonDisabled', false);
  };


//   _requestQrCode = async (obj) => {
//     this._setState('errorMessage', null);

//     if (
//       this.state.groupofpaymentType.has('qrcode') && (this.state.qrin === null || Number(this.state.qrin) <= 0)
//     ) {
//       await this._setState('isQRCodeDialogOpen', false);
//       this._setState('errorMessage', 'กรุณาระบุจำนวนเงิน (QrCode)');
//       return;
//     }


//     if (
//       this.state.groupofpaymentType.has('qrcode') && (this.state.qrContentItem === null)
//     ) {
//       this._setState('errorMessage', 'กรุณาระบุธนาคาร (QrCode) ');
//       return;
//     }

//     let payin = (this.state.groupofpaymentType.has('cash') ? Number(this.state.cashin) : 0) +
//     (this.state.groupofpaymentType.has('transfer') ? Number(this.state.paymentTransfer.tranFerin) : 0) +
//     (this.state.groupofpaymentType.has('qrcode') ? Number(this.state.qrin) : 0) +
//     (this.state.groupofpaymentType.has('cheque') ? Number(this.state.paymentCheque.chequein) : 0) +
//     (this.state.groupofpaymentType.has('other') ? Number(this.state.otherin) : 0);

  _requestQrCode = async (obj) => {
    this._setState('errorMessage', null);

    const selectedQrContent = this.state.qrContent?.find(
      item => String(item.QRCT_KEY) === String(this.state.qrContentItem) || String(item.QRCT_CODE) === String(this.state.qrContentItem)
    );

    const qrCodeSeedCandidates = [
      obj,
      selectedQrContent?.QRCT_CONTENT,
      selectedQrContent?.QRCT_CODE,
      selectedQrContent?.BNKAC_CODE,
    ]
      .map(value => String(value || '').trim())
      .filter(Boolean)
      .filter(value => value !== '0');

    if (
      this.state.groupofpaymentType.has('qrcode') && (this.state.qrin === null || Number(this.state.qrin) <= 0)
    ) {
      await this._setState('isQRCodeDialogOpen', false);
      this._setState('errorMessage', 'กรุณาระบุจำนวนเงิน (QrCode)');
      return;
    }

    if (
      this.state.groupofpaymentType.has('qrcode') && (this.state.qrContentItem === null)
    ) {
      this._setState('errorMessage', 'กรุณาระบุธนาคาร (QrCode) ');
      return;
    }

    let payin = (this.state.groupofpaymentType.has('cash') ? Number(this.state.cashin) : 0) +
      (this.state.groupofpaymentType.has('transfer') ? Number(this.state.paymentTransfer.tranFerin) : 0) +
      (this.state.groupofpaymentType.has('qrcode') ? Number(this.state.qrin) : 0) +
      (this.state.groupofpaymentType.has('cheque') ? Number(this.state.paymentCheque.chequein) : 0) +
      (this.state.groupofpaymentType.has('other') ? Number(this.state.otherin) : 0);

    if (
      this.state.groupofpaymentType.has('qrcode') && (Number(payin) < Number(this.props.order.header.VDI_AF_DISC) - this.state.differBy)
    ) {
      await this._setState('isQRCodeDialogOpen', false);
      this._setState('errorMessage', 'ยอดชำระยังไม่ครบ กรุณาตรวจสอบ ');
      return;
    }

    if (this.state.remainoptiontItem === null && this.state.groupofpaymentType.has('qrcode')) {
      if (
        Number(payin) > Number(this.props.order.header.VDI_AF_DISC) &&
        Number(this.props.order.header.VDI_AF_DISC - payin) <= Number(this.state.differBy)
      ) {
        await this._setState('reMainOption1', this.state.reMainOption_Over);
        await this._setState('differValue', (Number(payin - this.props.order.header.VDI_AF_DISC).toFixed(2)));
        if (this.state.remainConfirm == false) {
          await this._setState('isDialogOpen', true);
          return;
        }
      } else if (
        Number(payin) < Number(this.props.order.header.VDI_AF_DISC) &&
        Number(this.state.differBy) >= Number(this.props.order.header.VDI_AF_DISC - payin)
      ) {
        await this._setState('reMainOption1', this.state.reMainOption_Under);
        await this._setState('differValue', (Number(payin - this.props.order.header.VDI_AF_DISC).toFixed(2)));
        if (this.state.remainConfirm == false) {
          await this._setState('isDialogOpen', true);
          return;
        }
      } else if (Number(payin) === Number(this.props.order.header.VDI_AF_DISC)) {
        await this._setState('isDialogOpen', false);
      }
    }

    try {
      const isError = false;
      const data = qrCodeSeedCandidates[0] || obj;

      if (isError || !data) {
        this._setState('errorMessage', 'ไม่สามารถสร้าง QR Code ได้ กรุณาตรวจสอบการเชื่อมต่อหรือข้อมูล QR');
        return;
      }

      await this._setState('qrCode', data);
      await this._setState('isQRCodeDialogOpen', true);
    } catch (error) {
      this._setState('errorMessage', error);
    }
  };



  // _requestQrCodeSCB = async (obj) => {
  //   this._setState('errorMessage', null);

  //   try {
  //     const qrcode = await this.props.requestQrCodeSCB(
  //       obj,
  //       this.props.order.headerProcessed.VDI_AMOUNT,
  //     );
  //     const { isError, data } = qrcode;

  //     if (!isError) {
  //       await this._setState('qrCode', data.qrCode);
  //       await this._setState('isQRCodeDialogOpen', true);
  //       console.log(
  //         'PAYMENT_CALL_BACK_END_POINT',
  //         PAYMENT_CALL_BACK_END_POINT + `?TxUID=${data.partnerTxnUid}`,
  //       );
  //       const ws = new WebSocket(
  //         PAYMENT_CALL_BACK_END_POINT + `?TxUID=${data.partnerTxnUid}`,
  //       );

  //       ws.onopen = () => {
  //         // connection opened
  //         // ws.send('something') // send a message
  //         console.log('onopen');
  //       };

  //       ws.onmessage = async (e) => {
  //         // a message was received
  //         console.log('onmessage', e.data);

  //         ws.close();

  //         if (this.props.order.header.VDI_USER_REF === null) {
  //           await this.props.orderCreateCash(
  //             genenrateOrderForCreateToServer(
  //               this.props.order,
  //               this.props.mile.item.mileage,
  //               this.props.geolocation.position,
  //               this.state.dscfTxnId,
  //             ),
  //           );
  //         } else {
  //           await this.props.orderUpdateCash(
  //             genenrateOrderForUpdateToServer(
  //               genenrateOrderForCreateToServer(
  //                 this.props.order,
  //                 this.props.mile.item.mileage,
  //                 this.props.geolocation.position,
  //                 this.state.dscfTxnId,
  //               ),
  //               this.props.order.header,
  //             ),
  //           );
  //         }

  //         if (
  //           this.props.checkin.item.photo !== null &&
  //           this.props.checkin.item.isSubmit === false
  //         ) {
  //           await this._orderAttachImage();
  //         }

  //         if (
  //           this.props.mile.item.photo !== null &&
  //           this.props.mile.item.isSubmit === false
  //         ) {
  //           await this._orderMileAttachImage();
  //         }

  //         Navigator.navigate('OrderSalesSummary', {
  //           actionType: 'orderProductSummaryProcessed',
  //           printType: 'cash',
  //         });

  //         this._setState('successMessage', 'ส่งรายการเรียบร้อย');
  //         // Navigator.navigate('OrderChoice')
  //       };

  //       ws.onerror = (e) => {
  //         // an error occurred
  //         console.log('onerror 5', e);
  //         ws.close();
  //         throw new Error(e.message);
  //       };

  //       ws.onclose = async (e) => {
  //         // connection closed
  //         await this._setState('isQRCodeDialogOpen', false);
  //         console.log('onerror 6', e.code, e.reason);
  //       };
  //     }
  //   } catch (error) {
  //     this._setState('errorMessage', error);
  //   }
  // };

  _validatePaymentByCheque = () => {
    console.log('this.state.paymentCheque', this.state.paymentCheque);

    if (
      this.state.groupofpaymentType.has('cheque') && (this.state.paymentCheque.chequein === null || Number(this.state.paymentCheque.chequein) <= 0)
    ) {
      this._setState('errorMessage', 'กรุณาระบุจำนวนเงิน (เช็ค)');
      return;
    }

    if (this.state.groupofpaymentType.has('cheque') && this.state.paymentCheque.bankFileItem === null) {
      this._setState('errorMessage', 'กรุณาเลือกธนาคาร (เช็ค) ');
      return false;
    }

    if (this.state.groupofpaymentType.has('cheque') && this.state.paymentCheque.chequeNo === null) {
      this._setState('errorMessage', 'กรุณากรอกเลขที่เช็ค');
      return false;
    }

    if (this.state.groupofpaymentType.has('cheque') && this.state.paymentCheque.chequeNo.length < 8) {
      this._setState('errorMessage', 'กรุณากรอกเลขที่เช็คให้ครบ 8 หลัก');
      return false;
    }
    if (this.state.groupofpaymentType.has('cheque') && this.state.paymentCheque.chequeDate === null) {
      this._setState('errorMessage', 'กรุณาเลือกวันที่เช็ค');
      return false;
    }

    return true;
  };

  _validatePaymentByTransfer = () => {

    // console.log('this.state.paymentCheque', this.state.paymentCheque);
    // console.log('this.state.paymentCheque', this.state.paymentTransfer);


    if (
      this.state.groupofpaymentType.has('transfer') && (this.state.paymentTransfer.tranFerin === null || Number(this.state.paymentTransfer.tranFerin) <= 0)
    ) {
      this._setState('errorMessage', 'กรุณาระบุจำนวนเงิน (โอน)');
      return;
    }
    if (
      this.state.groupofpaymentType.has('transfer') && (this.state.paymentTransfer.bankAccountItem === null)
    ) {
      this._setState('errorMessage', 'กรุณาระบุธนาคาร (โอน) ');
      return;
    }

    // if (
    //   this.state.groupofpaymentType.has('qrcode') && (this.state.qrContentItem === null)
    // ) {
    //   this._setState('errorMessage', 'กรุณาระบุธนาคาร (QrCode) ');
    //   return;
    // }

    return true;
  };


  _validatePaymentByOther = () => {
    //console.log('this.state.paymentCheque', this.state.otherPaymentItem);

    if (
      this.state.groupofpaymentType.has('other') && (this.state.otherin === null || Number(this.state.otherin) <= 0)
    ) {
      this._setState('errorMessage', 'กรุณาระบุจำนวนเงิน (อื่นๆ)');
      return;
    }
    if (
      this.state.groupofpaymentType.has('other') && (this.state.otherPaymentItem === null)
    ) {
      this._setState('errorMessage', 'กรุณาระบุประเภทการชำระ (อื่นๆ) ');
      return;
    }
    return true;
  };






  _orderAttachImage = async () => {
    try {
      response = await this.props.orderAttachImage(
        genenrateAttachImageToServer(
          this.props.order.headerProcessed.VDI_KEY,
          this.props.order.headerProcessed.VDI_AR,
          this.props.checkin.item.photo,
        ),
      );

      const { RESULT_DATA, STATUS, ERROR_MESSAGES } = response;

      if (STATUS === '00') {
        this.props.setCheckInIsSubmit(true);
      }
    } catch (error) {
      console.log('_orderAttachImage', error);
    }
  };

  _orderMileAttachImage = async () => {
    try {
      response = await this.props.orderAttachImage(
        genenrateAttachImageToServer(
          this.props.order.headerProcessed.VDI_KEY,
          this.props.order.headerProcessed.VDI_AR,
          this.props.mile.item.photo,
        ),
      );

      const { RESULT_DATA, STATUS, ERROR_MESSAGES } = response;

      if (STATUS === '00') {
        this.props.setMileIsSubmit(true);
      }
    } catch (error) {
      console.log('_orderMileAttachImage', error);
    }
  };

  _setState = async (key, value) => {
    await this.setState((oldState) => {
      return {
        [key]: value,
      };
    });
  };

  _setBankFileItem = async (value) => {
    await this.setState((oldState) => {
      return {
        ...this.state,
        paymentCheque: {
          ...this.state.paymentCheque,
          bankFileItem: value,
        },
      };
    });
  };

  _setBankAccountItem = async (value) => {
    //const result = this.state.listbankAccountItem.find(item => item.BNKAC_CODE === value).BNKAC_NAME;
    const bankAccount = this.state.listbankAccountItem?.find(item => item.BNKAC_CODE === value);
    const result = bankAccount?.BNKAC_NAME || '';

    await this.setState((oldState) => {
      return {
        ...this.state,
        paymentTransfer: {
          ...this.state.paymentTransfer,
          bankAccountItem: value,
          bankAccountName: result,
        },
      };
    });
  };

  _setqrContentItem = async (value) => {
    if (value === false || value === undefined) {
      return;
    }

    if (value === null) {
      await this._setState('qrContentItem', null);
      await this._setState('qrContentName', '');
      return;
    }

    const qrContent = this.state.qrContent?.find(
      item => String(item.QRCT_KEY) === String(value) || String(item.QRCT_CODE) === String(value)
    );

    const result = qrContent?.QRCT_NAME || '';

    await this.setState((oldState) => {
      return {
        ...this.state,
        // paymentTransfer: {
        //   ...this.state.paymentTransfer,
        qrContentItem: value,
        qrContentName: result,
        // },
      };
    });



  };

  _setqrConfirm = async (value) => {
    console.log("_setqrConfirm value>>", value)
    await this.setState((oldState) => {
      return {
        ...this.state,
        qrConfirm: value,
      };
    });
    console.log('ผ่านทุกเงื่อนไข 4 ');
    await this._orderCash1(null);
  };


  _setremainConfirm = async (value) => {
    console.log("_setRemainConfirm value>>", value)
    await this.setState((oldState) => {
      return {
        ...this.state,
        remainConfirm: value,
      };
    });
    console.log("_setqrContentItem value>> ", value)
    if (value) { await this._orderCash1(null) };
   
  };





  _setCashin = async (value) => {

    await this._setState('reMainOption1', []);
    await this._setState('remainConfirm', false);
    this._setState('errorMessage', null);

    await this.setState((oldState) => {
      return {
        ...this.state, cashin: value,
      };
    });

    // console.log('444  _setCashin  >>>', this.state.cashin)
    // //console.log("444  totalPrice >>>", Number(totalPrice));
    // console.log("444  value >>>", value);



    const isValid = await this._validateAll(null);
    if (isValid) {
      console.log('ผ่านทุกเงื่อนไข');
    }
  }


  _settranFerin = async (value) => {

    await this._setState('reMainOption1', []);
    await this._setState('remainConfirm', false);
     this._setState('errorMessage', null);


    await this.setState((oldState) => {
      return {
        ...this.state,
        paymentTransfer: {
          ...this.state.paymentTransfer,
          tranFerin: value,
        },
      };
    });
    // console.log('_settranFerin2', this.state.paymentTransfer)
    // if (value) { this._orderCash() };

    const isValid = await this._validateAll(null);
    if (isValid) {
      console.log('ผ่านทุกเงื่อนไข');
    }

  };


  _setQrin = async (value) => {
    await this._setState('reMainOption1', []);
    await this._setState('remainConfirm', false);
    this._setState('errorMessage', null);

    console.log('_setQrin', value)
    await this.setState((oldState) => {
      return {
        ...this.state, qrin: value,
      };
    });

    const isValid = await this._validateAll(null);
    if (isValid) {
      console.log('ผ่านทุกเงื่อนไข');
    }

    // const isValid = await this._validateAll(null);
    // if (isValid) {
    //   console.log('ผ่านทุกเงื่อนไข 3 ');
    // }

    // console.log('_setQrin', this.state.qrin)
   //  if (value) { this._orderCash1(null) };
  };

  _setOtherin = async (value) => {
    await this._setState('reMainOption1', []);
    await this._setState('remainConfirm', false);
     this._setState('errorMessage', null);


    await this.setState((oldState) => {
      return {
        ...this.state, otherin: value,
      };
    });
  
    const isValid = await this._validateAll(null);
    if (isValid) {
      console.log('ผ่านทุกเงื่อนไข');
    }
  };

  _setOtherItem = async (value) => {
    console.log('_setOtherItem', value)
    await this.setState((oldState) => {
      return {
        ...this.state, otherPaymentItem: value,
      };
    });
    console.log('_setOtherItem', this.state.otherPaymentItem)
  };


  _setremainoptionItem = async (value) => {
    console.log('_setremainoptionItem', value)
    await this.setState((oldState) => {
      return {
        ...this.state, remainoptiontItem: value,
      };
    });
    console.log('_setremainoptionItem', this.state.remainoptiontItem)
  };




  _setchequein = async (value) => {
    await this._setState('reMainOption1', []);
    await this._setState('remainConfirm', false);
    this._setState('errorMessage', null);



    await this.setState((oldState) => {
      return {
        ...this.state,
        paymentCheque: {
          ...this.state.paymentCheque,
          chequein: value,
        },
      };
    });

    const isValid = await this._validateAll(null);
    if (isValid) {
      console.log('ผ่านทุกเงื่อนไข');
    }
   // console.log('_setchequein2', this.state.paymentCheque)
  };

  _setChequeDate = async (value) => {
    await this.setState((oldState) => {
      return {
        ...this.state,
        paymentCheque: {
          ...this.state.paymentCheque,
          chequeDate: value,
        },
      };
    });
  };

  _setChequeNo = async (value) => {
    await this.setState((oldState) => {
      return {
        ...this.state,
        paymentCheque: {
          ...this.state.paymentCheque,
          chequeNo: numberOnlyCanZeroFirst(value),
        },
      };
    });
  };

  _setEnabledPaymentCheque = async () => {
    await this.setState((oldState) => {
      return {
        ...this.state,
        paymentCheque: {
          ...this.state.paymentCheque,
          bankFileItemEnabled: true,
          bankAccountItemEnabled: false,
          chequeDateDisabled: false,
          chequeNoEditable: true,
        },
      };
    });
  };

  _setEnabledPaymentTransfer = async () => {
    await this.setState((oldState) => {
      return {
        ...this.state,
        paymentTransfer: {
          ...this.state.paymentTransfer,
          bankAccountItemEnabled: true,
        },
      };
    });
  };

  _setDisabledPaymentCheque = async () => {
    await this.setState((oldState) => {
      return {
        ...this.state,
        paymentCheque: {
          ...this.state.paymentCheque,
          bankFileItem: null,
          chequeDate: moment().format('DD/MM/YYYY'),
          chequeNo: null,
          bankFileItemEnabled: false,
          chequeDateDisabled: true,
          chequeNoEditable: false,
        },
      };
    });
  };

  _setDisabledPaymentTransfer = async () => {
    await this.setState((oldState) => {
      return {
        ...this.state,
        paymentTransfer: {
          ...this.state.paymentTransfer,
          bankAccountItem: null,
          bankAccountItemEnabled: false,
        },
      };
    });
  };

  render() {
    //this.state.groupofpaymentType.add('cash');
    //this.state.paymentType = "cash";
    //console.log("this.state.otherPaymentType444 ", this.state.otherPaymentType);
    //console.log("this.props.masterData.bankFileListItems", this.props.masterData.bankFileListItems);
    // console.log("headerProcessed header1", this.props.order.header);
    //  console.log("headerProcessed header24", this.props.order.headerProcessed);
    //  console.log("headerProcessed header26", this.props.order.header);


    const totalPrice = (this.props.order.header.VDI_AF_DISC !== null && this.props.order.header.VDI_AF_DISC !== undefined && !Number.isNaN(this.props.order.header.VDI_AF_DISC))
      ? this.props.order.header.VDI_AF_DISC
      : 0;

    //console.log("headerProcessed header25", totalPrice );


    return (
      <>
        <PaymentForm
          totalPrice={totalPrice}
          groupofpaymentType={this.state.groupofpaymentType}
          paymentType={this.state.paymentType}
          setPaymentType={this._setPaymentType}
          //setcashin={this._setcashin}



          buttonListItems={paymentButtonGroup}
          renderItem={this._renderItem}
          renderItemRemainOption={this._renderItemRemainOption}
          successMessage={this.state.successMessage}
          errorMessage={this.state.errorMessage}
          isLoading={this.state.isLoading}
          bankFileListItems={this.props.masterData.bankFileListItems}
          bankAccountListItems={this.props.masterData.bankAccountListItems}
          setBankFileItem={this._setBankFileItem}
          setBankAccountItem={this._setBankAccountItem}
          //  setBankAccountItemName={this._setBankAccountItemName}



          setAmtcashin={this._setCashin}
          setAmttranferin={this._settranFerin}
          setAmtQrin={this._setQrin}
          setAmtchequein={this._setchequein}
          setAmtOtherin={this._setOtherin}

          setotherPaymentItem={this._setOtherItem}
          otherPaymentItem={this.state.otherPaymentItem}

          setremainoptionItem={this._setremainoptionItem}
          remainoptiontItem={this.state.remainoptiontItem}

          bankFileItem={this.state.paymentCheque.bankFileItem}
          bankAccountItem={this.state.paymentTransfer.bankAccountItem}
          bankAccountItemName={this.state.paymentTransfer.bankAccountItemName}



          qrContentListItem={this.state.qrContent}
          qrContentItem={this.state.qrContentItem}

          listbankAccountItem={this.state.listbankAccountItem}
          tranFerin={this.state.paymentTransfer.tranFerin}
          setChequeDate={this._setChequeDate}
          setChequeNo={this._setChequeNo}
          chequeDate={this.state.paymentCheque.chequeDate}
          chequeNo={this.state.paymentCheque.chequeNo}
          bankFileItemEnabled={this.state.paymentCheque.bankFileItemEnabled}
          bankAccountItemEnabled={
            this.state.paymentTransfer.bankAccountItemEnabled
          }
          chequeDateDisabled={this.state.paymentCheque.chequeDateDisabled}
          chequeNoEditable={this.state.paymentCheque.chequeNoEditable}

          setqrContentItem={this._setqrContentItem}
          setqrConfirm={this._setqrConfirm}
          setremainConfirm={this._setremainConfirm}

          isQRCodeDialogOpen={this.state.isQRCodeDialogOpen}
          isDialogOpen={this.state.isDialogOpen}
          setState={this._setState}
          qrCode={this.state.qrCode}
          qrAmount={this.state.qrin}
          qrLogo={this.state.qrLogo}
          userToken={this.state.userToken}
          otherPaymentType={this.state.otherPaymentType}
          remainOptionItem={this.state.reMainOption1}
          differBy={this.state.differBy}
          differValue={this.state.differValue}

        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  order: state.order,
  customer: state.customer,
  masterData: state.masterData,
  mile: state.mile,
  geolocation: state.geolocation,
  checkin: state.checkin,
});

const mapDispatchToProps = (dispatch) => {
  return {
    orderCreateCash: (value) => dispatch(orderCreateCash(value)),
    orderUpdateCash: (value) => dispatch(orderUpdateCash(value)),
    setHeaderProcessedVdiChequeBank: (value) =>
      dispatch(setHeaderProcessedVdiChequeBank(value)),
    setHeaderProcessedVdiChequeDate: (value) =>
      dispatch(setHeaderProcessedVdiChequeDate(value)),
    setHeaderProcessedVdiChequeNo: (value) =>
      dispatch(setHeaderProcessedVdiChequeNo(value)),
    setHeaderProcessedVdiBankTransfer: (value) =>
      dispatch(setHeaderProcessedVdiBankTransfer(value)),
    setHeaderProcessedVdiQRRefer: (value) =>
      dispatch(setHeaderProcessedVdiQRRefer(value)),
    getCurrentPosition: () => dispatch(getCurrentPosition()),
    setCheckInIsSubmit: (bool) => dispatch(setCheckInIsSubmit(bool)),
    setMileIsSubmit: (bool) => dispatch(setMileIsSubmit(bool)),
    orderAttachImage: (data) => dispatch(orderAttachImage(data)),
    authForGetAccessToken: (auth) => dispatch(authForGetAccessToken(auth)),
    requestQrCodeSCB: (data, amount) =>
      dispatch(requestQrCodeSCB(data, amount)),
    auth: () => dispatch(auth()),
    subscription: (data, accessToken) =>
      dispatch(subscription(data, accessToken)),
    getQRCode: (data, accessToken) => dispatch(getQRCode(data, accessToken)),
    postinvoice: (data, accessToken) =>
      dispatch(postinvoice(data, accessToken)),
    createOrderSaleV3: (data, V3GUID, vanConfig, paymentType) =>
      dispatch(createOrderSaleV3(data, V3GUID, vanConfig, paymentType)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTPaymentForm);
