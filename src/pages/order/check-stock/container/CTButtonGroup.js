import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Alert,
  Keyboard,
  Platform,
  PermissionsAndroid,
  Text,
  TouchableOpacity,
  View, StyleSheet
} from 'react-native';
import { Button } from 'react-native-elements';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ButtonGroup from '../presenter/ButtonGroup';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Dialog from 'react-native-dialog';
import { printReceipt2 } from '../../../../constant/printing-pdf-lov';
import {
  checkStockTopButtonGroup,
  checkStockButtonGroup,
  checkStockSummaryButtonGroup,
  checkStockImageButtonGroup,
  MainTheme,
} from '../../../../constant/lov';
import Navigator from '../../../../services/Navigator';
import { setInitialState as setProductInitialState } from '../../../../action/product';
import {
  getUserToken,
  getLoginGuID,
  getSettingConfig,
} from '../../../../utils/Token';
import { serverReady } from '../../../../api/setting';
import {
  setOrderItems,
  processOrderSale,
  createQuotation,
  setHeader,
  calculateOrderProductSummary,
  addStockImageItem,
  orderUpdateQuotation,
  removeAllStockImageItems,
  orderAttachMultipleImages,
  removeAllProductItems,
  addProduct,
  setVDIRemark,
  getProductListItemsFromLastBillByArCode,
} from '../../../../action/order';
import {
  genenrateOrderForProcessToServer,
  genenrateOrderForCreateToServer,
  generateHeader,
  genenrateOrderForUpdateToServer,
  genenrateMultipleAttachImageToServer,
  convertProductItemToOrderItem,
} from '../../../../utils/Order';
import { BluetoothFinder, BplusPrinting } from '../../../../module';
import { systemCheck } from '../../../../action/setting';

class CTButtonGroup extends Component {
  _isMounted = false;
  _listItems = checkStockButtonGroup;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      disabledButton: false,
      successMessage: null,
      errorMessage: null,
      buttonDisabled: this.props.screen === 'Summary' ? true : false,
      productListItems: null,
      userToken: null,
      remarkDialogVisible: false,
      submitDisabled: true,

    };

    this._getUserToken();
    this._setButtonGroup();
  }

  componentDidMount = (props) => {
    this._check_inVANCNFDatetime();
    this._isMounted = true;
    console.log("this.props.screen === 'Summary' 2");
    if (this.props.screen === 'Summary') {
      console.log("this.props.screen === 'Summary' _createQuatation",);

      this._createQuatation();
    }
  };

  componentWillUnmount = (props) => {
    this._isMounted = false;
  };

  _check_inVANCNFDatetime = async () => {
    const VANCONFIG = await getSettingConfig();
    const result = await this.props.serverReady(VANCONFIG.baseUrl);
    const { RESULT_DATA, RESPONSE_DATETIME } = result;
    const timeArray = RESPONSE_DATETIME.split(':');
    console.log("vvvv", (
      parseInt(timeArray[0] + timeArray[1]) >=
      parseInt(VANCONFIG.VANCONFIG.VANCNF_TIME_FM) &&
      parseInt(timeArray[0] + timeArray[1]) <=
      parseInt(VANCONFIG.VANCONFIG.VANCNF_TIME_TO)
    ))

    if (
      parseInt(timeArray[0] + timeArray[1]) >=
      parseInt(VANCONFIG.VANCONFIG.VANCNF_TIME_FM) &&
      parseInt(timeArray[0] + timeArray[1]) <=
      parseInt(VANCONFIG.VANCONFIG.VANCNF_TIME_TO)
    ) {

    } else {
      const errorStr =
        'ไม่สามารถทำรายการได้เนื่องจากเกินช่วงเวลาที่กำหนด \n\r(' +
        VANCONFIG.VANCONFIG.VANCNF_TIME_FM.substring(0, 2) + ":" + VANCONFIG.VANCONFIG.VANCNF_TIME_FM.substring(2, 4) + ' น. - ' +
        VANCONFIG.VANCONFIG.VANCNF_TIME_TO.substring(0, 2) + ":" + VANCONFIG.VANCONFIG.VANCNF_TIME_TO.substring(2, 4) + ' น.)';

      this.setState({ _errormsg: errorStr });
      return;
    }

  };


  _setButtonGroup = () => {
    const { routes, index } = Navigator.getCurrentRoute();
    const { routeName } = routes[index];
    console.log('routeName >> ', routeName)
    console.log('this.props.position >> ', this.props.position)



    if (routeName === 'OrderCheckStock')
      this.props.position === 'top'
        ? (this._listItems = checkStockTopButtonGroup)
        : (this._listItems = checkStockButtonGroup);
    else if (routeName === 'OrderCheckStockSummary')
      this._listItems = checkStockSummaryButtonGroup;
    else if (routeName === 'OrderCheckStockImageItems')
      this._listItems = checkStockImageButtonGroup;


    console.log('this._listItems >> 1 ', this._listItems)

  };

  _setSubmitDisabled = (bool) => {
    this._isMounted &&
      this.setState((oldState) => {
        return {
          submitDisabled: bool,
        };
      });
  };

  _getUserToken = async () => {
    const userToken = await getUserToken();

    if (userToken) {
      this._isMounted &&
        (await this.setState((oldState) => {
          return {
            userToken: userToken,
          };
        }));
    }
  };

  _setState = async (key, value) => {
    this._isMounted &&
      (await this.setState((oldState) => {
        return {
          [key]: value,
        };
      }));
  };

  _renderItem = (item, key) => {

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


    console.log("this.props.screen === 'Summary'", this.props.screen);

    const disabled =
      this.props.order.productListItems.length <= 0 && item.methodName === 'confirm'
        ? true
        : false;


    return (
      <Button
        key={key}
        buttonStyle={item.methodName === 'process' && this.state.submitDisabled == true ? greentStyle : item.buttonStyle}

        //  buttonStyle={item.buttonStyle}
        containerStyle={item.containerStyle}
        titleStyle={item.methodName === 'process' && this.state.submitDisabled == true ? { titleStyle: { color: MainTheme.colorSecondary } } : item.titleStyle}

        //titleStyle={[item.titleStyle, {fontSize: hp('1.7%')}]}
        title={
          item.title === 'พิมพ์' &&
            this.props.bluetooth.printingType !== 'BLUETOOTH'
            ? item.subTitle
            : item.title
        }
        disabledStyle={{ backgroundColor: MainTheme.colorNonary }}
        disabled={disabled}

        // disabled={item.methodName === 'confirm' ?
        // this.props.screen === 'Index' ? false :        

        //  this.state.submitDisabled : this.state.disabledButton }
        // disabled={this.props.screen === 'Summary' ? this.state.submitDisabled : this.state.disabledButton }

        onPress={() => {
          this._onPress(item);
        }}
      />
    );
  };

  _onPress = async (item) => {
    console.log('item===> 2', item);
    this.props.order.errorMessage = null;

    const { routes, index } = Navigator.getCurrentRoute();

    console.log('_onPress routes: ', routes);
    console.log('_onPress index: ', index);
    const printType =
      routes[index].params !== undefined &&
        routes[index].params !== null &&
        routes[index].params.printType !== undefined &&
        routes[index].params.printType !== null
        ? routes[index].params.printType
        : null;
    const processResult =
      routes[index].params !== undefined &&
        routes[index].params !== null &&
        routes[index].params.processResult !== undefined &&
        routes[index].params.processResult !== null
        ? routes[index].params.processResult
        : null;
    const orderProductSummary =
      routes[index].params !== undefined &&
        routes[index].params !== null &&
        routes[index].params.orderProductSummary !== undefined &&
        routes[index].params.orderProductSummary !== null
        ? routes[index].params.orderProductSummary
        : null;


    console.log('_onPress printType: ', printType);
    console.log('_onPress processResult: ', processResult);
    console.log('_onPress orderProductSummary: ', orderProductSummary);

    if (item.methodType === 'function') {
      if (item.methodName === 'confirm') {


        // this._setSubmitDisabled(true);
        // await this._customerUpdateStockBalance();



        this.props.setProductInitialState();

        Navigator.navigate(item.screen, {
          actionType: 'add_stock_balance',
          confirmMethod: async (item) => {
            this._setSubmitDisabled(true);
            await this._customerUpdateStockBalance();
            Navigator.back();
          },
        });
        //  this._setSubmitDisabled(true);
        //   await this._customerUpdateStockBalance();
      } else if (item.methodName === 'print') {
        if (this.props.bluetooth.printingType === 'BLUETOOTH') {
          if (this.props.bluetooth.state !== 'connected') {
            this._bluetoothAlertDialog();
            return;
          }

          await this._printReceipt('quotation', processResult);
        } else {
          this._printReceiptPDF('quotation', processResult, orderProductSummary);
        }
      } else if (item.methodName === 'open-camera') {
        Navigator.navigate(item.screen, {
          takePicture: async (data) => {
            await this.props.addStockImageItem(data.uri);
            Navigator.back();
          },
        });
      } else if (item.methodName === 'remove-image-all') {
        this.props.removeAllStockImageItems();
      } else if (item.methodName === 'cancel' || item.methodName === 'back') {
        Navigator.back();
      } else if (item.methodName === 'remove-item-all') {
        this._removeAlertDialog();
      } else if (item.methodName === 'last-bill') {
        this._getLastBillDialog();
      }
    } else if (item.methodType === 'new-page') {
      if (item.screen === 'OrderSales') {
        const data = generateHeader(this.props.customer.item.INFO, 'ขายสินค้า');
        // await this.props.setInitialState()
        await this.props.setHeader(data);

        Navigator.pop(2, true);

        Navigator.navigate(item.screen, {
          userToken: this.state.userToken,
          disabledAutoLoad: true,
        });
      } else if (item.screen === 'ProductAddTo') {
        this.props.setProductInitialState();

        Navigator.navigate(item.screen, {
          actionType: 'add_stock_balance',
          confirmMethod: async (item) => {
            await this.props.addProduct(convertProductItemToOrderItem(item));
            Navigator.back();
          },
        });
      } else {
        Navigator.navigate(item.screen);
      }
    }
  };

  _getProductListItemsFromLastBillByArCode = async () => {
    try {
      console.log('_getProductListItemsFromLastBillByArCode 1');
      const v3GUID = await getLoginGuID();
      const userToken = await getUserToken();
      await this.props.getProductListItemsFromLastBillByArCode(
        v3GUID,
        userToken.VANCONFIG.VANCNF_MACHINE,
      );
      await this.props.calculateOrderProductSummary();
    } catch (error) {
      console.log(error);
    }
  };



  _getLastBillDialog = () =>
    Alert.alert(
      'ประกาศ',
      'ต้องการทำรายการเหมือนบิลล่าสุดหรือไม่?',
      [
        { text: 'ยกเลิก', onPress: () => { }, style: 'cancel' },
        {
          text: 'ยืนยัน',
          onPress: () => {
            this.props.order.errorMessage = null;
            this._removeAll();
            this._getProductListItemsFromLastBillByArCode();
          }
        },
      ],
      { cancelable: false },
    );



  _removeAlertDialog = () =>
    Alert.alert(
      'ประกาศ',
      'คุณต้องการลบข้อมูลสินค้าทั้งหมด?',
      [
        { text: 'ยกเลิก', onPress: () => { }, style: 'cancel' },
        { text: 'ยืนยัน', onPress: () => this._removeAll() },
      ],
      { cancelable: false },
    );

  _removeAll = () => {
    this.props.removeAllProductItems();
  };

  _printReceipt = async (type, processResult) => {
    try {
      await this._setState('successMessage', null);
      this._setState('isLoading', true);
      this._setState('errorMessage', null);


      const { routes, index } = Navigator.getCurrentRoute();

        const orderProductSummary =
        routes[index].params !== undefined &&
          routes[index].params !== null &&
          routes[index].params.orderProductSummary !== undefined &&
          routes[index].params.orderProductSummary !== null
          ? routes[index].params.orderProductSummary
          : null;



      if (this.props.bluetooth.state == 'connected') {
        const userToken = await getUserToken();
        const config = await getSettingConfig();
        const response = await this.props.systemCheck(config);


        console.log('this.props.bluetooth.state summary response', response.ResponseCode === '200');


        if (response.ResponseCode === '200') {
          const { ResponseData, RESPONSE_DATETIME } = response;

          let printTime = RESPONSE_DATETIME;
          //printTime = printTime[1].split('.');
          const summary = this.props.order.orderProductSummaryProcessed ?
            false :
            this.props.order.orderProductSummaryProcessed;

          console.log('this.props.bluetooth.state summary', summary);



          let isDiscountBath = false;
          console.log('summary ', summary.DIS_BILL_1);
          if (summary && summary.DIS_BILL_1) {
            console.log('summary.DIS_BILL_1 2', summary.DIS_BILL_1);

            let strArr = summary.DIS_BILL_1.split('');
            for (let i in strArr) {
              if (strArr[i] == 'B') {
                isDiscountBath = true;
              }
            }
          }

          BplusPrinting.printReceipt(
            type !== 'quotation' ? this.props.order.header : { ...this.props.order, orderProductSummary: orderProductSummary },
            this.props.order.productListItemsPRTProcessed,
            processResult,
            userToken.VANCONFIG,
            userToken.COMPANYINFO,
            type !== 'transfer'
              ? this.props.customer.item.INFO
              : this.props.order.header,
            printTime,
            type,
            0,
            isDiscountBath,
            (this.props.order && Array.isArray(this.props.order.paymentMethod) && this.props.order.paymentMethod.length > 0) ? this.props.order?.paymentMethod[0] : {}
          );
        } else if (response.STATUS === '10' && response.ERROR_MESSAGES[0]) {
          this._setState('errorMessage', response.ERROR_MESSAGES[0]);
          return false;
        }
      }
      this._setState('isLoading', false);
    } catch (error) {
      this._setState('isLoading', false);
      this._setState('errorMessage', error.message);
      return false;
    }

    return true;
  };

  _onBackFromAnother = async () => {
    await this.props.setOrderItems(this.state.productListItems);
  };

  _customerUpdateStockBalance = async () => {
    try {
      Keyboard.dismiss();
      const { productListItems } = this.props.order;

      console.log('productListItems >>> ', JSON.parse(JSON.stringify(productListItems)));
      console.log('_customerUpdateStockBalance');
      const cloneObj = JSON.parse(JSON.stringify(productListItems));

      await this._setState('productListItems5', cloneObj);

      const listItems = productListItems.filter((item, index) => {
        item.CAS_QTY = item.VTRD_QTY;
        item.DIFFERENCE = 1;
        if (
          item.CAS_QTY !== undefined &&
          item.CAS_QTY !== null &&
          item.CAS_QTY !== '' &&
          parseInt(item.CAS_QTY) <= item.VTRD_QTY &&
          item.DIFFERENCE > 0
        ) {
          item.VTRD_QTY_OLD = item.VTRD_QTY;
          //item.VTRD_QTY = parseInt(item.DIFFERENCE);
          //item.VTRD_Q_FREE = 0;
          return item;
        }
      });

      if (listItems.length <= 0) {
        this._alertErrorDialog('กรุณากรอกจำนวนสินค้า');
        return;
      }

      await this.props.setOrderItems(listItems);
      this._setState('remarkDialogVisible', true);
    } catch (error) {
      console.log(error);
      this._alertErrorDialog(error);
    }
  };

  _alertErrorDialog = (message) =>
    Alert.alert(
      'ประกาศ',
      message.toString(),
      [{ text: 'ตกลง', onPress: () => { }, style: 'cancel' }],
      { cancelable: false },
    );

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

  _goToBluetoothSetting = () => {
    BluetoothFinder.checkBluetoothEnable((value) => {
      // alert(value.result)
      if (value.result) {
        Navigator.navigate('Bluetooth');
      }
    });
  };

  _createQuatation = async () => {
    try {

      // console.log(
      //         '_createQuatation timeArray',
      //         parseInt(timeArray[0] + timeArray[1]),
      //       );

      await this._setState('isLoading', true);
      await this._setState('errorMessage', null);
      await this._setState('successMessage', null);
      const { baseUrl, vanCNFMachine } = await getSettingConfig();
      const { VANCONFIG } = await getUserToken();
      const response2 = await this.props.systemCheck({
        baseUrl: baseUrl,
        vanCNFMachine: VANCONFIG,
      });

      const { RESPONSE_DATETIME, ResponseData } = response2;
      const responseData = JSON.parse(ResponseData);
      const timeArray = RESPONSE_DATETIME.split(':');
      console.log(
        '_createQuatation timeArray',
        parseInt(timeArray[0] + timeArray[1]),
      );
      console.log(
        '_createQuatation  parseInt(this.state.config?.VANCONFIG?.VANCNF_TIME_FM)',
        parseInt(VANCONFIG.VANCNF_TIME_FM),
      );
      console.log(
        '_createQuatation  parseInt(this.state.config?.VANCONFIG?.VANCNF_TIME_TO)',
        parseInt(VANCONFIG.VANCNF_TIME_TO),
      );
      if (
        parseInt(timeArray[0] + timeArray[1]) >=
        parseInt(VANCONFIG.VANCNF_TIME_FM) &&
        parseInt(timeArray[0] + timeArray[1]) <=
        parseInt(VANCONFIG.VANCNF_TIME_TO)
      ) {
        const config = await getSettingConfig();
        let response = await this.props.processOrderSale(
          genenrateOrderForProcessToServer(
            this.props.order,
            true,
            1,
            typeof this.props.order.orderProductSummary.DIS_COUNT_TYPE1 ===
              'undefined'
              ? true
              : this.props.order.orderProductSummary.DIS_COUNT_TYPE1,

            this.props.order.header.AR_ORDER_TYPE,
          ),
          this.props.order,
          config.VANCONFIG,
        );

        const { ResponseData, ResponseCode, ReasonString } = response;
        console.log('_createQuatation AWDDWD', response);
        if (ResponseCode == '200') {
          // let responseData = JSON.parse(ResponseData);
          const v3GUID = await getLoginGuID();
          const userToken = await getUserToken();
          console.log('this.props.order ', this.props.order);
          if (this.props.order.header.VDI_USER_REF === null) {
            response = await this.props.createQuotation(
              genenrateOrderForCreateToServer(
                this.props.order,
                this.props.mile.item.mileage,
                this.props.geolocation.position,
              ),
              v3GUID,
              userToken.VANCONFIG,
            );
          } else {
            console.log('UPDATE');
            response = await this.props.orderUpdateQuotation(
              genenrateOrderForUpdateToServer(
                genenrateOrderForCreateToServer(
                  this.props.order,
                  this.props.mile.item.mileage,
                  this.props.geolocation.position,
                ),
                this.props.order.header,
              ),
            );
          }

          // console.log('_createQuatation response', response);
          const { ResponseData, ResponseCode, ReasonString } = response;
          if (ResponseCode == '200') {
            await this.props.calculateOrderProductSummary();

            // if (
            //   this.props.order.stock.imageItems &&
            //   this.props.order.stock.imageItems.length > 0
            // ) {
            //   await this._orderAttachMultipleImages();
            // }

            await this._setState('successMessage', 'ส่งรายการเรียบร้อย');
            await this._setState('buttonDisabled', false);
          } else {
            await this._setState('errorMessage', ReasonString);
          }
        } else {
          await this._setState('errorMessage', ReasonString);
        }
      } else {
        await this._setState('buttonDisabled', true);
        const errorStr =
          'ไม่สามารถทำรายการได้เนื่องจากเกินช่วงเวลาที่กำหนด ( ' +
          config.VANCONFIG.VANCNF_TIME_FM[0] +
          config.VANCONFIG.VANCNF_TIME_FM[1] +
          ':' +
          config.VANCONFIG.VANCNF_TIME_FM[2] +
          config.VANCONFIG.VANCNF_TIME_FM[3] +
          ' - ' +
          config.VANCONFIG.VANCNF_TIME_TO[0] +
          config.VANCONFIG.VANCNF_TIME_TO[1] +
          ':' +
          config.VANCONFIG.VANCNF_TIME_TO[2] +
          config.VANCONFIG.VANCNF_TIME_TO[3] +
          ' )';
        await this._setState('errorMessage', errorStr);
      }
    } catch (error) {
      await this._setState('errorMessage', error);
    }
    await this._setState('isLoading', false);
  };

  _orderAttachMultipleImages = async () => {
    try {
      response = await this.props.orderAttachMultipleImages(
        genenrateMultipleAttachImageToServer(
          this.props.order.headerProcessed.VDI_KEY,
          this.props.order.headerProcessed.VDI_AR,
          this.props.order.stock.imageItems,
        ),
      );

      const { RESULT_DATA, STATUS, ERROR_MESSAGES } = response;

      // if (STATUS === '00') {
      //     this.props.setCheckInIsSubmit(true)
      // }
    } catch (error) {
      console.log('_orderAttachImage', error);
    }
  };

  _printReceiptPDF = async (type, processResult, orderProductSummary) => {
    console.log('_printReceiptPDF type', type, processResult);
    try {
      permissions = [PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE];

      let granted = PermissionsAndroid.RESULTS.GRANTED;

      if (Platform.OS === 'android') {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
      }

      await this._setState('successMessage', null);
      this._setState('isLoading', true);
      this._setState('errorMessage', null);

      const userToken = await getUserToken();
      const config = await getSettingConfig();
      const response = await this.props.systemCheck(config);
      const {
        ResponseData,
        ResponseCode,
        ReasonString,
        BPAPUS_GUID,
        RESPONSE_DATETIME,
      } = response;
      let responseData = JSON.parse(ResponseData);
      if (responseData.RECORD_COUNT != '0' && ResponseCode == 200) {
        let printTime = RESPONSE_DATETIME.split(':');
        let isDiscountBath = false;
        console.log('_printReceiptPDF type', type);
        console.log('processResult', processResult);

        if (processResult.ARDETAIL) {
          let strArr = processResult.ARDETAIL.ARD_TDSC_KEYIN.split(',');
          console.log('INCLUDE B = DISCOUNTBATH');
          let strArr2 = strArr[0].split('');
          for (let i in strArr2) {
            if (strArr2[i] == 'B') {
              isDiscountBath = true;
            }
          }
        } else if (processResult.AROE) {
          let strArr = processResult.AROE.AROE_TDSC_KEYIN.split(',');
          console.log('NOT INCLUDE B = NOT DISCOUNTBATH');
          let strArr2 = strArr[0].split('');
          for (let i in strArr2) {
            if (strArr2[i] == 'B') {
              isDiscountBath = true;
            }
          }
        }

        // console.log('this.props.order.headerProcessed ', this.props.order);
        // console.log('userToken.VANCONFIG ', userToken.VANCONFIG);

        let html = printReceipt2(
          { ...this.props.order, orderProductSummary: orderProductSummary },
          this.props.order.productListItemsPRTProcessed,
          processResult,
          userToken.VANCONFIG,
          userToken.COMPANYINFO,
          type !== 'transfer'
            ? this.props.customer.item.INFO
            : this.props.order.header,
          printTime,
          type,
          0,
          isDiscountBath,
        );

        // let options = {
        //   html: html,
        //   fileName: this.props.order.headerProcessed.VDI_USER_REF.replace(
        //     '/',
        //     '-',
        //   ),
        //   directory: 'bplus-vansales',
        //   base64: true,
        // };
        let options = {
          html: html,
          // fileName: 'check-stock',
          fileName: this.props.order.header.VDI_USER_REF.replace(
            '/',
            '-',
          ),
          directory: 'Documents/bplus_vansales/',
          base64: true,
        };
        // console.log('options ', JSON.stringify(options));
        let file = await RNHTMLtoPDF.convert(options);

        // console.log('filePath2: ', file);
        this._pdfAlertDialog(file.filePath);
      } else {
        this._setState('errorMessage', ResponseCode + ReasonString);
        return false;
      }

      this._setState('isLoading', false);
    } catch (error) {
      this._setState('isLoading', false);
      this._setState('errorMessage', error.message);
      return false;
    }

    return true;
  };

  _pdfAlertDialog = (path) =>
    Alert.alert(
      'ประกาศ',
      path,
      [
        {
          text: 'แสดง',
          onPress: () =>
            Navigator.navigate('PDFPreview', { title: '', source: path }),
          style: 'cancel',
        },
        {
          text: 'กลับสู่เมนูหลัก',
          onPress: () => Navigator.navigate('OrderChoice'),
        },
      ],
      { cancelable: false },
    );

  _remarkDialogConfirm = () => {
    this._setState('remarkDialogVisible', false);
    Navigator.navigate('OrderCheckStockSummary', {
      userToken: this.state.userToken,
      onBackFromAnother: async () => this._onBackFromAnother(),
    });
  };
  render() {
    console.log('this._listItems >> ', this._listItems)
    //  console.log('routeName >> ', routeName)
    console.log('this.props.position >> ', this.props.position)


    return (
      <View>
        <Dialog.Container visible={this.state.remarkDialogVisible}>
          <Dialog.Title>หมายเหตุ</Dialog.Title>
          <Dialog.Input
            onChangeText={(value) => this.props.setVDIRemark(value)}
            style={{ borderWidth: 0.5 }}
          />
          <Dialog.Button
            label="ยกเลิก"
            onPress={() => {
              this._setState('remarkDialogVisible', false);
              this.props.setVDIRemark('');
            }}
          />
          <Dialog.Button
            label="ยืนยัน"
            onPress={() => this._remarkDialogConfirm()}
          />
        </Dialog.Container>
        <>
          {!this.state._errormsg ?
            <ButtonGroup
              listItems={this.state._errormsg ? null : this._listItems}
              renderItem={this._renderItem}
              successMessage={this.state.successMessage}
              errorMessage={this.state.errorMessage}
              isLoading={this.state.isLoading}
              pattern={this.props.screen === 'Index' ? 'A' : 'B'}
            />
            :
            (this.props.position === 'top' ?
              <Text style={styles.red}>{'\n\n'}{this.state._errormsg}</Text> :
              <ButtonGroup
                listItems={this._listItems}
                renderItem={this._renderItem}
                successMessage={this.state.successMessage}
                errorMessage={this.state.errorMessage}
                isLoading={this.state.isLoading}
                pattern={this.props.screen === 'Index' ? 'A' : 'B'}
              />
            )
          }
        </>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
    textAlign: 'center',
  },
});


const mapStateToProps = (state) => ({
  bluetooth: state.bluetooth,
  order: state.order,
  customer: state.customer,
  mile: state.mile,
  geolocation: state.geolocation,
});

const mapDispatchToProps = (dispatch) => {
  return {
    serverReady: (data) => dispatch(serverReady(data)),
    setVDIRemark: (value) => dispatch(setVDIRemark(value)),
    setOrderItems: (items) => dispatch(setOrderItems(items)),
    processOrderSale: (data, order, vanConfig) =>
      dispatch(processOrderSale(data, order, vanConfig)),
    createQuotation: (data, V3GUID, vanConfig) =>
      dispatch(createQuotation(data, V3GUID, vanConfig)),
    setHeader: (data) => dispatch(setHeader(data)),
    systemCheck: (data) => dispatch(systemCheck(data)),
    calculateOrderProductSummary: () =>
      dispatch(calculateOrderProductSummary()),
    addStockImageItem: (uri) => dispatch(addStockImageItem(uri)),
    removeAllStockImageItems: () => dispatch(removeAllStockImageItems()),
    orderAttachMultipleImages: (data) =>
      dispatch(orderAttachMultipleImages(data)),
    removeAllProductItems: () => dispatch(removeAllProductItems()),
    setProductInitialState: () => {
      dispatch(setProductInitialState());
    },
    getProductListItemsFromLastBillByArCode: (v3GUID, vancnf_machine) =>
      dispatch(getProductListItemsFromLastBillByArCode(v3GUID, vancnf_machine)),
    orderUpdateQuotation: (data) => dispatch(orderUpdateQuotation(data)),
    addProduct: (item) => dispatch(addProduct(item)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTButtonGroup);
