import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Keyboard, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {mileFormButtonGroup} from '../../../constant/lov';
import ButtonGroup from '../presenter/ButtonGroup';
import {
  setInitialState,
  mileCheckinCreate,
  mileAttachImage,
} from '../../../action/mile';
import {getUserToken} from '../../../utils/Token';
import Navigator from '../../../services/Navigator';
import {MainTheme} from '../../../constant/lov';
import {AndroidBackHandler} from '../../../component/AndroidBackHandler';
import {getCurrentPosition} from '../../../action/geolocation';
import {genenrateMileAttachImageToServer} from '../../../utils/Order';
import _ from 'lodash';

class CTButtonGroup extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      errorMessage: null,
    };

    this._onSubmitDebounce = _.debounce(this._onSubmit, 1000);
  }

  componentDidMount = (props) => {
    this._isMounted = true;
    this._getUserToken();
    this._getPreviousRoute();
  };

  componentWillUnmount = (props) => {
    this._isMounted = false;
  };

  _getUserToken = async () => {
    const userToken = await getUserToken();

    if (userToken) {
      await this._setState('userToken', userToken);
    }
  };

  _getPreviousRoute = async () => {
    const {routes, index} = Navigator.getCurrentRoute();
    await this._setState('previousRoute', routes[index - 1]);
  };

  _setState = async (key, value) => {
    this._isMounted &&
      (await this.setState((oldState) => {
        return {
          [key]: value,
        };
      }));
  };

  _renderItem = (item, key) => {
    return (
      <TouchableOpacity
        key={key}
        style={[
          styles.button,
          item.buttonStyle || {},
          item.containerStyle || {},
          this.state.isLoading ? styles.disabledButton : null,
        ]}
        disabled={this.state.isLoading}
        onPress={() => {
          this._onPress(item);
        }}
      >
        <Text style={[styles.buttonText, item.titleStyle || {}]}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  _onPress = async (item) => {
    if (item.methodName === 'confirm') {
      this._onSubmitDebounce();
    } else if (item.methodName === 'back') {
      Navigator.back();
    }

    Keyboard.dismiss();
  };

  _onSubmit = async () => {
    try {
      if (this._validateForm()) {
        this._setErrorMessage(null);
        const position = await this.props.getCurrentPosition();
        console.log('latitude: ', position.coords.latitude);
        console.log('longitude: ', position.coords.longitude);
        this._setState('isLoading', true);
        await this.props.mileCheckinCreate({
          VCL_MILE: this.props.mile.item.mileage,
          VCL_LAT: position.coords.latitude,
          VCL_LNT: position.coords.longitude,
        });

        await this.props.mileAttachImage(
          genenrateMileAttachImageToServer(this.props.mile.item.photo),
        );
        this._setState('isLoading', false);

        this.props.setInitialState();
        Navigator.back();
      }
    } catch (error) {
      this._setState('isLoading', false);
      this._setErrorMessage(error);
    }
  };

  _validateForm = () => {
    // ปิด ฟังค์ชั่น
    if (this.props.mile.item.photo === null) {
      // this._setErrorMessage('กรุณาถ่ายรูปไมล์รถ');
      // return false;
    }

    if (
      this.props.mile.item.mileage === null ||
      this.props.mile.item.mileage === ''
    ) {
      this._setErrorMessage('กรุณากรอกเลขที่ไมล์รถ');
      return false;
    }

    return true;
  };

  _setErrorMessage = (value) => {
    this.setState((oldState) => {
      return {
        errorMessage: value,
      };
    });
  };

  _onBackButtonPressAndroid = () => {
    this.props.setInitialState();
    return false;
  };

  render() {
    return (
      <AndroidBackHandler onBackPress={this._onBackButtonPressAndroid}>
        <ButtonGroup
          errorMessage={this.state.errorMessage}
          renderItem={this._renderItem}
          buttonListItems={mileFormButtonGroup}
          isLoading={this.state.isLoading}
        />
      </AndroidBackHandler>
    );
  }
}

const mapStateToProps = (state) => ({
  mile: state.mile,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setInitialState: () => {
      dispatch(setInitialState());
    },
    mileCheckinCreate: (payload) => {
      return dispatch(mileCheckinCreate(payload));
    },
    mileAttachImage: (payload) => {
      return dispatch(mileAttachImage(payload));
    },
    getCurrentPosition: () => dispatch(getCurrentPosition()),
  };
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.3,
  },
  buttonText: {
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: MainTheme.colorNonary,
    borderRadius: 0,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CTButtonGroup);
