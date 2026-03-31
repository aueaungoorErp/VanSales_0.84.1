import React, { Component } from 'react';
import { Image, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon, ListItem } from '../../../component/elements';
import { mainDivider, MainTheme, storeChoiceListItems } from '../../../constant/lov';
import Navigator from '../../../services/Navigator';
import { getUserToken } from '../../../utils/Token';
import ListItems from '../presenter/ListItems';

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
        containerStyle={{backgroundColor: MainTheme.colorSeptenary}}
        bottomDivider>
        <Image
          style={{width: 35, height: 35, alignSelf: 'center'}}
          resizeMode="contain"
          source={require('../../../images/warehouse.png')}
        />
        <ListItem.Content>
          <View style={{flexDirection: 'column'}}>
            <Text style={{fontSize: hp('2%')}} allowFontScaling={false}>
              คลังสินค้า
            </Text>
          </View>
        </ListItem.Content>
      </ListItem>
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
        onPress={() => this._onPress(item)}
        containerStyle={mainDivider}
        bottomDivider>
        <Icon
          name={item.iconName}
          type={item.iconType}
          iconStyle={item.iconStyle}
          size={item.size}
        />
        <ListItem.Content>
          <View style={{flexDirection: 'column'}}>
            <Text style={{fontSize: hp('2%')}} allowFontScaling={false}>
              {item.title}
            </Text>
          </View>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
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
