import React from 'react'
import { connect } from 'react-redux'
import { Alert, Keyboard, } from 'react-native'
import { Button } from 'react-native-elements'
import ButtonGroup from '../presenter/ButtonGroup'
import { 
    orderOutStandingPreProcessButtonGroup, 
    orderOutStandingKeyStepButtonGroup, 
    orderOutStandingCreateStepButtonGroup, 
    orderOutStandingSummaryStepButtonGroup,
    MainTheme } from '../../../../constant/lov'
import Navigator from '../../../../services/Navigator'
import { 
    customerPreProcessPayment, 
    customerProcessPayment, 
    customerCreatePayment,
    setPrePocessHeader, 
    setCreateInitialState,
 } from '../../../../action/outstanding-balance'
import { validateOutstandingBalancePayment, validateOutstandingBalancePaymentCheque } from '../../../../utils/validation'
import { authForGetAccessToken, requestQrCodeSCB } from '../../../../action/qrcode-payment'
import { PAYMENT_CALL_BACK_END_POINT } from '../../../../../appConfig'
import { BluetoothFinder, BplusPrinting, printPaymentReceipt  } from '../../../../module'
import { getUserToken, getSettingConfig } from '../../../../utils/Token'
import { systemCheck } from '../../../../action/setting'

class CTButtonGroup extends React.Component {
  _isMounted = false;
  _listItems = orderOutStandingPreProcessButtonGroup;

  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null,
      isLoading: false,
      loadingMessage: '',
      isQRCodeDialogOpen: false,
      TxUID: null,
      qrCode: null,
      qrLogo: require('../../../../images/Icon_App.png'),
      userToken: null,
    };

    this._setButtonGroup();
  }

  componentDidMount = (props) => {
    this._isMounted = true;
    this._getUserToken();
  };

  componentWillUnmount = (props) => {
    this._isMounted = false;
  };

  _setState = async (key, value) => {
    this._isMounted &&
      (await this.setState((oldState) => {
        return {
          [key]: value,
        };
      }));
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

  _goToBluetoothSetting = () => {
    BluetoothFinder.checkBluetoothEnable((value) => {
      // alert(value.result)
      if (value.result) {
        Navigator.navigate('Bluetooth');
      }
    });
  };

  _setButtonGroup = () => {
    const {routes, index} = Navigator.getCurrentRoute();
    const {routeName} = routes[index];

    if (routeName === 'OrderOutstandingBalance')
      this._listItems = orderOutStandingPreProcessButtonGroup;
    else if (routeName === 'OrderOutstandingBalanceKeyStep')
      this._listItems = orderOutStandingKeyStepButtonGroup;
    else if (routeName === 'OrderOutstandingBalanceCreateStep')
      this._listItems = orderOutStandingCreateStepButtonGroup;
    else if (routeName === 'OrderOutstandingBalanceSummaryStep')
      this._listItems = orderOutStandingSummaryStepButtonGroup;
  };

  _onPress = async (item) => {
    if (item.methodType === 'function') {
      if (item.methodName === 'pre-process')
        await this._customerPreProcessPayment();
      else if (item.methodName === 'process')
        await this._customerProcessPayment();
      else if (item.methodName === 'create')
        await this._customerCreatePayment();
      else if (item.methodName === 'back') Navigator.back();
      else if (item.methodName === 'create-step-clear') this._createStepClear();
      else if (item.methodName === 'print-receipt') this._printPaymentReceipt();
    } else if (item.methodType === 'newPage') {
      Navigator.navigate(item.screen);
    }

    Keyboard.dismiss();
  };

  _printPaymentReceipt = async () => {
    if (this.props.bluetooth.state !== 'connected') {
      this._bluetoothAlertDialog();
      return;
    }

    try {
      this._setState('errorMessage', null);
      this._setState('loadingMessage', 'กำลังพิมพ์ใบเสร็จ...');

      if (this.props.bluetooth.state == 'connected') {
        const userToken = await getUserToken();
        const config = await getSettingConfig();
        const response = await this.props.systemCheck(config);

        if (response.STATUS === '00') {
          const {RESPONSE_DATETIME} = response;

          let printTime = RESPONSE_DATETIME.split('T');
          printTime = printTime[1].split('.');

          BplusPrinting.printPaymentReceipt(
            this.props.order.header,
            this.props.outstandingBalance.create.header,
            this.props.outstandingBalance.create.listItems,
            userToken.VANCONFIG,
            userToken.COMPANYINFO,
            this.props.customer.item.INFO,
            printTime[0],
            'ใบเสร็จรับเงิน',
          );

          Navigator.navigate('OrderChoice');
        } else if (response.STATUS === '10' && response.ERROR_MESSAGES[0]) {
          this._setState('errorMessage', response.ERROR_MESSAGES[0]);
          return false;
        }
      }
    } catch (error) {
      this._setState('errorMessage', error.message);
    }

    _printPaymentReceipt = async () => {
        if (this.props.bluetooth.state !== 'connected') {
            this._bluetoothAlertDialog()
            return
        }

        try {
            this._setState('errorMessage', null)
            this._setState('loadingMessage', 'กำลังพิมพ์ใบเสร็จ...')
            
            if (this.props.bluetooth.state == 'connected') {
                const userToken = await getUserToken()
                const config = await getSettingConfig()
                const response = await this.props.systemCheck(config)

                if (response.STATUS === "00") {
                    const { RESPONSE_DATETIME } = response

                    let printTime = RESPONSE_DATETIME.split('T')
                    printTime = printTime[1].split('.')
                    
                    printPaymentReceipt(
                        this.props.order.header, 
                        this.props.outstandingBalance.create.header, 
                        this.props.outstandingBalance.create.listItems, 
                        userToken.VANCONFIG,
                        userToken.COMPANYINFO,
                        this.props.customer.item.INFO,
                        printTime[0],
                        'ใบเสร็จรับเงิน'
                    )

                    Navigator.navigate('OrderChoice')
                } else if (response.STATUS === "10" && response.ERROR_MESSAGES[0]) {
                    this._setState('errorMessage', response.ERROR_MESSAGES[0])
                    return false
                }
                
            }

        } catch (error) {
            this._setState('errorMessage', error.message)
        }

        this._setState('loadingMessage', '')
    }

    _bluetoothAlertDialog = () => Alert.alert(
        'ประกาศ',
        'เนื่องจากไม่ได้ทำการ Connect printer ต้องการจะไปที่หน้า Bluetooth setting หรือไม่',
        [
            {text: 'ยกเลิก', onPress: () => {}, style: 'cancel'},
            {text: 'ยืนยัน', onPress: () => this._goToBluetoothSetting()}
        ],
        { cancelable: false }
    )

    _customerPreProcessPayment = async () => {
        try {
            this._setState('errorMessage', null)
            this._setState('loadingMessage', 'กำลังโหลดข้อมูล...')

            await this.props.customerPreProcessPayment()
            Navigator.navigate('OrderOutstandingBalanceKeyStep')

        } catch (error) {
            this._setState('errorMessage', error)
        }

        this._setState('loadingMessage', '')
    }

    this._setState('loadingMessage', '');
  };

  _customerCreatePayment = async () => {
    let totalPay = 0;

    let validate = validateOutstandingBalancePayment(
      this.props.outstandingBalance.create.checkedItems,
      'cash',
      'เงินสด',
    );

    if (typeof validate.errorMessage !== 'undefined') {
      this._setState('errorMessage', validate.errorMessage);
      return;
    }

    totalPay = totalPay + validate.successResult;

    validate = validateOutstandingBalancePayment(
      this.props.outstandingBalance.create.checkedItems,
      'transfer',
      'การโอน',
    );

    if (typeof validate.errorMessage !== 'undefined') {
      this._setState('errorMessage', validate.errorMessage);
      return;
    }

    totalPay = totalPay + validate.successResult;

    validate = validateOutstandingBalancePayment(
      this.props.outstandingBalance.create.checkedItems,
      'qrcode',
      'QRCode',
    );

    if (typeof validate.errorMessage !== 'undefined') {
      this._setState('errorMessage', validate.errorMessage);
      return;
    }

    totalPay = totalPay + validate.successResult;

    validate = validateOutstandingBalancePaymentCheque(
      this.props.outstandingBalance.create.checkedItems.cheques,
    );

    if (typeof validate.errorMessage !== 'undefined') {
      this._setState('errorMessage', validate.errorMessage);
      return;
    }

    totalPay = totalPay + validate.successResult;

    // console.log('totalPay cheque', totalPay)
    // if (this.props.outstandingBalance.process.header.VPH_PAY_AMT > totalPay) {
    //     this._setState('errorMessage', 'ยอดเงินการชำระไม่ถูกต้อง')
    //     return
    // }

    if (this.props.outstandingBalance.create.checkedItems.qrcode.checked) {
      this._setState('isLoading', true);
      this._setState('errorMessage', null);

      try {
        const auth = await this.props.authForGetAccessToken({
          userName: this.state.userToken.VANCONFIG.VANCNF_BANK_QRCODE_USERNAME,
          userPassword: this.state.userToken.VANCONFIG
            .VANCNF_BANK_QRCODE_PASSWORD,
        });
        const {data} = auth;

        if (data) {
          await this.props.customerCreatePayment(1, this.state.TxUID);
          this._requestQrCodeSCB(data);
        }
      } catch (error) {
        this._setState('errorMessage', error);
      }

      this._setState('isLoading', false);
    } else {
      this._processCustomerCreatePayment();
    }
  };

  _processCustomerCreatePayment = async () => {
    try {
      this._setState('errorMessage', null);
      this._setState('loadingMessage', 'กำลังโหลดข้อมูล...');
      await this.props.customerCreatePayment(2, this.state.TxUID);

      Navigator.navigate('OrderOutstandingBalanceSummaryStep');
    } catch (error) {
      this._setState('errorMessage', error);
    }

    this._setState('loadingMessage', '');
  };

  _requestQrCodeSCB = async (obj) => {
    this._setState('errorMessage', null);

    try {
      const qrcode = await this.props.requestQrCodeSCB(
        obj,
        this.props.outstandingBalance.create.checkedItems.qrcode.pay,
      );
      const {isError, data} = qrcode;
      console.log('qrcode', qrcode);
      if (!isError) {
        await this._setState('qrCode', data.qrCode);
        await this._setState('isQRCodeDialogOpen', true);
        console.log(
          'PAYMENT_CALL_BACK_END_POINT',
          PAYMENT_CALL_BACK_END_POINT + `?TxUID=${data.partnerTxnUid}`,
        );
        const ws = new WebSocket(
          PAYMENT_CALL_BACK_END_POINT + `?TxUID=${data.partnerTxnUid}`,
        );

        ws.onopen = () => {
          console.log('onopen');
        };

        ws.onmessage = async (e) => {
          // a message was received
          console.log('onmessage', e.data);
          const data = JSON.parse(e.data);
          await this._setState('TxUID', data.TxUID);
          await this._processCustomerCreatePayment();
          ws.close();
        };

        ws.onerror = (e) => {
          // an error occurred
          console.log('onerror', e);
          ws.close();
          throw new Error(e.message);
        };

        ws.onclose = async (e) => {
          // connection closed
          await this._setState('isQRCodeDialogOpen', false);
          console.log('onerror', e.code, e.reason);
        };
      }
    } catch (error) {
      this._setState('errorMessage', error);
    }
  };

  _customerProcessPayment = async () => {
    try {
      this._setState('errorMessage', null);
      this._setState('loadingMessage', 'กำลังโหลดข้อมูล...');

      const {header, listItems} = this.props.outstandingBalance.preProcess;

      const VPH_CASH_AMT = listItems.reduce((acc, currentValue) => {
        return acc + parseFloat(currentValue.VPD_PAY);
      }, 0);

      if (VPH_CASH_AMT <= 0) throw 'ยอดการชำระต้องมากกว่า 0';
      header.VPH_CASH_AMT = VPH_CASH_AMT;
      await this.props.setPrePocessHeader(header);
      await this.props.customerProcessPayment();
      Navigator.navigate('OrderOutstandingBalanceCreateStep');
    } catch (error) {
      this._setState('errorMessage', error);
    }

    this._setState('loadingMessage', '');
  };

  _createStepClear = async () => {
    await this.props.setCreateInitialState();
  };

  _renderItem = (item, key) => {
    return (
      <Button
        key={key}
        buttonStyle={item.buttonStyle}
        containerStyle={item.containerStyle}
        titleStyle={item.titleStyle}
        title={item.title}
        disabledStyle={{backgroundColor: MainTheme.colorNonary}}
        onPress={() => {
          this._onPress(item);
        }}
        disabled={
          item.title === 'พิมพ์ใบเสร็จ' &&
          this.state.userToken !== null &&
          this.state.userToken.VANCONFIG !== null &&
          this.state.userToken.VANCONFIG.VANCNF_FRM_ALLCONFIG !== null &&
          this.state.userToken.VANCONFIG.VANCNF_FRM_ALLCONFIG !== 2 &&
          this.state.userToken.VANCONFIG.VANCNF_FRM_ALLCONFIG !== 3
            ? true
            : false
        }
      />
    );
  };

  render() {
    return (
      <ButtonGroup
        renderItem={this._renderItem}
        listItems={this._listItems}
        setState={this._setState}
        errorMessage={this.state.errorMessage}
        loadingMessage={this.state.loadingMessage}
        isQRCodeDialogOpen={this.state.isQRCodeDialogOpen}
        qrCode={this.state.qrCode}
        qrLogo={this.state.qrLogo}
        qrCodePay={this.props.outstandingBalance.create.checkedItems.qrcode.pay}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  bluetooth: state.bluetooth,
  customer: state.customer,
  order: state.order,
  outstandingBalance: state.outstandingBalance,
});

const mapDispatchToProps = (dispatch) => {
  return {
    customerPreProcessPayment: () => dispatch(customerPreProcessPayment()),
    customerProcessPayment: () => dispatch(customerProcessPayment()),
    setPrePocessHeader: (data) => dispatch(setPrePocessHeader(data)),
    setCreateInitialState: () => dispatch(setCreateInitialState()),
    customerCreatePayment: (forceSubmit, TxUID) =>
      dispatch(customerCreatePayment(forceSubmit, TxUID)),
    authForGetAccessToken: (auth) => dispatch(authForGetAccessToken(auth)),
    requestQrCodeSCB: (data, amount) =>
      dispatch(requestQrCodeSCB(data, amount)),
    systemCheck: (data) => dispatch(systemCheck(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTButtonGroup);
