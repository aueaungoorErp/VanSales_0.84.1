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
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ILoading from '../../../component/loading/ILoading';
import IActionButton from '../../../component/button/IActionButton';
import ITextWithErrorMessage from '../../../component/text/ITextWithErrorMessage';
import ITextWithSuccessMessage from '../../../component/text/ITextWithSuccessMessage';
import { MainTheme } from '../../../constant/lov';
import { strings } from '../../../locales/i18n';
import Navigator from '../../../services/Navigator';
import { testLongdoMapApiKey } from '../../../services/longdomap';
import {
  getListServiceSetting,
  getLongdoMapApiKeyConfigs,
  getSettingConfig,
  getUserToken,
  getVanSalesWebServiceUrl,
  removeLongdoMapApiKeys,
  removeSettingConfig,
  setLoginInfo,
  setLongdoMapApiKeyConfigs,
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
  API_KEY: string | null;
  API_KEYS?: string[] | null;
};

type ServiceSetting = {
  value: string;
  label: string;
  webURL?: string | null;
  number?: string | null;
  USER_CODE?: string | null;
  USER_PASSWORD?: string | null;
  API_KEY?: string | null;
  API_KEYS?: string[] | null;
  serviceName?: string | null;
};

type LongdoKeyValidation = {
  status: 'success' | 'limit' | 'invalid' | 'error';
  message: string;
};

type LongdoKeyAssessment = {
  failedResults: Array<{
    index: number;
    result: LongdoKeyValidation & { key?: string; httpStatus?: number | null };
  }>;
  hasAnyKey: boolean;
};

type LongdoApiKeyConfig = {
  key: string;
  outoflimit: boolean;
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
  API_KEY: null,
  API_KEYS: null,
};

const createDefaultLongdoApiKeyConfig = (): LongdoApiKeyConfig => ({
  key: '',
  outoflimit: false,
});

const normalizeLongdoConfigsForUi = (
  configs: LongdoApiKeyConfig[],
): LongdoApiKeyConfig[] => {
  return configs.length > 0 ? configs : [createDefaultLongdoApiKeyConfig()];
};

const normalizeLongdoConfigsFromConfig = (
  apiKeys?: string[] | null,
  apiKey?: string | null,
): LongdoApiKeyConfig[] => {
  const normalizedKeys = Array.isArray(apiKeys)
    ? apiKeys
    : apiKey
    ? [apiKey]
    : [];

  return normalizedKeys
    .map(item => String(item ?? '').trim())
    .filter(item => item !== '')
    .slice(0, 3)
    .map(item => ({
      key: item,
      outoflimit: false,
    }));
};

const getDuplicateLongdoKeyIndexes = (configs: LongdoApiKeyConfig[]) => {
  const indexesByKey: Record<string, number[]> = {};

  configs.forEach((item, index) => {
    const normalizedKey = String(item?.key ?? '').trim();
    if (!normalizedKey) {
      return;
    }

    if (!indexesByKey[normalizedKey]) {
      indexesByKey[normalizedKey] = [];
    }

    indexesByKey[normalizedKey].push(index);
  });

  return Object.values(indexesByKey).reduce<number[]>((result, indexes) => {
    if (indexes.length > 1) {
      result.push(...indexes);
    }
    return result;
  }, []);
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
  const [longdoApiKeyConfigs, setLongdoApiKeyConfigsState] = useState<
    LongdoApiKeyConfig[]
  >([createDefaultLongdoApiKeyConfig()]);
  const [longdoKeyValidations, setLongdoKeyValidations] = useState<
    Record<number, LongdoKeyValidation>
  >({});
  const [isTestingLongdoKeys, setIsTestingLongdoKeys] = useState(false);

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

  const persistLongdoApiKeyConfigs = async (
    nextConfigs: LongdoApiKeyConfig[],
    vanCodeOverride: string | null = null,
  ) => {
    const vanCode = vanCodeOverride ?? config.vanCNFMachine ?? null;
    await (setLongdoMapApiKeyConfigs as any)(nextConfigs, vanCode ?? null);
  };

  const confirmConnectWithoutLongdoApiKey = async () => {
    return await new Promise<boolean>(resolve => {
      Alert.alert(
        'แจ้งเตือน',
        'ยังไม่ได้กำหนด Longdo Map API Key ต้องการเชื่อมต่อต่อหรือไม่',
        [
          { text: 'ใช่', onPress: () => resolve(true) },
          { text: 'ไม่ใช่', onPress: () => resolve(false) },
        ],
        { cancelable: false },
      );
    });
  };

  const confirmConnectWithInvalidLongdoApiKey = async () => {
    return await new Promise<boolean>(resolve => {
      Alert.alert(
        'แจ้งเตือน',
        'Longdo Map API Key ใช้งานไม่ได้ ต้องการเชื่อมต่อต่อหรือไม่',
        [
          { text: 'ใช่', onPress: () => resolve(true) },
          { text: 'ไม่ใช่', onPress: () => resolve(false) },
        ],
        { cancelable: false },
      );
    });
  };

  const assessLongdoApiKeys =
    useCallback(async (): Promise<LongdoKeyAssessment> => {
      const keysToValidate = longdoApiKeyConfigs
        .map((item, index) => ({
          key: String(item?.key ?? '').trim(),
          index,
        }))
        .filter(item => item.key !== '');
      const duplicateIndexes =
        getDuplicateLongdoKeyIndexes(longdoApiKeyConfigs);

      if (keysToValidate.length === 0) {
        setLongdoKeyValidations({});
        return {
          failedResults: [],
          hasAnyKey: false,
        };
      }

      if (duplicateIndexes.length > 0) {
        const nextValidations: Record<number, LongdoKeyValidation> = {};
        duplicateIndexes.forEach(index => {
          nextValidations[index] = {
            status: 'invalid',
            message: 'API Key ซ้ำกับช่องอื่น',
          };
        });
        setLongdoKeyValidations(nextValidations);

        return {
          failedResults: duplicateIndexes.map(index => ({
            index,
            result: {
              status: 'invalid' as const,
              message: 'API Key ซ้ำกับช่องอื่น',
              key: String(longdoApiKeyConfigs[index]?.key ?? '').trim(),
              httpStatus: null,
            },
          })),
          hasAnyKey: true,
        };
      }

      setIsTestingLongdoKeys(true);

      try {
        const results = await Promise.all(
          keysToValidate.map(async item => ({
            ...item,
            result: await testLongdoMapApiKey(item.key),
          })),
        );
        const nextValidations: Record<number, LongdoKeyValidation> = {};
        const failedResults = results.filter(item => {
          const failed = item.result.status !== 'success';
          nextValidations[item.index] = {
            status: item.result.status,
            message: item.result.message,
          };

          return failed;
        });

        setLongdoKeyValidations(nextValidations);
        const nextConfigs = longdoApiKeyConfigs.map((item, index) => {
          const result = results.find(resultItem => resultItem.index === index);

          if (!result) {
            return item;
          }

          return {
            ...item,
            outoflimit: result.result.status === 'limit',
          };
        });
        setLongdoApiKeyConfigsState(nextConfigs);
        await persistLongdoApiKeyConfigs(
          nextConfigs,
          config.vanCNFMachine ?? null,
        );

        return {
          failedResults,
          hasAnyKey: true,
        };
      } finally {
        setIsTestingLongdoKeys(false);
      }
    }, [config.vanCNFMachine, longdoApiKeyConfigs]);

  const applySelectedService = useCallback(
    async (
      selectedService: ServiceSetting | null | undefined,
      nextValueOverride: string | null = null,
    ) => {
      if (!selectedService) {
        return;
      }

      const nextValue = nextValueOverride ?? selectedService.value ?? null;
      const normalizedApiKeys = Array.isArray(selectedService.API_KEYS)
        ? selectedService.API_KEYS
        : selectedService.API_KEY
        ? [selectedService.API_KEY]
        : [];
      const { webURL, number, USER_CODE, USER_PASSWORD, API_KEY } =
        selectedService;

      if (nextValue) {
        setService(nextValue);
      }

      await onApplyConfig({
        ...config,
        baseUrl: webURL ?? null,
        vanCNFMachine: number ?? null,
        USER_CODE: USER_CODE ?? null,
        USER_PASSWORD: USER_PASSWORD ?? null,
        API_KEY: API_KEY ?? normalizedApiKeys[0] ?? null,
        API_KEYS: normalizedApiKeys,
        SALESMAN: null,
        VANCONFIG: null,
      });
    },
    [config],
  );

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
    const loadLongdoApiKeys = async () => {
      const storedConfigs = await (getLongdoMapApiKeyConfigs as any)(
        config.vanCNFMachine ?? null,
      );
      const fallbackConfigs = normalizeLongdoConfigsFromConfig(
        config.API_KEYS ?? null,
        config.API_KEY ?? null,
      );
      const nextConfigs =
        Array.isArray(storedConfigs) && storedConfigs.length > 0
          ? storedConfigs
          : fallbackConfigs;

      setLongdoApiKeyConfigsState(normalizeLongdoConfigsForUi(nextConfigs));
    };

    void loadLongdoApiKeys();
  }, [config.API_KEY, config.API_KEYS, config.vanCNFMachine]);

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

  const onConfirmConnection = useCallback(
    async (configOverride: ConfigState | null = null) => {
      try {
        if (isLoading) {
          return;
        }

        const currentConfig = configOverride ?? config;

        setIsLoading(true);
        onSetErrorMessage(null);
        onSetSuccessMessage(null);

        const longdoKeyAssessment = await assessLongdoApiKeys();
        if (!longdoKeyAssessment.hasAnyKey) {
          const confirmed = await confirmConnectWithoutLongdoApiKey();
          if (!confirmed) {
            setIsLoading(false);
            return;
          }
        } else if (longdoKeyAssessment.failedResults.length > 0) {
          const confirmed = await confirmConnectWithInvalidLongdoApiKey();
          if (!confirmed) {
            setIsLoading(false);
            return;
          }
        }

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
    },
    [
      config,
      getSaleManV3,
      getVanConfigV3,
      isLoading,
      listServiceSettings,
      props,
      service,
      systemCheck2,
      unRegister,
      assessLongdoApiKeys,
    ],
  );

  const onClearConfig = async () => {
    await removeSettingConfig();
    await removeLongdoMapApiKeys();
    setConfig(initialConfig);
    setLongdoApiKeyConfigsState([createDefaultLongdoApiKeyConfig()]);
    setLongdoKeyValidations({});
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const onChangeLongdoApiKey = (index: number, value: string) => {
    const nextConfigs = longdoApiKeyConfigs.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            key: value,
            outoflimit: false,
          }
        : item,
    );
    const duplicateIndexes = getDuplicateLongdoKeyIndexes(nextConfigs);
    setLongdoApiKeyConfigsState(nextConfigs);
    setLongdoKeyValidations(current => {
      const nextValidations = { ...current };
      delete nextValidations[index];

      Object.keys(nextValidations).forEach(key => {
        if (
          nextValidations[Number(key)]?.message === 'API Key ซ้ำกับช่องอื่น'
        ) {
          delete nextValidations[Number(key)];
        }
      });

      duplicateIndexes.forEach(duplicateIndex => {
        nextValidations[duplicateIndex] = {
          status: 'invalid',
          message: 'API Key ซ้ำกับช่องอื่น',
        };
      });

      return nextValidations;
    });
    void persistLongdoApiKeyConfigs(nextConfigs);
  };

  const onAddLongdoApiKey = () => {
    if (longdoApiKeyConfigs.length >= 3) {
      return;
    }

    const nextConfigs = [
      ...longdoApiKeyConfigs,
      createDefaultLongdoApiKeyConfig(),
    ];
    setLongdoApiKeyConfigsState(nextConfigs);
  };

  const onRemoveLongdoApiKey = (index: number) => {
    const nextConfigs = longdoApiKeyConfigs.filter(
      (_, itemIndex) => itemIndex !== index,
    );
    const normalizedConfigs = normalizeLongdoConfigsForUi(nextConfigs);
    setLongdoApiKeyConfigsState(normalizedConfigs);
    setLongdoKeyValidations(current => {
      const nextValidations: Record<number, LongdoKeyValidation> = {};
      Object.keys(current).forEach(key => {
        const numericKey = Number(key);
        if (numericKey < index) {
          nextValidations[numericKey] = current[numericKey];
        } else if (numericKey > index) {
          nextValidations[numericKey - 1] = current[numericKey];
        }
      });
      return nextValidations;
    });
    void persistLongdoApiKeyConfigs(nextConfigs);
  };

  const validateLongdoApiKeys = useCallback(
    async (showSuccessAlert = false) => {
      const { failedResults, hasAnyKey } = await assessLongdoApiKeys();

      if (!hasAnyKey) {
        Alert.alert(
          'ไม่สำเร็จ',
          'กรุณาระบุ Longdo Map API Key อย่างน้อย 1 ช่อง',
        );
        return false;
      }

      if (failedResults.length > 0) {
        Alert.alert(
          'ตรวจสอบ Longdo API Key',
          failedResults
            .map(item => `ช่องที่ ${item.index + 1}: ${item.result.message}`)
            .join('\n'),
        );
        return false;
      }

      if (showSuccessAlert) {
        Alert.alert('สำเร็จ', 'Longdo Map API Key ใช้งานได้ทั้งหมด');
      }

      return true;
    },
    [assessLongdoApiKeys],
  );

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
        _api_key: null,
        _api_keys: null,
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
      _api_key: selectedService.API_KEY ?? null,
      _api_keys: selectedService.API_KEYS ?? null,
      setService,
      applySelectedService,
    });
  }, [applySelectedService, listServiceSettings, service]);

  useEffect(() => {
    onActionsChange?.({
      canEditService: Boolean(service),
      isLoading: isLoading || isTestingLongdoKeys,
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
    isTestingLongdoKeys,
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
                  top: 0,
                  bottom: 0,
                  right: 12,
                  justifyContent: 'center',
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

        <View style={styles.longdoHeaderRow}>
          <Text style={styles.sectionSubTitle}>Longdo Map API Key</Text>
          {longdoApiKeyConfigs.length < 3 ? (
            <TouchableOpacity
              style={styles.addKeyButton}
              activeOpacity={0.7}
              onPress={onAddLongdoApiKey}
            >
              <AntDesign name="plus" size={14} color={MainTheme.colorPrimary} />
              <Text style={styles.addKeyText}>เพิ่ม</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {longdoApiKeyConfigs.map((apiKeyConfig, index) => {
          const validation = longdoKeyValidations[index];
          const hasError =
            apiKeyConfig.outoflimit ||
            (validation &&
              ['limit', 'invalid', 'error'].includes(validation.status));
          const hasSuccess = validation?.status === 'success';
          const statusText = validation
            ? validation.message
            : !String(apiKeyConfig.key ?? '').trim()
            ? 'ยังไม่ได้กำหนด'
            : apiKeyConfig.outoflimit
            ? 'limit เต็ม'
            : 'ยังไม่ทดสอบ';

          return (
            <View key={`longdo-api-key-${index}`} style={styles.fieldBlock}>
              <View style={styles.keyLabelRow}>
                <Text style={styles.label}>API Key {index + 1}</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => onRemoveLongdoApiKey(index)}
                >
                  <Text style={styles.removeKeyText}>ลบ</Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.inputContainer,
                  hasError ? styles.inputContainerError : null,
                  hasSuccess ? styles.inputContainerSuccess : null,
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={apiKeyConfig.key}
                  onChangeText={value => onChangeLongdoApiKey(index, value)}
                  placeholder="Longdo Map API Key"
                  placeholderTextColor={MainTheme.placeholerTextInput}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <Text
                style={[
                  styles.keyStatusText,
                  hasSuccess
                    ? styles.keySuccessText
                    : hasError
                    ? styles.keyErrorText
                    : styles.keyNeutralText,
                ]}
              >
                {statusText}
              </Text>
            </View>
          );
        })}

        <IActionButton
          title="ทดสอบ API Key"
          variant="secondary"
          disabled={isLoading || isTestingLongdoKeys}
          onPress={() => {
            validateLongdoApiKeys(true).catch(error => {
              setIsTestingLongdoKeys(false);
              Alert.alert(
                'ไม่สำเร็จ',
                error?.message || 'ทดสอบ Longdo API Key ไม่สำเร็จ',
              );
            });
          }}
        />
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
  sectionSubTitle: {
    color: MainTheme.colorQuaternary,
    fontSize: hp('1.75%'),
    fontWeight: '700',
  },
  longdoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 12,
  },
  addKeyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: MainTheme.colorButtonBorder,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: MainTheme.colorSecondary,
  },
  addKeyText: {
    color: MainTheme.colorPrimary,
    fontSize: hp('1.55%'),
    marginLeft: 4,
  },
  keyLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  removeKeyText: {
    color: '#D64545',
    fontSize: hp('1.55%'),
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
    marginTop: 0,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#D8E2DB',
    borderRadius: 14,
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: '#F8FBF9',
  },
  inputContainerError: {
    borderColor: '#D64545',
    backgroundColor: '#FFF7F7',
  },
  inputContainerSuccess: {
    borderColor: MainTheme.colorPrimary,
    backgroundColor: '#F2FBF4',
  },
  input: {
    fontSize: hp('1.7%'),
    color: '#000000',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  keyStatusText: {
    fontSize: hp('1.45%'),
    marginTop: 6,
  },
  keySuccessText: {
    color: MainTheme.colorPrimary,
  },
  keyErrorText: {
    color: '#D64545',
  },
  keyNeutralText: {
    color: '#6E776F',
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
