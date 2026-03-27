import _ from 'lodash';
import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';

import { getSaleManV3, systemCheck } from '../../../action/setting';
import ILoading from '../../../component/loading/ILoading';
import ITextWithErrorMessage from '../../../component/text/ITextWithErrorMessage';
import ITextWithSuccessMessage from '../../../component/text/ITextWithSuccessMessage';
import { APP_VERSION, MainTheme } from '../../../constant/lov';
import { strings } from '../../../locales/i18n';
import { getListServiceSetting, getLoginInfo } from '../../../utils/Token';

const window = Dimensions.get('window');

const Input = ({style, flex, borderWidth, backgroundColor, ...props}) => (
  <TextInput
    {...props}
    style={[
      {
        flex: flex ?? undefined,
        borderWidth: borderWidth ?? 0,
        backgroundColor: backgroundColor ?? 'transparent',
        color: '#000000',
        paddingVertical: 8,
        paddingHorizontal: 0,
      },
      style,
    ]}
  />
);

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

    this.focusUnsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchData();
    });

    await this.fetchData();
  };

  componentWillUnmount() {
    this._isMounted = false;

    if (this.keyboardDidShowListener) {
      this.keyboardDidShowListener.remove();
    }

    if (this.keyboardDidHideListener) {
      this.keyboardDidHideListener.remove();
    }

    if (this.focusUnsubscribe) {
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

  fetchData = async () => {
    try {
      const serviceSettings = await getListServiceSetting();
      const listServiceSettings = Array.isArray(serviceSettings)
        ? serviceSettings
        : [];

      const loginInfo = await getLoginInfo();

      if (loginInfo) {
        this.props.setUserName?.(loginInfo.USER_CODE ?? '');
        this.props.setPassword?.(loginInfo.USER_PASSWORD ?? '');
        this.props.setIsRememberPassword?.(loginInfo.rememberPassword ?? false);
      }

      const selectedService =
        loginInfo?.service ?? listServiceSettings?.[0]?.value ?? null;

      await this.setStateAsync({
        listServiceSettings,
        service: selectedService,
      });

      if (selectedService) {
        this.props.setService?.(selectedService);
        await this._onChangeService(selectedService, listServiceSettings);
      }
    } catch (error) {
      console.log('fetchData error =', error);
      this.props.setErrorMessage?.(error?.message ?? '��Ŵ��������������');
      await this.setStateAsync({
        canLogin: false,
        successMessage: null,
      });
    }
  };

  _toggleShow = async () => {
    await this.setStateAsync({isShow: !this.state.isShow});
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
    this.setState({successMessage: null});

    if (this.state.canLogin) {
      this.props.onLogin?.();
    } else {
      this.props.setErrorMessage?.('�ô��Ǩ�ͺ��õ�駤������������');
    }
  };

  _handleChangePassword = (input) => {
    const capitalizedInput = (input ?? '').toUpperCase();
    this.props.setPassword?.(capitalizedInput.trim());
  };

  _onChangeService = async (value, listOverride = null) => {
    if (!value) {
      return;
    }

    const list = Array.isArray(listOverride)
      ? listOverride
      : this.state.listServiceSettings;

    this.props.setService?.(value);
    await this.setStateAsync({service: value});

    const service1 =
      _.find(list, ['value', value]) ||
      _.find(list, ['number', value]) ||
      null;

    console.log('service value >>>> ', value);
    console.log('service >>>> ', service1);

    const finalBaseUrl =
      service1?.webURL ??
      service1?.baseUrl ??
      service1?.baseURL ??
      '';

    const vanCNFMachine =
      service1?.number ??
      service1?.vanCNFMachine ??
      service1?.value ??
      '';

    const config = {
      baseUrl: finalBaseUrl,
      vanCNFMachine,
      SALESMAN: null,
      VANCONFIG: null,
      USER_CODE: service1?.USER_CODE ?? this.props.username ?? '',
      USER_PASSWORD: service1?.USER_PASSWORD ?? this.props.password ?? '',
    };

    console.log('_onChangeService config ', config);

    this.props.setErrorMessage?.(null);
    await this.setStateAsync({
      successMessage: null,
      canLogin: false,
    });

    if (!finalBaseUrl) {
      console.log('listServiceSettings =', JSON.stringify(list, null, 2));
      console.log('service1 invalid =', service1);
      this.props.setErrorMessage?.('��辺 webURL/baseUrl �ͧ service ������͡');
      return;
    }

    try {
      this.props.setIsLoading?.(true);

      const response = await this.props.systemCheck(config);
      console.log('_onChangeService response', response);

      const responseDataRaw = response?.ResponseData;
      const responseDateTime = response?.RESPONSE_DATETIME;

      let responseData = null;

      if (typeof responseDataRaw === 'string' && responseDataRaw.trim()) {
        responseData = JSON.parse(responseDataRaw);
      } else if (
        responseDataRaw &&
        typeof responseDataRaw === 'object'
      ) {
        responseData = responseDataRaw;
      }

      if (responseData && responseDateTime) {
        await this.setStateAsync({
          successMessage: strings('login_setting.connect_success'),
          canLogin: true,
        });
      } else {
        await this.setStateAsync({
          successMessage: null,
          canLogin: false,
        });

        this.props.setErrorMessage?.(
          response?.ReasonString || '��Ǩ�ͺ�������������������',
        );
      }
    } catch (error) {
      console.log('_onChangeService error =', error);
      console.log('_onChangeService error response =', error?.response?.data);

      await this.setStateAsync({
        successMessage: null,
        canLogin: false,
      });

      this.props.setErrorMessage?.(
        error?.message ||
          error?.response?.data?.ReasonString ||
          '���������к���������',
      );
    } finally {
      this.props.setIsLoading?.(false);
    }
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
        <Animated.View style={[styles.header, {height: this._headerHeight}]}>
          <View
            style={{
              flexDirection: 'row',
              zIndex: 999,
            }}>
            <Image
              style={{marginLeft: 5, width: 25, height: 25}}
              resizeMode="contain"
              source={require('../../../images/person.png')}
            />

            <View
              style={{
                flex: 1,
                borderBottomWidth: 0.3,
                borderColor: '#d6d7da',
                paddingRight: 0,
                marginLeft: 10,
              }}>
              <RNPickerSelect
                onValueChange={(selectedValue) => {
                  this._onChangeService(selectedValue);
                }}
                items={this.state.listServiceSettings}
                value={this.state.service}
                style={{
                  iconContainer: {
                    top: 12,
                    right: 0,
                  },
                  inputAndroid: {
                    color: '#000000',
                    paddingRight: 30,
                    paddingVertical: 12,
                  },
                  inputIOS: {
                    color: '#000000',
                    paddingRight: 30,
                    paddingVertical: 12,
                  },
                  placeholder: {
                    color: '#999999',
                  },
                }}
                placeholder={{
                  label: '���͡',
                  value: null,
                }}
                useNativeAndroidPickerStyle={false}
                textInputProps={{underlineColor: 'yellow'}}
                Icon={() => (
                  <AntDesign
                    name="down"
                    size={20}
                    color={MainTheme.colorPrimary}
                    style={{marginTop: 2}}
                  />
                )}
              />
            </View>
          </View>

          <View
            style={{
              marginTop: 20,
              borderWidth: 1,
              borderColor: MainTheme.colorTertiary,
              borderRadius: 25,
              flexDirection: 'row',
              alignItems: 'center',
              minHeight: 50,
              paddingHorizontal: 10,
            }}>
            <Image
              style={{marginLeft: 5, width: 25, height: 25}}
              resizeMode="contain"
              source={require('../../../images/person.png')}
            />

            <Input
              flex={1}
              borderWidth={0}
              backgroundColor="transparent"
              placeholder={strings('login.username')}
              placeholderTextColor={MainTheme.placeholerTextInput}
              value={username}
              autoCapitalize="characters"
              style={{fontSize: hp('1.7%')}}
              onChangeText={(text) => {
                setUserName?.(text.trim());
              }}
            />
          </View>

          <View
            style={{
              marginTop: 20,
              borderWidth: 1,
              borderColor: MainTheme.colorTertiary,
              borderRadius: 25,
              flexDirection: 'row',
              alignItems: 'center',
              minHeight: 50,
              paddingHorizontal: 10,
            }}>
            <Image
              style={{marginLeft: 5, width: 25, height: 25}}
              resizeMode="contain"
              source={require('../../../images/lock.png')}
            />

            <Input
              flex={1}
              borderWidth={0}
              backgroundColor="transparent"
              placeholder={strings('login.password')}
              secureTextEntry={this.state.isShow}
              placeholderTextColor={MainTheme.placeholerTextInput}
              value={password}
              style={{fontSize: hp('1.7%')}}
              onChangeText={this._handleChangePassword}
            />

            <MaterialIcons
              name={this.state.isShow ? 'visibility-off' : 'visibility'}
              size={26}
              color={MainTheme.colorTertiary}
              onPress={this._toggleShow}
              style={{marginRight: 5}}
            />
          </View>

          <View
            style={{
              alignSelf: 'center',
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CheckBox
              checked={!!isRememberPassword}
              onPress={() => {
                toggleRememberPassword?.();
              }}
              containerStyle={{padding: 0, margin: 0, marginRight: 8}}
            />
            <Text style={{alignSelf: 'flex-end'}}>
              {strings('login.rememberPassword')}
            </Text>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 35,
                    color: MainTheme.colorSecondary,
                  }}>
                  {strings('login.title1')}
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 23,
                    color: MainTheme.colorSecondary,
                  }}>
                  {strings('login.title2')}
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 23,
                    color: MainTheme.colorSecondary,
                  }}>
                  {strings('login.title3', {version: APP_VERSION})}
                </Text>
              </View>
            </View>
          </View>
          </View>
        </Animated.View>

        <View style={styles.body}>
          <View style={{width: '80%'}}>
            <View
              style={{
                marginTop: 0,
                borderWidth: 1,
                borderColor: MainTheme.colorTertiary,
                borderRadius: 25,
                display: 'none',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                minHeight: 50,
              }}>
              <Image
                style={{marginLeft: 5, width: 25, height: 25}}
                resizeMode="contain"
                source={require('../../../images/person.png')}
              />

              <View
                style={{
                  flex: 1,
                  borderBottomWidth: 0.3,
                  borderColor: '#d6d7da',
                  paddingRight: 0,
                  marginLeft: 10,
                }}>
                <RNPickerSelect
                  onValueChange={(selectedValue) => {
                    this._onChangeService(selectedValue);
                  }}
                  items={this.state.listServiceSettings}
                  value={this.state.service}
                  style={{
                    iconContainer: {
                      top: 12,
                      right: 0,
                    },
                    inputAndroid: {
                      color: '#000000',
                      paddingRight: 30,
                      paddingVertical: 12,
                    },
                    inputIOS: {
                      color: '#000000',
                      paddingRight: 30,
                      paddingVertical: 12,
                    },
                    placeholder: {
                      color: '#999999',
                    },
                  }}
                  placeholder={{
                    label: '���͡',
                    value: null,
                  }}
                  useNativeAndroidPickerStyle={false}
                  textInputProps={{underlineColor: 'yellow'}}
                  Icon={() => (
                    <AntDesign
                      name="down"
                      size={20}
                      color={MainTheme.colorPrimary}
                      style={{marginTop: 2}}
                    />
                  )}
                />
              </View>
            </View>

            <View
              style={{
                marginTop: 20,
                borderWidth: 1,
                borderColor: MainTheme.colorTertiary,
                borderRadius: 25,
                flexDirection: 'row',
                alignItems: 'center',
                minHeight: 50,
                paddingHorizontal: 10,
              }}>
              <Image
                style={{marginLeft: 5, width: 25, height: 25}}
                resizeMode="contain"
                source={require('../../../images/person.png')}
              />

              <Input
                flex={1}
                borderWidth={0}
                backgroundColor="transparent"
                placeholder={strings('login.username')}
                placeholderTextColor={MainTheme.placeholerTextInput}
                value={username}
                autoCapitalize="characters"
                style={{fontSize: hp('1.7%')}}
                onChangeText={(text) => {
                  setUserName?.(text.trim());
                }}
              />
            </View>

            <View
              style={{
                marginTop: 20,
                borderWidth: 1,
                borderColor: MainTheme.colorTertiary,
                borderRadius: 25,
                flexDirection: 'row',
                alignItems: 'center',
                minHeight: 50,
                paddingHorizontal: 10,
              }}>
              <Image
                style={{marginLeft: 5, width: 25, height: 25}}
                resizeMode="contain"
                source={require('../../../images/lock.png')}
              />

              <Input
                flex={1}
                borderWidth={0}
                backgroundColor="transparent"
                placeholder={strings('login.password')}
                secureTextEntry={this.state.isShow}
                placeholderTextColor={MainTheme.placeholerTextInput}
                value={password}
                style={{fontSize: hp('1.7%')}}
                onChangeText={this._handleChangePassword}
              />

              <MaterialIcons
                name={this.state.isShow ? 'visibility-off' : 'visibility'}
                size={26}
                color={MainTheme.colorTertiary}
                onPress={this._toggleShow}
                style={{marginRight: 5}}
              />
            </View>

            <View
              style={{
                alignSelf: 'center',
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <CheckBox
                checked={!!isRememberPassword}
                onPress={() => {
                  toggleRememberPassword?.();
                }}
                containerStyle={{padding: 0, margin: 0, marginRight: 8}}
              />
              <Text style={{alignSelf: 'flex-end'}}>
                {strings('login.rememberPassword')}
              </Text>
            </View>

            <View style={{marginTop: 20}}>
              <TouchableOpacity
                style={{
                  width: '60%',
                  backgroundColor: MainTheme.colorTertiary,
                  flexDirection: 'row',
                  borderRadius: 50,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  paddingVertical: 12,
                }}
                onPress={this._onLogin}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{color: MainTheme.colorSecondary, fontSize: hp('2')}}
                    allowFontScaling={false}>
                    {strings('login.login')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.MessageBox}>
              <ITextWithErrorMessage message={errorMessage} />
              <ITextWithSuccessMessage message={this.state.successMessage} />
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
    getSaleManV3: (GUID, SLMN_KEY) => dispatch(getSaleManV3(GUID, SLMN_KEY)),
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
  body: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footer: {
    flex: 0.4,
    alignItems: 'center',
  },
  MessageBox: {
    marginTop: 15,
    height: 30,
  },
  settingSection: {
    position: 'absolute',
    top: 20,
    right: 20,
    justifyContent: 'flex-end',
    height: 40,
  },
});
