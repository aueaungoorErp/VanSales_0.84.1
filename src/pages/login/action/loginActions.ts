import { findMemberNameV3Api, newMemberV3Api } from '../../../action/member';
import { strings } from '../../../locales/i18n';
import {
  clearPassword,
  getCredentials,
  getIsRemember,
  getSavedUsername,
  saveCredentials,
  setIsRemember,
  setSavedUsername,
} from '../../../services/SecureCredentials';
import Navigator from '../../../services/Navigator';
import {
  getDeviceUniqeId,
  getListServiceSetting,
  getLoginInfo,
  getSettingConfig,
  getUserToken,
  setAccessTimeToken,
  setLoginGuID,
  setLoginInfo,
  setSettingConfig,
  setUserToken,
} from '../../../utils/Token';

// ── Types ──

export type ServiceSetting = {
  value: string;
  label: string;
  number?: string;
  vanCNFMachine?: string;
  USER_CODE?: string;
  USER_PASSWORD?: string;
  API_KEY?: string;
  API_KEYS?: string[];
  webURL?: string;
  baseUrl?: string;
  baseURL?: string;
  serviceName?: string;
};

export type RawServiceSetting = Partial<ServiceSetting>;

export type UserLogin = {
  service: string | null;
  USER_CODE: string | null;
  USER_PASSWORD: string | null;
};

export type LoginDeps = {
  systemCheck2: (data: {
    baseUrl: string;
    vanCNFMachine: string;
    USER_CODE: string;
    USER_PASSWORD: string;
  }) => Promise<any>;
  registerV3: (username: string, password: string) => Promise<any>;
  getVanConfigV3: (machine: string) => Promise<any>;
  readCompanyInfoV3: (guid: string, companyCode: number) => Promise<any>;
  searchCustomerTypeList: (enabledAllAr: any) => Promise<any>;
  searchProductCateGoryList: (enabledAllIc: any) => Promise<any>;
  getMasterDataProvinces: () => Promise<any>;
  getArPricetab: () => Promise<any>;
};

// ── Utilities ──

export const safeJsonParse = (str: any) => {
  if (str == null || typeof str !== 'string' || !str.trim()) {
    return null;
  }

  try {
    return JSON.parse(str);
  } catch (_error) {
    return null;
  }
};

export const normalizeServiceSettings = (
  items: RawServiceSetting[] = [],
): ServiceSetting[] => {
  return items.map((item, index) => {
    const value = String(
      item?.value ??
        item?.number ??
        item?.serviceName ??
        item?.vanCNFMachine ??
        item?.USER_CODE ??
        index,
    );

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

// ── API helpers ──

export const fetchVanConfig = async (
  BPAPUS_GUID: string,
  VANCNF_MACHINE: string,
  deps: Pick<LoginDeps, 'getVanConfigV3' | 'readCompanyInfoV3'>,
) => {
  try {
    const [response, currentSetting, userToken, response2] = await Promise.all([
      deps.getVanConfigV3(VANCNF_MACHINE),
      getSettingConfig(),
      getUserToken(),
      deps.readCompanyInfoV3(BPAPUS_GUID, 0),
    ]);

    const responseData2 = safeJsonParse(response2.ResponseData);
    const companyInfo =
      response2.ResponseCode == 200 &&
      responseData2 &&
      responseData2.RECORD_COUNT != '0'
        ? responseData2.READCOMPANYINFO[0]
        : userToken?.COMPANYINFO ?? currentSetting?.COMPANYINFO ?? null;
    const nextVanConfig =
      response ?? userToken?.VANCONFIG ?? currentSetting?.VANCONFIG ?? null;

    if (nextVanConfig || companyInfo) {
      await setUserToken({
        ...(userToken ?? {}),
        SALESMAN: userToken?.SALESMAN ?? currentSetting?.SALESMAN ?? null,
        VANCONFIG: nextVanConfig,
        COMPANYINFO: companyInfo,
      });

      if (currentSetting) {
        await setSettingConfig({
          ...currentSetting,
          VANCONFIG: nextVanConfig,
          SALESMAN: userToken?.SALESMAN ?? currentSetting?.SALESMAN ?? null,
          COMPANYINFO: companyInfo,
        });
      }
    }
  } catch (error) {
    console.log('_getVanConfigV3 error', error);
  }
};

export const fetchCustomerTypeList = async (
  deps: Pick<LoginDeps, 'searchCustomerTypeList'>,
) => {
  try {
    const userToken = await getUserToken();
    const vanConfig = userToken?.VANCONFIG;
    if (!vanConfig) {
      console.log('[Login] _searchCustomerTypeList skipped: missing VANCONFIG');
      return;
    }
    await deps.searchCustomerTypeList(vanConfig.VANCNF_ENABLE_ALLAR);
  } catch (error) {
    console.log(error);
  }
};

export const fetchProductCategoryList = async (
  deps: Pick<LoginDeps, 'searchProductCateGoryList'>,
) => {
  try {
    const userToken = await getUserToken();
    const vanConfig = userToken?.VANCONFIG;
    if (!vanConfig) {
      console.log(
        '[Login] _searchProductCateGoryList skipped: missing VANCONFIG',
      );
      return;
    }
    await deps.searchProductCateGoryList(vanConfig.VANCNF_ENABLE_ALLIC);
  } catch (error) {
    console.log(error);
  }
};

export const fetchMasterDataProvinces = async (
  deps: Pick<LoginDeps, 'getMasterDataProvinces'>,
) => {
  try {
    await deps.getMasterDataProvinces();
  } catch (error) {
    console.log(error);
  }
};

export const fetchArPricetab = async (
  deps: Pick<LoginDeps, 'getArPricetab'>,
) => {
  try {
    await deps.getArPricetab();
  } catch (error) {
    console.log(error);
  }
};

export const ensureDeviceRegistrationForLogin = async (
  vanCNFMachine: string,
  loginGuid: string,
) => {
  const uniqueId = await getDeviceUniqeId();
  const responsemember = await findMemberNameV3Api(vanCNFMachine, loginGuid);
  const responseMemberData =
    typeof responsemember?.ResponseData === 'string' &&
    responsemember.ResponseData.trim()
      ? safeJsonParse(responsemember.ResponseData)
      : responsemember?.ResponseData;
  const existingMember = Array.isArray(responseMemberData?.Mb000130)
    ? responseMemberData.Mb000130[0]
    : null;

  console.log('[Login] device check', {
    uniqueId,
    MB_E_NAME: existingMember?.MB_E_NAME ?? null,
  });

  const existingMemberCount = Number(responseMemberData?.RECORD_COUNT ?? 0);

  if (
    responsemember.ResponseCode == 200 &&
    responsemember.ReasonString === 'Completed' &&
    existingMemberCount > 0
  ) {
    if (existingMember?.MB_E_NAME !== uniqueId) {
      throw new Error('duplicateUser');
    }

    return;
  }

  if (responsemember.ReasonString !== 'Not Login') {
    try {
      const responseNewmember = await newMemberV3Api(
        vanCNFMachine,
        loginGuid,
        uniqueId,
      );

      if (
        responseNewmember.ResponseCode == 200 &&
        safeJsonParse(responseNewmember.ResponseData)?.RECORD_COUNT > 0
      ) {
      }
    } catch (error) {
      console.log('newMemberV3Api error', error);
    }
  }
};

// ── Fetch initial data ──

export type FetchDataResult = {
  serviceSettings: ServiceSetting[];
  userLogin: UserLogin;
  isRemember: boolean;
};

export const fetchLoginData = async (): Promise<FetchDataResult> => {
  const rawServices = await getListServiceSetting();
  const normalizedList = normalizeServiceSettings(
    Array.isArray(rawServices) ? rawServices : [],
  );

  const isRemember = await getIsRemember();
  const savedUsername = await getSavedUsername();
  const credentials = isRemember ? await getCredentials() : null;
  const restoredUsername = credentials?.username ?? savedUsername ?? '';
  const restoredPassword = credentials?.password ?? '';

  const loginInfo = await getLoginInfo();

  let settingConfig: any = null;
  try {
    settingConfig = await getSettingConfig();
    if (settingConfig === false) {
      settingConfig = null;
    }
  } catch (_) {}

  let selectedService: string | null = null;

  // Priority 1: Match from loginInfo.service because it tracks the latest
  // explicit service selection from the login flow.
  if (loginInfo?.service) {
    const matched = normalizedList.find(
      item =>
        item.value === loginInfo.service || item.number === loginInfo.service,
    );
    if (matched) {
      selectedService = matched.value;
    }
  }

  // Priority 2: Match from settingConfig when there is no newer login selection.
  if (!selectedService && settingConfig?.vanCNFMachine) {
    const matched = normalizedList.find(
      item =>
        item.number === settingConfig.vanCNFMachine ||
        item.value === settingConfig.vanCNFMachine,
    );
    if (matched) {
      selectedService = matched.value;
    }
  }

  // Priority 3: Fallback to first item
  if (!selectedService) {
    selectedService = normalizedList?.[0]?.value ?? null;
  }

  return {
    serviceSettings: normalizedList,
    userLogin: {
      service: selectedService,
      USER_CODE: restoredUsername,
      USER_PASSWORD: restoredPassword,
    },
    isRemember,
  };
};

// ── Main login flow ──

export type LoginCallbacks = {
  setErrorMessage: (msg: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  onLoginSuccess?: (payload: {
    service: string | null;
    USER_CODE: string;
    USER_PASSWORD: string;
  }) => Promise<void> | void;
};

export const performLogin = async (
  userLogin: UserLogin,
  isRememberPassword: boolean,
  deps: LoginDeps,
  callbacks: LoginCallbacks,
) => {
  const { setErrorMessage, setIsLoading } = callbacks;

  try {
    setErrorMessage(null);

    const { service, USER_CODE, USER_PASSWORD } = userLogin;
    if (service === null || service.trim() === '') {
      setErrorMessage('กรุณาตั้งค่า Service');
      return;
    }

    if (USER_CODE === null || USER_CODE.trim() === '') {
      setErrorMessage(strings('error.username_is_required'));
      return;
    }

    if (USER_PASSWORD === null || USER_PASSWORD.trim() === '') {
      setErrorMessage(strings('error.password_is_required'));
      return;
    }

    setIsLoading(true);

    const rawSetting = await getListServiceSetting();
    const setting = normalizeServiceSettings(
      Array.isArray(rawSetting) ? rawSetting : [],
    );
    const selectedSetting =
      setting.find((item: any) => item?.value === service) ||
      setting.find((item: any) => item?.number === service) ||
      null;

    if (!selectedSetting?.webURL || !selectedSetting?.number) {
      setIsLoading(false);
      setErrorMessage('ไม่พบข้อมูล Service ที่เลือก');
      return;
    }

    if (USER_CODE && USER_PASSWORD && setting && setting.length > 0) {
      const baseURL = selectedSetting.webURL;
      const vanCNFMachine = selectedSetting.number;

      const response = await deps.systemCheck2({
        baseUrl: baseURL,
        vanCNFMachine,
        USER_CODE,
        USER_PASSWORD,
      });

      const responseData = safeJsonParse(response.ResponseData);
      if (
        response.ResponseCode == 200 &&
        response.ReasonString == 'Completed'
      ) {
        const registerResponse = await deps.registerV3(
          USER_CODE,
          USER_PASSWORD,
        );
        const { ResponseData } = registerResponse;
        const registerResponseData = safeJsonParse(ResponseData);
        if (!registerResponseData || !registerResponseData.BPAPUS_GUID) {
          setErrorMessage('ข้อมูลการลงทะเบียนไม่ถูกต้อง');
          return;
        }
        await ensureDeviceRegistrationForLogin(
          vanCNFMachine,
          registerResponseData.BPAPUS_GUID,
        );

        await setLoginGuID(registerResponseData.BPAPUS_GUID);
        await fetchVanConfig(
          registerResponseData.BPAPUS_GUID,
          vanCNFMachine,
          deps,
        );

        // Sync settingConfig so the splash screen uses the same service
        // that was actually logged in (e.g. fingerprint login may differ
        // from the service currently shown in settings).
        const currentSettingConfig = await getSettingConfig();
        if (currentSettingConfig) {
          await setSettingConfig({
            ...currentSettingConfig,
            baseUrl: baseURL,
            vanCNFMachine,
          });
        }

        if (isRememberPassword) {
          await Promise.all([
            saveCredentials(USER_CODE, USER_PASSWORD),
            setIsRemember(true),
            setLoginInfo({ service: userLogin.service }),
          ]);
        } else {
          await Promise.all([
            setSavedUsername(USER_CODE),
            clearPassword(),
            setIsRemember(false),
            setLoginInfo({ service: userLogin.service }),
          ]);
        }

        await Promise.all([
          fetchCustomerTypeList(deps),
          fetchProductCategoryList(deps),
        ]);
        await setAccessTimeToken(Date.now().toString());
        Navigator.navigate('Main');

        // Dispatch onLoginSuccess AFTER navigating to Main so any modal
        // (e.g. "enable biometrics?") appears on Home, not Login.
        if (callbacks.onLoginSuccess) {
          await callbacks.onLoginSuccess({
            service: userLogin.service,
            USER_CODE,
            USER_PASSWORD,
          });
        }
        return;
      } else if (responseData?.RECORD_COUNT == 0) {
        setErrorMessage('ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง');
      }

      await fetchMasterDataProvinces(deps);
      await fetchArPricetab(deps);
    } else {
      setErrorMessage('ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง');
    }
  } catch (error: any) {
    let errret: any = '';
    console.log('oooooo ....', error);

    const errorText = String(error?.message ?? error ?? '').trim();
    const isTimeoutError =
      /timeout of \d+ms exceeded/i.test(errorText) ||
      (error && error.code === 'ECONNABORTED');

    if (isTimeoutError) {
      errret = 'timeout';
    } else {
      switch (errorText) {
        case 'User ID Not found or wrong password':
        case 'บัญชีผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง':
          errret = '609';
          break;
        case 'Not Login':
          errret = '610';
          break;
        case 'UnRegister Machine':
          errret = '608';
          break;
        case 'เครื่องเกินขีดจำกัด':
          errret = '607';
          break;
        case 'เกิดข้อผิดพลาด รหัส 503':
          errret = '503';
          break;
        case 'duplicateUser':
          errret = 'duplicateUser';
          break;
        default:
          errret = error;
          break;
      }
    }

    console.log('oooooo errret ....', errret);
    if (errret != '') {
      try {
        setErrorMessage(strings('error_ser.' + errret));
      } catch (nextError) {
        setErrorMessage('เกิดข้อผิดพลาด' + nextError);
      }
    }
  } finally {
    setIsLoading(false);
  }
};
