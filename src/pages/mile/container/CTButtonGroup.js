import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Keyboard, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {mileFormButtonGroup} from '../../../constant/lov';
import ButtonGroup from '../presenter/ButtonGroup';
import {setInitialState} from '../../../action/mile';
import {getUserToken} from '../../../utils/Token';
import Navigator from '../../../services/Navigator';
import {MainTheme} from '../../../constant/lov';

class CTButtonGroup extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      userToken: {
        VANCONFIG: {
          VANCNF_FORCE_MILE: null,
        },
      },
      previousRoute: {name: null},
      errorMessage: null,
    };
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
    const isDisabled =
      item.title === 'ยกเลิก' &&
      this.state.userToken.VANCONFIG.VANCNF_FORCE_MILE == 1 &&
      this.state.previousRoute.name === 'Order';

    return (
      <TouchableOpacity
        key={key}
        style={[
          styles.button,
          item.buttonStyle || {},
          item.containerStyle || {},
          isDisabled ? styles.disabledButton : null,
        ]}
        onPress={() => {
          this._onPress(item);
        }}
        disabled={isDisabled}
      >
        <Text style={[styles.buttonText, item.titleStyle || {}]}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  _onPress = async (item) => {
    if (item.methodName === 'confirm') {
      this._onSubmit();
    } else if (item.methodName === 'back') {
      // this.props.setInitialState()
      const userToken = await getUserToken();
      const {routes, index} = Navigator.getCurrentRoute();
      const {name: routeName} = routes[index - 1];

      if (
        userToken.VANCONFIG.VANCNF_FORCE_GPS == 1 &&
        (routeName === 'Order' || routeName === 'CustomerProfileDetail')
      ) {
        Navigator.pop(1, true);
        Navigator.navigate('CheckIn');
        return;
      }

      if (routeName === 'Order') Navigator.pop(1, true);
      Navigator.navigate('OrderChoice');
    }

    Keyboard.dismiss();
  };

  _onSubmit = async () => {
    if (this._validateForm()) {
      const userToken = await getUserToken();
      const {routes, index} = Navigator.getCurrentRoute();
      const {name: routeName} = routes[index - 1];

      if (
        userToken.VANCONFIG.VANCNF_FORCE_GPS == 1 &&
        (routeName === 'Order' || routeName === 'CustomerProfileDetail')
      ) {
        Navigator.pop(1, true);
        Navigator.navigate('CheckIn');
        return;
      }

      this._setErrorMessage(null);

      Navigator.pop(1, true);
      Navigator.navigate('OrderChoice');
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

  render() {
    return (
      <ButtonGroup
        errorMessage={this.state.errorMessage}
        renderItem={this._renderItem}
        buttonListItems={mileFormButtonGroup}
      />
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
