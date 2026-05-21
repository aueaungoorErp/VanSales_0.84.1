import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getMasterDataProvinces,
  searchMasterDataBankFileList,
} from '../../../action/masterData';
import {
  findMemberNameV3Api,
  newMemberV3Api
} from '../../../action/member';
import { login, registerV3, toggleRememberPassword } from '../../../action/user';
import { strings } from '../../../locales/i18n';
import Navigator from '../../../services/Navigator';
import {
  getDeviceUniqeId,
  getListServiceSetting,
  getSettingConfig,
  getUserToken,
  removeLoginInfo,
  setLoginGuID,
  setLoginInfo,
  setSettingConfig,
  setUserToken
} from '../../../utils/Token';
import Form from '../presenter/Form';

import { getArPricetab } from '../../../action/customer';
import { searchCustomerTypeList } from '../../../action/customer-type';
import { searchProductCateGoryList } from '../../../action/product-category';
import {
  getVanConfigV3,
  readCompanyInfoV3,
  systemCheck2
} from '../../../action/setting';

class CTForm extends Component {
  _safeJsonParse = (str) => {
    if (str == null || typeof str !== 'string' || !str.trim()) return null;
    try { return JSON.parse(str); } catch (e) { return null; }
  };

  constructor(props) {
    super(props);

    this.state = {
      userLogin: {
        service: null,
        USER_CODE: null,
        USER_PASSWORD: null,
      },
      isLoading: false,
      errorMessage: null,
      isRememberPassword: false,
      isShowPassword: false,
      config: null,
    };
  }

  toggleRememberPassword = async () => {
    this.setState((oldState) => {
      return {
        isRememberPassword: !oldState.isRememberPassword,
      };
    });
  };

  toggleShowPassword = async () => {
    this.setState((oldState) => {
      return {
        isShowPassword: !oldState.isShowPassword,
      };
    });
  };

  _setService = (value) => {
    this.setState((oldState) => ({
      userLogin: { ...oldState.userLogin, service: value }
    }));
  };

  _setUserName = (value) => {
    this.setState((oldState) => {
      return {
        userLogin: {
          ...oldState.userLogin,
          USER_CODE: value,
        },
      };
    });
  };

  _setPassword = (value) => {
    this.setState((oldState) => {
      return {
        userLogin: {
          ...oldState.userLogin,
          USER_PASSWORD: value,
        },
      };
    });
  };
  _setIsRememberPassword = (isRememberPassword) => {
    this.setState((oldState) => {
      return {
        isRememberPassword: isRememberPassword,
      };
    });
  };

  _getWSv3SettingConfig = async () => {
    const config = await getSettingConfig();
    console.log('configaaa',config)
    if (config) {
      this.setState((oldState) => {
        return {
          config: config,
        };
      });
    }
  };

  async _onLogin() {
    try {
      this._setErrorMessage(null);

      let { service, USER_CODE, USER_PASSWORD } = this.state.userLogin;
      console.log('serviceaaa', service);
      if (service === null || service.trim() === '') {
        this._setErrorMessage('กรุณาตั้งค่า Service');
        return;
      }

      if (USER_CODE === null || USER_CODE.trim() === '') {
        this._setErrorMessage(strings('error.username_is_required'));
        return;
      }

      if (USER_PASSWORD === null || USER_PASSWORD.trim() === '') {
        this._setErrorMessage(strings('error.password_is_required'));
        return;
      }

      this._setIsLoading(true);

      //const response = await this.props.login(this.state.userLogin)
      await this._getWSv3SettingConfig();


      const setting = await getListServiceSetting();
      //console.log('_prepareData setting', setting[0]);



      // console.log(
      //   'conFigvvvvvvvvvs  this.state.config.vanCNFMachine',
      //   this.state.config.vanCNFMachine,
      // );

      const selectedSetting = Array.isArray(setting)
        ? setting.find((item) => item?.value === service) ||
          setting.find((item) => item?.number === service) ||
          setting[0]
        : null;

      if (!selectedSetting?.webURL || !selectedSetting?.number) {
        this._setIsLoading(false);
        this._setErrorMessage('ไม่พบข้อมูล Service ที่เลือก');
        return;
      }

      if (USER_CODE && USER_PASSWORD && setting && setting.length > 0) {
        this._setIsLoading(false);

        const baseURL = selectedSetting.webURL;
        const vanCNFMachine = selectedSetting.number;

        const response = await this.props.systemCheck2({
          baseUrl: baseURL,
          vanCNFMachine,
          USER_CODE,
          USER_PASSWORD,
        });

        const responseData = this._safeJsonParse(response.ResponseData);
        if (
          response.ResponseCode == 200 && response.ReasonString == 'Completed'
        ) {
          const registerResponse = await this.props.registerV3(
            USER_CODE,
            USER_PASSWORD,
          );
          const { ResponseData } = registerResponse;
          const registerResponseData = this._safeJsonParse(ResponseData);
          if (!registerResponseData || !registerResponseData.BPAPUS_GUID) {
            this._setErrorMessage('ข้อมูลการลงทะเบียนไม่ถูกต้อง');
            return;
          }
          const uniqueId = await getDeviceUniqeId();
          const responsemember = await findMemberNameV3Api(
            vanCNFMachine,
            registerResponseData.BPAPUS_GUID,
          );
          const responseMemberData =
            typeof responsemember?.ResponseData === 'string' &&
            responsemember.ResponseData.trim()
              ? this._safeJsonParse(responsemember.ResponseData)
              : responsemember?.ResponseData;
          const existingMember = Array.isArray(responseMemberData?.Mb000130)
            ? responseMemberData.Mb000130[0]
            : null;
          const existingMemberCount = Number(
            responseMemberData?.RECORD_COUNT ?? 0,
          );

          if (
            responsemember.ResponseCode == 200 &&
            responsemember.ReasonString === 'Completed' &&
            existingMemberCount > 0
          ) {
            if (
              existingMember?.MB_E_NAME !== uniqueId
            ) {
              this._setErrorMessage(strings('error.duplicateUser'));
              return;
            }
          } else if (responsemember.ReasonString !== 'Not Login') {
            try {
              const responseNewmember = await newMemberV3Api(
                vanCNFMachine,
                registerResponseData.BPAPUS_GUID,
                uniqueId,
              );
              if (
                responseNewmember.ResponseCode == 200 &&
                this._safeJsonParse(responseNewmember.ResponseData)?.RECORD_COUNT > 0
              ) {
              }
            } catch (error) {
              console.log('newMemberV3Api error', error);
            }
          }

          await setLoginGuID(registerResponseData.BPAPUS_GUID);
          await this._getVanConfigV3(
            registerResponseData.BPAPUS_GUID,
            vanCNFMachine,
          );

          if (this.state.isRememberPassword) {
            await setLoginInfo({
              ...this.state.userLogin,
              rememberPassword: this.state.isRememberPassword,
            });
          } else {
            await removeLoginInfo();
          }

          await this._searchCustomerTypeList();
          await this._searchProductCateGoryList();
            Navigator.navigate('Main');
          return;
        } else if (responseData?.RECORD_COUNT == 0) {
          this._setErrorMessage('ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง');
        }
        // console.log("this._searchMasterDataBankFileList");
        //  await this._searchMasterDataBankFileList();

        await this._getMasterDataProvinces();
        await this._getArPricetab();

        // } else if (STATUS === '10') {
        //  this._setErrorMessage(ERROR_MESSAGES);
        // } else {
        // this._setErrorMessage(strings('error.please_try_again'));
        // }
      } else {
        this._setErrorMessage('ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง');
      }
    } catch (error) {
      let errret = ''
      console.log('oooooo ....', error);

      const errorText = '' + error;
      const isTimeoutError =
        /timeout of \d+ms exceeded/i.test(errorText) ||
        (error && error.code === 'ECONNABORTED');

      if (isTimeoutError) {
        errret = 'timeout';
      } else {

      switch (errorText) {
        case "User ID Not found or wrong password":
        case "บัญชีผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง":
          errret = '609';
          break;
        case "Not Login":
          errret = '610';
          break;
        case "UnRegister Machine":
          errret = '608';
          break;
        case "เครื่องเกินขีดจำกัด":
          errret = '607';
          break;
        case "เกิดข้อผิดพลาด รหัส 503":
          errret = '503';
          break;
        case "duplicateUser":
          errret = strings('error_ser.' + 'duplicateUser');;
          break;

        default:
          errret = error;
          break;
      };
      }

      console.log('oooooo errret ....', errret);
      if (errret != '') {
        try {
          this._setErrorMessage(strings('error_ser.' + errret))
        } catch (error) {
          this._setErrorMessage('เกิดข้อผิดพลาด' + error)
        }

      }
      //this._setErrorMessage(error);
    }

    this._setIsLoading(false);
  }

  _getVanConfigV3 = async (BPAPUS_GUID, VANCNF_MACHINE) => {
    try {
      const response = await this.props.getVanConfigV3(VANCNF_MACHINE);
      const currentSetting = await getSettingConfig();
      const userToken = await getUserToken();

      const response2 = await this.props.readCompanyInfoV3(BPAPUS_GUID, 0);
      let responseData2 = this._safeJsonParse(response2.ResponseData);
      const companyInfo =
        response2.ResponseCode == 200 &&
        responseData2 && responseData2.RECORD_COUNT != '0'
          ? responseData2.READCOMPANYINFO[0]
          : userToken?.COMPANYINFO ?? currentSetting?.COMPANYINFO ?? null;
      const nextVanConfig = response ?? userToken?.VANCONFIG ?? currentSetting?.VANCONFIG ?? null;

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

  _searchMasterDataBankFileList = async () => {
    try {
      await this.props.searchMasterDataBankFileList();
    } catch (error) {
      console.log(error);
    }
  };

  _searchCustomerTypeList = async () => {
    try {
      const userToken = await getUserToken();
      const vanConfig = userToken?.VANCONFIG;
      if (!vanConfig) {
        console.log('[Login] _searchCustomerTypeList skipped: missing VANCONFIG');
        return;
      }
      await this.props.searchCustomerTypeList(
        vanConfig.VANCNF_ENABLE_ALLAR,
      );
    } catch (error) {
      console.log(error);
    }
  };

  _searchProductCateGoryList = async () => {
    try {
      const userToken = await getUserToken();
      const vanConfig = userToken?.VANCONFIG;
      if (!vanConfig) {
        console.log('[Login] _searchProductCateGoryList skipped: missing VANCONFIG');
        return;
      }
      await this.props.searchProductCateGoryList(
        vanConfig.VANCNF_ENABLE_ALLIC,
      );
    } catch (error) {
      console.log(error);
    }
  };

  _getMasterDataProvinces = async () => {
    try {
      await this.props.getMasterDataProvinces();
    } catch (error) {
      console.log(error);
    }
  };

  _getArPricetab = async () => {
    try {
      await this.props.getArPricetab();
    } catch (error) {
      console.log(error);
    }
  };

  _setIsLoading = (isLoading) => {
    this.setState((oldState) => {
      return {
        isLoading: isLoading,
      };
    });
  };

  _setErrorMessage = (errorMessage) => {
    this.setState((oldState) => {
      return {
        errorMessage: errorMessage,
      };
    });
  };

  _onSettingPress = () => {
    Navigator.navigate('LoginSetting');
  };

  render() {
    return (
      <Form
        navigation={this.props.navigation}
        onLogin={this._onLogin.bind(this)}
        username={this.state.userLogin.USER_CODE}
        password={this.state.userLogin.USER_PASSWORD}
        errorMessage={this.state.errorMessage}
        isLoading={this.state.isLoading}
        setUserName={this._setUserName}
        setPassword={this._setPassword}
        setService={this._setService}
        setErrorMessage={this._setErrorMessage}
        setIsLoading={this._setIsLoading}
        setIsRememberPassword={this._setIsRememberPassword}
        onSettingPress={this._onSettingPress}
        toggleRememberPassword={this.toggleRememberPassword}
        isRememberPassword={this.state.isRememberPassword}
        toggleShowPassword={this.toggleShowPassword}
        isShowPassword={this.state.isShowPassword}
      />
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {
  return {
    login: (userLogin) => {
      return dispatch(login(userLogin));
    },
    getVanConfigV3: (VANCNF_MACHINE) =>
      dispatch(getVanConfigV3(VANCNF_MACHINE)),
    registerV3: (username, password) =>
      dispatch(registerV3(username, password)),
    systemCheck2: (data) => dispatch(systemCheck2(data)),
    readCompanyInfoV3: (GUID, CMPNY_CODE) =>
      dispatch(readCompanyInfoV3(GUID, CMPNY_CODE)),

    searchMasterDataBankFileList: (GUID) =>
      dispatch(searchMasterDataBankFileList(GUID)),
    searchCustomerTypeList: (vanCNFEnabledAllar) =>
      dispatch(searchCustomerTypeList(vanCNFEnabledAllar)),
    searchProductCateGoryList: (vanCNFEnabledAllic) =>
      dispatch(searchProductCateGoryList(vanCNFEnabledAllic)),
    getMasterDataProvinces: () => dispatch(getMasterDataProvinces()),
    getArPricetab: () => dispatch(getArPricetab()),
    toggleRememberPassword: (item) => dispatch(toggleRememberPassword(item)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTForm);
