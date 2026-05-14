import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { API_ENDPOINT_V3 } from '../../../../appConfig';
import {
  getSaleManV3,
  getVanConfigV3,
  systemCheck,
  systemCheck2,
  unRegister
} from '../../../action/setting';
import { settingConfigButtonGroup } from '../../../constant/lov';
import { strings } from '../../../locales/i18n';
import Navigator from '../../../services/Navigator';
import {
  getSettingConfig,
  getUserToken,
  removeSettingConfig,
  setSettingConfig,
  setUserToken,
} from '../../../utils/Token';
import SettingForm from '../presenter/SettingForm';

class CTSetting extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      config: {
        baseUrl: API_ENDPOINT_V3,
        vanCNFMachine: null,
        SALESMAN: null,
        VANCONFIG: null,        
        USER_CODE:null,
        USER_PASSWORD:null,
      },
      isLoading: false,
      successMessage: null,
      errorMessage: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this._getSettingConfig();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setStateAsync = (nextState) =>
    new Promise((resolve) => {
      if (!this._isMounted) {
        resolve();
        return;
      }

      this.setState(nextState, resolve);
    });

  _renderItem = (item, key) => (
    <TouchableOpacity
      key={key}
      style={[{ paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center'}, item.buttonStyle]}
      onPress={() => {
        this._onPress(item);
      }}
      activeOpacity={0.7}>
      <Text style={[item.titleStyle, {fontSize: hp('1.7%')}]}>{item.title}</Text>
    </TouchableOpacity>
  );

  _onPress = async (item) => {
    if (item.methodName === 'confirm') {
      console.log('aaaaa', this.state.config);
      if (
        this.state.config.vanCNFMachine === null ||
        this.state.config.vanCNFMachine.trim() === ''
      ) {
        this._setErrorMessage(
          strings('login_setting.input_fields_are_required'),
        );
        return;
      }

      await this._systemCheck();
    } else if (item.methodName === 'clear') {
      this._removeSettingConfig();
    } else if (item.methodName === 'back') {
      Navigator.back();
    }
  };

  _getSettingConfig = async () => {
    const config = await getSettingConfig();

    if (config && this._isMounted) {
      this.setState((oldState) => {
        return {
          config: config,
        };
      });
    }
  };

  _applySelectedService = async (selectedService) => {
    if (!selectedService) {
      return;
    }

    const nextConfig = {
      ...this.state.config,
      baseUrl: selectedService.webURL ?? null,
      vanCNFMachine: selectedService.number ?? null,
      USER_CODE: selectedService.USER_CODE ?? null,
      USER_PASSWORD: selectedService.USER_PASSWORD ?? null,
      SALESMAN: null,
      VANCONFIG: null,
    };

    await this.setStateAsync({
      config: nextConfig,
      successMessage: null,
      errorMessage: null,
    });

    await setSettingConfig(nextConfig);
  };

  _systemCheck = async (configOverride = null) => {
    try {
      if (this.state.isLoading) {
        return;
      }

      const currentConfig = configOverride ?? this.state.config;

      this._setIsLoading(true);
      this._setErrorMessage(null);
      this._setSuccessMessage(null);

      const response = await this.props.systemCheck2(currentConfig);
      const {
        ResponseData,
        RESPONSE_DATETIME,
      } = response;
      const responseData = JSON.parse(ResponseData);

      if (!RESPONSE_DATETIME) {
        this._setErrorMessage(
          'ไม่พบหน่วยรถ ' + currentConfig.vanCNFMachine,
        );
      } else if (responseData?.BPAPUS_KEY && responseData?.BPAPUS_GUID) {

        const response2 = await this.props.getVanConfigV3(
          currentConfig.vanCNFMachine,
        );
        if (response2) {
          const response3 = await this.props.getSaleManV3(
            responseData.BPAPUS_GUID,
            response2.VANCNF_SLMN,
          );
          let responseData3 = JSON.parse(response3.ResponseData);

          if (
            response3.ResponseCode == 200 &&
            responseData3.RECORD_COUNT != '0'
          ) {
            const SALESMAN = responseData3.SaleMan;
            const userToken = await getUserToken();
            const nextConfig = {
              ...currentConfig,
              SALESMAN,
              VANCONFIG: response2,
            };

            await this.setStateAsync({config: nextConfig});
            await setSettingConfig(nextConfig);
            await setUserToken({
              ...(userToken ?? {}),
              SALESMAN,
              VANCONFIG: response2,
            });

            this._setSuccessMessage(strings('login_setting.connect_success'));


            this.props.onConnnect(true);
            try {
              await this.props.unRegister();
            } catch (unregisterError) {
              console.log('_systemCheck unRegister warning', unregisterError);
            }
            this._setIsLoading(false);
            return;
          } else {
            this._setErrorMessage(response3.ReasonString);
          }
        } else {
          this._setErrorMessage('ไม่พบข้อมูลหน่วยรถ ' + currentConfig.vanCNFMachine + ' กรุณาตรวจสอบการตั้งค่า');
        }
      } else {
        this._setErrorMessage(response.ReasonString);
      }
      this._setIsLoading(false);
    } catch (error) {
      this._setIsLoading(false);
      this._setErrorMessage(error?.message ?? 'เชื่อมต่อระบบไม่สำเร็จ');
      this.props.onConnnect(false);
    }
  };

  _removeSettingConfig = async () => {
    await removeSettingConfig();
    if (!this._isMounted) {
      return;
    }

    this.setState((oldState) => {
      return {
        config: {
          baseUrl: API_ENDPOINT_V3,
          vanCNFMachine: null,
          SALESMAN: null,
          VANCONFIG: null,
        USER_CODE:null,
        USER_PASSWORD:null,
        },
      };
    });
  };

  _setSalesMan = async (value) => {
    if (!this._isMounted) {
      return;
    }

    await this.setState((oldState) => {
      return {
        config: {
          ...this.state.config,
          SALESMAN: value,
        },
      };
    });
  };

  _setVanConfig = async (value) => {
    if (!this._isMounted) {
      return;
    }

    await this.setState((oldState) => {
      return {
        config: {
          ...this.state.config,
          VANCONFIG: value,
        },
      };
    });
  };

  _setBaseUrl = (value) => {
    if (!this._isMounted) {
      return;
    }

    this.setState((oldState) => {
      return {
        config: {
          ...this.state.config,
          baseUrl: value,
        },
      };
    });
  };


  _setUSER_CODE = (value) => {
    if (!this._isMounted) {
      return;
    }

    this.setState((oldState) => {
      return {
        config: {
          ...this.state.config,
          USER_CODE: value,
        },
      };
    });
  };


  _setUSER_PASSWORD = (value) => {
    if (!this._isMounted) {
      return;
    }

    this.setState((oldState) => {
      return {
        config: {
          ...this.state.config,
          USER_PASSWORD: value,
        },
      };
    });
  };




  _setVanCNFMachine = (value) => {
    if (!this._isMounted) {
      return;
    }

    this.setState((oldState) => {
      return {
        config: {
          ...this.state.config,
          vanCNFMachine: value,
        },
      };
    });
  };

  _setIsLoading = (value) => {
    if (!this._isMounted) {
      return;
    }

    this.setState((oldState) => {
      return {
        isLoading: value,
      };
    });
  };

  _setSuccessMessage = (value) => {
    if (!this._isMounted) {
      return;
    }

    this.setState((oldState) => {
      return {
        successMessage: value,
        errorMessage: null,
      };
    });
  };

  _setErrorMessage = (value) => {
    if (!this._isMounted) {
      return;
    }

    this.setState((oldState) => {
      return {
        errorMessage: value,
        successMessage: null,
      };
    });
  };

  render() {
    return (
      <SettingForm
        navigation={this.props.navigation}
        baseUrl={this.state.config.baseUrl}
        salesMan={this.state.config.SALESMAN}
        vanCNFMachine={this.state.config.vanCNFMachine}
        vanConfig={this.state.config.VANCONFIG}
        onApplySelectedService={this._applySelectedService}
        setBaseUrl={this._setBaseUrl}
        setUSER_CODE={this._setUSER_CODE}
        setUSER_PASSWORD={this._setUSER_PASSWORD}  
        setVanCNFMachine={this._setVanCNFMachine}
        renderItem={this._renderItem}
        buttonListItems={settingConfigButtonGroup}
        successMessage={this.state.successMessage}
        errorMessage={this.state.errorMessage}
        isLoading={this.state.isLoading}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  // user: state.user
});

const mapDispatchToProps = (dispatch) => {
  return {
    systemCheck: (data) => {
      return dispatch(systemCheck(data));
    },
    systemCheck2: (data) => {
      return dispatch(systemCheck2(data));
    },
    unRegister: () => {
      return dispatch(unRegister());
    },
    getSaleManV3: (GUID, SLMN_KEY) => {
      return dispatch(getSaleManV3(GUID, SLMN_KEY));
    },
    getVanConfigV3: (VANCNF_MACHINE) => {
      return dispatch(getVanConfigV3(VANCNF_MACHINE));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTSetting);
