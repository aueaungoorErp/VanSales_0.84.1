import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button} from 'react-native-elements';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import KTBSettingForm from '../presenter/KTBSettingForm';
import {
  setKTBSettingConfig,
  getKTBSettingConfig,
  removeKTBSettingConfig,
} from '../../../utils/Token';
import {settingConfigButtonGroup} from '../../../constant/lov';
import Navigator from '../../../services/Navigator';
import {checkStatusService} from '../../../action/ktb-payment';
import {strings} from '../../../locales/i18n';
import * as appConfig from '../../../../appConfig';

class KTBSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      config: {
        ktbURL: appConfig.KTB_ENDPOINT,
      },
      isLoading: false,
      successMessage: null,
      errorMessage: null,
    };

    this._getKTBSettingConfig();
  }

  _renderItem = (item, key) => (
    <Button
      key={key}
      large
      buttonStyle={item.buttonStyle}
      title={item.title}
      titleStyle={[item.titleStyle, {fontSize: hp('1.7%')}]}
      onPress={() => {
        this._onPress(item);
      }}
    />
  );

  _onPress = async (item) => {
    if (item.methodName === 'confirm') {
      if (
        this.state.config.ktbURL === null ||
        this.state.config.ktbURL.trim() === ''
      ) {
        this._setErrorMessage(strings('login_setting.ktb_required'));
        return;
      }

      this._checkStatusService();
    } else if (item.methodName === 'clear') {
      this._removeKTBSettingConfig();
    } else if (item.methodName === 'back') {
      Navigator.back();
    }
  };

  _getKTBSettingConfig = async () => {
    const config = await getKTBSettingConfig();

    if (config) {
      this.setState((oldState) => {
        return {
          config: config,
        };
      });
    }
  };

  _checkStatusService = async () => {
    try {
      this._setIsLoading(true);
      this._setErrorMessage(null);
      this._setSuccessMessage(null);
      const response = await this.props.checkStatusService(this.state.config);
      console.log('response: ', response);
      if (response.txnStatusCode === 200 && response.statusCode == '10') {
        await setKTBSettingConfig(this.state.config);
        this._setSuccessMessage(strings('login_setting.connect_success'));
        // Keyboard.dismiss()
        // Navigator.back();
        this.props.onConnnect(true);
      } else if (response.STATUS === '10' && response.ERROR_MESSAGES[0]) {
        this._setErrorMessage(response.ERROR_MESSAGES[0]);
      }
      this._setIsLoading(false);
    } catch (error) {
      this._setIsLoading(false);
      this._setErrorMessage(error.message);
      this.props.onConnnect(false);
    }
  };

  _removeKTBSettingConfig = async () => {
    await removeKTBSettingConfig();
    this.setState((oldState) => {
      return {
        config: {
          ktbURL: null,
        },
      };
    });
  };

  _setKTBUrl = (value) => {
    this.setState((oldState) => {
      return {
        config: {
          ...this.state.config,
          ktbURL: value,
        },
      };
    });
  };

  _setIsLoading = (value) => {
    this.setState((oldState) => {
      return {
        isLoading: value,
      };
    });
  };

  _setSuccessMessage = (value) => {
    this.setState((oldState) => {
      return {
        successMessage: value,
      };
    });
  };

  _setErrorMessage = (value) => {
    this.setState((oldState) => {
      return {
        errorMessage: value,
      };
    });
  };

  render() {
    return (
      <KTBSettingForm
        ktbURL={this.state.config.ktbURL}
        setKTBUrl={this._setKTBUrl}
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
    checkStatusService: (data) => {
      return dispatch(checkStatusService(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KTBSetting);
