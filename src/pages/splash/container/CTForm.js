import React from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
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
  getVanConfigV3,
  readCompanyInfoV3,
  systemCheck2
} from '../../../action/setting';
import { registerV3 } from '../../../action/user';
import Navigate from '../../../services/Navigator';
import Request from '../../../utils/Request';
import {
  getLoginInfo,
  getSettingConfig,
  getUserToken,
  removeUserToken,
  setLoginGuID,
  setUserToken
} from '../../../utils/Token';
import Form from '../presenter/Form';

class CTForm extends React.Component {
  _isMounted = false;
  _safeJsonParse = (str) => {
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
    permissions = [
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

  componentDidMount() {
    this._isMounted = true;

    this._checkPermission();
    this._prepareData();
  
  }

  componentWillUnmount() {
    this._isMounted = false;
  }


  _goToAuth = async () => {
    await removeUserToken();
    Navigate.navigate('Auth');
  };

  _prepareData = async () => {
    const setting = await getSettingConfig();
    const loginInfo = await getLoginInfo();
    const rememberedLogin = loginInfo?.rememberPassword ? loginInfo : null;
    const hasSettingConfig = Boolean(
      setting && setting.baseUrl && setting.vanCNFMachine,
    );

    if (!hasSettingConfig) {
      await this._goToAuth();
      return;
    }

    const userCode = rememberedLogin?.USER_CODE ?? null;
    const userPassword = rememberedLogin?.USER_PASSWORD ?? null;

    if (!userCode || !userPassword) {
      await this._goToAuth();
      return;
    }

    if (setting && setting.baseUrl) {
      Request.setBaseUrl(setting.baseUrl);
      Request.setHeaders({
        vanCNFMachine: setting.vanCNFMachine
      });
    }

    await this._getVanConfig(setting.vanCNFMachine, {
      baseUrl: setting.baseUrl,
      vanCNFMachine: setting.vanCNFMachine,
      USER_CODE: userCode,
      USER_PASSWORD: userPassword,
    });
  };

  _getVanConfigV3 = async (BPAPUS_GUID, VANCNF_MACHINE) => {
    try {
      console.log('_getVanConfigV3');
      const response = await this.props.getVanConfigV3(VANCNF_MACHINE);

      // console.log('_getVanConfigV3 ResponseData ', response);
      if (response) {
        const response2 = await this.props.readCompanyInfoV3(BPAPUS_GUID, 0);
        const responseData2 = this._safeJsonParse(response2.ResponseData);
        if (
          response2.ResponseCode == 200 &&
          responseData2 && responseData2.RECORD_COUNT != '0'
        ) {
          const userToken = await getUserToken();
          //console.log('P_getVanConfigV3 userToken ', userToken);
          await setUserToken({
            ...userToken,
            VANCONFIG: response,
            COMPANYINFO: responseData2.READCOMPANYINFO[0],
          });

          await this._setState('progress', 0.2);
          //Navigate.navigate('Home');
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  _getVanConfig = async (vanCNFMachine, configOverride = null) => {
    try {
      console.log('_getVanConfig: ',vanCNFMachine)
      const setting = await getSettingConfig();
      const loginInfo = await getLoginInfo();
      const rememberedLogin = loginInfo?.rememberPassword ? loginInfo : null;
      const activeConfig = configOverride ?? {
        baseUrl: setting?.baseUrl,
        vanCNFMachine: setting?.vanCNFMachine,
        USER_CODE: rememberedLogin?.USER_CODE ?? null,
        USER_PASSWORD: rememberedLogin?.USER_PASSWORD ?? null,
      };

      if (
        !activeConfig.baseUrl ||
        !activeConfig.vanCNFMachine ||
        !activeConfig.USER_CODE ||
        !activeConfig.USER_PASSWORD
      ) {
        await this._goToAuth();
        return;
      }

      Request.setBaseUrl(activeConfig.baseUrl);
      Request.setHeaders({
        vanCNFMachine: activeConfig.vanCNFMachine,
      });

      if (!setting || !setting.baseUrl || !setting.vanCNFMachine) {
        await this._goToAuth();
        return;
      }

      await this.props.systemCheck2({
        baseUrl: activeConfig.baseUrl,
        vanCNFMachine: activeConfig.vanCNFMachine,
        USER_CODE: activeConfig.USER_CODE,
        USER_PASSWORD: activeConfig.USER_PASSWORD
      });

      const response2 = await this.props.registerV3(
        activeConfig.USER_CODE,
        activeConfig.USER_PASSWORD,
      );

      const { ResponseData, ResponseCode } = response2;
      if (ResponseCode == 200) {
        await this._setState(
          'titleProgress',
          'กำลังโหลดข้อมูลการตั้งค่าหน่วยรถ',
        );
        await this._setState('progress', 0.1);

        const responseData = this._safeJsonParse(ResponseData);

        if (!responseData || !responseData.BPAPUS_GUID) {
          await this._goToAuth();
          return;
        }

        await setLoginGuID(responseData.BPAPUS_GUID);
        await this._getVanConfigV3(responseData.BPAPUS_GUID, activeConfig.vanCNFMachine);
        await this._searchCustomerTypeList();
        await this._setState('titleProgress', 'กำลังโหลดข้อมูลการตั้งค่าหน่วยรถ');
        await this._searchMasterDataBankFileList(responseData.BPAPUS_GUID);
        await this._setState('titleProgress','กำลังโหลดข้อมูลการตั้งค่า ข้อมูลธนาคาร');
      } else {
        await this._goToAuth();
      }
    } catch (error) {
      console.log(error);
      await this._goToAuth();
    }
  };

  _searchMasterDataBankFileList = async (GUID) => {
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

      // await this._setVanMovingState(70, 100)

      // this.animatedMoveOnValue.setValue(0)

      // Animated.timing(
      //   this.animatedMoveOnValue,
      //   this._animateMovingConfig
      // ).start(() => this._searchCustomerTypeList())
    } catch (error) {
      console.log(error);
      this._echoError(error);
    }
  };

  _searchCustomerTypeList = async () => {
    try {
      const userToken = await getUserToken();
      //console.log('userToken _searchCustomerTypeList', userToken);
      await this.props.searchCustomerTypeList(
        userToken.VANCONFIG.VANCNF_ENABLE_ALLAR,
      );
      await this._setState('titleProgress', 'กำลังโหลดการตั้งค่าลูกค้า');
      await this._setState('progress', 0.3);
      await this._searchProductCateGoryList();

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
      const userToken = await getUserToken();
      await this.props.searchProductCateGoryList(
        userToken.VANCONFIG.VANCNF_ENABLE_ALLIC,
      );
      await this.props.getArPricetab();
      await this._setState('titleProgress', 'กำลังโหลดการตั้งค่าสินค้า');
      await this._setState('progress', 0.5);
      this._getMasterDataProvinces();

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
      Navigate.navigate('Main');
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
      Navigate.navigate('Main');
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
      (await this.setState((oldState) => {
        return {
          [key]: value,
        };
      }));
  };

  _echoError = async (error) => {
    const msg = error instanceof Error
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
    Navigate.navigate('Auth');
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {
  return {
    getVanConfig: () => dispatch(getVanConfig()),
    getVanConfigV3: (VANCNF_MACHINE) =>
      dispatch(getVanConfigV3(VANCNF_MACHINE)),
    readCompanyInfoV3: (GUID, CMPNY_CODE) =>
      dispatch(readCompanyInfoV3(GUID, CMPNY_CODE)),
    systemCheck2: (data) => dispatch(systemCheck2(data)),
    searchMasterDataBankFileList: (GUID) =>
      dispatch(searchMasterDataBankFileList(GUID)),
    searchCustomerTypeList: (vanCNFEnabledAllar) =>
      dispatch(searchCustomerTypeList(vanCNFEnabledAllar)),
    searchProductCateGoryList: (vanCNFEnabledAllic) =>
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
