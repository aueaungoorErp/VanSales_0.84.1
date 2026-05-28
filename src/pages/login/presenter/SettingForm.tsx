import React, { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { API_ENDPOINT_V3 } from '../../../../appConfig';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ILoading from '../../../component/loading/ILoading';
import ITextWithErrorMessage from '../../../component/text/ITextWithErrorMessage';
import ITextWithSuccessMessage from '../../../component/text/ITextWithSuccessMessage';
import { MainTheme } from '../../../constant/lov';
import { strings } from '../../../locales/i18n';
import { settingConfigButtonGroup } from '../constant/settingConfigButtonGroup';
import Navigator from '../../../services/Navigator';
import {
  getListServiceSetting,
  getSettingConfig,
  getUserToken,
  removeSettingConfig,
  setSettingConfig,
  setUserToken,
} from '../../../utils/Token';

const AntDesign = require('react-native-vector-icons/AntDesign')
  .default as ComponentType<any>;

const toInputValue = (value: string | null | undefined) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
};

type ConfigState = {
  baseUrl: string | null;
  vanCNFMachine: string | null;
  SALESMAN: any;
  VANCONFIG: any;
  USER_CODE: string | null;
  USER_PASSWORD: string | null;
};

type ServiceSetting = {
  value: string;
  label: string;
  webURL?: string | null;
  number?: string | null;
  USER_CODE?: string | null;
  USER_PASSWORD?: string | null;
  serviceName?: string | null;
};

type ButtonItem = {
  methodName?: string;
  title?: string;
  titleStyle?: any;
  buttonStyle?: any;
};

type SettingFormProps = {
  navigation?: {
    addListener?: (
      eventName: string,
      callback: () => void | Promise<void>,
    ) => (() => void) | { remove?: () => void };
  };
  onConnnect?: (status: boolean) => void;
  systemCheck2: (data: any) => Promise<any>;
  unRegister: () => Promise<any>;
  getSaleManV3: (guid: string, slmnKey: string) => Promise<any>;
  getVanConfigV3: (vanCnfMachine: string) => Promise<any>;
};

const initialConfig: ConfigState = {
  baseUrl: API_ENDPOINT_V3,
  vanCNFMachine: null,
  SALESMAN: null,
  VANCONFIG: null,
  USER_CODE: null,
  USER_PASSWORD: null,
};

const SettingForm: React.FC<SettingFormProps> = props => {
  const { navigation, systemCheck2, unRegister, getSaleManV3, getVanConfigV3 } =
    props;
  const [config, setConfig] = useState<ConfigState>(initialConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);
  const [listServiceSettings, setList] = useState<ServiceSetting[]>([]);

  const {
    baseUrl,
    vanCNFMachine,
    SALESMAN: salesMan,
    VANCONFIG: vanConfig,
  } = config;

  const normalizeServices = (items: any[] = []): ServiceSetting[] => {
    return items.map((item, index) => ({
      ...item,
      value: String(item?.value ?? item?.number ?? item?.serviceName ?? index),
      label: String(
        item?.label ??
          item?.serviceName ??
          item?.number ??
          item?.value ??
          'Service',
      ),
    }));
  };

  const setConfigField = <K extends keyof ConfigState>(
    key: K,
    value: ConfigState[K],
  ) => {
    setConfig(oldState => ({
      ...oldState,
      [key]: value,
    }));
  };

  const onSetSuccessMessage = (value: string | null) => {
    setSuccessMessage(value);
    setErrorMessage(null);
  };

  const onSetErrorMessage = (value: string | null) => {
    setErrorMessage(value);
    setSuccessMessage(null);
  };

  const onApplyConfig = async (nextConfig: ConfigState) => {
    setConfig(nextConfig);
    setSuccessMessage(null);
    setErrorMessage(null);
    await setSettingConfig(nextConfig);
  };

  const applySelectedService = async (
    selectedService: ServiceSetting | null | undefined,
    nextValueOverride: string | null = null,
  ) => {
    if (!selectedService) {
      return;
    }

    const nextValue = nextValueOverride ?? selectedService.value ?? null;
    const { webURL, number, USER_CODE, USER_PASSWORD } = selectedService;

    if (nextValue) {
      setService(nextValue);
    }

    await onApplyConfig({
      ...config,
      baseUrl: webURL ?? null,
      vanCNFMachine: number ?? null,
      USER_CODE: USER_CODE ?? null,
      USER_PASSWORD: USER_PASSWORD ?? null,
      SALESMAN: null,
      VANCONFIG: null,
    });
  };

  useEffect(() => {
    const loadSettingConfig = async () => {
      const nextConfig = await getSettingConfig();

      if (nextConfig) {
        setConfig(nextConfig);
      }
    };

    void loadSettingConfig();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      const configList = await getListServiceSetting();
      const nextList = Array.isArray(configList)
        ? normalizeServices(configList)
        : [];

      if (!isMounted) {
        return;
      }

      setList(nextList);

      const matchedService = nextList.find(item => {
        return item.webURL === baseUrl && item.number === vanCNFMachine;
      });

      if (matchedService?.value) {
        setService(matchedService.value);
      }
    };

    void loadServices();

    const unsubscribe = navigation?.addListener?.('focus', loadServices);

    return () => {
      isMounted = false;

      if (typeof unsubscribe === 'function') {
        unsubscribe();
      } else {
        unsubscribe?.remove?.();
      }
    };
  }, [baseUrl, navigation, vanCNFMachine]);

  const onConfirmConnection = async (
    configOverride: ConfigState | null = null,
  ) => {
    try {
      if (isLoading) {
        return;
      }

      const currentConfig = configOverride ?? config;

      setIsLoading(true);
      onSetErrorMessage(null);
      onSetSuccessMessage(null);

      const response = await systemCheck2(currentConfig);
      const { ResponseData, RESPONSE_DATETIME } = response;
      const responseData = JSON.parse(ResponseData);

      if (!RESPONSE_DATETIME) {
        onSetErrorMessage('ไม่พบหน่วยรถ ' + currentConfig.vanCNFMachine);
      } else if (responseData?.BPAPUS_KEY && responseData?.BPAPUS_GUID) {
        const response2 = await getVanConfigV3(
          currentConfig.vanCNFMachine ?? '',
        );

        if (response2) {
          const response3 = await getSaleManV3(
            responseData.BPAPUS_GUID,
            response2.VANCNF_SLMN,
          );
          const responseData3 = JSON.parse(response3.ResponseData);

          if (
            response3.ResponseCode == 200 &&
            responseData3.RECORD_COUNT != '0'
          ) {
            const nextConfig = {
              ...currentConfig,
              SALESMAN: responseData3.SaleMan,
              VANCONFIG: response2,
            };
            const userToken = await getUserToken();

            setConfig(nextConfig);
            await setSettingConfig(nextConfig);
            await setUserToken({
              ...(userToken ?? {}),
              SALESMAN: responseData3.SaleMan,
              VANCONFIG: response2,
            });

            onSetSuccessMessage(strings('login_setting.connect_success'));
            props.onConnnect?.(true);

            try {
              await unRegister();
            } catch (unregisterError) {
              console.log('_systemCheck unRegister warning', unregisterError);
            }

            setIsLoading(false);
            return;
          }

          onSetErrorMessage(response3.ReasonString);
        } else {
          onSetErrorMessage(
            'ไม่พบข้อมูลหน่วยรถ ' +
              currentConfig.vanCNFMachine +
              ' กรุณาตรวจสอบการตั้งค่า',
          );
        }
      } else {
        onSetErrorMessage(response.ReasonString);
      }

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      onSetErrorMessage(error?.message ?? 'เชื่อมต่อระบบไม่สำเร็จ');
      props.onConnnect?.(false);
    }
  };

  const onClearConfig = async () => {
    await removeSettingConfig();
    setConfig(initialConfig);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const onChangeService = async (value: string | null) => {
    if (value === 'add') {
      setService(null);
      Navigator.navigate('ServiceSetting', {
        service: 'add',
        _webServiceKey: null,
        _webURL: null,
        _serviceName: null,
        _number: null,
        _user_code: null,
        _user_password: null,
        setService,
        applySelectedService,
      });
      return;
    }

    const nextValue = value ?? listServiceSettings[0]?.value ?? null;
    if (!nextValue) {
      return;
    }

    const selectedService =
      listServiceSettings.find(item => item.value === nextValue) ?? null;
    if (!selectedService) {
      return;
    }

    await applySelectedService(selectedService, nextValue);
  };

  const onEdit = () => {
    const selectedService =
      listServiceSettings.find(item => item.value === service) ?? null;
    if (!selectedService) {
      return;
    }

    Navigator.navigate('ServiceSetting', {
      service: 'edit',
      _webServiceKey: service,
      _webURL: selectedService.webURL,
      _serviceName: selectedService.serviceName,
      _number: selectedService.number,
      _user_code: selectedService.USER_CODE,
      _user_password: selectedService.USER_PASSWORD,
      setService,
      applySelectedService,
    });
  };

  const handleButtonPress = async (item: ButtonItem) => {
    if (item.methodName === 'confirm') {
      if (vanCNFMachine === null || vanCNFMachine.trim() === '') {
        onSetErrorMessage(strings('login_setting.input_fields_are_required'));
        return;
      }

      await onConfirmConnection();
      return;
    }

    if (item.methodName === 'clear') {
      await onClearConfig();
      setService(null);
      return;
    }

    if (item.methodName === 'back') {
      Navigator.back();
    }
  };

  const handleBaseUrlChange = (value: string) => {
    setConfigField('baseUrl', value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>เลือกเว็บเซอร์วิส</Text>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>
            {strings('login_setting.web_service')}
          </Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={onChangeService}
              items={[
                ...listServiceSettings,
                { label: 'เพิ่มเซอร์วิส...', value: 'add' },
              ]}
              value={service}
              style={{
                iconContainer: {
                  top: 14,
                  right: 12,
                },
                inputAndroid: styles.pickerInput,
                inputIOS: styles.pickerInput,
                placeholder: {
                  color: MainTheme.placeholerTextInput,
                },
              }}
              placeholder={{
                label: 'เลือกเว็บเซอร์วิส',
                value: null,
              }}
              textInputProps={{
                underlineColorAndroid: 'transparent',
              }}
              useNativeAndroidPickerStyle={false}
              Icon={() => (
                <AntDesign
                  name="down"
                  size={18}
                  color={MainTheme.colorPrimary}
                  style={styles.pickerIcon}
                />
              )}
            />
          </View>
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>URL</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={toInputValue(baseUrl)}
              onChangeText={handleBaseUrlChange}
              placeholder="URL"
              placeholderTextColor={MainTheme.placeholerTextInput}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>รายละเอียดการเชื่อมต่อ</Text>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>
              {strings('login_setting.van_machine')}
            </Text>
            <Text style={styles.summaryValue}>
              {toInputValue(vanCNFMachine) || '-'}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>
              {strings('login_setting.car_number')}
            </Text>
            <Text style={styles.summaryValue}>
              {toInputValue(vanConfig?.VANCNF_REG_NAME) || '-'}
            </Text>
          </View>

          <View style={styles.summaryItemWide}>
            <Text style={styles.summaryLabel}>
              {strings('login_setting.employee')}
            </Text>
            <Text style={styles.summaryValue}>
              {toInputValue(salesMan?.SLMN_NAME) || '-'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>จัดการการตั้งค่า</Text>

        <View style={styles.buttonGroup}>
          {settingConfigButtonGroup.map((item, index) => (
            <TouchableOpacity
              key={item.methodName ?? index}
              style={[
                {
                  paddingVertical: 10,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                item.buttonStyle,
              ]}
              onPress={() => {
                void handleButtonPress(item);
              }}
              activeOpacity={0.7}
            >
              <Text style={[item.titleStyle, { fontSize: hp('1.7%') }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {service ? (
          <View style={styles.editButtonPanel}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={onEdit}
              activeOpacity={0.7}
            >
              <Text style={styles.editButtonTitle}>แก้ไขเซอร์วิส</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      <View style={styles.messageBox}>
        <ITextWithSuccessMessage message={successMessage} />
        <ITextWithErrorMessage message={errorMessage} />
        <ILoading isLoading={isLoading} />
      </View>
    </View>
  );
};

export default SettingForm;

const styles = StyleSheet.create({
  container: {
    paddingTop: 6,
    paddingBottom: 8,
  },
  sectionCard: {
    backgroundColor: MainTheme.colorSecondary,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E3E8E4',
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  sectionTitle: {
    color: MainTheme.colorQuaternary,
    fontSize: hp('2%'),
    fontWeight: '700',
    marginBottom: 12,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  label: {
    color: MainTheme.colorQuaternary,
    fontSize: hp('1.7%'),
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D8E2DB',
    borderRadius: 14,
    paddingRight: 12,
    backgroundColor: '#F8FBF9',
  },
  pickerInput: {
    color: '#000000',
    fontSize: hp('1.7%'),
    paddingLeft: 14,
    paddingRight: 36,
    paddingVertical: 12,
  },
  pickerIcon: {
    marginTop: 2,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#D8E2DB',
    borderRadius: 14,
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: '#F8FBF9',
  },
  input: {
    fontSize: hp('1.7%'),
    color: '#000000',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  summaryItem: {
    width: '48%',
    backgroundColor: '#F6FAF7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E9E4',
  },
  summaryItemWide: {
    width: '100%',
    backgroundColor: '#F6FAF7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E9E4',
  },
  summaryLabel: {
    color: '#6E776F',
    fontSize: hp('1.5%'),
    marginBottom: 6,
  },
  summaryValue: {
    color: MainTheme.colorQuaternary,
    fontSize: hp('1.8%'),
    fontWeight: '700',
  },
  messageBox: {
    alignContent: 'center',
    minHeight: 34,
    marginBottom: 10,
  },
  editButton: {
    height: 44,
    backgroundColor: MainTheme.colorSecondary,
    width: 100,
    elevation: 0,
    borderWidth: 0.5,
    borderColor: MainTheme.colorButtonBorder,
    borderRadius: 8,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonTitle: {
    color: MainTheme.colorPrimary,
    fontSize: hp('1.7%'),
  },
  buttonGroup: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 4,
    justifyContent: 'space-between',
    gap: 5,
    flexWrap: 'wrap',
  },
  editButtonPanel: {
    flex: 1,
    justifyContent: 'center',
    height: 50,
  },
});
