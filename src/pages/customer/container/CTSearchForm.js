import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchForm from '../presenter/SearchForm';
import {
  searchCustomerList,
  setKeyword,
  clearCustomerList,
  setInitialState,
  searchCustomerNextDestination,
} from '../../../action/customer';
import { setCustomerType } from '../../../action/customer-type';
import { getUserToken } from '../../../utils/Token';
import Navigator from '../../../services/Navigator';

class CTSearchForm extends Component {
  _isMounted = false;
  _firstTime = true;

  constructor(props) {
    super(props);

    this.state = {
      textSearch: null,
      ARCAT_KEY: null,
      userToken: {
        VANCONFIG: {
          VANCNF_AR_LIMIT: null,
        },
      },
    };

    this._getUserToken();
  }

  componentDidMount() {
    this._isMounted = true;
    console.log('this.state.userToken.', this.state.userToken);
    this.props.setInitialState();
    this.props.clearCustomerList();
    this._onRefresh();
    this._onSearch();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _getUserToken = async () => {
    const userToken = await getUserToken();
    if (userToken) {
      await this._setState('userToken', userToken);
    }
  };

  _onRefresh = async () => {
    const userToken = await getUserToken();
    this.props.customerType.item = {};

    if (userToken) {
      //console.log('userToken 2', userToken);
      await this._setState('userToken', userToken);
    }


    if (!this.props.customer.isLoading) {
      console.log('this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT2.0  ');
      //ดึงข้อมูลลูกค้า ตาม VAN_CNF VANCNF_AR_LIMIT โดย ค่า1 คือตามสายลูกค้า, ค่า 2 คือตามสายเดินรถ
      if (this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT != 2) {
        console.log('VANCNF_AR_LIMIT0.1.2  ตามสายลูกค้า');
        console.log('this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT111  ', this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT,);
        await this.props.clearCustomerList();
        console.log('ตรวจสอบตรงนี้ >> 2', this.props.customerType.item);
        await this.props.setKeyword(
          this.state.textSearch ? this.state.textSearch.trim() : null,
        );
        await this.props.searchCustomerList(false);
      } else {
        console.log('VANCNF_AR_LIMIT0.2.2  ตามสายเดินรถ');
        console.log('this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT222  ', this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT,);
        await this.props.clearCustomerList();
        await this.props.searchCustomerNextDestination();
      }
    }
  };

  _setTextSearch = (value) => {
    this._isMounted &&
      this.setState((oldState) => {
        return {
          textSearch: value,
        };
      });
  };

  _onSearch = async () => {
    await this._getUserToken();
    console.log('_onSearch', !this.props.customer.isLoading);

    if (!this.props.customer.isLoading) {
      if (this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT != 2) {
        console.log(
          ' this.props.customerType.listItems ',
          this.props.customerType.listItems,
        );
        if (
          this.props.customerType.listItems &&
          this.props.customerType.listItems.length > 0
        ) {
          console.log(" this.state.ARCAT_KEY=>>>>>>>> ", this.state.ARCAT_KEY);
          let type = this.props.customerType.listItems.find((v) => {
            console.log(' this.state.ARCAT_KEY ', this.state.ARCAT_KEY);
            console.log(' v.ARCAT_KEY', v.ARCAT_KEY);
            return this.state.ARCAT_KEY == v.ARCAT_KEY;
          });
          console.log(" type=>>>>>>>> ", type);
          type ? null : (type = { ARCAT_KEY: null, ARCAT_NAME: null });

          await this.props.setCustomerType(type);
          await this.props.clearCustomerList();
          await this.props.setKeyword(
            this.state.textSearch ? this.state.textSearch.trim() : null,
          );
          console.log('ตรวจสอบตรงนี้ >> 1');
          await this.props.searchCustomerList();
        }
      } else {
        await this.props.clearCustomerList();
        //await this.props.searchCustomerNextDestination();
      }
    }
  };

  _setCustomerType = async (value) => {
    this._isMounted &&
      (await this.setState((oldState) => {
        console.log("_setCustomerType value ", value);
        return {
          ARCAT_KEY: value,
        };
      }));
    this._onSearch();
  };

  _navigateTo = (routeName) => {
    Navigator.navigate(routeName);
  };

  _setState = async (key, value) => {
    this._isMounted &&
      (await this.setState((oldState) => {
        return {
          [key]: value,
        };
      }));
  };

  render() {
    return (
      <SearchForm
        value={this.state.textSearch}
        type={this.state.ARCAT_KEY}
        setTextSearch={this._setTextSearch}
        onSearch={this._onSearch}
        typeItems={this.props.customerType.listItems}
        setCustomerType={this._setCustomerType}
        onRefresh={this._onRefresh}
        navigateTo={this._navigateTo}
        userToken={this.state.userToken}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  customer: state.customer,
  customerType: state.customerType,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setInitialState: () => {
      dispatch(setInitialState());
    },
    setKeyword: (criteria) => {
      dispatch(setKeyword(criteria));
    },
    searchCustomerList: () => {
      dispatch(searchCustomerList());
    },
    clearCustomerList: () => {
      dispatch(clearCustomerList());
    },
    setCustomerType: (value) => {
      dispatch(setCustomerType(value));
    },
    searchCustomerNextDestination: () => {
      dispatch(searchCustomerNextDestination());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTSearchForm);
