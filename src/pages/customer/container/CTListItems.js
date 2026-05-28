import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import { setInitialState as setCheckInInitialState } from '../../../action/check-in';
import {
  clearCustomerList,
  findCustomerById,
  searchCustomerList,
  searchCustomerNextDestination,
  setCustomerInfo,
  setError,
  setInitialState,
} from '../../../action/customer';
import { setCustomerType } from '../../../action/customer-type';
import { setInitialState as setMileInitialState } from '../../../action/mile';
import { ListItem } from '../../../component/elements';
import { mainDivider, MainTheme } from '../../../constant/lov';
import Navigator from '../../../services/Navigator';
import { getUserToken } from '../../../utils/Token';
import ListItems from '../presenter/ListItems';

class CTListItems extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null,
      isLoading: false,
      userToken: {
        VANCONFIG: {
          VANCNF_AR_LIMIT: null,
        },
      },
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    await this._getUserToken();
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

  _renderItem = ({ item, index }) => {
    return (
      <ListItem
        key={item.AR_KEY || index}
        containerStyle={mainDivider}
        bottomDivider
        onPress={async () => {
          this._onListItemPress(item, index);
        }}
      >
        <ListItem.Content key="content">
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 0.1, flexDirection: 'column' }}>
              {this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT == 2 &&
              item.LAST_DO ? (
                <AntDesign
                  name="check"
                  color={MainTheme.colorPrimary}
                  size={26}
                />
              ) : null}
              {this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT == 2 &&
              item.IS_SKIP ? (
                <AntDesign
                  name="stepforward"
                  color={MainTheme.colorPrimary}
                  size={26}
                />
              ) : null}
            </View>
            <View style={{ flex: 0.9, flexDirection: 'column' }}>
              {this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT == 2 ? (
                <Text style={{ fontSize: hp('1.9%') }} allowFontScaling={false}>
                  {index + 1}
                </Text>
              ) : null}
              <Text
                style={{ fontSize: hp('1.9%'), fontWeight: 'bold' }}
                allowFontScaling={false}
              >
                {item.AR_CODE || '-'}
              </Text>
              <Text style={{ fontSize: hp('1.9%') }} allowFontScaling={false}>
                {item.AR_NAME || '-'}
              </Text>
              <Text style={{ fontSize: hp('1.8%') }} allowFontScaling={false}>
                {item.ADDB_ADDB_1 ? item.ADDB_ADDB_1 + ' ' : null}
                {item.ADDB_ADDB_2 ? item.ADDB_ADDB_2 + ' ' : null}
                {item.ADDB_ADDB_3 ? item.ADDB_ADDB_3 + ' ' : null}
                {item.ADDB_SUB_DISTRICT ? item.ADDB_SUB_DISTRICT + ' ' : null}
                {item.ADDB_DISTRICT ? item.ADDB_DISTRICT + ' ' : null}
                {item.ADDB_PROVINCE ? item.ADDB_PROVINCE + ' ' : null}
                {item.ADDB_POST ? item.ADDB_POST + ' ' : null}
                {!item.ADDB_ADDB_1 &&
                !item.ADDB_ADDB_2 &&
                !item.ADDB_ADDB_3 &&
                !item.ADDB_SUB_DISTRICT &&
                !item.ADDB_DISTRICT &&
                !item.ADDB_PROVINCE &&
                !item.ADDB_POST
                  ? '-'
                  : null}
              </Text>
            </View>
          </View>
        </ListItem.Content>
        <ListItem.Chevron key="chevron" color="#666" size={30} />
      </ListItem>
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
    const selectedCustomerType = this.props.customerType.listItems.find(
      item => item.ARCAT_KEY == this.props.customerType.item?.ARCAT_KEY,
    ) ??
      this.props.customerType.item ?? { ARCAT_KEY: null, ARCAT_NAME: null };

    await this.props.setCustomerType(selectedCustomerType);

    // console.log('this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT1  ',this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT,);
    if (this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT != 2) {
      //ดึงข้อมูลลูกค้า ตาม VAN_CNF VANCNF_AR_LIMIT โดย ค่า1 คือตามสายลูกค้า, ค่า 2 คือตามสายเดินรถ
      // console.log('VANCNF_AR_LIMIT0.1.1  ตามสายลูกค้า');
      //     console.log('ตรวจสอบตรงนี้ >> 4');

      await this.props.searchCustomerList(false);
    } else {
      // console.log('VANCNF_AR_LIMIT0.2.1  ตามสายเดินรถ');
      await this.props.searchCustomerNextDestination();
    }
  };

  _onScroll = event => {
    if (this.state.userToken.VANCONFIG.VANCNF_AR_LIMIT != 2) {
      const frameHeight = event.nativeEvent.layoutMeasurement.height;
      const contentHeight = event.nativeEvent.contentSize.height;
      const maxScrollableHeight = contentHeight - frameHeight;

      if (maxScrollableHeight <= 0) {
        return;
      }

      const maxOffset = 0.95 * parseInt(maxScrollableHeight);
      const currentOffset = parseInt(event.nativeEvent.contentOffset.y);

      if (
        currentOffset > 0 &&
        currentOffset >= maxOffset &&
        !this.props.customer.isLoading
      ) {
        this.props.searchCustomerList(true);
      }
    }
  };

  _actionHandler = () => {
    this.props.setError(false);
  };

  _setState = async (key, value) => {
    this._isMounted &&
      (await this.setState(oldState => {
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

const mapStateToProps = state => ({
  customer: state.customer,
  customerType: state.customerType,
});

const mapDispatchToProps = dispatch => {
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
    searchCustomerList: nextPage => dispatch(searchCustomerList(nextPage)),
    setError: bool => {
      dispatch(setError(bool));
    },
    findCustomerById: id => dispatch(findCustomerById(id)),
    setCustomerInfo: data => {
      dispatch(setCustomerInfo(data));
    },
    setCustomerType: value => dispatch(setCustomerType(value)),
    searchCustomerNextDestination: () => {
      dispatch(searchCustomerNextDestination());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTListItems);
