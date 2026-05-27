import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { homeMenuButtonGroup } from '../../../constant/lov';
import { strings } from '../../../locales/i18n';
import Navigator from '../../../services/Navigator';
import Request from '../../../utils/Request';
import {
  getLoginInfo,
  getLoginGuID,
  getSettingConfig,
  getUserToken,
  removeLoginGuID,
  removeLoginInfo,
  removeUserToken,
  setAccessTimeToken,
  setLoginInfo,
  setSettingConfig,
} from '../../../utils/Token';
import MenuItems from '../presenter/MenuItems';

class CTMenuItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userToken: null,
      loginGUID: null,
    };
    this._getUserToken();
    this._getLoginGuID();
  }

  _onPress = async item => {
    if (item.methodType === 'new-page') {
      Navigator.navigate(item.screen);
    } else if (item.methodType === 'function') {
      if (item.methodName === 'logout') {
        this._logout(item);
      }
    }
  };

  _getUserToken = async () => {
    const userToken = await getUserToken();

    if (userToken) {
      await this.setState(oldState => {
        return {
          userToken: userToken,
        };
      });
    }
  };

  _getLoginGuID = async () => {
    const loginGUID = await getLoginGuID();
    console.log('loginGUID ', loginGUID);
    if (loginGUID) {
      await this.setState(oldState => {
        return {
          loginGUID: loginGUID,
        };
      });
    }
  };

  _logout = async item => {
    const settingConfig = await getSettingConfig();
    const loginInfo = await getLoginInfo();

    Request.setTimeCutOff();
    await removeUserToken();
    if (loginInfo?.rememberPassword) {
      await setLoginInfo({
        ...loginInfo,
        USER_PASSWORD: '',
        rememberPassword: true,
      });
    } else {
      await removeLoginInfo();
    }
    await removeLoginGuID();
    await setAccessTimeToken('0');

    if (settingConfig) {
      await setSettingConfig({
        ...settingConfig,
        USER_CODE: null,
        USER_PASSWORD: null,
        SALESMAN: null,
        VANCONFIG: null,
        COMPANYINFO: null,
      });
    }

    Request.removeAllHeaders();
    Request.removeAllHeadersV3();
    Navigator.reset('Auth');
  };

  _renderItem = ({ item }) => {
    return (
      <View style={styles.itemShell}>
        <TouchableOpacity
          onPress={() => this._onPress(item)}
          style={styles.touchable}
        >
          <Image
            style={styles.image}
            resizeMode="contain"
            source={item.imgSrc}
          />
          <Text style={styles.title} numberOfLines={2} allowFontScaling={false}>
            {item.title}
          </Text>
        </TouchableOpacity>
      </View>
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

  render() {
    let homeMenu = homeMenuButtonGroup;
    const itemDimension = Dimensions.get('window').width > 450 ? 170 : 130;
    // this._checkVanConfigBalance() == 1 ? homeMenu = homeMenuButtonGroup.filter((value, index) => value.screen != 'Stock') : null
    return (
      <MenuItems
        itemDimension={itemDimension}
        homeMenu={homeMenu}
        renderItem={this._renderItem}
      />
    );
  }
}

export default CTMenuItems;

const styles = StyleSheet.create({
  itemShell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  touchable: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  image: {
    width: 96,
    height: 96,
    alignSelf: 'center',
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: hp('2%'),
    color: '#444444',
  },
});
