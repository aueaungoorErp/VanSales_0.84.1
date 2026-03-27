import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import {ListItem} from 'react-native-elements';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {storeChoiceListItems, MainTheme} from '../../../constant/lov';
import ListItems from '../presenter/ListItems';
import Navigator from '../../../services/Navigator';
import {getUserToken} from '../../../utils/Token';
import {mainDivider} from '../../../constant/lov';

class CTListItems extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      userToken: null,
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
      this._isMounted &&
        (await this.setState((oldState) => {
          return {
            userToken: userToken,
          };
        }));
    }
  };

  _header = () => {
    return (
      <ListItem
        title={
          <View style={{flexDirection: 'column'}}>
            <Text style={{fontSize: hp('2%')}} allowFontScaling={false}>
              คลังสินค้า
            </Text>
          </View>
        }
        containerStyle={{backgroundColor: MainTheme.colorSeptenary}}
        leftIcon={
          <Image
            style={{width: 35, height: 35, alignSelf: 'center'}}
            resizeMode="contain"
            source={require('../../../images/warehouse.png')}
          />
        }
        bottomDivider></ListItem>
    );
  };

  _checkVanConfigBalance = () => {
    result = 2;
    this.state.userToken &&
    this.state.userToken.VANCONFIG &&
    this.state.userToken.VANCONFIG.VANCNF_NEED_BAL
      ? (result = this.state.userToken.VANCONFIG.VANCNF_NEED_BAL)
      : (result = 2);

    return result;
  };

  _renderItem = ({item}, key) => {
    return (
      <ListItem
        key={key}
        title={
          <View style={{flexDirection: 'column'}}>
            <Text style={{fontSize: hp('2%')}} allowFontScaling={false}>
              {item.title}
            </Text>
          </View>
        }
        leftIcon={{
          name: item.iconName,
          type: item.iconType,
          iconStyle: item.iconStyle,
          size: item.size,
        }}
        onPress={() => this._onPress(item)}
        containerStyle={mainDivider}
        bottomDivider></ListItem>
    );
  };

  _onPress = async (item) => {
    if (item.methodType === 'new-page') {

      if (item.screen == 'StockTransfer') {
        Navigator.navigate(item.screen, {isFirst: true});
      } else {
        Navigator.navigate(item.screen);
      }
    }
  };

  render() {
    let storeChoices = storeChoiceListItems;
    this._checkVanConfigBalance() == 1
      ? (storeChoices = storeChoiceListItems.filter(
          (value, index) => value.screen != 'StockDropPoint',
        ))
      : null;

    return (
      <ListItems
        header={this._header}
        listItems={storeChoices}
        renderItem={this._renderItem}
      />
    );
  }
}

export default CTListItems;
