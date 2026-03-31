import moment from 'moment';
import React, { Component } from 'react';
import { Alert, PermissionsAndroid, Platform, Text, View } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import {
  billClearListItems,
  billSearchListItems,
  setError,
} from '../../../../action/bill';
import {
  addProduct,
  loadOrderFileByById,
  orderCancel,
  orderUpdate,
  setHeader,
  setInitialState,
  setOrderItems,
} from '../../../../action/order';
import { MainTheme, mainDivider } from '../../../../constant/lov';
import { printReceipt } from '../../../../constant/printing-pdf-lov';
import { BluetoothFinder, BplusPrinting } from '../../../../module';
import Navigator from '../../../../services/Navigator';
import { calculateOrderProductProcessedSummary } from '../../../../utils/Culculate';
import {
  convertProductItemLastBillToOrderItem,
  generateHeaderForUpdate
} from '../../../../utils/Order';
import { getUserToken } from '../../../../utils/Token';
import ListItems from '../presenter/ListItems';

class CTListItems extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      errorMessage: null,
      loadingMessage: 'กำลังโหลดข้อมูล...',
      userToken: null,
      successMessage: null,
    };
    this._getUserToken();
  }

  componentDidMount = (props) => {
    this._isMounted = true;
  };

  componentWillUnmount = (props) => {
    this._isMounted = false;
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

  _printBill = async (item) => {
    try {
      if (item.DOCINFO?.DI_ACTIVE == 0) {
        if (this.props.bluetooth.state !== 'connected') {
          this._bluetoothAlertDialog();
          return;
        }

        let type = null;

        if (item.DOCINFO?.DT_PROPERTIES == 207) {
          type = 'reserv';
        } else if (item.DOCINFO?.DT_PROPERTIES == 302) {
          type = 'cash';
        } else if (item.DOCINFO?.DT_PROPERTIES == 307) {
          type = 'credit';
        } else if (item.DOCINFO?.DT_PROPERTIES == 308) {
          type = 'return';
        } else if (item.DOCINFO?.DT_PROPERTIES == 337) {
          type = 'returnCash';
        } else if (item.DOCINFO?.DT_PROPERTIES == 337) {
          type = 'orderCheckStock';
        }

        this._setState('loadingMessage', 'กำลังโหลดข้อมูล...');
        this._setState('isLoading', true);

        const result = await this.props.loadOrderFileByById(
          item.DI_REF,
          moment(item.DI_DATE).format('DDMMYYYY'),
        );
        const {RESULT_DATA, RESPONSE_DATETIME} = result;

        const {HEADER, ITEMS, ITEMS_PRT} = RESULT_DATA;

        let printTime = RESPONSE_DATETIME.split('T');
        printTime = printTime[1].split('.');
        this._printReceipt(
          HEADER,
          ITEMS_PRT,
          calculateOrderProductProcessedSummary(HEADER, ITEMS),
          this.props.customer.item.INFO,
          printTime[0],
          type,
          1,
        );
      }
    } catch (error) {
      this._setState('errorMessage', error);
    }

    this._setState('isLoading', false);
  };

  _printBillPDF = async (item) => {
    try {
      console.log('_printBillPDF 1');
      permissions = [PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE];
      console.log('_printBillPDF 2');
      let granted = PermissionsAndroid.RESULTS.GRANTED;
      console.log('_printBillPDF 3');
      if (Platform.OS === 'android') {
        console.log('_printBillPDF 4');
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
      }
      console.log('_printBillPDF 5');
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('_printBillPDF 6');
        if (item.DOCINFO?.DI_ACTIVE == 0) {
          let type = null;
          console.log('_printBillPDF 7');
          if (item.DOCINFO?.DT_PROPERTIES == 207) {
            type = 'reserv';
          } else if (item.DOCINFO?.DT_PROPERTIES == 302) {
            type = 'cash';
          } else if (item.DOCINFO?.DT_PROPERTIES == 307) {
            type = 'credit';
          } else if (item.DOCINFO?.DT_PROPERTIES == 308) {
            type = 'return';
          } else if (item.DOCINFO?.DT_PROPERTIES == 337) {
            type = 'returnCash';
          } else if (item.DOCINFO?.DT_PROPERTIES == 206) {
            type = 'quotation';
          }

          this._setState('loadingMessage', 'กำลังโหลดข้อมูล...');
          this._setState('isLoading', true);
          console.log('_printBillPDF 8');
          const result = await this.props.loadOrderFileByById(
            item.DI_REF,
            moment(item.DI_DATE).format('DDMMYYYY'),
          );
          console.log('_printBillPDF 9');
          const {RESULT_DATA, RESPONSE_DATETIME} = result;
          console.log('RESULT_DATA ', RESULT_DATA);
          console.log('RESPONSE_DATETIME ', RESPONSE_DATETIME);
          const {HEADER, ITEMS, ITEMS_PRT} = RESULT_DATA;

          let printTime = RESPONSE_DATETIME.split('T');
          printTime = printTime[1].split('.');

          const userToken = await getUserToken();
          const disc1 = RESULT_DATA.DIS_BILL_1;
          let isDiscountBath = false;
          if (disc1) {
            let str = disc1.toString();

            if (str.includes('B')) {
              isDiscountBath = true;
            }
          }
          console.log('isDiscountBath ', isDiscountBath);
          const html = printReceipt(
            HEADER,
            ITEMS_PRT,
            calculateOrderProductProcessedSummary(HEADER, ITEMS),
            userToken.VANCONFIG,
            userToken.COMPANYINFO,
            this.props.customer.item.INFO,
            printTime[0],
            type,
            1,
            isDiscountBath,
          );

          let options = {
            html: html,
            fileName: HEADER.VDI_USER_REF.replace('/', '-'),
            directory: 'Documents/bplus_vansales/',
            base64: true,
          };

          let file = await RNHTMLtoPDF.convert(options);
          console.log("filePath: ",file)
          this._pdfAlertDialog(file.filePath);
        }
      }
    } catch (error) {
      this._setState('errorMessage', error);
    }
    this._setState('isLoading', false);
  };

  _orderCancel = async (item) => {
    try {
      if (
        item.DOCINFO?.DI_ACTIVE == 0 //&&
      //  this.state.userToken.VANCONFIG.VANCNF_EDIT_AFPRT == 2
      ) {
        this._setState('loadingMessage', 'กำลังทำการยกเลิกเอกสาร...');
        this._setState('isLoading', true);

        //await this.props.orderCancel(item.DI_REF);
        this._setState('successMessage', 'ยกเลิกเอกสารเรียบร้อย');
      }
    } catch (error) {
      this._setState('errorMessage', error);
    }

    this._setState('isLoading', false);
  };

  _orderUpdate = async (item) => {
    try {
      console.log(
        'this.state.userToken.VANCONFIG.VANCNF_EDIT_AFPRT ',
        this.state.userToken.VANCONFIG.VANCNF_EDIT_AFPRT,
      );
      if (this.state.userToken.VANCONFIG?.VANCNF_EDIT_AFPRT == 2) {
        if (item.DOCINFO?.DI_ACTIVE == 0) {
          let type = null;
          let subType = null;
          console.log(
            'item.DOCINFO?.DT_PROPERTIES ',
            item.DOCINFO?.DT_PROPERTIES,
          );
          if (item.DOCINFO?.DT_PROPERTIES === 207) {
            type = 'จองสินค้า';
            subType = 'reserv';
          } else if (item.DOCINFO?.DT_PROPERTIES == 302) {
            type = 'ขายสินค้า';
            subType = 'cash';
          } else if (item.DOCINFO?.DT_PROPERTIES == 307) {
            type = 'ขายสินค้า';
            subType = 'credit';
          } else if (item.DOCINFO?.DT_PROPERTIES == 308) {
            type = 'รับคืนสินค้า';
            subType = 'return';
          } else if (item.DOCINFO?.DT_PROPERTIES == 337) {
            type = 'รับคืนสินค้า';
            subType = 'returnCash';
          } else if (item.DOCINFO?.DT_PROPERTIES == 206) {
            type = 'ใบเสนอราคา';
            subType = 'quotation';
          }

          this._setState('loadingMessage', 'กำลังทำการโหลดข้อมูลเอกสาร...');
          this._setState('isLoading', true);

          const response = await this.props.orderUpdate(item.DI_KEY);
          const {ORDER_VIEW, EDIT_ITEMS} = response;
          console.log('ORDER_VIEW.ITEMS ', JSON.stringify(ORDER_VIEW.ITEMS));
          console.log('EDIT_ITEMS ', JSON.stringify(EDIT_ITEMS));

          console.log('type ', type);
          console.log('subType ', subType);

          const data = generateHeaderForUpdate(
            this.props.customer.item.INFO,
            ORDER_VIEW.HEADER,
            type,
            subType,
          );

          await this.props.setInitialState();
          await this.props.setHeader(data);
          await this.props.setOrderItems(
            convertProductItemLastBillToOrderItem(EDIT_ITEMS),
          );

          if (item.DOCINFO?.DT_PROPERTIES == 206) {
            Navigator.navigate('OrderCheckStock', {
              userToken: this.state.userToken,
              actionType: 'add_stock_balance',
            });
          } else {
            Navigator.navigate('OrderSales', {
              userToken: this.state.userToken,
              //onBackFromAnother: async () => this._onBackFromAnother(),
            });
          }
        }
      } else {
        this._setState('errorMessage', 'ไม่สามารถแก้ไขบิลได้');
      }
    } catch (error) {
      this._setState('errorMessage', 'ไม่สามารถแก้ไขบิลได้');
    }

    this._setState('isLoading', false);
  };

  _printReceipt = async (
    headerProcessed,
    productListItemsPRTProcessed,
    orderProductSummaryProcessed,
    customer,
    printTime,
    type,
    printTimes,
  ) => {
    if (this.props.bluetooth.state == 'connected') {
      const userToken = await getUserToken();
      console.log("printReceipt...1");
      BplusPrinting.printReceipt(
        headerProcessed,
        productListItemsPRTProcessed,
        orderProductSummaryProcessed,
        userToken.VANCONFIG,
        userToken.COMPANYINFO,
        customer,
        printTime,
        type,
        printTimes,
      );
    }
  };

  _removeConfirmDialog = (item) =>
    Alert.alert(
      'ประกาศ',
      ' ยืนยันการยกเลิกเอกสาร',
      [
        {text: 'ยกเลิก', onPress: () => {}, style: 'cancel'},
        {text: 'ยืนยัน', onPress: () => this._orderCancel(item)},
      ],
      {cancelable: false},
    );

  _printConfirmDialog = (item) => {
    Alert.alert(
      'ประกาศ',
      'ต้องการพิมพ์',
      [
        {text: 'ยกเลิก', onPress: () => {}, style: 'cancel'},
        {
          text: 'ยืนยัน',
          onPress: () =>
            this.props.bluetooth.printingType === 'BLUETOOTH'
              ? this._printBill(item)
              : this._printBillPDF(item),
        },
      ],
      {cancelable: false},
    );
  };

  _bluetoothAlertDialog = () =>
    Alert.alert(
      'ประกาศ',
      'เนื่องจากไม่ได้ทำการ Connect printer ต้องการจะไปที่หน้า Bluetooth setting หรือไม่',
      [
        {text: 'ยกเลิก', onPress: () => {}, style: 'cancel'},
        {text: 'ยืนยัน', onPress: () => this._goToBluetoothSetting()},
      ],
      {cancelable: false},
    );

  _goToBluetoothSetting = () => {
    BluetoothFinder.checkBluetoothEnable((value) => {
      if (value.result) {
        Navigator.navigate('Bluetooth');
      }
    });
  };

  _pdfAlertDialog = (path) =>
    Alert.alert(
      'ประกาศ',
      path,
      [
        {
          text: 'แสดง',
          onPress: () =>
            Navigator.navigate('PDFPreview', {title: '', source: path}),
          style: 'cancel',
        },
        {
          text: 'กลับสู่เมนูหลัก',
          onPress: () => Navigator.navigate('OrderChoice'),
        },
      ],
      {cancelable: false},
    );

  _setState = (key, value) => {
    this._isMounted &&
      this.setState((oldState) => {
        return {
          [key]: value,
        };
      });
  };

  _onRefresh = () => {
    this.props.billClearListItems();
    this.props.billSearchListItems();
  };

  _onScroll = (event) => {
    const frameHeight = event.nativeEvent.layoutMeasurement.height;
    const contentHeight = event.nativeEvent.contentSize.height;
    const maxOffset = 0.95 * parseInt(contentHeight - frameHeight);
    const currentOffset = parseInt(event.nativeEvent.contentOffset.y);
    currentOffset >= maxOffset && !this.props.bill.isLoading
      ? this.props.billSearchListItems(true)
      : null;
  };

  _header = () => {
    return (
      <ListItem
        title={
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{width: 150, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              เลขที่
            </Text>
            <Text
              style={{width: 100, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              รายการ
            </Text>
            <Text
              style={{width: 100, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              ยอดเงิน
            </Text>
            <Text
              style={{width: 100, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              วันที่
            </Text>
            <Text
              style={{width: 50, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              สถานะ
            </Text>
            <Text
              style={{width: 150, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}></Text>
          </View>
        }
        containerStyle={{backgroundColor: MainTheme.colorPrimary}}
        titleNumberOfLines={1}
      />
    );
  };

  _actionHandler = () => {
    this.props.setError(false);
  };

  _showPrinterIcon = (item) => {
    if (item.DOCINFO?.DI_ACTIVE != 0) return false;
    if (item.DOCINFO?.DT_PROPERTIES == 348) return false;
    if (item.DOCINFO?.DT_PROPERTIES == 349) return false;
    if (!this.state.userToken) return false;
    if (!this.state.userToken.VANCONFIG.VANCNF_FRM_ALLCONFIG) return false;
    if (
      this.state.userToken.VANCONFIG.VANCNF_FRM_ALLCONFIG !== 2 &&
      this.state.userToken.VANCONFIG.VANCNF_FRM_ALLCONFIG !== 3
    )
      return false;
    if (
      item.DOCINFO?.DT_PROPERTIES == 302 &&
      this.state.userToken.VANCONFIG.VANCNF_REPRT_CASHSALES != 2
    )
      return false;
    if (
      item.DOCINFO?.DT_PROPERTIES == 307 &&
      this.state.userToken.VANCONFIG.VANCNF_REPRT_INV != 2
    )
      return false;

    return true;
  };

  _renderItem = ({item}) => {
    console.log("order bill list item ",item);
    return (
      <ListItem
        title={
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{width: 150, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              {/* {item.DI_REF} */}
              {item.DOCINFO?.DI_REF}
            </Text>
            <Text
              style={{width: 100, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              {item.DI_ITEMS.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </Text>
            <Text
              style={{width: 100, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              {item.DI_AMOUNT.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </Text>
            <Text
              style={{width: 100, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              {moment(item.DOCINFO?.DI_DATE)
                .add(543, 'years')
                .format('DD/MM/YYYY')}
            </Text>
            <Text
              style={{width: 50, marginLeft: 5, fontSize: hp('1.6%')}}
              allowFontScaling={false}>
              {item.DOCINFO?.DI_ACTIVE == 0 ? 'ปรกติ' : 'ยกเลิก'}
            </Text>

            <View style={{width: 150, marginLeft: 5, flexDirection: 'row'}}>
              {item.DOCINFO?.DI_ACTIVE == 0 &&
              item.CAN_EDIT == true &&
              item.DOCINFO?.DT_PROPERTIES != 348 &&
              item.DOCINFO?.DT_PROPERTIES != 349 &&
              this.state.userToken &&
              this.state.userToken.VANCONFIG ? ( //&&
                //    this.state.userToken.VANCONFIG.VANCNF_EDIT_AFPRT &&
                //       this.state.userToken.VANCONFIG.VANCNF_EDIT_AFPRT == 2
                <View style={{marginRight: 15}}>
                  <Icon
                    name="edit"
                    size={20}
                    type={'antdesign'}
                    color={MainTheme.colorPrimary}
                    underlayColor="transparent"
                    onPress={() => this._orderUpdate(item)}
                  />
                </View>
              ) : null}

             
              
            </View>
          </View>
        }
        containerStyle={[
          {
            backgroundColor:
              item.DOCINFO?.DI_ACTIVE == 0 //&& item.CAN_EDIT == true
                ? MainTheme.colorSecondary
                : '#FFCBA4',
          },
          mainDivider,
        ]}
        bottomDivider
        titleNumberOfLines={1}
      />
    );
  };

  render() {
    return (
      <ListItems
        header={this._header}
        listItems={this.props.bill.listItems}
        renderItem={this._renderItem}
        errorMessage={this.state.errorMessage}
        onScroll={this._onScroll}
        refreshing={this.props.bill.isLoading}
        onRefresh={this._onRefresh}
        setState={this._setState}
        isError={
          this.props.bill.isError && this.props.bill.listItems.length == 0
        }
        isNotFound={
          this.props.bill.isNotFound && this.props.bill.listItems.length == 0
        }
        isSnackBarVisible={
          this.props.bill.isError && this.props.bill.listItems.length > 0
        }
        actionHandler={this._actionHandler}
        isLoading={this.state.isLoading}
        loadingMessage={this.state.loadingMessage}
        successMessage={this.state.successMessage}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  bill: state.bill,
  bluetooth: state.bluetooth,
  customer: state.customer,
});

const mapDispatchToProps = (dispatch) => {
  return {
    loadOrderFileByById: (id, date) => dispatch(loadOrderFileByById(id, date)),
    orderCancel: (id) => dispatch(orderCancel(id)),
    orderUpdate: (id, type) => dispatch(orderUpdate(id, type)),
    setInitialState: (data) => dispatch(setInitialState(data)),
    setHeader: (data) => dispatch(setHeader(data)),
    setOrderItems: (data) => dispatch(setOrderItems(data)),
    billSearchListItems: (dateFrom, dateTo) => {
      dispatch(billSearchListItems(dateFrom, dateTo));
    },
    billClearListItems: () => {
      dispatch(billClearListItems());
    },
    setError: (bool) => {
      dispatch(setError(bool));
    },
    addProduct: (item) => dispatch(addProduct(item)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTListItems);
