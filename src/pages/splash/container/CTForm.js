import React from 'react';
import {
  AppState,
  InteractionManager,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { getArPricetab } from '../../../action/customer';
import { searchCustomerTypeList } from '../../../action/customer-type';
import {
  getMasterDataBankAccounts,
  getMasterDataProvinces,
  getMasterDataWareLocations,
  searchMasterDataBankFileList,
} from '../../../action/masterData';
import { searchProductCateGoryList } from '../../../action/product-category';
import {
  getVanConfig,
  getSaleManV3,
  getVanConfigV3,
  readCompanyInfoV3,
  systemCheck2,
} from '../../../action/setting';
import { registerV3 } from '../../../action/user';
import Navigate from '../../../services/Navigator';
import Request from '../../../utils/Request';
import {
  canAutoLogin,
  getCredentials,
  getSavedUsername,
} from '../../../services/SecureCredentials';
import {
  getLoginGuID,
  getLoginInfo,
  getSettingConfig,
  getUserToken,
  removeUserToken,
  setLoginGuID,
  setSettingConfig,
  setUserToken,
} from '../../../utils/Token';
import Form from '../presenter/Form';

class CTForm extends React.Component {
  _isMounted = false;
  _permissionRetryCount = 0;
  _permissionRetryTimer = null;
  _log = (step, payload = null) => {
    if (payload === null) {
      console.log(`[Splash] ${step}`);
      return;
    }

    console.log(`[Splash] ${step}`, payload);
  };

  _safeJsonParse = str => {
    if (str == null || typeof str !== 'string' || !str.trim()) return null;
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  };

  _animateMovingConfig = {
    toValue: 1,
    duration: 1000,
    // easing: Easing.linear
  };

  constructor(props) {
    super(props);

    this.state = {
      titleProgress: 'กำลังโหลด',
      vanMoving: null,
      errorMessage: null,
      progress: 0.0,
    };
    // this.animatedValue = new Animated.Value(0)
    // this.animatedMoveOnValue = new Animated.Value(0)
  }

  _checkPermission = async () => {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ];

    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple(permissions);
    }
  };

  _requestStartupPermissions = () => {
    if (!this._isMounted || Platform.OS !== 'android') {
      return;
    }

    if (AppState.currentState !== 'active') {
      this._permissionRetryTimer = setTimeout(() => {
        this._requestStartupPermissions();
      }, 300);
      return;
    }

    InteractionManager.runAfterInteractions(async () => {
      if (!this._isMounted) {
        return;
      }

      try {
        await this._checkPermission();
        this._permissionRetryCount = 0;
      } catch (error) {
        const message = error?.message ?? String(error);
        const shouldRetry =
          message.includes('not attached to an Activity') &&
          this._permissionRetryCount < 5;

        this._log('requestStartupPermissions failed', { message, shouldRetry });

        if (!shouldRetry) {
          return;
        }

        this._permissionRetryCount += 1;
        this._permissionRetryTimer = setTimeout(() => {
          this._requestStartupPermissions();
        }, 300);
      }
    });
  };

  componentDidMount() {
    this._isMounted = true;
    this._log('componentDidMount');

    this._requestStartupPermissions();
    this._prepareData();
  }

  componentWillUnmount() {
    this._isMounted = false;

    if (this._permissionRetryTimer) {
      clearTimeout(this._permissionRetryTimer);
      this._permissionRetryTimer = null;
    }
  }

  _replaceRoute = routeName => {
    this._log('replaceRoute', { routeName });
    const navigation = this.props.navigation;

    if (navigation?.replace) {
      navigation.replace(routeName);
      return;
    }

    if (navigation?.reset) {
      navigation.reset({
        index: 0,
        routes: [{ name: routeName }],
      });
      return;
    }

    Navigate.navigate(routeName);
  };

  _goToAuth = async (reason = 'unknown') => {
    this._log('goToAuth', { reason });
    await removeUserToken();
    this._replaceRoute('Auth');
  };

  _getRequiredVanConfig = async () => {
    const userToken = await getUserToken();
    const vanConfig = userToken?.VANCONFIG ?? null;
    this._log('getRequiredVanConfig', {
      hasUserToken: !!userToken,
      hasVanConfig: !!vanConfig,
    });

    if (!vanConfig) {
      throw new Error('VANCONFIG is not available');
    }

    return vanConfig;
  };

  _delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  _getStartupPayloadState = async () => {
    const userToken = await getUserToken();
    const setting = await getSettingConfig();
    const loginGUID = await getLoginGuID();
    const companyInfo = userToken?.COMPANYINFO ?? setting?.COMPANYINFO ?? null;
    const vanConfig = userToken?.VANCONFIG ?? setting?.VANCONFIG ?? null;
    const salesman = userToken?.SALESMAN ?? setting?.SALESMAN ?? null;

    return {
      companyInfo,
      hasCompanyInfo: !!companyInfo?.CMPNY_TCOMPANYNAME,
      hasLoginGUID: !!loginGUID,
      hasSalesman: !!salesman,
      hasVanConfig: !!vanConfig,
      hasVanMachine: !!vanConfig?.VANCNF_MACHINE,
      hasVanRegName: !!vanConfig?.VANCNF_REG_NAME,
      loginGUID,
      salesman,
      vanConfig,
    };
  };

  _isStartupPayloadComplete = payloadState =>
    Boolean(
      payloadState?.hasLoginGUID &&
        payloadState?.hasCompanyInfo &&
        payloadState?.hasVanConfig &&
        payloadState?.hasVanMachine,
    );

  _isRetryableStartupError = error => {
    const message = String(error?.message ?? error ?? '').trim();

    if (!message) {
      return true;
    }

    if (
      /timeout of \d+ms exceeded/i.test(message) ||
      /network error/i.test(message) ||
      /not login/i.test(message) ||
      /vanconfig/i.test(message) ||
      /companyinfo/i.test(message) ||
      /salesman/i.test(message) ||
      /incomplete startup payload/i.test(message)
    ) {
      return true;
    }

    if (
      /user id not found or wrong password/i.test(message) ||
      /บัญชีผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง/i.test(message) ||
      /609/.test(message)
    ) {
      return false;
    }

    return true;
  };

  _runStartupRelogin = async (setting, rememberedLogin) => {
    const userCode = rememberedLogin?.USER_CODE ?? null;
    const userPassword = rememberedLogin?.USER_PASSWORD ?? null;

    if (!userCode || !userPassword) {
      throw new Error('missing remembered credentials');
    }

    return this._getVanConfig(setting.vanCNFMachine, {
      baseUrl: setting.baseUrl,
      vanCNFMachine: setting.vanCNFMachine,
      USER_CODE: userCode,
      USER_PASSWORD: userPassword,
    });
  };

  _retryStartupRelogin = async (setting, rememberedLogin) => {
    const maxAttempts = 3;
    let attempt = 0;

    while (this._isMounted && attempt < maxAttempts) {
      attempt += 1;
      try {
        await this._setState(
          'titleProgress',
          `กำลังเข้าสู่ระบบอัตโนมัติ ครั้งที่ ${attempt}`,
        );
        await this._setState('errorMessage', null);
        const payloadState = await this._runStartupRelogin(
          setting,
          rememberedLogin,
        );

        if (!this._isStartupPayloadComplete(payloadState)) {
          this._log('startupRelogin:incompletePayload', payloadState);
          throw new Error('incomplete startup payload');
        }

        console.log('payloadState', payloadState);

        this._log('startupRelogin:success', {
          attempt,
          hasCompanyInfo: payloadState.hasCompanyInfo,
          hasSalesman: payloadState.hasSalesman,
          hasVanConfig: payloadState.hasVanConfig,
        });
        this._replaceRoute('Main');
        return;
      } catch (error) {
        const retryable = this._isRetryableStartupError(error);
        this._log('startupRelogin:error', {
          attempt,
          message: error?.message ?? String(error),
          retryable,
        });

        if (!retryable) {
          await this._goToAuth(error?.message ?? 'startup relogin failed');
          return;
        }

        await this._setState(
          'titleProgress',
          `ข้อมูลยังไม่ครบ กำลังลองใหม่ ครั้งที่ ${attempt + 1}`,
        );
        await this._setState(
          'errorMessage',
          `กำลังลองใหม่อัตโนมัติ ครั้งที่ ${attempt + 1}`,
        );
        await this._delay(Math.min(2000 * attempt, 10000));
      }
    }

    if (this._isMounted) {
      await this._setState('titleProgress', 'เข้าสู่ระบบอัตโนมัติไม่สำเร็จ');
      await this._setState(
        'errorMessage',
        'เข้าสู่ระบบอัตโนมัติไม่สำเร็จ กรุณาเข้าสู่ระบบอีกครั้ง',
      );
      await this._goToAuth('startup relogin exceeded retry limit');
    }
  };

  _restoreCachedSession = async setting => {
    const userToken = await getUserToken();
    const cachedVanConfig = userToken?.VANCONFIG ?? setting?.VANCONFIG ?? null;

    this._log('restoreCachedSession:start', {
      hasUserToken: !!userToken,
      hasUserTokenVanConfig: !!userToken?.VANCONFIG,
      hasSettingVanConfig: !!setting?.VANCONFIG,
      hasSettingSalesman: !!setting?.SALESMAN,
    });

    if (!cachedVanConfig) {
      this._log('restoreCachedSession:skip', { reason: 'no cached VANCONFIG' });
      return false;
    }

    await setUserToken({
      ...(userToken ?? {}),
      SALESMAN: userToken?.SALESMAN ?? setting?.SALESMAN ?? null,
      VANCONFIG: cachedVanConfig,
      COMPANYINFO: userToken?.COMPANYINFO ?? setting?.COMPANYINFO ?? null,
    });

    this._log('restoreCachedSession:done', {
      restoredSalesman: !!(userToken?.SALESMAN ?? setting?.SALESMAN),
      restoredCompanyInfo: !!userToken?.COMPANYINFO,
    });

    return true;
  };

  _hasCachedRememberedSession = async (credentials, setting) => {
    const userToken = await getUserToken();
    const result = Boolean(
      credentials?.username &&
        credentials?.password &&
        (userToken?.VANCONFIG || setting?.VANCONFIG),
    );
    this._log('hasCachedRememberedSession', {
      result,
      hasCredentials: !!credentials,
      hasUser: !!credentials?.username,
      hasPassword: !!credentials?.password,
      hasUserTokenVanConfig: !!userToken?.VANCONFIG,
      hasSettingVanConfig: !!setting?.VANCONFIG,
    });
    return result;
  };

  _prepareData = async () => {
    const setting = await getSettingConfig();
    const autoLogin = await canAutoLogin();
    const credentials = autoLogin ? await getCredentials() : null;
    const hasSettingConfig = Boolean(
      setting && setting.baseUrl && setting.vanCNFMachine,
    );

    this._log('prepareData:start', {
      hasSetting: !!setting,
      hasBaseUrl: !!setting?.baseUrl,
      hasVanCNFMachine: !!setting?.vanCNFMachine,
      hasSettingVanConfig: !!setting?.VANCONFIG,
      canAutoLogin: autoLogin,
      hasCredentials: !!credentials,
    });

    if (!hasSettingConfig) {
      await this._goToAuth('missing setting config');
      return;
    }

    if (setting && setting.baseUrl) {
      Request.setBaseUrl(setting.baseUrl);
      Request.setHeaders({
        vanCNFMachine: setting.vanCNFMachine,
      });
    }

    const userCode =
      (await getSavedUsername()) || credentials?.username || null;
    const userPassword = credentials?.password ?? null;

    if (!userCode || !userPassword) {
      await this._goToAuth('missing credentials or auto-login disabled');
      return;
    }

    const rememberedLogin = {
      USER_CODE: userCode,
      USER_PASSWORD: userPassword,
    };

    this._log('prepareData:forcedRelogin', {
      hasUserCode: !!userCode,
      hasUserPassword: !!userPassword,
    });

    await this._retryStartupRelogin(setting, rememberedLogin);
  };

  _getVanConfigV3 = async (BPAPUS_GUID, VANCNF_MACHINE) => {
    try {
      this._log('getVanConfigV3:start', { BPAPUS_GUID, VANCNF_MACHINE });
      const response = await this.props.getVanConfigV3(VANCNF_MACHINE);
      const currentSetting = await getSettingConfig();
      const userToken = await getUserToken();

      const response2 = await this.props.readCompanyInfoV3(BPAPUS_GUID, 0);
      const responseData2 = this._safeJsonParse(response2.ResponseData);
      const companyInfo =
        response2.ResponseCode == 200 &&
        responseData2 &&
        responseData2.RECORD_COUNT != '0'
          ? responseData2.READCOMPANYINFO[0]
          : userToken?.COMPANYINFO ?? currentSetting?.COMPANYINFO ?? null;

      const nextVanConfig =
        response ?? userToken?.VANCONFIG ?? currentSetting?.VANCONFIG ?? null;
      let salesman = userToken?.SALESMAN ?? currentSetting?.SALESMAN ?? null;

      if (BPAPUS_GUID && nextVanConfig?.VANCNF_SLMN) {
        try {
          const salesmanResponse = await this.props.getSaleManV3(
            BPAPUS_GUID,
            nextVanConfig.VANCNF_SLMN,
          );
          const salesmanData = this._safeJsonParse(
            salesmanResponse?.ResponseData,
          );

          if (
            salesmanResponse?.ResponseCode == 200 &&
            salesmanData &&
            salesmanData.RECORD_COUNT != '0'
          ) {
            salesman = salesmanData.SL000130?.[0] ?? salesman;
          }
        } catch (salesmanError) {
          this._log('getVanConfigV3:salesmanError', {
            message: salesmanError?.message ?? String(salesmanError),
          });
        }
      }

      if (nextVanConfig || companyInfo) {
        await setUserToken({
          ...(userToken ?? {}),
          SALESMAN: salesman,
          VANCONFIG: nextVanConfig,
          COMPANYINFO: companyInfo,
        });

        if (currentSetting) {
          await setSettingConfig({
            ...currentSetting,
            SALESMAN: salesman,
            VANCONFIG: nextVanConfig,
            COMPANYINFO: companyInfo,
          });
        }

        await this._setState('progress', 0.2);
        this._log('getVanConfigV3:success', {
          hasCompanyInfo: !!companyInfo,
          hasVanConfig: !!nextVanConfig,
        });
      }
    } catch (error) {
      this._log('getVanConfigV3:error', {
        message: error?.message ?? String(error),
      });
    }
  };
  _getVanConfig = async (
    vanCNFMachine,
    configOverride = null,
    options = {},
  ) => {
    try {
      const { allowAuthRedirect = true } = options;
      this._log('getVanConfig:start', {
        vanCNFMachine,
        allowAuthRedirect,
      });
      const setting = await getSettingConfig();
      const credentials = await getCredentials();
      const activeConfig = configOverride ?? {
        baseUrl: setting?.baseUrl,
        vanCNFMachine: setting?.vanCNFMachine,
        USER_CODE: credentials?.username ?? null,
        USER_PASSWORD: credentials?.password ?? null,
      };

      if (
        !activeConfig.baseUrl ||
        !activeConfig.vanCNFMachine ||
        !activeConfig.USER_CODE ||
        !activeConfig.USER_PASSWORD
      ) {
        this._log('getVanConfig:invalidActiveConfig', {
          hasBaseUrl: !!activeConfig.baseUrl,
          hasVanCNFMachine: !!activeConfig.vanCNFMachine,
          hasUserCode: !!activeConfig.USER_CODE,
          hasUserPassword: !!activeConfig.USER_PASSWORD,
        });
        throw new Error('invalid active config');
      }

      Request.setBaseUrl(activeConfig.baseUrl);
      Request.setHeaders({
        vanCNFMachine: activeConfig.vanCNFMachine,
      });

      if (!setting || !setting.baseUrl || !setting.vanCNFMachine) {
        this._log('getVanConfig:invalidStoredSetting', {
          hasSetting: !!setting,
          hasBaseUrl: !!setting?.baseUrl,
          hasVanCNFMachine: !!setting?.vanCNFMachine,
        });
        throw new Error('invalid stored setting');
      }

      await this.props.systemCheck2({
        baseUrl: activeConfig.baseUrl,
        vanCNFMachine: activeConfig.vanCNFMachine,
        USER_CODE: activeConfig.USER_CODE,
        USER_PASSWORD: activeConfig.USER_PASSWORD,
      });

      const response2 = await this.props.registerV3(
        activeConfig.USER_CODE,
        activeConfig.USER_PASSWORD,
      );

      const { ResponseData, ResponseCode } = response2;
      this._log('getVanConfig:registerResult', { ResponseCode });
      if (ResponseCode == 200) {
        await this._setState(
          'titleProgress',
          'กำลังโหลดข้อมูลการตั้งค่าหน่วยรถ',
        );
        await this._setState('progress', 0.1);

        const responseData = this._safeJsonParse(ResponseData);
        this._log('getVanConfig:registerParsed', {
          hasResponseData: !!responseData,
          hasBPAPUS_GUID: !!responseData?.BPAPUS_GUID,
        });

        if (!responseData || !responseData.BPAPUS_GUID) {
          throw new Error('missing BPAPUS_GUID after register');
        }

        await setLoginGuID(responseData.BPAPUS_GUID);
        await this._getVanConfigV3(
          responseData.BPAPUS_GUID,
          activeConfig.vanCNFMachine,
        );

        const payloadState = await this._getStartupPayloadState();
        const vanConfig = payloadState.vanConfig;
        this._log('getVanConfig:afterVanConfigV3', {
          hasVanConfig: !!vanConfig,
          VANCNF_MACHINE: vanConfig?.VANCNF_MACHINE ?? null,
          hasCompanyInfo: payloadState.hasCompanyInfo,
          hasSalesman: payloadState.hasSalesman,
        });

        await this._searchCustomerTypeList();
        await this._searchProductCateGoryList();
        await this._setState(
          'titleProgress',
          'กำลังโหลดข้อมูลการตั้งค่าหน่วยรถ',
        );
        await this._searchMasterDataBankFileList(responseData.BPAPUS_GUID);
        await this._setState(
          'titleProgress',
          'กำลังโหลดข้อมูลการตั้งค่า ข้อมูลธนาคาร',
        );

        return await this._getStartupPayloadState();
      } else {
        throw new Error(`register failed (${ResponseCode})`);
      }
    } catch (error) {
      this._log('getVanConfig:error', {
        message: error?.message ?? String(error),
      });

      throw error;
    }
  };

  _searchMasterDataBankFileList = async GUID => {
    try {
      // console.log("GUID >>>>> " , GUID);
      await this.props.searchMasterDataBankFileList(GUID);
      await this._setState('titleProgress', 'กำลังโหลดการตั้งค่าธนาคาร');
      await this._setState('progress', 0.3);
      // console.log("GUID >>>>> " , 2);
      //this._getMasterDataBankAccounts();
      // console.log("GUID >>>>> " , 3);
      // await this._setVanMovingState(35, 70)
      // this.animatedMoveOnValue.setValue(0)

      // Animated.timing(
      //   this.animatedMoveOnValue,
      //   this._animateMovingConfig
      // ).start(() => this._getMasterDataBankAccounts())
    } catch (error) {
      console.log(error);
      this._echoError(error);
    }
  };

  _getMasterDataBankAccounts = async () => {
    try {
      await this.props.getMasterDataBankAccounts();
      await this._setState('titleProgress', 'กำลังโหลดการตั้งค่าธนาคาร');
      await this._searchCustomerTypeList();
      await this._setState('progress', 0.4);
    } catch (error) {
      console.log(error);
      this._echoError(error);
    }
  };

  _searchCustomerTypeList = async () => {
    try {
      const vanConfig = await this._getRequiredVanConfig().catch(() => null);
      if (!vanConfig) return;
      await this.props.searchCustomerTypeList(vanConfig.VANCNF_ENABLE_ALLAR);
      await this._setState('titleProgress', 'กำลังโหลดการตั้งค่าลูกค้า');
      await this._setState('progress', 0.3);

      // await this._setVanMovingState(100, 175)

      // this.animatedMoveOnValue.setValue(0)

      // Animated.timing(
      //   this.animatedMoveOnValue,
      //   this._animateMovingConfig
      // ).start(() => this._searchProductCateGoryList())
    } catch (error) {
      console.log(error);
      this._echoError(error);
    }
  };

  _searchProductCateGoryList = async () => {
    try {
      const vanConfig = await this._getRequiredVanConfig().catch(() => null);
      if (!vanConfig) return;
      await this.props.searchProductCateGoryList(vanConfig.VANCNF_ENABLE_ALLIC);
      await this.props.getArPricetab();
      await this._setState('titleProgress', 'กำลังโหลดการตั้งค่าสินค้า');
      await this._setState('progress', 0.5);

      // await this._setVanMovingState(175, 220)

      // this.animatedMoveOnValue.setValue(0)

      // Animated.timing(
      //   this.animatedMoveOnValue,
      //   this._animateMovingConfig
      // ).start(() => this._getMasterDataProvinces())
    } catch (error) {
      console.log(error);
      this._echoError(error);
    }
  };

  _getMasterDataProvinces = async () => {
    try {
      //console.log('_getMasterDataProvinces');
      await this._setState('progress', 0.8);
      await this.props.getMasterDataProvinces();
      await this._setState('titleProgress', 'กำลังโหลดการตั้งค่าจังหวัด');
      await this._setState('progress', 1);

      //this._getMasterDataWareLocations();

      // await this._setVanMovingState(220, 270)

      // this.animatedMoveOnValue.setValue(0)

      // Animated.timing(
      //   this.animatedMoveOnValue,
      //   this._animateMovingConfig
      // ).start(() => this._getMasterDataWareLocations())
    } catch (error) {
      console.log(error);
      this._echoError(error);
    }
  };

  _getMasterDataWareLocations = async () => {
    try {
      console.log('_getMasterDataWareLocations1 ');
      await this.props.getMasterDataWareLocations();
      console.log('_getMasterDataWareLocations2 ');
      await this._setState('titleProgress', 'กำลังโหลดการตั้งค่าจุดรับสินค้า');
      await this._setState('progress', 1);
      // await this._setVanMovingState(270, 310)

      // this.animatedMoveOnValue.setValue(0)

      // Animated.timing(
      //   this.animatedMoveOnValue,
      //   this._animateMovingConfig
      // ).start(() => Navigate.navigate('Home'))
    } catch (error) {
      console.log(error);
      this._echoError(error);
      // this._echoError()
    }
  };

  _setVanMovingState = async (start, end) => {
    const animate = this.animatedMoveOnValue.interpolate({
      inputRange: [0, 1],
      outputRange: [start, end],
    });

    await this._setState('vanMoving', animate);
  };

  _setState = async (key, value) => {
    this._isMounted &&
      (await this.setState(oldState => {
        return {
          [key]: value,
        };
      }));
  };

  _echoError = async error => {
    const msg =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
        ? error
        : error != null
        ? String(error)
        : null;
    await this._setState(
      'errorMessage',
      msg ? msg : 'ไม่สามารถเชื่อมต่อระบบได้',
    );
  };

  _refresh = async () => {
    await this._setState('progress', 0.0);
    await this._setState('errorMessage', null);
    this._prepareData();
  };

  _goToScreen = () => {
    this._replaceRoute('Auth');
  };

  render() {
    return (
      <Form
        progress={this.state.progress}
        titleProgress={this.state.titleProgress}
        // movingUpDown={movingUpDown}
        // vanMoving={this.state.vanMoving}
        errorMessage={this.state.errorMessage}
        refresh={this._refresh}
        goToScreen={this._goToScreen}
      />
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return {
    getVanConfig: () => dispatch(getVanConfig()),
    getSaleManV3: (GUID, SLMN_KEY) => dispatch(getSaleManV3(GUID, SLMN_KEY)),
    getVanConfigV3: VANCNF_MACHINE => dispatch(getVanConfigV3(VANCNF_MACHINE)),
    readCompanyInfoV3: (GUID, CMPNY_CODE) =>
      dispatch(readCompanyInfoV3(GUID, CMPNY_CODE)),
    systemCheck2: data => dispatch(systemCheck2(data)),
    searchMasterDataBankFileList: GUID =>
      dispatch(searchMasterDataBankFileList(GUID)),
    searchCustomerTypeList: vanCNFEnabledAllar =>
      dispatch(searchCustomerTypeList(vanCNFEnabledAllar)),
    searchProductCateGoryList: vanCNFEnabledAllic =>
      dispatch(searchProductCateGoryList(vanCNFEnabledAllic)),
    getMasterDataProvinces: () => dispatch(getMasterDataProvinces()),
    getMasterDataBankAccounts: () => dispatch(getMasterDataBankAccounts()),
    getMasterDataWareLocations: () => dispatch(getMasterDataWareLocations()),
    registerV3: (username, password) =>
      dispatch(registerV3(username, password)),
    getArPricetab: () => dispatch(getArPricetab()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTForm);
