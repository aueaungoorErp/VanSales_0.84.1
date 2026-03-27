import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, TouchableOpacity, Linking, Image, Alert} from 'react-native';
import {ListItem, Text} from 'react-native-elements';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ChoiceGroup from '../presenter/ChoiceGroup';
import Navigator from '../../../services/Navigator';
import {orderChoiceButtonGroup} from '../../../constant/lov';
import {setInitialState, setHeader} from '../../../action/order';
import {generateHeader} from '../../../utils/Order';
import {getUserToken} from '../../../utils/Token';

class CTChoiceGroup extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      userToken: null,
    };
    this._getUserToken();
  }

  componentDidMount = (props) => {
    this._isMounted = true;
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

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

  _renderItem = ({item}) => {
    return (
      <ListItem
        title={
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <TouchableOpacity onPress={() => this._onPress(item)}>
              <Image
                style={{width: 100, height: 100, alignSelf: 'center'}}
                resizeMode="contain"
                source={item.imgSrc}
              />
              <Text style={{textAlign: 'center', fontSize: hp('1.7%')}}>
                {item.title}
              </Text>
            </TouchableOpacity>
          </View>
        }
        titleNumberOfLines={1}
      />
    );
  };

  _onPress = async (item) => {
    const data = generateHeader(this.props.customer.item.INFO, item.title);
    await this.props.setInitialState();
    await this.props.setHeader(data);
    const userToken = await getUserToken();
    console.log('_onPress CTChoiceGroup item', item);
    if (item.screen == 'OrderSurvey') {
      const supported = await Linking.canOpenURL(
        userToken.VANCONFIG.VANCNF_URL_SURVEY,
      );
      console.log('supported', supported);
      if (supported) {
        console.log(
          'userToken ',
          JSON.stringify(userToken.VANCONFIG.VANCNF_URL_SURVEY),
        );
        await Linking.openURL(userToken.VANCONFIG.VANCNF_URL_SURVEY);
      } else {
        Alert.alert(
          `Don't know how to open this URL: ${userToken.VANCONFIG.VANCNF_URL_SURVEY}`,
        );
      }
    } else if (item.screen == 'OrderVisit') {
     // const supported = await Linking.canOpenURL('https://google.com');
      const supported = await Linking.canOpenURL(
        userToken.VANCONFIG.VANCNF_URL_VISIT,
      );

      if (supported) {
        console.log(
          'userToken ',
          JSON.stringify(userToken.VANCONFIG.VANCNF_URL_VISIT),
        );
        await Linking.openURL(userToken.VANCONFIG.VANCNF_URL_VISIT);
      } else {
        Alert.alert(
          `Don't know how to open this URL: ${userToken.VANCONFIG.VANCNF_URL_VISIT}`,
        );
      }
    } else {
      Navigator.navigate(item.screen, {
        from: 'OrderChoice',
        userToken: this.state.userToken,
        isFirst: true,
      });
    }
  };

  _filterPermissionListItems = () => {
    const userToken = this.state.userToken;
    let result = [];

    // console.log('orderChoiceButtonGroup', orderChoiceButtonGroup);

    if (userToken) {
      orderChoiceButtonGroup.map((value, index) => {
        if (value.orderType === 'return-product') {
          if (userToken.VANCONFIG.VANCNF_ENABLE_RTN == 'Y') {
            result.push(value);
          }
        } else if (value.orderType === 'survey') {
          if (userToken.VANCONFIG.VANCNF_URL_SURVEY != '') {
            result.push(value);
          }
        } else if (value.orderType === 'sale-product') {
          if (
            userToken.VANCONFIG.VANCNF_ENABLE_INV == 'Y' ||
            userToken.VANCONFIG.VANCNF_ENABLE_CASH == 'Y'
          ) {
            result.push(value);
          }
        } else if (value.orderType === 'visit') {
          if (userToken.VANCONFIG.VANCNF_URL_VISIT != '') {
            result.push(value);
          }
        } else if (value.orderType === 'reserv-product') {
          if (
            userToken.VANCONFIG.VANCNF_ENABLE_BOOK == 'Y'
          ) {
            result.push(value);
          }
        } else if (value.orderType === 'check-stock') {
          if (userToken.VANCONFIG.VANCNF_ENABLE_QUOTE == 'Y') {
            result.push(value);
          }
        } else {
          result.push(value);
        }
      });
    }

    return result;
  };

  render() {
    return (
      <ChoiceGroup
        listItems={this._filterPermissionListItems()}
        renderItem={this._renderItem}
        numColumns={3}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  screen: state.screen,
  customer: state.customer,
  order: state.order,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setInitialState: (data) => dispatch(setInitialState(data)),
    setHeader: (data) => dispatch(setHeader(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTChoiceGroup);
