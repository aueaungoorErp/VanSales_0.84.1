import React, { Component } from 'react';
import { Alert, PermissionsAndroid, Platform, Text, TouchableOpacity } from 'react-native';
import RNFS from 'react-native-fs';
import { generatePDF } from 'react-native-html-to-pdf';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { searchMasterDataVanVisRList } from '../../../../action/masterData';
import {
  addVisitImageItem,
  createDocVisit,
  removeAllVisitImageItems,
} from '../../../../action/order';
import { systemCheck } from '../../../../action/setting';
import { orderSummaryFormButtonGroup } from '../../../../constant/lov';
import {
  printReceipt2
} from '../../../../constant/printing-pdf-lov';
import { BluetoothFinder, BplusPrinting } from '../../../../module';
import Navigator from '../../../../services/Navigator';
import { getSettingConfig, getUserToken } from '../../../../utils/Token';
import SummaryButtonGroup from '../presenter/SummaryButtonGroup';

class CTSummaryButtonGroup extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      errorMessage: null,
      userToken: null,
    };
  }

  componentDidMount = (props) => {
    this._isMounted = true;
    this._getUserToken();
  };

  componentWillUnmount = (props) => {
    this._isMounted = false;
  };

  _getUserToken = async () => {
    const userToken = await getUserToken();
    console.log('userToken ', userToken);

    if (userToken) {
      this._isMounted &&
        (await this.setState((oldState) => {
          return {
            userToken: userToken,
          };
        }));
    }
  };

  _checkPermission = async (type, processResult) => {
    try {
      console.log('_checkPermission type', type);
      console.log('_checkPermission processResult', processResult);

      let granted = PermissionsAndroid.RESULTS.GRANTED;

      if (Platform.OS === 'android' && Platform.Version < 33) {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
      }

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const userToken = await getUserToken();

        const { baseUrl, vanCNFMachine } = await getSettingConfig();
        const { VANCONFIG } = await getUserToken();
        const response = await this.props.systemCheck({
          baseUrl: baseUrl,
          vanCNFMachine: VANCONFIG,
        });

        const {
          ResponseData,
          ResponseCode,
          ReasonString,
          BPAPUS_GUID,
          RESPONSE_DATETIME,
        } = response;
        let responseData = JSON.parse(ResponseData);
        console.log('response RESPONSE_DATETIME ', RESPONSE_DATETIME);
        console.log('responseData', responseData);
        console.log('responseData.RECORD_COUNT', responseData.RECORD_COUNT);
        if (responseData.RECORD_COUNT != 0) {
          let printTime = RESPONSE_DATETIME.split(':');

          let isDiscountBath = false;
          if (type != 'transfer') {
            if (processResult.ARDETAIL) {
              let strArr = processResult.ARDETAIL.ARD_TDSC_KEYIN.split(',');
              console.log('processResult.ARDETAIL');
              let strArr2 = strArr[0].split('');
              for (let i in strArr2) {
                if (strArr2[i] == 'B') {
                  console.log('INCLUDE B ARDETAIL = DISCOUNTBATH');
                  isDiscountBath = true;
                }
              }
            } else if (processResult.AROE) {
              console.log('processResult.AROE');
              let strArr = processResult.AROE.AROE_TDSC_KEYIN.split(',');

              let strArr2 = strArr[0].split('');
              for (let i in strArr2) {
                if (strArr2[i] == 'B') {
                  console.log('INCLUDE B AROE= DISCOUNTBATH');
                  isDiscountBath = true;
                }
              }
            }
          }

          // console.log('this.props.order.headerProcessed ', this.props.order);
          // console.log('userToken.VANCONFIG ', userToken.VANCONFIG);
          console.log('processResultBtn ', processResult);
          //const html = 'eeeeee' ;

          const html = printReceipt2(
            this.props.order,
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

          // let options = {
          //   html: html,
          //   fileName:
          //     processResult.DOCINFO.DI_REF + processResult.DOCINFO.DI_AMOUNT,
          //   directory: 'bplus-vansales',
          //   base64: true,
          // };


          let options = {
            html: '' + html + '',
            //fileName: 'doc-' + JSON.parse(header.headerProcessed) + type,
            fileName: this.props.order.header.VDI_USER_REF.replace(
              '/',
              '-',
            ),
            // directory: 'Documents/bplus_vansales/',
            directory: 'Documents',
            base64: true
          };
          // alert(html)
          let file = await generatePDF(options);
          // alert(file)

          console.log("filePath3: ", file.filePath.split("/").pop())

          this._pdfAlertDialog(file.filePath);
        }
      }
    } catch (error) {
      this._setState('isLoading', false);
      this._setState('errorMessage', error.message);
      return false;
    }

    return true;
  };

  _renderItem = (item, key) => {
    const { routes, index } = Navigator.getCurrentRoute();
    const printType =
      routes[index].params !== undefined &&
        routes[index].params !== null &&
        routes[index].params.printType !== undefined &&
        routes[index].params.printType !== null
        ? routes[index].params.printType
        : null;

    // console.log(
    //   'พิมพ์ใบเสร็จ1',
    //   item.title === 'พิมพ์ใบเสร็จ' &&
    //     this.state.userToken !== null &&
    //     this.state.userToken.VANCONFIG !== null &&
    //     this.state.userToken.VANCONFIG.VANCNF_FRM_ALLCONFIG !== null,
    // );
    // console.log(
    //   'พิมพ์ใบเสร็จ2',
    //   item.title === 'พิมพ์ใบเสร็จ' &&
    //     this.state.userToken !== null &&
    //     this.state.userToken.VANCONFIG !== null &&
    //     this.state.userToken.VANCONFIG.VANCNF_FRM_ALLCONFIG !== null &&
    //     this.state.userToken.VANCONFIG.VANCNF_FRM_ALLCONFIG !== 2 &&
    //     this.state.userToken.VANCONFIG.VANCNF_FRM_ALLCONFIG !== 3,
    // );
    return (
      <TouchableOpacity key={key} style={[item.buttonStyle, item.containerStyle, {justifyContent: "center", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16}]} onPress={() => {
          this._onPress(item);
        }} activeOpacity={0.7}>
              <Text style={[item.titleStyle, { fontSize: hp('1.8%') }]}>{
          printType === 'transfer' && key == 0
            ? this.props.bluetooth.printingType !== 'BLUETOOTH'
              ? item.subTitle2
              : item.subTitle
            : item.title === 'พิมพ์ใบเสร็จ' &&
              this.props.bluetooth.printingType !== 'BLUETOOTH'
              ? item.subTitle2
              : item.title
        }</Text>
            </TouchableOpacity>
    );
  };

  _onPress = async (item) => {
    console.log("item=================>", item)
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
    console.log('_onPress printType: ', printType);
    console.log('_onPress processResult: ', processResult);
    if (item.methodType === 'function') {
      if (this.props.bluetooth.printingType === 'BLUETOOTH') {
        if (item.methodName === 'print-receipt') {
          if (this.props.bluetooth.state !== 'connected') {
            this._bluetoothAlertDialog();
            return;
          }

          if (printType != null) {
            if (await this._printReceipt(printType, processResult)) {
              console.log('printType3: ', printType);
              // if (printType !== 'transfer') {
              //   Navigator.navigate(item.screen);
              // } else {
              //   Navigator.navigate('Home');
              // }
            }
          }
        }
      } else {
        console.log('pdf');
        this._checkPermission(printType, processResult);
      }
    } else if (item.methodType === 'newPage') {
      if (printType !== 'transfer') {
        Navigator.navigate(item.screen);
      } else {
        Navigator.navigate('Home');
      }
    }
  };

  _printReceipt = async (type, processResult) => {
    try {
      this._setState('isLoading', true);
      this._setState('errorMessage', null);
      console.log('_printReceipt');
      if (this.props.bluetooth.state == 'connected') {
        const userToken = await getUserToken();

        const { baseUrl, vanCNFMachine } = await getSettingConfig();
        const { VANCONFIG } = await getUserToken();
        const response = await this.props.systemCheck({
          baseUrl: baseUrl,
          vanCNFMachine: VANCONFIG,
        });

        console.log('responseresponse ', response);
        if (response.ResponseCode == 200) {
          const { ResponseData, RESPONSE_DATETIME } = response;
          const responseData = JSON.parse(ResponseData);
          console.log('responseresponsssssse ', responseData);
          console.log('responseresponsssssse ', RESPONSE_DATETIME);
          let printTime = RESPONSE_DATETIME;
          if (responseData) {
            let isDiscountBath = false;
            if (processResult && processResult.ARDETAIL) {
              let strArr = processResult.ARDETAIL.ARD_TDSC_KEYIN.split(',');
              console.log('processResult.ARDETAIL');
              let strArr2 = strArr[0].split('');
              for (let i in strArr2) {
                if (strArr2[i] == 'B') {
                  console.log('INCLUDE B ARDETAIL = DISCOUNTBATH');
                  isDiscountBath = true;
                }
              }
            } else if (processResult && processResult.AROE) {
              console.log('processResult.AROE');
              let strArr = processResult.AROE.AROE_TDSC_KEYIN.split(',');

              let strArr2 = strArr[0].split('');
              for (let i in strArr2) {
                if (strArr2[i] == 'B') {
                  console.log('INCLUDE B AROE= DISCOUNTBATH');
                  isDiscountBath = true;
                }
              }
            }

            BplusPrinting.printReceipt(
              this.props.order,
              this.props.order.productListItemsPRTProcessed,
              processResult ? processResult : {},
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
          }
        } else {
          this._setState(
            'errorMessage',
            response.ReasonString + response.ResponseData,
          );
          return false;
        }
      }
      this._setState('isLoading', false);
    } catch (error) {
      this._setState('isLoading', false);
      console.log("ERROR _printReceipt ", error);
      this._setState('errorMessage', error.message);
      return false;
    }

    return true;
  };

  _setState = async (key, value) => {
    this._isMounted &&
      (await this.setState((oldState) => {
        return {
          [key]: value,
        };
      }));
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

  _pdfAlertDialog = (path) =>
    Alert.alert(
      'ประกาศ',
      `${RNFS.ExternalStorageDirectoryPath}/Documents/bplus_vansales/${path.split("/").pop()}`,
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

  render() {
    return (
      <SummaryButtonGroup
        printingType={this.props.bluetooth.printingType}
        listItems={orderSummaryFormButtonGroup}
        renderItem={this._renderItem}
        errorMessage={this.state.errorMessage}
        isLoading={this.state.isLoading}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  bluetooth: state.bluetooth,
  order: state.order,
  customer: state.customer,
});

const mapDispatchToProps = (dispatch) => {
  return {
    searchMasterDataVanVisRList: () => dispatch(searchMasterDataVanVisRList()),
    addVisitImageItem: (uri) => dispatch(addVisitImageItem(uri)),
    removeAllVisitImageItems: () => dispatch(removeAllVisitImageItems()),
    createDocVisit: (data) => dispatch(createDocVisit(data)),
    systemCheck: (data) => dispatch(systemCheck(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CTSummaryButtonGroup);
