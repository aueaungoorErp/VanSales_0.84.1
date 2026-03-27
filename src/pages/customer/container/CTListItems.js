import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Text} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Navigator from '../../../services/Navigator';
import ListItems from '../presenter/ListItems';
import {
  setInitialState,
  clearCustomerList,
  searchCustomerList,
  setError,
  findCustomerById,
  setCustomerInfo,
  searchCustomerNextDestination,
} from '../../../action/customer';
import {setInitialState as setMileInitialState} from '../../../action/mile';
import {setInitialState as setCheckInInitialState} from '../../../action/check-in';
import {getUserToken} from '../../../utils/Token';
import {mainDivider, MainTheme} from '../../../constant/lov';


class CTListItems extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.props.setInitialState();

    this.state = {
      errorMessage: null,
      isLoading: false,
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
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _getUserToken = async () => {
    const userToken = await getUserToken();

    if (userToken) {
      // console.log('userToken 1', userToken);
      await this._setState('userToken', userToken);
    }
  };

  _renderItem = ({item, index}) => {
    // console.log("Bazz this.props.customer.listItems" , this.props.customer.listItems )
    // console.log('Bazz this.props.customer.item', item);

    return (
      <ListItem
        title={
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 0.1, flexDirection: 'column'}}>
              {this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT == 2 &&
              item.LAST_DO ? (
                <Icon
                  name="map-marker-check"
                  type="material-community"
                  color={MainTheme.colorPrimary}
                />
              ) : null}
              {this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT == 2 &&
              item.IS_SKIP ? (
                <Icon
                  name="skip-next"
                  type="material-community"
                  color={MainTheme.colorPrimary}
                />
              ) : null}
            </View>
            <View style={{flex: 0.9, flexDirection: 'column'}}>
              {this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT == 2 ? (
                <Text>{index + 1}</Text>
              ) : null}
              <Text style={{fontSize: hp('1.7%')}} allowFontScaling={false}>
                {item.AR_CODE}
              </Text>
              <Text style={{fontSize: hp('1.7%')}} allowFontScaling={false}>
                {item.AR_NAME}
              </Text>
              <Text style={{fontSize: hp('1.7%')}} allowFontScaling={false}>
                {item.ADDB_ADDB_1 ? item.ADDB_ADDB_1 + ' ' : null}
                {item.ADDB_ADDB_2 ? item.ADDB_ADDB_2 + ' ' : null}
                {item.ADDB_ADDB_3 ? item.ADDB_ADDB_3 + ' ' : null}
                {item.ADDB_SUB_DISTRICT ? item.ADDB_SUB_DISTRICT + ' ' : null}
                {item.ADDB_DISTRICT ? item.ADDB_DISTRICT + ' ' : null}
                {item.ADDB_PROVINCE ? item.ADDB_PROVINCE + ' ' : null}
                {item.ADDB_POST ? item.ADDB_POST + ' ' : null}
              </Text>
            </View>
          </View>
        }
        // leftIcon={ {
        //     name: 'map-marker-check',
        //     type: 'material-community',
        //     color: this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT === 2 && item.IS_SKIP ? MainTheme.colorPrimary : MainTheme.colorSecondary }
        // }
        rightIcon={{name: 'chevron-right', type: 'material', color: '#666'}}
        hideChevron
        containerStyle={mainDivider}
        bottomDivider
        // onPressIn={async () => {
        //    const {VANCONFIG} = await getUserToken();
        //   //  console.log('กดๆๆ1', item.ARPRB_KEY);
        //   //  console.log('กดๆๆ2', VANCONFIG.VANCNF_ARPRB);
        //   //  console.log('กดๆๆ3', VANCONFIG.VANCNF_ARPRB_MODE);
        //   //  console.log('กดๆๆ4', String(item.ARPRB_KEY).trim() !==  String(VANCONFIG.VANCNF_ARPRB).trim());
        //   //  console.log(typeof item.ARPRB_KEY);
        //   //  console.log(typeof VANCONFIG.VANCNF_ARPRB);


        //    if (VANCONFIG.VANCNF_ARPRB_MODE === 0 && String(item.ARPRB_KEY).trim() !==  String(VANCONFIG.VANCNF_ARPRB).trim()) {
        //     this._setState('errorMessage', 'ไม่สามารถเลือกลูกหนี้ รายนี้ได้เนื่องจากตารางราคาขายในข้อตกลงหลัก ไม่ตรงเงื่อนไข');
        //    } else {
        //      this._onListItemPress(item, index);
        //    }
        // }}
        onPress={async () => {
           const {VANCONFIG} = await getUserToken();
          //  console.log('กดๆๆ1', item.ARPRB_KEY);
          //  console.log('กดๆๆ2', VANCONFIG.VANCNF_ARPRB);
          //  console.log('กดๆๆ3', VANCONFIG.VANCNF_ARPRB_MODE);
          //  console.log('กดๆๆ4', String(item.ARPRB_KEY).trim() !==  String(VANCONFIG.VANCNF_ARPRB).trim());
          //  console.log(typeof item.ARPRB_KEY);
          //  console.log(typeof VANCONFIG.VANCNF_ARPRB);


           if (VANCONFIG.VANCNF_ARPRB_MODE === 0 && String(item.ARPRB_KEY).trim() !==  String(VANCONFIG.VANCNF_ARPRB).trim()) {
            this._setState('errorMessage', 'ไม่สามารถเลือกลูกหนี้ รายนี้ได้เนื่องจากตารางราคาขายในข้อตกลงหลัก ไม่ตรงเงื่อนไข');
           } else {
             this._onListItemPress(item, index);
           }
        }}
      />
    );
  };

  _onListItemPress = async (item, index) => {
    try {
      this._setState('isLoading', true);

      console.log('_onListItemPress item', item);
      await this.props.findCustomerById(item.AR_KEY);
      this.props.setCustomerInfo(item);

      await this._setState('isLoading', false);

      this.props.setMileInitialState();
      this.props.setCheckInInitialState();

      const userToken = await getUserToken();
      // console.log('_onListItemPress this.props.screen', this.props.screen);
      if (this.props.screen === 'profile') {
        Navigator.navigate('CustomerProfileDetail');
        return;
      }

      if (userToken.VANCONFIG.VANCNF_FORCE_MILE === 1) {
        Navigator.navigate('Mile');
        return;
      }

      if (userToken.VANCONFIG.VANCNF_FORCE_GPS === 1) {
        Navigator.navigate('CheckIn');
        return;
      }

      Navigator.navigate('OrderChoice');
    } catch (error) {
      this._setState('errorMessage', 'เกิดข้อผิดพลาด: ' + error);
    }

    await this._setState('isLoading', false);
  };

  _onRefresh = async () => {
    await this.props.clearCustomerList();
    this.props.customerType.item = {};



    // console.log('this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT1  ',this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT,);
    if (this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT != 2) {
      //ดึงข้อมูลลูกค้า ตาม VAN_CNF VANCNF_AR_LIMIT โดย ค่า1 คือตามสายลูกค้า, ค่า 2 คือตามสายเดินรถ
      // console.log('VANCNF_AR_LIMIT0.1.1  ตามสายลูกค้า');
      //     console.log('ตรวจสอบตรงนี้ >> 4');

      await this.props.searchCustomerList();
    } else {
      // console.log('VANCNF_AR_LIMIT0.2.1  ตามสายเดินรถ');
      await this.props.searchCustomerNextDestination();
    }
  };

  _onScroll = (event) => {
    // console.log('_onScroll 2'  , event.nativeEvent.layoutMeasurement);
    // console.log('_onScroll 2' ,  event.nativeEvent.contentSize.height);
    // console.log('_onScroll 2' ,  this.props.screen );


    if (this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT != 2) {
      const frameHeight = event.nativeEvent.layoutMeasurement.height;
      const contentHeight = event.nativeEvent.contentSize.height;
      const maxOffset = 0.95 * parseInt(contentHeight - frameHeight);
      const currentOffset = parseInt(event.nativeEvent.contentOffset.y);
          // console.log('ตรวจสอบตรงนี้ >> 3');
      currentOffset >= maxOffset && !this.props.customer.isLoading
        ? this.props.searchCustomerList(true)
        : null;
    }
  };

  _actionHandler = () => {
    this.props.setError(false);
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
      <ListItems
        listItems={this.props.customer.listItems}
        renderItem={this._renderItem}
        isNotFound={
          this.props.customer.isNotFound &&
          this.props.customer.listItems.length == 0
        }
        isError={
          (this.props.customer.isError &&
            this.props.customer.listItems.length == 0) ||
          this.props.customerType.isError
        }
        isSnackBarVisible={
          this.props.customer.isError &&
          this.props.customer.listItems.length > 0
        }
        refreshing={
          this.props.customer.isLoading || this.props.customerType.isLoading
        }
        onRefresh={this._onRefresh}
        onScroll={this._onScroll}
        actionHandler={this._actionHandler}
        setErrorMessage={this._setState}
        errorMessage={this.state.errorMessage}
        isLoading={this.state.isLoading}
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
    setMileInitialState: () => {
      dispatch(setMileInitialState());
    },
    setCheckInInitialState: () => {
      dispatch(setCheckInInitialState());
    },
    clearCustomerList: () => dispatch(clearCustomerList()),
    searchCustomerList: (nextPage) => {
      dispatch(searchCustomerList(nextPage));
    },
    setError: (bool) => {
      dispatch(setError(bool));
    },
    findCustomerById: (id) => dispatch(findCustomerById(id)),
    setCustomerInfo: (data) => {
      dispatch(setCustomerInfo(data));
    },
    searchCustomerNextDestination: () => {
      dispatch(searchCustomerNextDestination());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTListItems);
