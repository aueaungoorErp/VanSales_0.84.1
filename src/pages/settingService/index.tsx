import React, { useState } from 'react';
import type { ComponentType, Dispatch, SetStateAction } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as appConfig from '../../../appConfig';
import { systemCheckApi2 } from '../../api/setting';
import ILoading from '../../component/loading/ILoading';
import ITextWithErrorMessage from '../../component/text/ITextWithErrorMessage';
import { MainTheme } from '../../constant/lov';
import { strings } from '../../locales/i18n';
import Navigator from '../../services/Navigator';
import {
  getListServiceSetting,
  saveListServiceSetting,
} from '../../utils/Token';
import { normalizeWebServiceUrl } from '../../utils/webService';

const AntDesign = require('react-native-vector-icons/AntDesign')
  .default as ComponentType<any>;

const DEFAULT_SERVICE_URL = appConfig.API_ENDPOINT_V3;

const createLocalId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const toInputValue = (value: string | null | undefined) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
};

const isEmptyValue = (value: string | null | undefined) => {
  return value === null || value === undefined || value.trim() === '';
};

type ServiceSettingItem = {
  label: string;
  value: string;
  webURL?: string | null;
  serviceName?: string | null;
  number?: string | null;
  USER_CODE?: string | null;
  USER_PASSWORD?: string | null;
};

type ApplySelectedService = (
  selectedService: ServiceSettingItem | null | undefined,
  nextValueOverride?: string | null,
) => Promise<void>;

type ServiceSettingRouteParams = {
  service: 'add' | 'edit' | string;
  _webServiceKey: string | null;
  _webURL: string | null;
  _serviceName: string | null;
  _number: string | null;
  _user_code: string | null;
  _user_password: string | null;
  setService?: Dispatch<SetStateAction<string | null>>;
  applySelectedService?: ApplySelectedService;
};

type ServiceSettingProps = {
  route: {
    params: ServiceSettingRouteParams;
  };
};

const ServiceSetting: React.FC<ServiceSettingProps> = props => {
  const {
    service,
    _webServiceKey,
    _webURL,
    _serviceName,
    _number,
    _user_code,
    _user_password,
    setService,
    applySelectedService,
  } = props.route.params;

  const mode = service;
  const [webURL, setWebURL] = useState(
    normalizeWebServiceUrl(_webURL || DEFAULT_SERVICE_URL),
  );
  const [userCode, setUserCode] = useState(_user_code || '');
  const [userPassword, setUserPassword] = useState(_user_password || '');
  const [serviceName, setServiceName] = useState(_serviceName || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [number, setNumber] = useState(_number || '');
  const [isShow, setIsShow] = useState(true);

  const showConfirm = (title: string, message: string) => {
    return new Promise<boolean>(resolve => {
      Alert.alert(
        title,
        message,
        [
          { text: 'ใช่', onPress: () => resolve(true) },
          { text: 'ไม่ใช่', onPress: () => resolve(false) },
        ],
        { cancelable: false },
      );
    });
  };

  const handleErrorMessage = (error: unknown) => {
    setIsLoading(false);
    setErrorMessage(typeof error === 'string' ? error : String(error));
  };

  const validateItem = () => {
    let validate = true;

    if (isEmptyValue(serviceName)) {
      setErrorMessage('กรุณาระบุ' + strings('login_setting.web_servicename'));
      validate = false;
    } else if (isEmptyValue(webURL)) {
      setErrorMessage('กรุณาระบุ' + strings('login_setting.web_serviceurl'));
      validate = false;
    } else if (isEmptyValue(number)) {
      setErrorMessage('กรุณาระบุ' + strings('login_setting.van_machine'));
      validate = false;
    } else if (isEmptyValue(userCode)) {
      setErrorMessage('กรุณาระบุ' + strings('login_setting.user_code'));
      validate = false;
    } else if (isEmptyValue(userPassword)) {
      setErrorMessage('กรุณาระบุ' + strings('login_setting.user_password'));
      validate = false;
    }

    return validate;
  };

  const onSave = async () => {
    if (!validateItem()) {
      return;
    }

    const config = await getListServiceSetting();
    setErrorMessage('');
    const list: ServiceSettingItem[] = [];
    const normalizedWebURL = normalizeWebServiceUrl(webURL);

    try {
      setIsLoading(true);
      const response = await systemCheckApi2(
        normalizedWebURL,
        number,
        userCode,
        userPassword,
      );
      const { ResponseData, ResponseCode } = response;
      const responseData =
        ResponseData !== '' ? JSON.parse(ResponseData) : ResponseData;

      if (responseData && responseData.RECORD_COUNT !== 0) {
        if (Array.isArray(config) && config.length >= 0) {
          list.push(...config);
        }

        const uuid = createLocalId();
        const savedService: ServiceSettingItem = {
          label: serviceName,
          value: uuid,
          webURL: normalizedWebURL,
          serviceName,
          number,
          USER_CODE: userCode,
          USER_PASSWORD: userPassword,
        };

        list.push(savedService);
        await saveListServiceSetting(list);
        setService?.(uuid);
        await applySelectedService?.(savedService, uuid);

        Alert.alert(
          'สำเร็จ',
          strings('login_setting.connect') +
            strings('login_setting.web_service') +
            ' ' +
            serviceName +
            ' ' +
            strings('login_setting.success'),
          [{ text: 'ตกลง', onPress: () => Navigator.back() }],
          { cancelable: false },
        );
      } else if (ResponseCode == '607') {
        setErrorMessage('จำนวนสิทธิ์ใช้งานเกิน');
      } else {
        setErrorMessage('Web Service หรือ หน่วยรถ ไม่ถูกต้อง');
      }
    } catch (error) {
      if (error == '607') {
        setErrorMessage('จำนวนสิทธิ์ใช้งานเกิน');
      } else {
        handleErrorMessage(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onEdit = async () => {
    if (!validateItem()) {
      return;
    }

    const config = await getListServiceSetting();
    setErrorMessage('');
    const normalizedWebURL = normalizeWebServiceUrl(webURL);

    try {
      if (!Array.isArray(config)) {
        setErrorMessage('ไม่พบรายการเว็บเซอร์วิส');
        return;
      }

      const objIndex = config.findIndex(obj => obj.value === _webServiceKey);
      if (objIndex < 0) {
        setErrorMessage('ไม่พบรายการเว็บเซอร์วิส');
        return;
      }

      if (normalizeWebServiceUrl(_webURL) !== normalizedWebURL) {
        const confirmed = await showConfirm(
          'มีข้อมูลนี้ในระบบ',
          strings('announce.Alert2') + strings('login_setting.web_serviceurl'),
        );
        if (!confirmed) {
          return;
        }
      } else if (_serviceName !== serviceName) {
        const confirmed = await showConfirm(
          'มีข้อมูลนี้ในระบบ',
          strings('announce.Alert2') + strings('login_setting.web_servicename'),
        );
        if (!confirmed) {
          return;
        }
      }

      const response = await systemCheckApi2(
        normalizedWebURL,
        number,
        userCode,
        userPassword,
      );
      const { ResponseData } = response;
      const responseData =
        ResponseData !== '' ? JSON.parse(ResponseData) : ResponseData;

      if (responseData && responseData.RECORD_COUNT !== 0) {
        config[objIndex].webURL = normalizedWebURL;
        config[objIndex].label = serviceName;
        config[objIndex].serviceName = serviceName;
        config[objIndex].number = number;
        config[objIndex].USER_CODE = userCode;
        config[objIndex].USER_PASSWORD = userPassword;

        const savedService: ServiceSettingItem = { ...config[objIndex] };

        Alert.alert(
          'สำเร็จ',
          strings('login_setting.connect') +
            strings('login_setting.web_service') +
            ' ' +
            serviceName +
            ' ' +
            strings('login_setting.success'),
          [
            {
              text: 'ใช่',
              onPress: async () => {
                await saveListServiceSetting(config);
                setService?.(_webServiceKey);
                await applySelectedService?.(savedService, _webServiceKey);
                Navigator.back();
              },
            },
          ],
          { cancelable: true },
        );
      }
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  const onReset = () => {
    setWebURL(DEFAULT_SERVICE_URL);
    setServiceName('');
    setNumber('');
    setUserCode('');
    setUserPassword('');
    setErrorMessage('');
  };

  const onDelete = async () => {
    const confirmed = await showConfirm(
      'แจ้งเตือน',
      strings('announce.AlertDelete') + ' ' + serviceName + ' หรือไม่',
    );

    if (!confirmed) {
      return;
    }

    const config = await getListServiceSetting();
    const list = Array.isArray(config)
      ? config.filter(item => item.value !== _webServiceKey)
      : [];
    await saveListServiceSetting(list);
    Navigator.back();
  };

  const onBack = () => {
    Navigator.back();
  };

  const toggleShow = () => {
    setIsShow(oldValue => !oldValue);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.titleSection}>
        <AntDesign name="setting" color={MainTheme.colorQuaternary} size={30} />

        <Text style={styles.title} allowFontScaling={false}>
          {`${mode === 'add' ? 'เพิ่ม' : 'แก้ไข'}เว็ปเซอร์วิส`}
        </Text>
      </View>

      <ScrollView
        style={styles.form}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>ข้อมูลเซอร์วิส</Text>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>
              {strings('login_setting.web_servicename')}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={strings('login_setting.web_servicename')}
              placeholderTextColor={MainTheme.placeholerTextInput}
              value={toInputValue(serviceName)}
              underlineColorAndroid="transparent"
              onChangeText={setServiceName}
            />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>
              {strings('login_setting.web_serviceurl')}
            </Text>
            <TextInput
              multiline
              style={[styles.input, styles.multilineInput]}
              value={toInputValue(webURL)}
              underlineColorAndroid="transparent"
              placeholder={DEFAULT_SERVICE_URL}
              placeholderTextColor={MainTheme.placeholerTextInput}
              onChangeText={setWebURL}
            />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>
              {strings('login_setting.van_machine')}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={strings('login_setting.van_machine')}
              placeholderTextColor={MainTheme.placeholerTextInput}
              value={toInputValue(number)}
              underlineColorAndroid="transparent"
              onChangeText={setNumber}
            />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>ข้อมูลผู้ใช้งาน</Text>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>
              {strings('login_setting.user_code')}
            </Text>
            <View style={styles.iconInputRow}>
              <Image
                style={styles.leadingIcon}
                resizeMode="contain"
                source={require('../../images/person.png')}
              />
              <TextInput
                placeholder={strings('login.user_code')}
                placeholderTextColor={MainTheme.placeholerTextInput}
                value={toInputValue(userCode)}
                autoCapitalize="characters"
                style={styles.iconInput}
                underlineColorAndroid="transparent"
                onChangeText={value => {
                  setUserCode(value.trim());
                }}
              />
            </View>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>
              {strings('login_setting.user_password')}
            </Text>
            <View style={styles.iconInputRow}>
              <Image
                style={styles.leadingIcon}
                resizeMode="contain"
                source={require('../../images/lock.png')}
              />
              <TextInput
                placeholder={strings('login.user_password')}
                secureTextEntry={isShow}
                placeholderTextColor={MainTheme.placeholerTextInput}
                value={toInputValue(userPassword)}
                autoCapitalize="characters"
                style={styles.iconInput}
                underlineColorAndroid="transparent"
                onChangeText={setUserPassword}
              />
              <AntDesign
                name={isShow ? 'eyeo' : 'eye'}
                size={22}
                onPress={toggleShow}
                style={styles.trailingIcon}
              />
            </View>
          </View>
        </View>

        <View style={styles.messageBox}>
          <ITextWithErrorMessage message={errorMessage} />
          <ILoading isLoading={isLoading} />
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              { justifyContent: 'center', alignItems: 'center' },
            ]}
            onPress={() => {
              void (mode === 'add' ? onSave() : onEdit());
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonTitle} numberOfLines={1}>
              {'บันทึกและเชื่อมต่อ'}
            </Text>
          </TouchableOpacity>

          {mode === 'add' ? (
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                { justifyContent: 'center', alignItems: 'center' },
              ]}
              onPress={onReset}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonTitle}>{'ล้าง'}</Text>
            </TouchableOpacity>
          ) : null}

          {mode === 'edit' ? (
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 1,
                  paddingHorizontal: 16,
                },
              ]}
              onPress={() => {
                void onDelete();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonTitle}>{'ลบ'}</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 16,
              },
            ]}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonTitle}>{'ย้อนกลับ'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ServiceSetting;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4FAF6',
  },
  form: {
    width: '100%',
  },
  formContent: {
    padding: 14,
    paddingBottom: 28,
  },
  titleSection: {
    paddingLeft: 15,
    flexDirection: 'row',
    borderBottomColor: MainTheme.colorQuaternary,
    borderBottomWidth: 0.5,
    height: 50,
    alignItems: 'center',
    backgroundColor: MainTheme.colorSecondary,
  },
  title: {
    color: MainTheme.colorQuaternary,
    fontSize: hp('2.5%'),
    marginLeft: 8,
  },
  heroCard: {
    backgroundColor: '#E8F5EC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D3E9D9',
  },
  heroTitle: {
    color: MainTheme.colorQuaternary,
    fontSize: hp('2.2%'),
    fontWeight: '700',
    marginBottom: 6,
  },
  heroText: {
    color: '#4C6656',
    fontSize: hp('1.7%'),
    lineHeight: 22,
  },
  sectionCard: {
    backgroundColor: MainTheme.colorSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8E4',
  },
  sectionTitle: {
    color: MainTheme.colorQuaternary,
    fontSize: hp('2%'),
    fontWeight: '700',
    marginBottom: 14,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  label: {
    fontSize: hp('1.7%'),
    color: MainTheme.colorQuaternary,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    fontSize: hp('1.7%'),
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: '#000000',
    backgroundColor: '#F9FCFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D6E2D9',
  },
  multilineInput: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  helperText: {
    marginTop: 6,
    color: '#708070',
    fontSize: hp('1.5%'),
  },
  iconInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FCFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D6E2D9',
    paddingHorizontal: 12,
  },
  leadingIcon: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
  iconInput: {
    flex: 1,
    fontSize: hp('1.7%'),
    paddingVertical: 12,
    color: '#000000',
  },
  trailingIcon: {
    color: MainTheme.colorTertiary,
    marginLeft: 8,
  },
  messageBox: {
    alignContent: 'center',
    minHeight: 30,
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    paddingVertical: 5,
    justifyContent: 'space-evenly',
    rowGap: 10,
  },
  primaryButton: {
    backgroundColor: MainTheme.colorPrimary,
    elevation: 0,
    borderColor: MainTheme.colorPrimary,
    borderRadius: 12,
    paddingHorizontal: 4,
    width: 120,
    minHeight: 48,
  },
  primaryButtonTitle: {
    color: MainTheme.colorSecondary,
    fontSize: hp('1.55%'),
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: MainTheme.colorSecondary,
    width: 100,
    elevation: 0,
    borderWidth: 1,
    borderColor: MainTheme.colorButtonBorder,
    borderRadius: 12,
    minHeight: 48,
  },
  secondaryButtonTitle: {
    color: MainTheme.colorPrimary,
    fontSize: hp('1.7%'),
  },
});
