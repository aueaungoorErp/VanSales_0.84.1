import React from 'react';
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { isSensorAvailable } from '@sbaiahmed1/react-native-biometrics';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import {
  hydrateUserBiometricState,
  persistBiometricPreference,
} from '../../../action/user';
import { MainTheme, settingListItems } from '../../../constant/lov';
import { strings } from '../../../locales/i18n';
import Navigator from '../../../services/Navigator';
import Request from '../../../utils/Request';
import {
  clearPassword,
  getCredentials,
  getSavedUsername,
  saveCredentials,
} from '../../../services/SecureCredentials';
import {
  getBBLPaymentBaseUrl,
  getBBLQrPaymentEnabled,
  getBiometricLoginState,
  getLoginInfo,
  getSettingConfig,
  removeBiometricLoginState,
  removeLoginGuID,
  removeLoginInfo,
  removeUserToken,
  setAccessTimeToken,
  setBBLQrPaymentEnabled,
  setLoginInfo,
  setSettingConfig,
} from '../../../utils/Token';
import ListItems from '../presenter/ListItems';

import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
class CTListItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bblQrPaymentEnabled: false,
      config: null,
    };

    this._checkPermission();

    this._getSettingConfig();
  }

  componentDidMount() {
    this.props.hydrateUserBiometricState();
    this._loadBBLQrPaymentSetting();

    this.focusSubscription = this.props.navigation?.addListener(
      'focus',
      this._handleFocus,
    );
  }

  componentWillUnmount() {
    if (typeof this.focusSubscription === 'function') {
      this.focusSubscription();
    }
  }

  _checkPermission = async () => {
    permissions = [
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ];

    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple(permissions);
    }
  };

  _getSettingConfig = async () => {
    const config = await getSettingConfig();

    if (config) {
      this.setState(oldState => {
        return {
          config: config,
        };
      });
    }
  };

  _handleFocus = () => {
    this._getSettingConfig();
    this._loadBBLQrPaymentSetting();
  };

  _loadBBLQrPaymentSetting = async () => {
    const [storedEnabled, bblBaseUrl] = await Promise.all([
      getBBLQrPaymentEnabled(),
      getBBLPaymentBaseUrl(),
    ]);

    this.setState({
      bblQrPaymentEnabled:
        storedEnabled === null ? !!String(bblBaseUrl || '').trim() : !!storedEnabled,
    });
  };

  _header = () => {
    return (
      <View style={itemStyles.headerContainer}>
        <AntDesign name="setting" size={24} color={MainTheme.colorPrimary} />
        <Text style={itemStyles.headerText} allowFontScaling={false}>
          การตั้งค่า
        </Text>
      </View>
    );
  };

  _getFormattedBaseUrl = () => {
    const rawBaseUrl = this.state.config?.baseUrl;

    if (!rawBaseUrl) {
      return null;
    }

    if (/^https?:\/\//i.test(rawBaseUrl)) {
      return rawBaseUrl;
    }

    return `http://${rawBaseUrl}`;
  };

  _getDisplayTitle = item => {
    if (item.title === 'ปริ้นเตอร์' || item.title === 'printer') {
      return 'ปริ้นเตอร์';
    }

    if (item.iconName === 'server') {
      const formattedBaseUrl = this._getFormattedBaseUrl();
      return formattedBaseUrl
        ? `${item.title} ${formattedBaseUrl}`
        : item.title;
    }

    return item.title;
  };

  _canPressItem = item =>
    item.methodType === 'new-page' ||
    (item.methodType === 'function' &&
      item.methodName !== 'toggleBiometrics' &&
      item.methodName !== 'toggleBBLQrPayment');

  _renderRightArrow = item => {
    if (!this._canPressItem(item)) {
      return null;
    }

    return <AntDesign name="right" size={14} color="#ccc" />;
  };

  _getListItems = () => {
    const bblQrPaymentItem = {
      title: 'ชำระผ่าน BBL QR Payment',
      iconName: 'qrcode-scan',
      iconType: 'material-design',
      methodType: 'function',
      methodName: 'toggleBBLQrPayment',
      screen: null,
    };
    const biometricItem = {
      title: 'เปิด/ปิดการใช้งาน Biometrics',
      iconName: 'fingerprint',
      iconType: 'material-design',
      methodType: 'function',
      methodName: 'toggleBiometrics',
      screen: null,
    };
    const manualIndex = settingListItems.findIndex(
      item => item.screen === 'Manual',
    );

    if (manualIndex < 0) {
      return [...settingListItems, bblQrPaymentItem, biometricItem];
    }

    return [
      ...settingListItems.slice(0, manualIndex),
      bblQrPaymentItem,
      biometricItem,
      ...settingListItems.slice(manualIndex),
    ];
  };

  _renderItem = ({ item }, key) => {
    console.log('itemaaa', item);
    if (item.methodName === 'toggleBBLQrPayment') {
      return this._renderBBLQrPaymentPattern(item);
    }

    if (item.methodName === 'toggleBiometrics') {
      return this._renderBiometricsPattern(item);
    }

    if (item.title === 'ปริ้นเตอร์' || item.title === 'printer') {
      return this._renderCustomPattern(item);
    }
    if (
      item.title === 'คู่มือการใช้งาน' ||
      item.title === 'คำถามที่พบบ่อย' ||
      item.title === 'ออกจากระบบ'
    ) {
      return this._renderImagePattern(item);
    } else {
      return this._renderDefaultPattern(item);
    }
  };

  _renderDefaultPattern = item => {
    const canPress = this._canPressItem(item);

    return (
      <TouchableOpacity
        style={itemStyles.row}
        onPress={() => this._onPress(item)}
        disabled={!canPress}
        activeOpacity={0.6}
      >
        <View style={itemStyles.iconContainer}>
          {item.iconName === 'server' ? (
            <MaterialDesignIcons
              name={item.iconName}
              color={MainTheme.colorPrimary}
              size={22}
            />
          ) : (
            <AntDesign
              name={item.iconName}
              size={22}
              color={MainTheme.colorPrimary}
            />
          )}
        </View>
        <View style={itemStyles.textContainer}>
          <Text style={itemStyles.title} allowFontScaling={false}>
            {this._getDisplayTitle(item)}
          </Text>
        </View>
        {this._renderRightArrow(item)}
      </TouchableOpacity>
    );
  };

  _renderImagePattern = item => {
    const canPress = this._canPressItem(item);

    return (
      <TouchableOpacity
        style={itemStyles.row}
        onPress={() => this._onPress(item)}
        disabled={!canPress}
        activeOpacity={0.6}
      >
        <View style={itemStyles.iconContainer}>
          {item.imgSrc ? (
            <Image
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
              source={item.imgSrc}
            />
          ) : (
            <AntDesign
              name={item.iconName}
              size={22}
              color={MainTheme.colorPrimary}
            />
          )}
        </View>
        <View style={itemStyles.textContainer}>
          <Text style={itemStyles.title} allowFontScaling={false}>
            {item.title}
          </Text>
        </View>
        {this._renderRightArrow(item)}
      </TouchableOpacity>
    );
  };

  _renderCustomPattern = item => {
    const isPDF = this.props.bluetooth.printingType === 'PDF';
    const isConnected =
      this.props.bluetooth && this.props.bluetooth.state === 'connected';

    return (
      <TouchableOpacity
        style={itemStyles.row}
        onPress={() => this._onPress(item)}
        activeOpacity={0.6}
      >
        <View style={itemStyles.iconContainer}>
          {isPDF ? (
            <FontAwesome5
              name="file-pdf"
              color={MainTheme.colorPrimary}
              size={20}
              solid
            />
          ) : (
            <Image
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
              source={isConnected ? item.imgSrc : item.subImgSrc}
            />
          )}
        </View>
        <View style={itemStyles.textContainer}>
          <Text style={itemStyles.title} allowFontScaling={false}>
            {isPDF ? 'PDF' : this._getDisplayTitle(item)}
          </Text>
          <Text
            style={[
              itemStyles.subtitle,
              { color: isConnected ? MainTheme.colorPrimary : '#E74C3C' },
            ]}
          >
            {isPDF
              ? 'พิมพ์เป็น PDF'
              : isConnected
              ? 'เชื่อมต่อแล้ว'
              : 'ไม่ได้เชื่อมต่อ'}
          </Text>
        </View>
        {this._renderRightArrow(item)}
      </TouchableOpacity>
    );
  };

  _renderBiometricsPattern = item => {
    const isEnabled = !!this.props.user?.isBiometrics;

    return (
      <View style={itemStyles.row}>
        <View style={itemStyles.iconContainer}>
          <MaterialDesignIcons
            name={item.iconName}
            color={MainTheme.colorPrimary}
            size={24}
          />
        </View>
        <View style={itemStyles.textContainer}>
          <Text style={itemStyles.title} allowFontScaling={false}>
            {item.title}
          </Text>
          <Text
            style={[
              itemStyles.subtitle,
              { color: isEnabled ? MainTheme.colorPrimary : '#777777' },
            ]}
            allowFontScaling={false}
          >
            {isEnabled ? 'เปิดอยู่' : 'ปิดอยู่'}
          </Text>
        </View>
        <Switch
          value={isEnabled}
          onValueChange={this._toggleBiometrics}
          trackColor={{ false: '#D6D7DA', true: MainTheme.colorSeptenary }}
          thumbColor={isEnabled ? MainTheme.colorPrimary : '#F4F3F4'}
        />
      </View>
    );
  };

  _renderBBLQrPaymentPattern = item => {
    const isEnabled = !!this.state.bblQrPaymentEnabled;

    return (
      <View style={itemStyles.row}>
        <View style={itemStyles.iconContainer}>
          <MaterialDesignIcons
            name={item.iconName}
            color={MainTheme.colorPrimary}
            size={24}
          />
        </View>
        <View style={itemStyles.textContainer}>
          <Text style={itemStyles.title} allowFontScaling={false}>
            {item.title}
          </Text>
          <Text
            style={[
              itemStyles.subtitle,
              { color: isEnabled ? MainTheme.colorPrimary : '#777777' },
            ]}
            allowFontScaling={false}
          >
            {isEnabled ? 'เปิดอยู่' : 'ปิดอยู่'}
          </Text>
        </View>
        <Switch
          value={isEnabled}
          onValueChange={this._toggleBBLQrPayment}
          trackColor={{ false: '#D6D7DA', true: MainTheme.colorSeptenary }}
          thumbColor={isEnabled ? MainTheme.colorPrimary : '#F4F3F4'}
        />
      </View>
    );
  };

  _onPress = async item => {
    if (item.methodType === 'new-page') {
      Navigator.navigate(item.screen, item.params);
    } else if (item.methodType === 'function') {
      if (item.methodName === 'logout') {
        this._logout(item);
      } else if (item.methodName === 'syncUserConfig') {
        Navigator.navigate('Splash');
      }
    }
  };

  _getCurrentBiometricUser = async () => {
    const biometricState = await getBiometricLoginState();
    const loginInfo = await getLoginInfo();
    const savedUsername = await getSavedUsername();

    return (
      biometricState?.userInfo ?? {
        service: loginInfo?.service ?? this.state.config?.service ?? null,
        USER_CODE: savedUsername || null,
      }
    );
  };

  _toggleBiometrics = async value => {
    const userInfo = await this._getCurrentBiometricUser();

    if (!value) {
      await this.props.persistBiometricPreference(false, userInfo);
      return;
    }

    try {
      const sensorInfo = await isSensorAvailable();

      if (!sensorInfo?.available || !sensorInfo?.isDeviceSecure) {
        Alert.alert(
          'ไม่สามารถเปิดใช้งาน Biometrics',
          'อุปกรณ์นี้ยังไม่รองรับหรือยังไม่ได้ตั้งค่า Biometrics',
        );
        return;
      }

      const credentials = await getCredentials();
      const username = credentials?.username || userInfo?.USER_CODE;
      const password = credentials?.password;

      if (!username || !password) {
        Alert.alert(
          'ไม่สามารถเปิดใช้งาน Biometrics',
          'ไม่พบรหัสผ่านที่บันทึกไว้ กรุณาเข้าสู่ระบบใหม่และเปิดใช้งานอีกครั้ง',
        );
        return;
      }

      const saved = await saveCredentials(username, password);

      if (!saved) {
        Alert.alert(
          'ไม่สามารถเปิดใช้งาน Biometrics',
          'ไม่สามารถบันทึกข้อมูลเข้าสู่ระบบสำหรับ Biometrics ได้',
        );
        return;
      }

      await this.props.persistBiometricPreference(true, {
        ...userInfo,
        USER_CODE: username,
      });
    } catch (error) {
      Alert.alert(
        'ไม่สามารถเปิดใช้งาน Biometrics',
        error?.message || 'เกิดข้อผิดพลาดในการตรวจสอบ Biometrics',
      );
    }
  };

  _toggleBBLQrPayment = async value => {
    await setBBLQrPaymentEnabled(value);
    this.setState({ bblQrPaymentEnabled: !!value });
  };

  _logout = async item => {
    const settingConfig = await getSettingConfig();
    const loginInfo = await getLoginInfo();

    Request.setTimeCutOff();
    await removeUserToken();

    // Clear only the saved password. Username is kept in SecureCredentials.
    await clearPassword();

    // Clear biometric state so stale isBiometrics flag doesn't cause
    // a silent failure on next app open (password is already gone).
    await removeBiometricLoginState();
    this.props.persistBiometricPreference(false, null);

    // Keep legacy login info trimmed down to service only.
    if (loginInfo) {
      await setLoginInfo({
        service: loginInfo.service,
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

  render() {
    return (
      <ListItems
        header={this._header}
        listItems={this._getListItems()}
        renderItem={this._renderItem}
      />
    );
  }
}

const itemStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MainTheme.colorSeptenary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E4E8',
  },
  headerText: {
    fontSize: hp('2.2%'),
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F0FAF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: hp('1.8%'),
    color: '#333',
    fontWeight: '500',
  },
  subtitle: {
    fontSize: hp('1.4%'),
    marginTop: 2,
  },
});

const mapStateToProps = state => ({
  bluetooth: state.bluetooth,
  user: state.user,
});

const mapDispatchToProps = dispatch => {
  return {
    hydrateUserBiometricState: () => dispatch(hydrateUserBiometricState()),
    persistBiometricPreference: (value, userInfo) =>
      dispatch(persistBiometricPreference(value, userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTListItems);
