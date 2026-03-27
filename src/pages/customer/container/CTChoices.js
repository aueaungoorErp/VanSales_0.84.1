import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {customerChoices, MainTheme, mainDivider} from '../../../constant/lov';
import Navigator from '../../../services/Navigator';
import Choices from '../presenter/Choices';
import {getUserToken} from '../../../../src/utils/Token';

class CTChoices extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      userToken: {
        VANCONFIG: {
          VANCNF_AR_CREATE: null,
        },
      },
      customerChoices: [],
    };
  }

  componentDidMount = async (props) => {
    this._isMounted = true;
    await this._getUserToken();
    // console.log(customerChoices[1]);
    await this._setState('customerChoices', customerChoices);
  };

  componentWillUnmount = (props) => {
    this._isMounted = false;
  };

  _getUserToken = async () => {
    const userToken = await getUserToken();

    if (userToken) {
      await this._setState('userToken', userToken);
    }
  };

  _setState = async (key, value) => {
    this._isMounted &&
      (await this.setState((oldState) => {
        return {
          [key]: value,
        };
      }));
  };

  _header = () => {
    return (
      <ListItem
        title={
          <View style={{flexDirection: 'column'}}>
            <Text style>ลูกค้า</Text>
          </View>
        }
        containerStyle={{backgroundColor: MainTheme.colorSeptenary}}
        leftIcon={
          <Image
            style={{width: 35, height: 35, alignSelf: 'center'}}
            resizeMode="contain"
            source={require('../../../images/customer.png')}
          />
        }
        bottomDivider></ListItem>
    );
  };

  _renderItem = ({item}, key) => {
    return (
      <ListItem
        key={key}
        title={
          <View style={{flexDirection: 'column'}}>
            <Text style={{fontSize: hp('1.7%')}} allowFontScaling={false}>
              {item.title}
            </Text>
          </View>
        }
        leftIcon={
          <Image
            style={{width: 35, height: 35, alignSelf: 'center'}}
            resizeMode="contain"
            source={item.imgSrc}
          />

          // {
          //     name: item.iconName,
          //     type: item.iconType,
          //     iconStyle: item.iconStyle,
          //     size: item.size
          // }
        }
        onPress={() => this._onPress(item)}
        containerStyle={mainDivider}></ListItem>
    );
  };

  _onPress = async (item) => {
    if (item.methodType === 'new-page') {
      Navigator.navigate(item.screen);
    }
  };

  render() {
    return (
      <Choices
        header={this._header}
        listItems={this.state.customerChoices}
        renderItem={this._renderItem}
      />
    );
  }
}

export default CTChoices;
