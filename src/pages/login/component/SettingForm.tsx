import React, { useCallback, useEffect, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { connect } from 'react-redux';
import { API_ENDPOINT_V3 } from '../../../../appConfig';
import {
  getSaleManV3,
  getVanConfigV3,
  systemCheck2,
  unRegister,
} from '../../../action/setting';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ILoading from '../../../component/loading/ILoading';
import ITextWithErrorMessage from '../../../component/text/ITextWithErrorMessage';
import ITextWithSuccessMessage from '../../../component/text/ITextWithSuccessMessage';
import { MainTheme } from '../../../constant/lov';
import { strings } from '../../../locales/i18n';
import Navigator from '../../../services/Navigator';
import {
  getListServiceSetting,
  getSettingConfig,
  getUserToken,
  getVanSalesWebServiceUrl,
  removeSettingConfig,
  setLoginInfo,
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

export type SettingFormActionController = {
  canEditService: boolean;
  isLoading: boolean;
  onConfirmPress: () => Promise<void>;
  onClearPress: () => Promise<void>;
  onEditPress: () => void;
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
  onActionsChange?: (actions: SettingFormActionController) => void;
  children?: ReactNode;
};

const mapStateToProps = (_state: any) => ({
  // user: state.user
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    systemCheck2: (data: any) => {
      return dispatch(systemCheck2(data));
    },
    unRegister: () => {
      return dispatch(unRegister());
    },
    getSaleManV3: (GUID: string, SLMN_KEY: string) => {
      return dispatch(getSaleManV3(GUID, SLMN_KEY));
    },
    getVanConfigV3: (VANCNF_MACHINE: string) => {
      return dispatch(getVanConfigV3(VANCNF_MACHINE));
    },
  };
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
  const {
    navigation,
    systemCheck2,
    unRegister,
    getSaleManV3,
    getVanConfigV3,
    onActionsChange,
    children,
  } = props;
  const [config, setConfig] = useState<ConfigState>(initialConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);
  const [listServiceSettings, setList] = useState<ServiceSetting[]>([]);
  const [vanSalesWebServiceUrl, setVanSalesWebServiceUrl] = useState('');

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

  const applySelectedService = useCallback(async (
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
  }, [config]);

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
      const [configList, storedVanSalesWebServiceUrl] = await Promise.all([
        getListServiceSetting(),
        getVanSalesWebServiceUrl(),
      ]);
      const nextList = Array.isArray(configList)
        ? normalizeServices(configList)
        : [];

      if (!isMounted) {
        return;
      }

      setList(nextList);
      setVanSalesWebServiceUrl(toInputValue(storedVanSalesWebServiceUrl));

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

  const onConfirmConnection = useCallback(async (
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
          const salesman =
            responseData3?.SaleMan ??
            (Array.isArray(responseData3?.SL000130)
              ? responseData3.SL000130[0]
              : null);

          if (
            response3.ResponseCode == 200 &&
            responseData3.RECORD_COUNT != '0'
          ) {
            const nextConfig = {
              ...currentConfig,
              SALESMAN: salesman,
              VANCONFIG: response2,
            };
            const userToken = await getUserToken();

            setConfig(nextConfig);
            await setSettingConfig(nextConfig);
            await setUserToken({
              ...(userToken ?? {}),
              SALESMAN: salesman,
              VANCONFIG: response2,
            });

            onSetSuccessMessage(strings('login_setting.connect_success'));
            props.onConnnect?.(true);

            const serviceToSave =
              service ||
              listServiceSettings.find(
                item => item.number === currentConfig.vanCNFMachine,
              )?.value ||
              currentConfig.vanCNFMachine;
            if (serviceToSave) {
              await setLoginInfo({ service: serviceToSave });
            }

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
  }, [
    config,
    getSaleManV3,
    getVanConfigV3,
    isLoading,
    listServiceSettings,
    props,
    service,
    systemCheck2,
    unRegister,
  ]);

  const onClearConfig = async () => {
    await removeSettingConfig();
    setConfig(initialConfig);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const onChangeService = async (value: string | null) => {
    if (value === 'add') {
      setService(null);
      Navigator.navigate('ServiceSettingScreen', {
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

  const onEdit = useCallback(() => {
    const selectedService =
      listServiceSettings.find(item => item.value === service) ?? null;
    if (!selectedService) {
      return;
    }

    Navigator.navigate('ServiceSettingScreen', {
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
  }, [applySelectedService, listServiceSettings, service]);

  useEffect(() => {
    onActionsChange?.({
      canEditService: Boolean(service),
      isLoading,
      onConfirmPress: async () => {
        if (vanCNFMachine === null || vanCNFMachine.trim() === '') {
          onSetErrorMessage(strings('login_setting.input_fields_are_required'));
          return;
        }

        await onConfirmConnection();
      },
      onClearPress: async () => {
        await onClearConfig();
        setService(null);
      },
      onEditPress: onEdit,
    });
  }, [
    onActionsChange,
    service,
    isLoading,
    vanCNFMachine,
    config,
    listServiceSettings,
    onConfirmConnection,
    onEdit,
  ]);

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

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>ที่อยู่เว็บเซอร์วิส VanSales</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.input}>
              {toInputValue(vanSalesWebServiceUrl) || '-'}
            </Text>
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

      {children}

      <View style={styles.messageBox}>
        <ITextWithSuccessMessage message={successMessage} />
        <ITextWithErrorMessage message={errorMessage} />
        <ILoading isLoading={isLoading} />
      </View>
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingForm);

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
});
