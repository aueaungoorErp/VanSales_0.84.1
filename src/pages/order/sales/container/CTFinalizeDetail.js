import moment from 'moment';
import React, { Component } from 'react';
import { Alert, Keyboard, Text, TouchableOpacity , View } from 'react-native';
import { connect } from 'react-redux';
import { BluetoothFinder, BluetoothPrinter } from '../../../../module';

import { getCurrentPosition } from '../../../../action/geolocation';
import {
  calculateOrderNetPriceAfterDiscount,
  calculateOrderProductProcessSummary,
  calculateOrderProductSummary,
  clearDisBill,
  createOrderSaleV3,
  orderAttachImage,
  orderReservV3,
  orderReturn,
  orderTransferV3,
  processOrderSale,
  setDisBill1,
  setDisBill2,
  setDisBillProcess,
  setDisCountType1,
  setDisCountType2,
  setHeaderProcessedShipDate,
  setVDIRemark,
  updateOrderSale
} from '../../../../action/order';
import { systemCheck } from '../../../../action/setting';
import { return_Errmessage } from '../../../../api/setting';
import {
  MainTheme,
  paymentLOVItems,
  productFinalizeFormButtonGroup,
  returnLOVItems,
} from '../../../../constant/lov';
import Navigator from '../../../../services/Navigator';
import { discountFormat } from '../../../../utils/Culculate';
import {
  genenrateAttachImageToServer,
  genenrateOrderForCreateToServer,
  genenrateOrderForProcessToServer,
  genenrateOrderForUpdateToServer,
  generateResponseFromServer,
} from '../../../../utils/Order';
import {
  getLoginGuID,
  getSettingConfig,
  getUserToken,
} from '../../../../utils/Token';




import { setIsSubmit as setCheckInIsSubmit } from '../../../../action/check-in';
import { setIsSubmit as setMileIsSubmit } from '../../../../action/mile';
import FinalizeDetail from '../presenter/FinalizeDetail';

class CTFinalizeDetail extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      successMessage: null,
      errorMessage: null,
      submitDisabled: true,
      disabledButton: false,
      paymentType: null,
      returnType: null,
      shipDate: moment().format('DD/MM/YYYY'),
      saleDisable: false,
      returnDisable: false,
      userToken: null,
      processResult: null,
      isAbleoverLimit: false,
      iaAbleOverLimit: false,
      overLimitMessage: null,
    };
  }

  componentDidMount = async (props) => {
    this._isMounted = true;

    await this._getUserToken();

    await this._getActiveUserToken();







    if (this.props.order.header.VDI_USER_REF !== null) {
      if (this.props.order.header.AR_ORDER_TYPE === 'ขายสินค้า') {
        this._setStateUpdateOrderSale();
      } else if (this.props.order.header.AR_ORDER_TYPE === 'รับคืนสินค้า') {
        this._setStateUpdateOrderReturn();
      }
    }
    console.log('componentDidMount', props);
    // if (
    //   this.props.order.header.AR_ORDER_TYPE !== 'โอนย้ายสินค้า' &&
    //   this.props.customer.item.ARCONDITION.ARCD_TRADE_DC !== null &&
    //   this.props.order.orderProductSummary.totalQty > 0
    // ) {
    //   await this._setDisBill1(
    //     this.props.customer.item.ARCONDITION.ARCD_TRADE_DC,
    //   );
    // }

    this._processOrderSale();
    this._setDisType1(true);
    this._setDisType2(false);

  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps, prevState) {
    const nextProcessFail = this.props.order?.orderProductSummary?.ORDER_PROCESS_FAIL;
    const prevProcessFail = prevProps.order?.orderProductSummary?.ORDER_PROCESS_FAIL;
    const shouldShowProcessFail =
      this.props.order?.header?.AR_ORDER_TYPE === 'ขายสินค้า' &&
      this.state.userToken?.VANCONFIG?.VANCNF_NOV_SKU_BAL == 1 &&
      nextProcessFail != '' &&
      nextProcessFail !== this.state.errorMessage;

    if (nextProcessFail !== prevProcessFail && shouldShowProcessFail) {
      this._setErrorMessage(nextProcessFail);
    }

    const processResultChanged =
      prevState.processResult !== this.state.processResult;
    const paymentTypeChanged =
      prevState.paymentType !== this.state.paymentType;
    const customerChanged =
      prevProps.customer?.item?.AR_SUMMARY !== this.props.customer?.item?.AR_SUMMARY;

    if (processResultChanged || paymentTypeChanged || customerChanged) {
      this._validateCreditLimit();
    }
  }

  _getUserToken = async () => {
    const userToken = await getUserToken();

    if (userToken && this._isMounted) {
      await this.setState((oldState) => {
        return {
          userToken: userToken,
        };
      });
    }
  };

  _getActiveUserToken = async () => {
    const latestUserToken = await getUserToken();
    const activeUserToken = latestUserToken || this.state.userToken;

    if (latestUserToken && this._isMounted) {
      await this.setState((oldState) => {
        return {
          userToken: latestUserToken,
        };
      });
    }

    return activeUserToken;
  };

  _setStateUpdateOrderSale = async () => {
    // await this._setSaleDisable(true);
    if (this.props.order.header.AR_ORDER_SUB_TYPE === 'credit') {
      await this._setPaymentType('0');
    } else if (this.props.order.header.AR_ORDER_SUB_TYPE === 'cash') {
      this._setPaymentType('1');
    }
  };

  _setStateUpdateOrderReturn = async () => {
    await this._setReturnDisable(true);
    if (this.props.order.header.AR_ORDER_SUB_TYPE === 'return') {
      await this._setReturnType('0');
    } else if (this.props.order.header.AR_ORDER_SUB_TYPE === 'returnCash') {
      this._setReturnType('1');
    }
  };


  _parseAmount = (value) => {
    const parsedValue = parseFloat(value);

    return Number.isFinite(parsedValue) ? parsedValue : 0;
  };

  _formatAmount = (value) =>
    this._parseAmount(value)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  _getProcessedOrderAmount = (processResult = this.state.processResult) => {
    if (!processResult) {
      return 0;
    }

    const amountCandidates = [
      processResult?.ARDETAIL?.ARD_A_AMT,
      processResult?.AROE?.AROE_A_AMT,
      processResult?.DOCINFO?.DI_AMOUNT,
    ];

    for (const amount of amountCandidates) {
      const parsedAmount = parseFloat(amount);

      if (Number.isFinite(parsedAmount)) {
        return parsedAmount;
      }
    }

    return 0;
  };

  _setCreditLimitState = (isAbleoverLimit, overLimitMessage = null) => {
    if (
      this.state.isAbleoverLimit === isAbleoverLimit &&
      this.state.overLimitMessage === overLimitMessage
    ) {
      return;
    }

    this._isMounted && this.setState({
      isAbleoverLimit,
      overLimitMessage,
    });
  };

  _validateCreditLimit = (processResult = this.state.processResult) => {
    const isSalesOrder = this.props.order?.header?.AR_ORDER_TYPE === 'ขายสินค้า';
    const isCashPayment = this.state.paymentType === '1';
    const iaAbleOverLimit = false;
    const creditSummary = this.props.customer?.item?.AR_SUMMARY;
    const creditLimit = this._parseAmount(creditSummary?.ARS_CRE_LIM);
    const creditRemain = this._parseAmount(creditSummary?.ARS_CRE_REMAIN_NPDC);
    const processedAmount = this._getProcessedOrderAmount(processResult);

    if (this.state.iaAbleOverLimit !== iaAbleOverLimit) {
      this._isMounted && this.setState({ iaAbleOverLimit });
      return false;
    }

    if (!isSalesOrder || isCashPayment) {
      this._setCreditLimitState(true, null);
      return true;
    }

    if (!processResult || processedAmount <= 0) {
      this._setCreditLimitState(false, null);
      return false;
    }

    if (creditLimit <= 0) {
      this._setCreditLimitState(true, null);
      return true;
    }

    console.log('credit-limit-check', {
      customerCode: this.props.customer?.item?.INFO?.AR_CODE,
      customerName: this.props.customer?.item?.INFO?.AR_NAME,
      iaAbleOverLimit,
      creditLimit,
      creditRemain,
      processedAmount,
    });

    if (iaAbleOverLimit) {
      this._setCreditLimitState(true, null);
      return true;
    }

    if (processedAmount > creditRemain) {
      this._setCreditLimitState(
        false,
        'เกินกว่าวงเงินคงเหลือที่กำหนด (คงเหลือ ' +
          this._formatAmount(creditRemain) +
          ' บาท)',
      );
      return false;
    }

    this._setCreditLimitState(true, null);
    return true;
  };
  _setDisBill1 = async (value) => {
    this._setSubmitDisabled(true);
    await this.props.setDisBill1(discountFormat(value));
    await this.props.calculateOrderNetPriceAfterDiscount();
  };

  _setDisBill2 = async (value) => {
    this._setSubmitDisabled(true);
    await this.props.setDisBill2(discountFormat(value));
    await this.props.calculateOrderNetPriceAfterDiscount();
  };


  _changePaymentType = async (value) => {
    this._setSubmitDisabled(true);
    this._processOrderSale();
  };

  _setDisType1 = async (value) => {
    // console.log('VALUE ', value);
    await this.props.setDisCountType1(value);
  };
  _setDisType2 = async (value) => {
    await this.props.setDisCountType2(value);
  };


  // _totalItems= async (value) => {
  //     await this.props.setT(value);
  //   };ggg

  _setVDIRemark = async (value) => {
    this._setSubmitDisabled(true);
    await this.props.setVDIRemark(value);
  };

  _onPress = async (item) => {
    // console.log('item.methodName =>', item.methodName);
    // console.log('this.state.submitDisabled =>', this.state.submitDisabled);
    // console.log('this.state.disabledButton =>', this.state.disabledButton);


    const activeUserToken = await this._getActiveUserToken();
    const activeVanConfig = activeUserToken?.VANCONFIG;

    if (!activeVanConfig) {
      this._setErrorMessage('ไม่พบข้อมูล VANCONFIG กรุณาเข้าใช้งานใหม่');
      Keyboard.dismiss();
      return;
    }

    if (!this.state.isLoading) {
      this._setErrorMessage(null);
      this._setSuccessMessage(null);
      if (item.methodType === 'function') {
        if (item.methodName === 'confirm') {
          if (!this.state.isAbleoverLimit) {
            this._validateCreditLimit();
            Keyboard.dismiss();
            return;
          }

          if (this.props.order.header.AR_ORDER_TYPE === 'ขายสินค้า') {

            console.log(
              'ขายสินค้า this.state.paymentType',
              this.state.paymentType
            );



            if (this.state.paymentType !== null) {
              // console.log('ขายเชื่อ 0');
              if (this.state.paymentType === '0') {
                //ขายเชื่อ
                console.log('ขายเชื่อ 1');
                if (activeVanConfig.VANCNF_ENABLE_AR == 2) {
                  console.log('ขายเชื่อ 2');
                  if (this.props.order.header.VDI_USER_REF === null) {
                    console.log('ขายเชื่อ 3');
                    this._createOrderSale();
                  } else {
                    this._updateOrderSale();
                  }
                } else {
                  this._setErrorMessage('ไม่สามารถบันทึกขายเชื่อได้');
                }
              } else {
                if (
                  activeVanConfig.VANCNF_ENABLE_CASH == 2 ||
                  activeVanConfig.VANCNF_CHEQUE == 2 //||
                  // this.state.userToken.VANCONFIG.VANCNF_BANK_TRANSFER_USE ===
                  //   2 ||
                  // this.state.userToken.VANCONFIG.VANCNF_BANK_QRCODE_USE === 2
                ) {
                  console.log('ขายสด 1');
                  console.log('renderthis.state.processResult', this.state.processResult);
                  Navigator.navigate('OrderSalesPayment', {
                    processResult: this.state.processResult,
                  });
                  //   Navigator.navigate('OrderSalesPayment');
                } else {
                  this._setErrorMessage('ไม่สามารถชำระด้วยเงินสดได้');
                }
              }
            } else {
              this._setErrorMessage('โปรดเลือกประเภทการชำระ');
            }
          } else if (this.props.order.header.AR_ORDER_TYPE === 'รับคืนสินค้า') {
            if (this.state.returnType !== null) {
              this._orderReturn();
            } else {
              this._setErrorMessage('โปรดเลือกประเภทการคืน');
            }
          } else if (this.props.order.header.AR_ORDER_TYPE === 'จองสินค้า') {
            this._orderReserv();
          } else if (this.props.order.header.AR_ORDER_TYPE === 'โอนย้ายสินค้า') {
            this._orderTransfer();
          }
        } else if (item.methodName === 'process') {
          this._processOrderSale();
        } else if (item.methodName === 'clear') {
          this.props.clearDisBill();
        } else if (item.methodName === 'back') {
          this._backAlertDialog();
        }
      } else if (item.methodType === 'new-page') {
        // console.log("item.methodType === 'new-page'");
        console.log("item.screen", item.screen);
        // Navigator.navigate(item.screen, {
        //   actionType: 'orderProductSummaryProcessed',
        // });
      }
    }
    Keyboard.dismiss();
  };

  _backAlertDialog = () =>
    Alert.alert(
      'ประกาศ',
      'คุณแน่ใจว่าจะออกจากหน้าจอนี้',
      [
        { text: 'ยกเลิก', onPress: () => { }, style: 'cancel' },
        { text: 'ยืนยัน', onPress: () => Navigator.back() },
      ],
      { cancelable: false },
    );

  _getCurrentPosition = async () => {
    try {
      await getCurrentPosition();
    } catch (error) {
      this._setErrorMessage('ไม่สามารถจับตำแหน่ง GPS ได้');
      return false;
    }
    return true;
  };

  _orderReturn = async () => {
    try {
      this._setIsLoading(true);
      this._setErrorMessage(null);
      this._setSuccessMessage(null);
      const activeUserToken = await this._getActiveUserToken();
      const activeVanConfig = activeUserToken?.VANCONFIG;

      if (!activeVanConfig) {
        this._setErrorMessage('ไม่พบข้อมูล VANCONFIG กรุณาเข้าใช้งานใหม่');
        this._setIsLoading(false);
        return;
      }

      // console.log('_orderReturn');
      // console.log('_orderReturn this.state.returnType ', this.state.returnType);
      // console.log(
      //   '_orderReturn this.props.order.header.VDI_USER_REF ',
      //   this.props.order.header.VDI_USER_REF,
      // );
      if (
        activeVanConfig.VANCNF_ENABLE_AR != 2 &&
        this.state.returnType == '0'
      ) {
        this._setErrorMessage('ไม่สามารถบันทึกรับคืนเชื่อได้');
        this._setIsLoading(false);
        return;
      }

      const { baseUrl, vanCNFMachine } = await getSettingConfig();
      const { VANCONFIG } = await getUserToken();
      const response = await this.props.systemCheck({
        baseUrl: baseUrl,
        vanCNFMachine: VANCONFIG,
      });

      //await this.props.calculateOrderProductSummary();

      const { RESPONSE_DATETIME, ResponseData } = response;
      const responseData = JSON.parse(ResponseData);
      const timeArray = RESPONSE_DATETIME.split(':');
      const v3GUID = await getLoginGuID();
      if (
        parseInt(timeArray[0] + timeArray[1]) >=
        parseInt(VANCONFIG.VANCNF_TIME_FM) &&
        parseInt(timeArray[0] + timeArray[1]) <=
        parseInt(VANCONFIG.VANCNF_TIME_TO)
      ) {
        if (this.props.order.header.VDI_USER_REF === null) {
          console.log('RTN CREATE ');
          await this.props.orderReturn(
            genenrateOrderForCreateToServer(
              this.props.order,
              this.props.mile.item.mileage,
              this.props.geolocation.position,
            ),
            this.state.returnType,
            VANCONFIG,
            v3GUID,
          );
        } else {
          console.log('RTN UPDATE ');
          await this.props.orderReturn(
            genenrateOrderForUpdateToServer(
              genenrateOrderForCreateToServer(
                this.props.order,
                this.props.mile.item.mileage,
                this.props.geolocation.position,
              ),
              this.props.order.header,
            ),
            this.state.returnType,
            VANCONFIG,
            v3GUID,
          );
        }

        // if (
        //   this.props.checkin.item.photo !== null &&
        //   this.props.checkin.item.isSubmit === false
        // ) {
        //   await this._orderAttachImage();
        // }

        // if (
        //   this.props.mile.item.photo !== null &&
        //   this.props.mile.item.isSubmit === false
        // ) {
        //   await this._orderMileAttachImage();
        // }
        // console.log('this.state.processResult ', this.state.processResult);
        // this._printReceipt(this.state.returnType === '0' ? 'return' : 'returnCash')
        this._setSuccessMessage('ส่งรายการเรียบร้อย');
        Navigator.navigate('OrderSalesSummary', {
          actionType: 'orderProductSummaryProcessed',
          printType: this.state.returnType === '0' ? 'return' : 'returnCash',
          processResult: this.state.processResult,
        });
        // Navigator.navigate('OrderChoice')}
      } else {
        const errorStr =
          'ไม่สามารถทำรายการได้เนื่องจากเกินช่วงเวลาที่กำหนด ( ' +
          VANCONFIG.VANCNF_TIME_FM[0] +
          VANCONFIG.VANCNF_TIME_FM[1] +
          ':' +
          VANCONFIG.VANCNF_TIME_FM[2] +
          VANCONFIG.VANCNF_TIME_FM[3] +
          ' - ' +
          VANCONFIG.VANCNF_TIME_TO[0] +
          VANCONFIG.VANCNF_TIME_TO[1] +
          ':' +
          VANCONFIG.VANCNF_TIME_TO[2] +
          VANCONFIG.VANCNF_TIME_TO[3] +
          ' )';
        this._setErrorMessage(errorStr);
        console.log("errorStr : ", errorStr)
      }
    } catch (error) {
      console.log("error : ", error)
      this._setErrorMessage(error);
    }
    this._setIsLoading(false);
  };

  _orderReserv = async () => {
    try {
      this._setIsLoading(true);
      this._setErrorMessage(null);
      this._setSuccessMessage(null);
      const { baseUrl, vanCNFMachine } = await getSettingConfig();
      const { VANCONFIG } = await getUserToken();
      const response2 = await this.props.systemCheck({
        baseUrl: baseUrl,
        vanCNFMachine: VANCONFIG,
      });
      const { RESPONSE_DATETIME, ResponseData } = response2;
      const responseData = JSON.parse(ResponseData);
      const timeArray = RESPONSE_DATETIME.split(':');

      // console.log('_orderReserv RESPONSE_DATETIME', RESPONSE_DATETIME);
      // console.log(
      //   '_orderReserv timeArray2',
      //   parseInt(timeArray[0] + timeArray[1]),
      // );
      // console.log(
      //   '_orderReserv  parseInt(this.state?.VANCONFIG?.VANCNF_TIME_FM)',
      //   parseInt(VANCONFIG.VANCNF_TIME_FM),
      // );
      // console.log(
      //   '_orderReserv  parseInt(this.state?.VANCONFIG?.VANCNF_TIME_TO)',
      //   parseInt(VANCONFIG.VANCNF_TIME_TO),
      // );
      if (
        parseInt(timeArray[0] + timeArray[1]) >=
        parseInt(VANCONFIG.VANCNF_TIME_FM) &&
        parseInt(timeArray[0] + timeArray[1]) <=
        parseInt(VANCONFIG.VANCNF_TIME_TO)
      ) {
        await this.props.setHeaderProcessedShipDate(
          moment(this.state.shipDate, 'DD/MM/YYYY').add(1, 'days').toJSON(),
        );

        console.log('shipDate 11', this.props.order.header);
        // console.log('shipDate 31' , this.props.order.header.VDI_SHIP_DATE) ; 


        this.state.processResult.TRANSTKH.TRH_SHIP_DATE = moment(this.state.shipDate, 'DD/MM/YYYY').format('YYYYMMDDHHmm');
        this.props.order.header.VDI_SHIP_DATE = moment(this.state.shipDate, 'DD/MM/YYYY').format('YYYYMMDDHHmm');
        const v3GUID = await getLoginGuID();

        let res = null;
        if (this.props.order.header.VDI_USER_REF === null) {
          res = await this.props.orderReservV3(
            genenrateOrderForCreateToServer(
              this.props.order,
              this.props.mile.item.mileage,
              this.props.geolocation.position,
            ),
            v3GUID,
            VANCONFIG,
            'create',
          );
        } else {
          res = await this.props.orderReservV3(
            genenrateOrderForUpdateToServer(
              genenrateOrderForCreateToServer(
                this.props.order,
                this.props.mile.item.mileage,
                this.props.geolocation.position,
              ),
              this.props.order.header,
            ),
            v3GUID,
            VANCONFIG,
            'update',
          );
        }
        // console.log('_orderReserv res', res);
        // if (
        //   this.props.checkin.item.photo !== null &&
        //   this.props.checkin.item.isSubmit === false
        // ) {
        //   await this._orderAttachImage();
        // }

        // if (
        //   this.props.mile.item.photo !== null &&
        //   this.props.mile.item.isSubmit === false
        // ) {
        //   await this._orderMileAttachImage();
        // }

        // this._printReceipt('reserv')

        this._setSuccessMessage('ส่งรายการเรียบร้อย');
        Navigator.navigate('OrderSalesSummary', {
          actionType: 'orderProductSummaryProcessed',
          printType: 'reserv',
          processResult: this.state.processResult,
        });
        // Navigator.navigate('OrderChoice')
      } else {
        const errorStr =
          'ไม่สามารถทำรายการได้เนื่องจากเกินช่วงเวลาที่กำหนด ( ' +
          VANCONFIG.VANCNF_TIME_FM[0] +
          VANCONFIG.VANCNF_TIME_FM[1] +
          ':' +
          VANCONFIG.VANCNF_TIME_FM[2] +
          VANCONFIG.VANCNF_TIME_FM[3] +
          ' - ' +
          VANCONFIG.VANCNF_TIME_TO[0] +
          VANCONFIG.VANCNF_TIME_TO[1] +
          ':' +
          VANCONFIG.VANCNF_TIME_TO[2] +
          VANCONFIG.VANCNF_TIME_TO[3] +
          ' )';
        this._setErrorMessage(errorStr);
        console.log("errorStr : 2", errorStr)

      }
    } catch (error) {
      this._setErrorMessage(error);
      console.log("error : 2", error)

    }
    this._setIsLoading(false);
  };

  _orderTransfer = async () => {
    try {
      this._setIsLoading(true);
      this._setErrorMessage(null);
      this._setSuccessMessage(null);

      const { baseUrl, vanCNFMachine } = await getSettingConfig();
      const { VANCONFIG } = await getUserToken();
      const response2 = await this.props.systemCheck({
        baseUrl: baseUrl,
        vanCNFMachine: VANCONFIG,
      });
      const { RESPONSE_DATETIME, ResponseData } = response2;
      const responseData = JSON.parse(ResponseData);
      const timeArray = RESPONSE_DATETIME.split(':');
      if (
        parseInt(timeArray[0] + timeArray[1]) >=
        parseInt(VANCONFIG.VANCNF_TIME_FM) &&
        parseInt(timeArray[0] + timeArray[1]) <=
        parseInt(VANCONFIG.VANCNF_TIME_TO)
      ) {
        const v3GUID = await getLoginGuID();
        // console.log('v3GUID ', v3GUID);
        const userToken = await getUserToken();
        const response2 = await this.props.orderTransferV3(
          genenrateOrderForCreateToServer(
            this.props.order,
            this.props.mile.item.mileage,
            this.props.geolocation.position,
          ),
          v3GUID,
          VANCONFIG,
        );
        const { ResponseData, ResponseCode, ReasonString } = response2;
        if (ResponseCode === '200') {
          console.log('createOrderSaleV3 response2:', response2);
        }
        this._setSuccessMessage('ส่งรายการเรียบร้อย');

        Navigator.navigate('OrderSalesSummary', {
          actionType: 'orderProductSummaryProcessed',
          printType: 'transfer',
          processResult: this.state.processResult,
        });
      } else {
        const errorStr =
          'ไม่สามารถทำรายการได้เนื่องจากเกินช่วงเวลาที่กำหนด ( ' +
          VANCONFIG.VANCNF_TIME_FM[0] +
          VANCONFIG.VANCNF_TIME_FM[1] +
          ':' +
          VANCONFIG.VANCNF_TIME_FM[2] +
          VANCONFIG.VANCNF_TIME_FM[3] +
          ' - ' +
          VANCONFIG.VANCNF_TIME_TO[0] +
          VANCONFIG.VANCNF_TIME_TO[1] +
          ':' +
          VANCONFIG.VANCNF_TIME_TO[2] +
          VANCONFIG.VANCNF_TIME_TO[3] +
          ' )';
        this._setErrorMessage(errorStr);
        console.log("errorStr : 3", errorStr)

      }
    } catch (error) {
      this._setErrorMessage(error);
      console.log("error : 3", error)

    }
    this._setIsLoading(false);
  };

  _createOrderSale = async () => {
    try {
      // if (this.props.bluetooth.state !== 'connected') {
      //     this._bluetoothAlertDialog()
      //     return
      // }
      if (this.state.paymentType !== null) {
        this._setIsLoading(true);
        this._setErrorMessage(null);
        this._setSuccessMessage(null);

        const { baseUrl, vanCNFMachine } = await getSettingConfig();
        const { VANCONFIG } = await getUserToken();
        const response = await this.props.systemCheck({
          baseUrl: baseUrl,
          vanCNFMachine: VANCONFIG,
        });
        const { RESPONSE_DATETIME, ResponseData } = response;
        const responseData = JSON.parse(ResponseData);
        const timeArray = RESPONSE_DATETIME.split(':');
        //console.log('_createOrderSale config', config);
        // console.log(
        //   '_createOrderSale timeArray',
        //   parseInt(timeArray[0] + timeArray[1]),
        // );
        // console.log(
        //   '_createOrderSale  parseInt(this.state.config?.VANCONFIG?.VANCNF_TIME_FM)',
        //   parseInt(VANCONFIG.VANCNF_TIME_FM),
        // );
        // console.log(
        //   '_createOrderSale  parseInt(this.state.config?.VANCONFIG?.VANCNF_TIME_TO)',
        //   parseInt(VANCONFIG.VANCNF_TIME_TO),
        // );
        console.log('_createOrderSale this.props.order', this.props.order);
        if (
          parseInt(timeArray[0] + timeArray[1]) >=
          parseInt(VANCONFIG.VANCNF_TIME_FM) &&
          parseInt(timeArray[0] + timeArray[1]) <=
          parseInt(VANCONFIG.VANCNF_TIME_TO)
        ) {
          const userToken = await getUserToken();
          const v3GUID = await getLoginGuID();
          const response2 = await this.props.createOrderSaleV3(
            genenrateOrderForCreateToServer(
              this.props.order,
              this.props.mile.item.mileage,
              this.props.geolocation.position,
            ),
            v3GUID,
            VANCONFIG,
            '0'
          );
          const { ResponseData, ResponseCode, ReasonString } = response2;
          if (ResponseCode === '200') {
            // console.log('createOrderSaleV3 response2:', response2);

            this._setSubmitDisabled(false);

            // if (
            //   this.props.checkin.item.photo !== null &&
            //   this.props.checkin.item.isSubmit === false
            // ) {
            //   await this._orderAttachImage();
            // }

            // if (
            //   this.props.mile.item.photo !== null &&
            //   this.props.mile.item.isSubmit === false
            // ) {
            //   await this._orderMileAttachImage();
            // }

            this._setSuccessMessage('ส่งรายการเรียบร้อย');

            Navigator.navigate('OrderSalesSummary', {
              actionType: 'orderProductSummaryProcessed',
              printType: 'credit',
              processResult: this.state.processResult,
            });

            // Navigator.navigate('OrderChoice')
          } else {
            this._setErrorMessage(ReasonString);
            console.log("ReasonString : ", ReasonString)

          }
        } else {
          const errorStr =
            'ไม่สามารถทำรายการได้เนื่องจากเกินช่วงเวลาที่กำหนด ( ' +
            VANCONFIG.VANCNF_TIME_FM[0] +
            VANCONFIG.VANCNF_TIME_FM[1] +
            ':' +
            VANCONFIG.VANCNF_TIME_FM[2] +
            VANCONFIG.VANCNF_TIME_FM[3] +
            ' - ' +
            VANCONFIG.VANCNF_TIME_TO[0] +
            VANCONFIG.VANCNF_TIME_TO[1] +
            ':' +
            VANCONFIG.VANCNF_TIME_TO[2] +
            VANCONFIG.VANCNF_TIME_TO[3] +
            ' )';
          this._setErrorMessage(errorStr);
          console.log("errorStr : 4", errorStr)

        }
      } else {
        this._setErrorMessage('โปรดเลือกประเภทการชำระ');
      }
    } catch (error) {
      console.log("_createOrderSale Error")
      this._setErrorMessage(error);
      console.log("error : 4", error)

    }

    this._setIsLoading(false);
  };

  _updateOrderSale = async () => {
    try {
      if (this.state.paymentType !== null) {
        this._setIsLoading(true);
        this._setErrorMessage(null);
        this._setSuccessMessage(null);

        const response = await this.props.updateOrderSale(
          genenrateOrderForUpdateToServer(
            genenrateOrderForCreateToServer(
              this.props.order,
              this.props.mile.item.mileage,
              this.props.geolocation.position,
            ),
            this.props.order.header,
          ),
        );

        const { RESULT_DATA, STATUS, ERROR_MESSAGES } = response;

        if (STATUS === '00') {
          this._setSubmitDisabled(false);
          // this._printReceipt('credit')

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

          this._setSuccessMessage('ส่งรายการเรียบร้อย');
          Navigator.navigate('OrderSalesSummary', {
            actionType: 'orderProductSummaryProcessed',
            printType: 'credit',
            processResult: this.state.processResult,
          });
          // Navigator.navigate('OrderChoice')
        } else if (STATUS === '10' && ERROR_MESSAGES[0]) {
          this._setErrorMessage(ERROR_MESSAGES[0]);
          console.log("ERROR_MESSAGES[0] ", ERROR_MESSAGES[0])

        }
      } else {
        this._setErrorMessage('โปรดเลือกประเภทการชำระ');
      }
    } catch (error) {
      this._setErrorMessage(error);
      console.log("error : 5", error)

    }
    this._setIsLoading(false);
  };

  _processOrderSale = async () => {
    try {
      this._setIsLoading(true);
      this._setErrorMessage(null);
      this._setSuccessMessage(null);




      if (
        this.props.order.orderProductSummary.totalQty === 0 &&
        (parseFloat(this.props.order.orderProductSummary.DIS_BILL_1) > 0 ||
          parseFloat(this.props.order.orderProductSummary.DIS_BILL_2) > 0)
      ) {
        this._setErrorMessage(
          'ไม่สามารถใส่ส่วนลดได้เนื่องจากไม่มีสินค้าที่มีมูลค่าขาย',
        );
        this._setIsLoading(false);
        return;
      }

      if (
        (
          this.props.order.orderProductSummary.DIS_COUNT_TYPE1 && parseFloat(this.props.order.orderProductSummary.DIS_BILL_1) > 100
          ||
          (this.props.order.orderProductSummary.DIS_COUNT_TYPE2 && parseFloat(this.props.order.orderProductSummary.DIS_BILL_1))
          > parseFloat(this.state.processResult?.ARDETAIL?.ARD_G_KEYIN)
        )
      ) {
        this._setErrorMessage(
          'ไม่สามารถใส่ส่วนลดได้ กรุณาตรวจสอบ',
        );
        this._setIsLoading(false);
        return;
      }







      // console.log(
      //   '_processOrderSale this.props.customer.item',
      //   this.props.customer.item,
      // );

      // console.log('this.props.order.orderProductSummary66' , this.props.order.orderProductSummary)







      // เช๊คจากเกินช่วงเวลาที่กำหนด

      const { VANCONFIG } = await getUserToken();

      // const {baseUrl, vanCNFMachine} = await getSettingConfig();
      // const responsecheck = await this.props.systemCheck({
      //         baseUrl: baseUrl,
      //         vanCNFMachine: VANCONFIG,
      //       });
      //  const {RESPONSE_DATETIME, ResponseDatacheck} = responsecheck;
      // // const responseData = JSON.parse(ResponseDatacheck);
      // console.log('RESPONSE_DATETIME' , RESPONSE_DATETIME);
      // console.log('VANCONFIG.VANCNF_TIME_FM1' , VANCONFIG.VANCNF_TIME_FM);
      // console.log('VANCONFIG.VANCNF_TIME_TO' , VANCONFIG.VANCNF_TIME_TO);


      //  const timeArray = RESPONSE_DATETIME.split(':');
      //     console.log("item Bazzz .timeArray", timeArray);
      //     console.log("item Bazzz .timeArray", parseInt(timeArray[0] + timeArray[1]));
      //     console.log("item Bazzz .timeArray", parseInt(VANCONFIG.VANCNF_TIME_FM));
      //     console.log("item Bazzz .timeArray", parseInt(VANCONFIG.VANCNF_TIME_TO));

      //       if (parseInt(timeArray[0] + timeArray[1]) >=
      //           parseInt(VANCONFIG.VANCNF_TIME_FM) &&
      //           parseInt(timeArray[0] + timeArray[1]) <=
      //           parseInt(VANCONFIG.VANCNF_TIME_TO)
      //       ) {
      //         } else {
      //         const errorStr =
      //           'ไม่สามารถทำรายการได้เนื่องจากเกินช่วงเวลาที่กำหนด \n\r(' +
      //           VANCONFIG.VANCNF_TIME_FM.substring(0, 2) + ":" + VANCONFIG.VANCNF_TIME_FM.substring(2, 4) + ' น. - ' +
      //           VANCONFIG.VANCNF_TIME_TO.substring(0, 2) + ":" + VANCONFIG.VANCNF_TIME_TO.substring(2, 4) + ' น.)';

      //         this._setErrorMessage(errorStr);
      //         this._setIsLoading(false);
      //         return;
      //       }

      if (this.props.order.header.AR_ORDER_TYPE === 'ขายสินค้า') {
        if (this.props.customer.item.AR_SUMMARY.ARS_CRE_LIM > 0) {
          // this.state.paymentType === 0 ขายเชื่อ  , 1 ขายสด

          if (VANCONFIG.VANCNF_NOV_CRE_LIM === 1 && this.state.paymentType !== "1") {
            //  console.log('_processOrderSale this.props.customer.ARS_CRE_LIM', this.props.customer.item.AR_SUMMARY.ARS_CRE_LIM, );
            //  console.log('this.props.order.orderProductSummary.totalQty', this.props.order.orderProductSummary, );
            //  console.log('this.props.customer.item', this.props.customer.item, );
            //  console.log(' Bazzzz ',this.props.customer.item.AR_SUMMARY.ARS_CRE_REMAIN_NPDC - this.props.order.orderProductSummary.totalPrice, );

            if (this.props.customer.item.AR_SUMMARY.ARS_CRE_REMAIN_NPDC - this.props.order.orderProductSummary.totalPrice < 0) {
              this._setErrorMessage('ไม่สามารถขายเกินวงเงินคงเหลือได้ ( ' + parseFloat(this.props.customer.item.AR_SUMMARY.ARS_CRE_REMAIN_NPDC).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' บาท)',);
              this._setIsLoading(false);
              return;
            }
            //  console.log('ไม่สามารถขายเกินวงเงินเครดิต', this.props.customer.item.AR_SUMMARY.ARS_CRE_LIM, );
            //  console.log('ไม่สามารถขายเกินวงเงินคงเหลือ', this.props.customer.item.AR_SUMMARY.ARS_CRE_REMAIN_NPDC, );

          }
        }

      }

      if (this.props.order.orderProductSummary.DIS_BILL_1 != '' &&
        this.props.order.orderProductSummary.DIS_BILL_1 != null) {

        if (
          this.props.order.orderProductSummary.DIS_BILL_1.includes('B') &&
          this.props.order.orderProductSummary.DIS_BILL_2 ===
          undefined) {
          this.props.order.orderProductSummary.DIS_COUNT_TYPE1 = false;
          this.props.order.orderProductSummary.DIS_COUNT_TYPE2 = true;
          this.props.order.orderProductSummary.DIS_BILL_1 = this.props.order.orderProductSummary.DIS_BILL_1.replace('BB', 'B')

        }
      } else {
        this.props.order.orderProductSummary.DIS_BILL_1 = ''
        this.props.order.orderProductSummary.DIS_BILL_2 = ''
      }

      this.props.order.header.VDI_AF_DISC = this.props.order.orderProductSummary.totalPrice !== "" ? this.props.order.orderProductSummary.totalPrice : 0;

      // Bazz
      const response = await this.props.processOrderSale(
        genenrateOrderForProcessToServer(
          this.props.order,
          this.props.order.header.AR_ORDER_TYPE === 'รับคืนสินค้า' ||
            this.props.order.header.AR_ORDER_TYPE === 'โอนย้ายสินค้า'
            ? true
            : false,
          this.props.order.header.AR_ORDER_TYPE === 'รับคืนสินค้า' ||
            this.props.order.header.AR_ORDER_TYPE === 'จองสินค้า' ||
            this.props.order.header.AR_ORDER_TYPE === 'ใบเสนอราคา'
            ? 1
            : 0,

          typeof this.props.order.orderProductSummary.DIS_COUNT_TYPE1 ===
            'undefined'
            ? true
            : this.props.order.orderProductSummary.DIS_COUNT_TYPE1,

          this.props.order.header.AR_ORDER_TYPE,
        ),
        this.props.order,
        VANCONFIG,
      );
      // console.log('CTFinalizeDetail AWDDWD this.props.order', this.props.order);



      const { ResponseData, ResponseCode, ReasonString } = response;
      console.log('CTFinalizeDetail AWDDWD', response);
      // console.log(
      //   ' this.props.order.orderProductSummary.DIS_BILL_1: ',
      //   this.props.order.orderProductSummary.DIS_BILL_1,
      // );
      // console.log(
      //   ' this.props.order.orderProductSummary.DIS_BILL_2: ',
      //   this.props.order.orderProductSummary.DIS_BILL_2,
      // );

      // console.log(
      //   ' this.props.order.orderProductSummary.DIS_BILL_2: ',
      //   this.props.order.orderProductSummary,
      // );

      if (ResponseCode == 200) {
        let responseData = JSON.parse(ResponseData);
        // console.log('responseData333', responseData);

        let sumfree = 0
        let totalQty = 0
        for (let i in responseData.TRANSTKD) {
          sumfree += parseFloat(responseData.TRANSTKD[i].TRD_Q_FREE);
          totalQty += parseFloat(responseData.TRANSTKD[i].TRD_QTY);
        }

        this.props.order.orderProductSummary.totalItems = parseFloat(responseData.DOCINFO.DI_ITEMS);
        this.props.order.orderProductSummary.totalFree = parseFloat(sumfree);
        this.props.order.orderProductSummary.totalQty = parseFloat(totalQty);

        // console.log('responseData333t', this.props.order.header.AR_ORDER_TYPE);


        if (this.props.order.orderProductSummary.DIS_COUNT_TYPE1 == true) {
          if (this.props.order.header.AR_ORDER_TYPE === 'โอนย้ายสินค้า') {
            this.props.order.orderProductSummary.DIS_BILL_1_AFTER_DISCOUNT = 0;
            this.props.order.orderProductSummary.DIS_BILL_2_AFTER_DISCOUNT = 0;
          } else {
            this.props.order.orderProductSummary.DIS_BILL_1_AFTER_DISCOUNT =
              (
                (this.props.order.orderProductSummary.DIS_BILL_1 / 100) * (responseData?.AROE && responseData?.AROE?.AROE_G_KEYIN ? responseData.AROE.AROE_G_KEYIN : responseData.ARDETAIL.ARD_G_KEYIN)
              );
            this.props.order.orderProductSummary.DIS_BILL_2_AFTER_DISCOUNT =
              (
                parseFloat(this.props.order.orderProductSummary.DIS_BILL_2) > 0 ?
                  (this.props.order.orderProductSummary.DIS_BILL_2 / 100) * (responseData?.AROE && responseData?.AROE?.AROE_G_KEYIN ? responseData.AROE.AROE_G_KEYIN : responseData.ARDETAIL.ARD_G_KEYIN) - ((this.props.order.orderProductSummary.DIS_BILL_2 / 100) * (this.props.order.orderProductSummary.DIS_BILL_1_AFTER_DISCOUNT))
                  : 0
              );

            // console.log('responseData333', (responseData ?.AROE && responseData ?.AROE  ?.AROE_G_KEYIN ? responseData.AROE.AROE_G_KEYIN :  responseData.ARDETAIL.ARD_G_KEYIN));
            // console.log('responseData333',   ((this.props.order.orderProductSummary.DIS_BILL_2 / 100) * (this.props.order.orderProductSummary.DIS_BILL_1_AFTER_DISCOUNT)));

          }
        } else if (this.props.order.orderProductSummary.DIS_COUNT_TYPE2 == true) {
          if (this.props.order.header.AR_ORDER_TYPE === 'โอนย้ายสินค้า') {
            this.props.order.orderProductSummary.DIS_BILL_1_AFTER_DISCOUNT = 0;
            this.props.order.orderProductSummary.DIS_BILL_2_AFTER_DISCOUNT = 0;
          } else {
            this.props.order.orderProductSummary.DIS_BILL_1_AFTER_DISCOUNT = parseFloat(this.props.order.orderProductSummary.DIS_BILL_1.replace('B', ''));
            this.props.order.orderProductSummary.DIS_BILL_1 = this.props.order.orderProductSummary.DIS_BILL_1.replace('B', '');

            this.props.order.orderProductSummary.DIS_BILL_2 = 0;
          }
        }




        //await this.props.calculateOrderNetPriceAfterDiscount();
        //await this.props.calculateOrderProductSummary();
        //await this.props.calculateOrderProductProcessSummary()


        this._setSubmitDisabled(false);
        this._setSuccessMessage('รวมยอดสำเร็จ');

        if (this.props.order.header.AR_ORDER_TYPE != 'โอนย้ายสินค้า') {
          const ddd = await generateResponseFromServer(responseData);
          // console.log('dddddddddddddddd2 ', ddd);
          this._isMounted && await this.setState({ processResult: ddd });
          this._validateCreditLimit(ddd);
          // await this.props.calculateOrderProductProcessSummary();


          // console.log(
          //       ' this.props.order.orderProductSummary Bazz: ',
          //       this.props.order.orderProductSummary,
          //     );


          typeof this.props.order.orderProductSummary.DIS_COUNT_TYPE1 ===
            'undefined'
            ? await this.props.setDisBillProcess(
              this.props.order.orderProductSummary.DIS_BILL_1,
              this.props.order.orderProductSummary.DIS_BILL_2,
            )
            : await this.props.setDisBillProcess(
              this.props.order.orderProductSummary.DIS_BILL_1,
              this.props.order.orderProductSummary.DIS_BILL_2,
            );
        }
      } else {
        this._setErrorMessage(await return_Errmessage(ResponseCode));
        console.log("ResponseCode : 6", await return_Errmessage(ResponseCode))

      }
    } catch (error) {
      this._setErrorMessage(error.message);
      console.log("error.message : 6", error.message)

    }
    this._setIsLoading(false);
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

  _printReceipt = async (type) => {
    if (this.props.bluetooth.state == 'connected') {
      const userToken = await getUserToken();
      BluetoothPrinter.printSaleReceipt(
        this.props.order.headerProcessed,
        this.props.order.productListItemsPRTProcessed,
        this.props.order.orderProductSummaryProcessed,
        userToken.VANCONFIG,
        userToken.COMPANYINFO,
        this.props.customer.item.INFO,
        type,
      );
    }
  };

  _setIsLoading = (value) => {
    this._isMounted && this.setState((oldState) => {
      return {
        isLoading: value,
      };
    });
  };

  _setSuccessMessage = (value) => {
    this._isMounted && this.setState((oldState) => {
      return {
        successMessage: value,
      };
    });
  };

  _setErrorMessage = (value) => {
    this._isMounted && this.setState((oldState) => {
      return {
        errorMessage: value,
      };
    });
  };

  _setSubmitDisabled = (bool) => {
    this._isMounted && this.setState((oldState) => {
      return {
        submitDisabled: bool,
      };
    });
  };


  _setDisabledButton = (value) => {
    this._isMounted &&
      this.setState((oldState) => {
        return {
          disabledButton: value,
        };
      });
  };








  _setPaymentType = async (value) => {
    const activeUserToken = await this._getActiveUserToken();
    const activeVanConfig = activeUserToken?.VANCONFIG;

    if (!activeVanConfig) {
      this._setSubmitDisabled(true);
      this._setSuccessMessage(null);
      this._setErrorMessage('ไม่พบข้อมูล VANCONFIG กรุณาเข้าใช้งานใหม่');
      return;
    }

    if (
      activeVanConfig.VANCNF_ENABLE_CASHSALES == 'Y' &&
      value == 1
    ) {
      this._setErrorMessage(null);
      this._isMounted && this.setState((oldState) => {
        return {
          paymentType: value,
        };
      });
    } else if (
      activeVanConfig.VANCNF_ENABLE_INV == 'Y' &&
      value == 0
    ) {
      this._setErrorMessage(null);
      this._isMounted && this.setState((oldState) => {
        return {
          paymentType: value,
        };
      });
    } else if (
      activeVanConfig.VANCNF_ENABLE_CASHSALES == 'N' &&
      value == 1
    ) {
      this._setSubmitDisabled(true);
      this._setSuccessMessage(null);
      this._setErrorMessage('กรุณาตรวจสอบการตั้งค่าขายสด');
    } else if (
      activeVanConfig.VANCNF_ENABLE_INV == 'N' &&
      value == 0
    ) {
      this._setSubmitDisabled(true);
      this._setSuccessMessage(null);
      this._setErrorMessage('กรุณาตรวจสอบการตั้งค่าขายเชื่อ');
    }
  };

  _setReturnType = (value) => {
    this._isMounted && this.setState((oldState) => {
      return {
        returnType: value,
      };
    });
  };

  _setShipDate = async (value) => {
    this._isMounted && await this.setState((oldState) => {
      // console.log('shipDate 1' , value) ; 
      // console.log('shipDate 2' , processResult) ; 

      // console.log('shipDate 3' , this.state.processResult.TRANSTKH.TRH_SHIP_DATE) ; 

      this.state.processResult.TRANSTKH.TRH_SHIP_DATE = moment(value, 'DD/MM/YYYY').format('YYYYMMDDHHmm');
      // console.log('shipDate 4' , this.state.processResult.TRANSTKH.TRH_SHIP_DATE) ; 

      return {
        shipDate: value,
      };
    });
  };

  _setSaleDisable = async (value) => {
    this._isMounted && await this.setState((oldState) => {
      return {
        saleDisable: value,
      };
    });
  };

  _setReturnDisable = async (value) => {
    this._isMounted && await this.setState((oldState) => {
      return {
        returnDisable: value,
      };
    });
  };

  _goToBluetoothSetting = () => {
    BluetoothFinder.checkBluetoothEnable((value) => {
      // alert(value.result)
      if (value.result) {
        Navigator.navigate('Bluetooth');
      }
    });
  };

  _bluetoothAlertDialog = () =>
    Alert.alert(
      'ประกาศ',
      'เนื่องจากไม่ได้ทำการ Connect printer ต้องการจะไปที่หน้า Bluetooth setting หรือไม่',
      [
        { text: 'ยกเลิก', onPress: () => { }, style: 'cancel' },
        { text: 'ยืนยัน', onPress: () => this._goToBluetoothSetting() },
      ],
      { cancelable: false },
    );

  _renderItem = (item, key) => {
    //  console.log('item ==>', item)
    //  console.log('key ==>', key)

    const greentStyle = {
      "backgroundColor": "#2FBA74",
      "borderColor": "#E5E4E2",
      "borderRadius": 0,
      "borderWidth": 0.3,
      "height": 60
    };
    const graytStyle = {
      backgroundColor: MainTheme.colorSecondary,
      height: 60,
      borderRadius: 0,
      borderColor: MainTheme.colorQuaternary,
      borderTopWidth: 0.3,
      borderRightWidth: 0.3,
      elevation: 0,
    };

    const confirmDisabled =
      item.methodName === 'confirm' &&
      (this.state.submitDisabled || !this.state.isAbleoverLimit);


    return (<>
      <TouchableOpacity key={key} style={[item.methodName === 'process' && this.state.submitDisabled == true ? greentStyle : item.buttonStyle, item.containerStyle, {justifyContent: "center", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16}, confirmDisabled || this.state.disabledButton ? { backgroundColor: MainTheme.colorNonary } : null]} onPress={() => {
          this._onPress(item);
        }} disabled={confirmDisabled ? confirmDisabled : this.state.disabledButton} activeOpacity={0.7}>
              <Text style={item.methodName === 'process' && this.state.submitDisabled == true ? { titleStyle: { color: MainTheme.colorSecondary } } : item.titleStyle}>{item.title}</Text>
            </TouchableOpacity>
    </>);
  };

  render() {
    // สินค้ามีไม่พอ หรือ ไม่สามารถขายสินค้าจำนวนติดลบได้

    //  console.log(
    //    'this.state.userToken.VANCONFIG.VANCNF_NOV_SKU_BAL' );
    //     console.log(
    //     'this.state.userToken.VANCONFIG.VANCNF_NOV_SKU_BAL' );
    //  console.log(
    //    '==ORDER_PROCESS_FAIL==', this.props.order.orderProductSummary.ORDER_PROCESS_FAIL, );
    //  console.log(
    //    'this.state.errorMessage', this.state.errorMessage, );
    //  if (this.props.order.orderProductSummary.ORDER_PROCESS_FAIL != '') {
    //    if (this.state.errorMessage === undefined && this.state.errorMessage != this.props.order.orderProductSummary.ORDER_PROCESS_FAIL) {
    //      this._setErrorMessage(this.props.order.orderProductSummary.ORDER_PROCESS_FAIL, );
    //    }
    //  }

    let editableDisBill = false;
    this.state.userToken &&
      this.state.userToken.VANCONFIG &&
      this.state.userToken.VANCONFIG.VANCNF_ENABLE_TDSC &&
      this.state.userToken.VANCONFIG.VANCNF_ENABLE_TDSC == 2
      ? (editableDisBill = true)
      : false;

    const processedAmount = parseFloat(this.state.processResult?.DOCINFO?.DI_AMOUNT);
    const orderForView = {
      ...this.props.order,
      header: {
        ...this.props.order.header,
        VDI_AF_DISC: Number.isNaN(processedAmount)
          ? this.props.order.header.VDI_AF_DISC
          : processedAmount,
      },
    };

    return (
      <FinalizeDetail
        arOrderType={this.props.order.header.AR_ORDER_TYPE}
        vdiRemark={this.props.order.header.VDI_REMARK}
        orderProductSummary={this.props.order.orderProductSummary}
        orderProductSummaryProcessed={orderForView}
        processResult={this.state.processResult}
        setDisBill1={this._setDisBill1}
        setDisBill2={this._setDisBill2}
        setDisType1={this._setDisType1}
        setDisType2={this._setDisType2}
        setShipDate={this._setShipDate}
        setVDIRemark={this._setVDIRemark} //หมายเหตุ
        buttonListItems={productFinalizeFormButtonGroup}
        renderItem={this._renderItem}
        successMessage={this.state.successMessage}
        errorMessage={this.state.overLimitMessage || this.state.errorMessage}
        isLoading={this.state.isLoading}
        paymentItems={paymentLOVItems}
        paymentType={this.state.paymentType}
        setPaymentType={this._setPaymentType}
        shipDate={this.state.shipDate}
        setReturnType={this._setReturnType}
        returnType={this.state.returnType}
        returnItems={returnLOVItems}
        saleDisable={this.state.saleDisable}
        returnDisable={this.state.returnDisable}
        editableDisBill={editableDisBill}
        changePaymentType={this._changePaymentType}

      />
   
    );
  }
}

const mapStateToProps = (state) => ({
  bluetooth: state.bluetooth,
  order: state.order,
  customer: state.customer,
  mile: state.mile,
  geolocation: state.geolocation,
  checkin: state.checkin,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setVDIRemark: (value) => dispatch(setVDIRemark(value)),
    setDisBill1: (value) => dispatch(setDisBill1(value)),
    setDisBill2: (value) => dispatch(setDisBill2(value)),
    setDisCountType1: (value) => dispatch(setDisCountType1(value)),
    setDisCountType2: (value) => dispatch(setDisCountType2(value)),
    calculateOrderNetPriceAfterDiscount: () =>
      dispatch(calculateOrderNetPriceAfterDiscount()),
    clearDisBill: () => dispatch(clearDisBill()),
    processOrderSale: (data, order, config) =>
      dispatch(processOrderSale(data, order, config)),
    createOrderSaleV3: (data, V3GUID, vanConfig, paymentType) =>
      dispatch(createOrderSaleV3(data, V3GUID, vanConfig, paymentType)),
    orderReservV3: (data, V3GUID, vanConfig) =>
      dispatch(orderReservV3(data, V3GUID, vanConfig)),
    orderReturn: (data, type, vanConfig, v3GUID) =>
      dispatch(orderReturn(data, type, vanConfig, v3GUID)),
    getUserToken: () => dispatch(getUserToken()),
    calculateOrderProductSummary: () =>
      dispatch(calculateOrderProductSummary()),
    calculateOrderProductProcessSummary: () =>
      dispatch(calculateOrderProductProcessSummary()),
    setDisBillProcess: (disBill1, disBill2) =>
      dispatch(setDisBillProcess(disBill1, disBill2)),
    setHeaderProcessedShipDate: (value) =>
      dispatch(setHeaderProcessedShipDate(value)),
    getCurrentPosition: () => dispatch(getCurrentPosition()),
    updateOrderSale: (data) => dispatch(updateOrderSale(data)),
    orderTransferV3: (data, V3GUID, vanConfig) =>
      dispatch(orderTransferV3(data, V3GUID, vanConfig)),
    orderAttachImage: (data) => dispatch(orderAttachImage(data)),
    systemCheck: (data) => dispatch(systemCheck(data)),
    setCheckInIsSubmit: (bool) => dispatch(setCheckInIsSubmit(bool)),
    setMileIsSubmit: (bool) => dispatch(setMileIsSubmit(bool)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTFinalizeDetail);
