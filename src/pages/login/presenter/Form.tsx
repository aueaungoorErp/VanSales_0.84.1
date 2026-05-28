import React, { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ITextWithErrorMessage from '../../../component/text/ITextWithErrorMessage';
import ITextWithSuccessMessage from '../../../component/text/ITextWithSuccessMessage';
import { APP_VERSION, MainTheme } from '../../../constant/lov';
import { strings } from '../../../locales/i18n';
import Navigator from '../../../services/Navigator';
import {
  fetchLoginData,
  performLogin,
  type LoginDeps,
  type ServiceSetting,
  type UserLogin,
} from '../action/loginActions';

const AntDesign = require('react-native-vector-icons/AntDesign')
  .default as ComponentType<any>;

const window = Dimensions.get('window');
const HEADER_HEIGHT = window.width / 1.7;
const BODY_SHIFT = HEADER_HEIGHT * 0.28;

const toInputValue = (value: string | null | undefined) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
};

type FormProps = LoginDeps & {
  navigation?: {
    addListener?: (
      eventName: string,
      callback: () => void | Promise<void>,
    ) => (() => void) | { remove?: () => void };
  };
};

const Form: React.FC<FormProps> = props => {
  const { navigation } = props;

  const [listServiceSettings, setListServiceSettings] = useState<
    ServiceSetting[]
  >([]);
  const [userLogin, setUserLogin] = useState<UserLogin>({
    service: null,
    USER_CODE: null,
    USER_PASSWORD: null,
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [canLogin, setCanLogin] = useState(true);
  const [isShow, setIsShow] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRememberPassword, setRememberPassword] = useState(false);
  const isMountedRef = useRef(false);
  const isEditingRef = useRef(false);
  const keyboardAnimation = useRef(new Animated.Value(0)).current;
  const headerTranslateY = keyboardAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -HEADER_HEIGHT + 36],
  });
  const bodyTranslateY = keyboardAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -BODY_SHIFT],
  });

  const fetchData = useEffectEvent(async () => {
    try {
      setErrorMessage(null);

      const result = await fetchLoginData();

      if (!isMountedRef.current) {
        return;
      }

      setListServiceSettings(result.serviceSettings);
      if (!isEditingRef.current) {
        setUserLogin(result.userLogin);
        setRememberPassword(result.isRemember);
      }
      setSuccessMessage(null);
    } catch (error: any) {
      console.log('fetchData error =', error);

      setErrorMessage(error?.message ?? 'โหลดข้อมูลการตั้งค่าไม่สำเร็จ');

      if (!isMountedRef.current) {
        return;
      }

      setCanLogin(false);
      setSuccessMessage(null);
    }
  });

  const handleKeyboardDidShow = useEffectEvent(
    (event?: { duration?: number }) => {
      Animated.timing(keyboardAnimation, {
        duration: event?.duration ?? 250,
        toValue: 1,
        useNativeDriver: true,
      }).start();
    },
  );

  const handleKeyboardDidHide = useEffectEvent(() => {
    Animated.timing(keyboardAnimation, {
      duration: 500,
      toValue: 0,
      useNativeDriver: true,
    }).start();
  });

  const animateHeaderUp = useEffectEvent(() => {
    Animated.timing(keyboardAnimation, {
      duration: 250,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  });

  useEffect(() => {
    isMountedRef.current = true;

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyboardDidShow,
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      handleKeyboardDidHide,
    );

    const focusUnsubscribe = navigation?.addListener?.('focus', fetchData);

    fetchData();

    return () => {
      isMountedRef.current = false;
      keyboardDidShowListener?.remove?.();
      keyboardDidHideListener?.remove?.();

      if (typeof focusUnsubscribe === 'function') {
        focusUnsubscribe();
      } else {
        focusUnsubscribe?.remove?.();
      }
    };
  }, [fetchData, handleKeyboardDidHide, handleKeyboardDidShow, navigation]);

  const onLogin = () =>
    performLogin(userLogin, isRememberPassword, props, {
      setErrorMessage,
      setIsLoading,
    });

  const onLoginPress = () => {
    setSuccessMessage(null);

    if (userLogin.service) {
      void onLogin();
      return;
    }

    setErrorMessage('โปรดตรวจสอบการตั้งค่าเว็ปเซอร์วิส');
  };

  const handleChangePassword = (input: string) => {
    isEditingRef.current = true;
    const capitalizedInput = (input ?? '').toUpperCase();
    setUserLogin(oldState => ({
      ...oldState,
      USER_PASSWORD: capitalizedInput.trim(),
    }));
  };

  const onChangeService = async (
    value: string | null,
    listOverride: ServiceSetting[] | null = null,
    autoContinue = false,
  ) => {
    if (!value) {
      return;
    }

    isEditingRef.current = true;

    const list = Array.isArray(listOverride)
      ? listOverride
      : listServiceSettings;

    setUserLogin(oldState => ({
      ...oldState,
      service: value,
    }));

    const serviceItem =
      list.find(item => item.value === value) ||
      list.find(item => item.number === value) ||
      null;

    const finalBaseUrl =
      serviceItem?.webURL ?? serviceItem?.baseUrl ?? serviceItem?.baseURL ?? '';

    const resolvedUserCode =
      userLogin.USER_CODE ?? serviceItem?.USER_CODE ?? '';
    const currentPassword = userLogin.USER_PASSWORD ?? '';
    const shouldRestorePassword = !!isRememberPassword;
    const resolvedPassword = String(currentPassword).trim()
      ? currentPassword
      : '';

    if (!String(userLogin.USER_CODE ?? '').trim() && serviceItem?.USER_CODE) {
      setUserLogin(oldState => ({
        ...oldState,
        USER_CODE: serviceItem.USER_CODE ?? oldState.USER_CODE,
      }));
    }

    setErrorMessage(null);
    setSuccessMessage(strings('login_setting.connect_success'));
    setCanLogin(true);

    if (!finalBaseUrl) {
      console.log('service1 invalid =', serviceItem);
      console.log('listServiceSettings =', list);

      setErrorMessage('ไม่พบ webURL/baseUrl ของ service ที่เลือก');
      return;
    }

    if (
      autoContinue &&
      String(resolvedUserCode).trim() &&
      String(resolvedPassword).trim()
    ) {
      void onLogin();
    }
  };

  const onToggleRememberPassword = () => {
    isEditingRef.current = true;
    setRememberPassword(oldState => !oldState);
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingSection}>
        <Pressable
          hitSlop={10}
          onPress={() => {
            Navigator.navigate('LoginSetting');
          }}
        >
          <AntDesign
            name="setting"
            color={MainTheme.colorSecondary}
            size={24}
          />
        </Pressable>
      </View>

      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
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

      <Animated.View
        style={[
          styles.body,
          {
            transform: [{ translateY: bodyTranslateY }],
          },
        ]}
      >
        <View style={styles.formWidth}>
          <View style={styles.hiddenServiceContainer}>
            <Image
              style={styles.leftIcon}
              resizeMode="contain"
              source={require('../../../images/person.png')}
            />

            <View style={styles.pickerWrapper}>
              <RNPickerSelect
                onValueChange={value => {
                  onChangeService(value);
                }}
                items={listServiceSettings}
                value={userLogin.service}
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

          <View style={styles.inputRow}>
            <Image
              style={styles.leftIcon}
              resizeMode="contain"
              source={require('../../../images/person.png')}
            />

            <TextInput
              placeholder={strings('login.username')}
              placeholderTextColor={MainTheme.placeholerTextInput}
              value={toInputValue(userLogin.USER_CODE)}
              autoCapitalize="characters"
              style={styles.textInput}
              underlineColorAndroid="transparent"
              onFocus={animateHeaderUp}
              onChangeText={value => {
                isEditingRef.current = true;
                setUserLogin(oldState => ({
                  ...oldState,
                  USER_CODE: value.trim(),
                }));
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
              secureTextEntry={isShow}
              placeholderTextColor={MainTheme.placeholerTextInput}
              value={toInputValue(userLogin.USER_PASSWORD)}
              autoComplete="off"
              textContentType="none"
              importantForAutofill="no"
              autoCorrect={false}
              style={styles.textInput}
              underlineColorAndroid="transparent"
              onFocus={animateHeaderUp}
              onChangeText={handleChangePassword}
            />

            <AntDesign
              name={isShow ? 'eye' : 'eye-invisible'}
              size={28}
              color={MainTheme.colorTertiary}
              onPress={() => {
                setIsShow(old => !old);
              }}
            />
          </View>

          <View style={styles.rememberRow}>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityLabel="remember password"
              accessibilityState={{ checked: !!isRememberPassword }}
              onPress={() => {
                onToggleRememberPassword();
              }}
              style={styles.checkboxPressable}
            >
              <View
                style={[
                  styles.checkboxBox,
                  isRememberPassword ? styles.checkboxBoxChecked : null,
                ]}
              >
                {isRememberPassword ? (
                  <AntDesign name="check" size={14} color="#ffffff" />
                ) : null}
              </View>
            </Pressable>

            <Text style={styles.rememberText}>
              {strings('login.rememberPassword')}
            </Text>
          </View>

          <View style={styles.loginButtonWrap}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={onLoginPress}
              activeOpacity={0.8}
            >
              <View style={styles.loginButtonInner}>
                <Text style={styles.loginButtonText} allowFontScaling={false}>
                  {strings('login.login')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.messageBox}>
            <ITextWithErrorMessage message={errorMessage} />
            <ITextWithSuccessMessage message={successMessage} />
          </View>
        </View>
      </Animated.View>

      <Modal transparent visible={!!isLoading} animationType="fade">
        <View style={styles.loadingBackdrop}>
          <View style={styles.loadingModalCard}>
            <View style={styles.loadingInline}>
              <ActivityIndicator
                size="large"
                color={MainTheme.colorTertiary}
                style={styles.loadingSpinner}
              />
              <Text style={styles.loadingText}>กำลังเข้าสู่ระบบ</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Form;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignSelf: 'center',
    width: window.width,
    overflow: 'hidden',
    height: HEADER_HEIGHT,
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
    height: HEADER_HEIGHT,
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
    marginTop: -20,
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
    color: MainTheme.colorQuaternary,
    fontSize: hp('1.7%'),
    fontWeight: '600',
    lineHeight: hp('2.1%'),
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
  loadingBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingModalCard: {
    minWidth: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 20,
    elevation: 6,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  loadingInline: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 34,
    height: 34,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: hp('2%'),
    color: '#333333',
    fontWeight: '500',
  },
  footer: {
    flex: 0.4,
    alignItems: 'center',
  },
});
