import React, {Component} from 'react';
import {connect} from 'react-redux';
import Form from '../presenter/Form';
import {setCustomerTempCus} from '../../../action/customer';
import {
  phoneNumberFormat,
  numberOnlyCanZeroFirst,
} from '../../../utils/FormatUtil';
import {
  getMasterDataProvinces,
  getMasterDataDistricts,
  getMasterDataSubDistricts,
  setDistrictListItems,
  setSubDistrictListItems,
} from '../../../action/masterData';
import {getUserToken} from '../../../utils/Token';

class CTForm extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      userToken: {VANCONFIG: {VANCNF_ARPRB_MODE: null}},
      temCus: {
        ID: null,
        CODE: null,
        NAME: null,
        ADDRESS1: null,
        ADDRESS2: null,
        ADDRESS3: null,
        PROVINCE: null,
        POSTCODE: null,
        TEL: null,
        FAX: null,
        CATCODE: null,
        GROUPCODE: null,
        TYPECODE: null,
        PRICETABCODE: null,
        SALESMANCODE: null,
        AREACODE: null,
        REFID: null,
        TEMPCODE: null,
        DOCSTATUS: null,
        REMARK: null,
        TAXID: null,
        CONTACTNAME: null,
        DOCDATE: null,
      },
    };
    this._getUserToken();
  }

  componentDidMount = async (props) => {
    this._isMounted = true;
    await this.props.setCustomerTempCus({PROVINCE: null, ARC_VAT_TY: null});
    await this.props.setDistrictListItems([]);
    await this.props.setSubDistrictListItems([]);
    
    // โหลดข้อมูลจังหวัดถ้ายังไม่มี
    if (this.props.masterData.province.listItems.length === 0) {
      try {
        await this.props.getMasterDataProvinces();
      } catch (error) {
        console.log('Error loading provinces:', error);
      }
    }
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

  _setTempCus = async (key, value) => {
    let tempCus = this.props.customer.item.TEMP_CUS;

    if (key === 'TEL') {
      value = phoneNumberFormat(value);
    }
      if (key === 'FAX') {
      value = phoneNumberFormat(value);
    }

    if (key === 'TAXID') {
      value = numberOnlyCanZeroFirst(value);
    }

    if (key === 'POSTCODE') {
      value = numberOnlyCanZeroFirst(value);
    }

    if (key === 'ARC_PAYMENT_PERIOD') {
      value = numberOnlyCanZeroFirst(value);
    }

    tempCus = {
      ...tempCus,
      [key]: value,
    };

    await this.props.setCustomerTempCus(tempCus);
  };

  _onProvinceChange = async (value) => {
    try {
      await this._setTempCus('PROVINCE', value);
      if (value) await this.props.getMasterDataDistricts();
      else await this.props.setDistrictListItems([]);
      await this._setTempCus('POSTCODE', '');
    } catch (error) {
      console.log('error', error);
    }
  };

  _onARPriceTabItemsChange = (value) => {
    this._setTempCus('PRICETABCODE', value);
  };

  _onDistrictChange = async (value) => {
    try {
      await this._setTempCus('ADDRESS3', value);
      if (value) await this.props.getMasterDataSubDistricts();
      else await this.props.setSubDistrictListItems([]);
      await this._setTempCus('POSTCODE', '');
    } catch (error) {
      console.log('error', error);
    }
  };

  _onSubDistrictChange = async (value) => {
    try {
      const index = this.props.masterData.subDistrict.listItems.findIndex(
        (item) => item.Id === value,
      );
      const subDistrict = this.props.masterData.subDistrict.listItems[index];
      await this._setTempCus('ADDRESS2', value);
      if (subDistrict)
        await this._setTempCus('POSTCODE', subDistrict.ZipCode.toString());
    } catch (error) {
      console.log('error', error);
    }
  };

  render() {
    return (
      <Form
        tempCus={this.props.customer.item.TEMP_CUS}
        arPriceTab={this.props.customer.arPriceTab}
        masterData={this.props.masterData}
        setTempCus={this._setTempCus}
        VANCNFARPRBMODE
        vancnfArprbMode={this.state.userToken.VANCONFIG.VANCNF_ARPRB_MODE}
        onProvinceChange={this._onProvinceChange}
        onDistrictChange={this._onDistrictChange}
        onARPriceTabItemsChange={this._onARPriceTabItemsChange}
        onSubDistrictChange={this._onSubDistrictChange}
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
    setCustomerTempCus: (item) => dispatch(setCustomerTempCus(item)),
    getMasterDataProvinces: () => dispatch(getMasterDataProvinces()),
    getMasterDataDistricts: () => dispatch(getMasterDataDistricts()),
    getMasterDataSubDistricts: () => dispatch(getMasterDataSubDistricts()),
    setDistrictListItems: (items) => dispatch(setDistrictListItems(items)),
    setSubDistrictListItems: (items) =>
      dispatch(setSubDistrictListItems(items)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTForm);
