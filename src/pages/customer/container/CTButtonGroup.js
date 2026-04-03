import moment from 'moment';
import React from 'react';
import { Alert, Keyboard, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { BPAPUS_BPAPSV } from '../../../../appConfig';
import {
  closeCustomerAccount,
  createTempCus,
  setCustomerTempCus,
} from '../../../action/customer';
import { lookupErpV3Api } from '../../../api/bPlusApi';
import {
  customerAddButtonGroup,
  customerProfileDetailButtonGroup,
  MainTheme,
} from '../../../constant/lov';
import { strings } from '../../../locales/i18n';
import Navigator from '../../../services/Navigator';
import { getLoginGuID, getUserToken } from '../../../utils/Token';
import ButtonGroup from '../presenter/ButtonGroup';

class CTButtonGroup extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null,
      isLoading: false,
      loadingMessage: '',
      isOpenReasonDialog: false,
      closeReason: null,
      successCloseReasonMessage: null,
      errorCloseReasonMessage: null,
      isCloseReasonLoading: false,
      userToken: { VANCONFIG: { VANCNF_ARPRB_MODE: null } },
      isOpenSuccessCloseReasonDialog: false,
    };
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
    console.log('CTButtonGroup getUserToken');
    const userToken = await getUserToken();
    if (userToken) {
      await this._setState('userToken', userToken);
    }
  };

  _onPress = async (item) => {
    if (item.methodType === 'function') {
      if (item.methodName === 'order') {
        try {
          const userToken = await getUserToken();

          if (userToken.VANCONFIG.VANCNF_FORCE_MILE == 1) {
            Navigator.navigate('Mile');
            return;
          }

          if (userToken.VANCONFIG.VANCNF_FORCE_GPS == 1) {
            Navigator.navigate('CheckIn');
            return;
          }

          Navigator.navigate('OrderChoice');
        } catch (error) {
          console.log('CTButtonGroup1 ', error);
          this._setState('errorMessage', 'เกิดข้อผิดพลาด: ' + error);
        }
      } else if (item.methodName === 'add') {
        await this._addCustomer();
      } else if (item.methodName === 'close-customer-account') {
        if (this.state.userToken.VANCONFIG.VANCNF_AR_CANCEL !== 2) {
          this._setState('errorMessage', 'ไม่มีสิทธิในการปิดบัญชีลูกค้า');
          return;
        }

        await this._setState('isOpenReasonDialog', true);
        this._setState('successCloseReasonMessage', null);
        this._setState('errorCloseReasonMessage', null);
        this._setState('closeReason', null);
      } else if (item.methodName === 'clear-profile') {
        await this.props.setCustomerTempCus({ PROVINCE: null, ARC_VAT_TY: null });
      } else if (item.methodName === 'back') {
        Navigator.back();
      }
    }
  };

  _closeCustomerAccount = async () => {
    try {
      await this._setState('errorCloseReasonMessage', null);

      if (
        this.state.closeReason === null ||
        this.state.closeReason.trim() === ''
      ) {
        this._setState('errorCloseReasonMessage', 'กรุณาใส่เหตุผลการปิดบัญชี');
        return;
      }

      this._setState('isCloseReasonLoading', true);
      await this.props.closeCustomerAccount(this.state.closeReason);
      this._setState('isOpenSuccessCloseReasonDialog', true);
      this._setState('successCloseReasonMessage', 'ปิดบัญชีลูกค้าเรียบร้อย');
    } catch (error) {
      console.log('CTButtonGroup2 ', error);
      this._setState('errorMessage', 'เกิดข้อผิดพลาด: ' + error);
    }

    this._setState('isCloseReasonLoading', false);
    await this._setState('isOpenReasonDialog', false);
  };

  _addCustomer = async () => {
    try {
      const userToken = await getUserToken();
      const LoginGUID = await getLoginGuID();

      // ดึง SLMN_CODE จาก API โดยใช้ SLMN_KEY (VANCNF_SLMN)
      let SLMN_CODE = null;
      await lookupErpV3Api({
        'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': 'SL000130',
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER': "and SLMN_KEY = '" + userToken.VANCONFIG.VANCNF_SLMN + "'",
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      })
        .then((v) => {
          const { ResponseData, ResponseCode, ReasonString } = v.data;
          if (ResponseCode == 200) {
            let responseData = JSON.parse(ResponseData);
            SLMN_CODE = responseData.SL000130 ? responseData.SL000130[0].SLMN_CODE : '';
          } else {
            console.log('ERROR lookupErpV3Api', ReasonString);
          }
        })
        .catch((err) => {
          console.log('ERROR lookupErpV3Api', err);
        });

      // ดึง AC_KEY จาก API โดยใช้ AC_PROPERTIES = 303
      let AC_KEY = null;
      await lookupErpV3Api({
        'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': 'GL000200',
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER': "AND AC_PROPERTIES = 303",
        'BPAPUS-ORDERBY': 'ORDER BY AC_KEY ASC',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '1',
      })
        .then((v) => {
          const { ResponseData, ResponseCode, ReasonString } = v.data;
          if (ResponseCode == 200) {
            let responseData = JSON.parse(ResponseData);
            AC_KEY = responseData.GL000200 ? responseData.GL000200[0].AC_KEY : '';
          } else {
          }
        })
        .catch((err) => {
          console.log('ERROR lookupErpV3Api AC_KEY', err);
        });

      const validate = this._checkProperties(this.props.customer.item.TEMP_CUS);

      if (validate !== null && validate !== '') {
        this._setState('errorMessage', 'เกิดข้อผิดพลาด: ' + validate);
        return;
      }

      Keyboard.dismiss();

      let tempCus = this.props.customer.item.TEMP_CUS;
      const provinceIndex = this.props.masterData.province.listItems.findIndex(
        (item) => item.Id === tempCus.PROVINCE,
      );
      const address3Index = this.props.masterData.district.listItems.findIndex(
        (item) => item.Id === tempCus.ADDRESS3,
      );
      const address2Index = this.props.masterData.subDistrict.listItems.findIndex(
        (item) => item.Id === tempCus.ADDRESS2,
      );

      const PROVINCE = this.props.masterData.province.listItems[provinceIndex]
        .NameInThai;
      const ADDRESS3 = this.props.masterData.district.listItems[address3Index]
        .NameInThai;
      const ADDRESS2 = this.props.masterData.subDistrict.listItems[
        address2Index
      ].NameInThai;

      tempCus = {
        ...tempCus,
        ID: 0,
        CODE: '',
        TEMPADRCODE: '',
        CATCODE: '',
        GROUPCODE: '',
        TYPECODE: '',
        SALESMANCODE: SLMN_CODE,
        AREACODE: '',
        REFID: '',
        TEMPCODE: '',
        DOCSTATUS: 0,
        REMARK: '',
        DOCDATE: moment().format('YYYY-MM-DDTHH:mm:SS'),          //'2019-06-05T03:39:58.537Z',
        PROVINCE: PROVINCE,
        ADDRESS3: ADDRESS3,
        ADDRESS2: ADDRESS2,
        ARC_REMARK: '',
        AR_AC: AC_KEY,
      };

      this._setState('loadingMessage', 'กำลังสร้างข้อมูลลูกค้า');

      await this.props.createTempCus(tempCus);
      this._completeAlertDialog();
    } catch (error) {
      this._setState('errorMessage', 'เกิดข้อผิดพลาด: ' + error);
    }

    this._setState('loadingMessage', '');
  };

  _completeAlertDialog = () =>
    Alert.alert(
      'สำเร็จ',
      'สร้างข้อมูลลูกค้าเรียบร้อย',
      [{ text: 'ตกลง', onPress: () => Navigator.navigate('Home') }],
      { cancelable: false },
    );

  _checkProperties = (obj) => {
    console.log('obj', obj);
    if (obj.NAME === undefined || obj.NAME === null || obj.NAME === '') {
      return strings('customer.error_name_is_required');
    }





    if (obj.TAXID === '' ||
      obj.TAXID === undefined ||
      obj.TAXID === null ||
      obj.TAXID.length !== 13

    ) {
      return strings('customer.error_tax_id_should_be_13_digits');
    }

    if (
      obj.PROVINCE === undefined ||
      obj.PROVINCE === null ||
      obj.PROVINCE === ''
    ) {
      return strings('customer.error_province_is_required');
    }

    if (
      obj.ADDRESS3 === undefined ||
      obj.ADDRESS3 === null ||
      obj.ADDRESS3 === ''
    ) {
      return strings('customer.error_adress3_is_required');
    }

    if (
      obj.ADDRESS2 === undefined ||
      obj.ADDRESS2 === null ||
      obj.ADDRESS2 === ''
    ) {
      return strings('customer.error_adress2_is_required');
    }

    if (
      obj.ADDRESS1 === undefined ||
      obj.ADDRESS1 === null ||
      obj.ADDRESS1 === ''
    ) {
      return strings('customer.error_adress1_is_required');
    }

    if (
      obj.POSTCODE === undefined ||
      obj.POSTCODE === null ||
      obj.POSTCODE === '' ||
      obj.POSTCODE.length !== 5
    ) {
      return strings('customer.error_post_code_should_be_5_digits');
    }



    // if (obj.FAX === undefined || obj.FAX === null || obj.FAX === '') {
    //     return 'กรุณากรอกเบอร์แฟกซ์'
    // }
    // if (obj.ARCONDITION === undefined || obj.ARCONDITION === null || obj.ARCONDITION === '') {
    //     return strings('customer.error_province_is_required')
    // }
    if (obj.CONTACTNAME === undefined ||
      obj.CONTACTNAME === null ||
      obj.CONTACTNAME === ''
    ) {
      return strings('customer.error_contact_name_is_required');
    }



    if (obj.TEL === undefined || obj.TEL === null || obj.TEL === '') {
      return 'กรุณากรอกเบอร์โทรศัพท์'
    }


    if (
      obj.ARC_NAME === undefined ||
      obj.ARC_NAME === null ||
      obj.ARC_NAME === ''
    ) {
      obj.ARC_NAME === ' ';
      //return strings('customer.error_arc_name_is_required');
    }

    if (
      obj.ARC_PAYMENT_PERIOD === undefined ||
      obj.ARC_PAYMENT_PERIOD === null
    ) {
      obj.ARC_PAYMENT_PERIOD = 0;
      //return strings('customer.error_arc_payment_period_is_required');
    }

    if (obj.ARC_VAT_TY === undefined || obj.ARC_VAT_TY === null) {
      obj.ARC_VAT_TY = 0;
      //return strings('customer.error_arc_vat_ty_is_required');
    }
    console.log(
      'this.state.userToken.VANCONFIG.VANCNF_ARPRB_MODE ',
      this.state.userToken.VANCONFIG.VANCNF_ARPRB_MODE,
    );


    // เอา ข้อความแจ้งเตื่อน "กรุณากรอกรหัสตารางราคาขาย" ออก
    // if (
    //   this.state.userToken.VANCONFIG.VANCNF_ARPRB_MODE == 1 &&
    //   (obj.PRICETABCODE === undefined || obj.PRICETABCODE === null)
    // ) {
    //   return strings('customer.error_ar_price_tab');
    // }

    return null;
  };

  _renderItem = (item, key) => {
    const isPrimary = item.methodName === 'add';
    const isDisabled = !!this.state.buttonDisabled;

    return (
      <TouchableOpacity key={key} style={[
          item.containerStyle,
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 4,
            paddingVertical: 10,
            paddingHorizontal: 10,
            minHeight: 54,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: isPrimary ? MainTheme.colorPrimary : '#D7E0D8',
            backgroundColor: isDisabled
              ? MainTheme.colorNonary
              : isPrimary
              ? MainTheme.colorPrimary
              : '#FFFFFF',
          },
        ]} onPress={() => {
          this._onPress(item);
        }} disabled={this.state.buttonDisabled} activeOpacity={0.7}>
              <Text style={[
                item.titleStyle,
                {
                  fontWeight: '700',
                  fontSize: 16,
                  color: isDisabled
                    ? '#FFFFFF'
                    : isPrimary
                    ? MainTheme.colorSecondary
                    : '#22312B',
                },
              ]}>{item.title}</Text>
            </TouchableOpacity>
    );
  };

  render() {
    return (
      <ButtonGroup
        renderItem={this._renderItem}
        listItems={
          this.props.screen === 'add'
            ? customerAddButtonGroup
            : customerProfileDetailButtonGroup
        }
        setState={this._setState}
        errorMessage={this.state.errorMessage}
        isLoading={this.props.masterData.isLoading}
        loadingMessage={this.state.loadingMessage}
        isOpenReasonDialog={this.state.isOpenReasonDialog}
        closeReason={this.state.closeReason}
        closeCustomerAccount={this._closeCustomerAccount}
        successCloseReasonMessage={this.state.successCloseReasonMessage}
        errorCloseReasonMessage={this.state.errorCloseReasonMessage}
        isCloseReasonLoading={this.state.isCloseReasonLoading}
        isOpenSuccessCloseReasonDialog={
          this.state.isOpenSuccessCloseReasonDialog
        }
      />
    );
  }
}

const mapStateToProps = (state) => ({
  customer: state.customer,
  masterData: state.masterData,
});

const mapDispatchToProps = (dispatch) => {
  return {
    createTempCus: (data) => dispatch(createTempCus(data)),
    setCustomerTempCus: (data) => dispatch(setCustomerTempCus(data)),
    closeCustomerAccount: (reason) => dispatch(closeCustomerAccount(reason)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTButtonGroup);
