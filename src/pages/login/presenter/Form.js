import _ from 'lodash';
import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import { getSaleManV3, systemCheck } from '../../../action/setting';
import ILoading from '../../../component/loading/ILoading';
import ITextWithErrorMessage from '../../../component/text/ITextWithErrorMessage';
import ITextWithSuccessMessage from '../../../component/text/ITextWithSuccessMessage';
import { APP_VERSION, MainTheme } from '../../../constant/lov';
import { strings } from '../../../locales/i18n';
import {
  getListServiceSetting,
  getLoginInfo,
} from '../../../utils/Token';

const window = Dimensions.get('window');

const toInputValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
};

class Form extends Component {
  _isMounted = false;
  focusUnsubscribe = null;
  keyboardDidShowListener = null;
  keyboardDidHideListener = null;

  constructor(props) {
    super(props);

    this.state = {
      listServiceSettings: [],
      service: null,
      successMessage: null,
      canLogin: true,
      isShow: true,
    };

    this._headerHeight = new Animated.Value(window.width / 1.7);
  }

  componentDidMount = async () => {
    this._isMounted = true;

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );

    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );

    this.focusUnsubscribe = this.props.navigation?.addListener?.(
      'focus',
      this.fetchData,
    );

    await this.fetchData();
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.keyboardDidShowListener?.remove?.();
    this.keyboardDidHideListener?.remove?.();

    if (typeof this.focusUnsubscribe === 'function') {
      this.focusUnsubscribe();
    }
  }

  setStateAsync = (nextState) =>
    new Promise((resolve) => {
      if (!this._isMounted) {
        resolve();
        return;
      }

      this.setState(nextState, resolve);
    });

  normalizeServiceSettings = (items = []) => {
    return items.map((item, index) => {
      const value =
        item?.value ??
        item?.number ??
        item?.vanCNFMachine ??
        item?.USER_CODE ??
        String(index);

      const label =
        item?.label ??
        item?.number ??
        item?.vanCNFMachine ??
        item?.USER_CODE ??
        `Service ${index + 1}`;

      return {
        ...item,
        value,
        label,
      };
    });
  };

  fetchData = async () => {
    try {
      this.props.setErrorMessage?.(null);

      const rawServices = await getListServiceSetting();
      const listServiceSettings = this.normalizeServiceSettings(
        Array.isArray(rawServices) ? rawServices : [],
      );

      const loginInfo = await getLoginInfo();

      if (loginInfo) {
        this.props.setUserName?.(loginInfo.USER_CODE ?? '');
        this.props.setPassword?.(loginInfo.USER_PASSWORD ?? '');
        this.props.setIsRememberPassword?.(!!loginInfo.rememberPassword);
      }

      const selectedService =
        loginInfo?.service ?? listServiceSettings?.[0]?.value ?? null;

      await this.setStateAsync({
        listServiceSettings,
        service: selectedService,
        successMessage: null,
      });

      if (selectedService) {
        this.props.setService?.(selectedService);
      }
    } catch (error) {
      console.log('fetchData error =', error);

      this.props.setErrorMessage?.(
        error?.message ?? 'โหลดข้อมูลการตั้งค่าไม่สำเร็จ',
      );

      await this.setStateAsync({
        canLogin: false,
        successMessage: null,
      });
    }
  };

  _toggleShow = async () => {
    await this.setStateAsync({
      isShow: !this.state.isShow,
    });
  };

  _keyboardDidShow = (event) => {
    Animated.timing(this._headerHeight, {
      duration: event?.duration ?? 250,
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  _keyboardDidHide = () => {
    Animated.timing(this._headerHeight, {
      duration: 500,
      toValue: window.width / 1.7,
      useNativeDriver: false,
    }).start();
  };

  _onLogin = async () => {
    this.setState({ successMessage: null });

    if (this.state.service) {
      this.props.onLogin?.();
      return;
    }

    this.props.setErrorMessage?.('โปรดตรวจสอบการตั้งค่าเว็ปเซอร์วิส');
  };

  _handleChangePassword = (input) => {
    const capitalizedInput = (input ?? '').toUpperCase();
    this.props.setPassword?.(capitalizedInput.trim());
  };

  _onChangeService = async (
    value,
    listOverride = null,
    autoContinue = false,
  ) => {
    if (!value) {
      return;
    }

    const list = Array.isArray(listOverride)
      ? listOverride
      : this.state.listServiceSettings;

    this.props.setService?.(value);
    await this.setStateAsync({ service: value });

    const service1 =
      _.find(list, ['value', value]) ||
      _.find(list, ['number', value]) ||
      null;

    const finalBaseUrl =
      service1?.webURL ?? service1?.baseUrl ?? service1?.baseURL ?? '';

    const vanCNFMachine =
      service1?.number ?? service1?.vanCNFMachine ?? service1?.value ?? '';

    const resolvedUserCode =
      this.props.username ?? service1?.USER_CODE ?? '';
    const resolvedPassword =
      this.props.password ?? service1?.USER_PASSWORD ?? '';

    if (!String(this.props.username ?? '').trim() && service1?.USER_CODE) {
      this.props.setUserName?.(service1.USER_CODE);
    }

    if (!String(this.props.password ?? '').trim() && service1?.USER_PASSWORD) {
      this.props.setPassword?.(service1.USER_PASSWORD);
    }

    const config = {
      baseUrl: finalBaseUrl,
      vanCNFMachine,
      SALESMAN: null,
      VANCONFIG: null,
      USER_CODE: resolvedUserCode,
      USER_PASSWORD: resolvedPassword,
    };

    this.props.setErrorMessage?.(null);

    await this.setStateAsync({
      successMessage: null,
      canLogin: false,
    });

    if (!finalBaseUrl) {
      console.log('service1 invalid =', service1);
      console.log('listServiceSettings =', list);

      this.props.setErrorMessage?.(
        'ไม่พบ webURL/baseUrl ของ service ที่เลือก',
      );
      return;
    }

    try {
      this.props.setIsLoading?.(true);

      const response = await this.props.systemCheck(config);
      const responseDataRaw = response?.ResponseData;
      const responseDateTime = response?.RESPONSE_DATETIME;

      let responseData = null;

      if (
        typeof responseDataRaw === 'string' &&
        responseDataRaw.trim()
      ) {
        responseData = JSON.parse(responseDataRaw);
      } else if (
        responseDataRaw &&
        typeof responseDataRaw === 'object'
      ) {
        responseData = responseDataRaw;
      }

      if (
        response?.ResponseCode == 200 &&
        response?.ReasonString == 'Completed' &&
        responseData &&
        responseDateTime
      ) {
        await this.setStateAsync({
          successMessage: strings('login_setting.connect_success'),
          canLogin: true,
        });

        if (
          autoContinue &&
          String(resolvedUserCode).trim() &&
          String(resolvedPassword).trim()
        ) {
          this.props.onLogin?.();
        }
      } else {
        await this.setStateAsync({
          successMessage: null,
          canLogin: false,
        });

        this.props.setErrorMessage?.(
          response?.ReasonString ?? 'ตรวจสอบการเชื่อมต่อไม่สำเร็จ',
        );
      }
    } catch (error) {
      console.log('_onChangeService error =', error);
      console.log(
        '_onChangeService error response =',
        error?.response?.data,
      );

      await this.setStateAsync({
        successMessage: null,
        canLogin: false,
      });

      this.props.setErrorMessage?.(
        error?.message ||
          error?.response?.data?.ReasonString ||
          'เชื่อมต่อระบบไม่สำเร็จ',
      );
    } finally {
      this.props.setIsLoading?.(false);
    }
  };

  renderPickerRow = () => {
    return (
      <View style={styles.hiddenServiceContainer}>
        <Image
          style={styles.leftIcon}
          resizeMode="contain"
          source={require('../../../images/person.png')}
        />

        <View style={styles.pickerWrapper}>
          <RNPickerSelect
            onValueChange={(value) => {
              this._onChangeService(value);
            }}
            items={this.state.listServiceSettings}
            value={this.state.service}
            style={{
              iconContainer: {
                top: 10,
                right: 0,
              },
              inputAndroid: styles.pickerInput,
              inputIOS: styles.pickerInput,
              placeholder: {
                color: MainTheme.placeholerTextInput,
              },
            }}
            placeholder={{
              label: 'เลือก',
              value: null,
            }}
            useNativeAndroidPickerStyle={false}
            textInputProps={{
              underlineColor: 'transparent',
              underlineColorAndroid: 'transparent',
            }}
            Icon={() => (
              <AntDesign
                name="down"
                size={20}
                color={MainTheme.colorPrimary}
                style={{ marginTop: 2 }}
              />
            )}
          />
        </View>
      </View>
    );
  };

  render() {
    const {
      username,
      password,
      setUserName,
      onSettingPress,
      errorMessage,
      isLoading,
      toggleRememberPassword,
      isRememberPassword,
    } = this.props;

    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.header,
            {
              height: this._headerHeight,
            },
          ]}
        >
          <View style={styles.settingSection}>
            <Pressable
              hitSlop={10}
              onPress={() => {
                onSettingPress?.();
              }}
            >
              <AntDesign
                name="setting"
                color={MainTheme.colorSecondary}
                size={24}
              />
            </Pressable>
          </View>


          <View style={styles.headerCurved}>
            <View style={styles.headerTitle}>
              <View style={styles.headerTitleInner}>
                <Text style={styles.headerTitleTextLarge}>
                  {strings('login.title1')}
                </Text>

                <Text style={styles.headerTitleTextSmall}>
                  {strings('login.title2')}
                </Text>

                <Text style={styles.headerTitleTextSmall}>
                  {strings('login.title3', { version: APP_VERSION })}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={styles.body}>
          <View style={styles.formWidth}>
            {this.renderPickerRow()}

            <View style={styles.inputRow}>
              <Image
                style={styles.leftIcon}
                resizeMode="contain"
                source={require('../../../images/person.png')}
              />

              <TextInput
                placeholder={strings('login.username')}
                placeholderTextColor={MainTheme.placeholerTextInput}
                value={toInputValue(username)}
                autoCapitalize="characters"
                style={styles.textInput}
                underlineColorAndroid="transparent"
                onChangeText={(value) => {
                  setUserName?.(value.trim());
                }}
              />
            </View>

            <View style={styles.inputRow}>
              <Image
                style={styles.leftIcon}
                resizeMode="contain"
                source={require('../../../images/lock.png')}
              />

              <TextInput
                placeholder={strings('login.password')}
                secureTextEntry={this.state.isShow}
                placeholderTextColor={MainTheme.placeholerTextInput}
                value={toInputValue(password)}
                style={styles.textInput}
                underlineColorAndroid="transparent"
                onChangeText={this._handleChangePassword}
              />

              <AntDesign
                name={
                  this.state.isShow ? 'eyeo' : 'eye'
                }
                size={28}
                color={MainTheme.colorTertiary}
                onPress={this._toggleShow}
              />
            </View>

            <View style={styles.rememberRow}>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityLabel="remember password"
                accessibilityState={{checked: !!isRememberPassword}}
                onPress={() => {
                  toggleRememberPassword?.();
                }}
                style={styles.checkboxPressable}>
                <View
                  style={[
                    styles.checkboxBox,
                    isRememberPassword ? styles.checkboxBoxChecked : null,
                  ]}>
                  {isRememberPassword ? (
                    <AntDesign name="check" size={14} color="#ffffff" />
                  ) : null}
                </View>
              </Pressable>

              <Text style={styles.rememberText}>
                {strings('login.rememberPassword')}
              </Text>
            </View>

            <View style={[styles.loginButtonWrap ]}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={this._onLogin}
                activeOpacity={0.8}
              >
                <View style={styles.loginButtonInner}>
                  <Text
                    style={styles.loginButtonText}
                    allowFontScaling={false}
                  >
                    {strings('login.login')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.messageBox}>
              <ITextWithErrorMessage message={errorMessage} />
              <ITextWithSuccessMessage
                message={this.state.successMessage}
              />
              <ILoading isLoading={isLoading} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => {
  return {
    systemCheck: (data) => dispatch(systemCheck(data)),
    getSaleManV3: (GUID, SLMN_KEY) =>
      dispatch(getSaleManV3(GUID, SLMN_KEY)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignSelf: 'center',
    width: window.width,
    overflow: 'hidden',
    height: window.width / 1.7,
  },
  headerCurved: {
    backgroundColor: MainTheme.colorPrimary,
    borderRadius: window.width,
    width: window.width * 2,
    height: window.width * 2,
    marginLeft: -(window.width / 2),
    position: 'absolute',
    bottom: 0,
    overflow: 'hidden',
  },
  headerTitle: {
    height: window.width / 1.7,
    width: window.width,
    position: 'absolute',
    bottom: 0,
    marginLeft: window.width / 2,
    backgroundColor: MainTheme.colorPrimary,
  },
  headerTitleInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleTextLarge: {
    textAlign: 'center',
    fontSize: 35,
    color: MainTheme.colorSecondary,
  },
  headerTitleTextSmall: {
    textAlign: 'center',
    fontSize: 23,
    color: MainTheme.colorSecondary,
  },
  body: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  formWidth: {
    width: '80%',
  },
  settingSection: {
    flexDirection: 'row',
    zIndex: 999,
    justifyContent: 'flex-end',
    padding: 15,
    position: 'absolute',
    right: 2,
    top: 0,
  },
  hiddenServiceContainer: {
    marginTop: 0,
    borderWidth: 1,
    borderColor: MainTheme.colorTertiary,
    borderRadius: 25,
    display: 'none',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    paddingHorizontal: 10,
  },
  inputRow: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: MainTheme.colorTertiary,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    paddingHorizontal: 10,
  },
  leftIcon: {
    marginLeft: 15,
    width: 25,
    height: 25,
  },
  pickerWrapper: {
    flex: 1,
    borderBottomWidth: 0.3,
    borderColor: '#d6d7da',
    paddingRight: 0,
    marginLeft: 10,
  },
  pickerInput: {
    color: '#000000',
    paddingVertical: 12,
    paddingRight: 30,
  },
  textInput: {
    flex: 1,
    fontSize: hp('1.7%'),
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  rememberRow: {
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    alignSelf: 'flex-end',
    color: MainTheme.colorQuaternary,
    fontSize: hp('1.7%'),
    fontWeight: '600',
  },
  checkboxPressable: {
    marginRight: 10,
    padding: 2,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: MainTheme.colorQuaternary,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    borderColor: MainTheme.colorTertiary,
    backgroundColor: MainTheme.colorTertiary,
  },
  loginButtonWrap: {
    marginTop: 20,
    
  },
  loginButton: {
    width: '60%',
    backgroundColor: MainTheme.colorTertiary,
    flexDirection: 'row',
    borderRadius: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    height: 50,
    alignItems: 'center',
  },
  loginButtonInner: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: MainTheme.colorSecondary,
    fontSize: hp('2'),
  },
  messageBox: {
    marginTop: 15,
    height: 30,
  },
  footer: {
    flex: 0.4,
    alignItems: 'center',
  },
});