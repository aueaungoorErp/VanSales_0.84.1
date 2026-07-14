import React, { Component } from 'react';

import { connect } from 'react-redux';

import { Alert, Keyboard, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { mileFormButtonGroup } from '../../../constant/lov';

import ButtonGroup from '../presenter/ButtonGroup';

import {

  setInitialState,

  isMileageLessThanLatest,

  getMileageLessThanLatestMessage,

  saveVehicleMileageRecord,

} from '../../../action/mile';

import {

  assessLongdoApiKeyAvailability,

  getLongdoApiKeyAlertMessage,

} from '../../../services/longdomap';

import { getUserToken } from '../../../utils/Token';

import Navigator from '../../../services/Navigator';

import { MainTheme } from '../../../constant/lov';



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

      previousRoute: { name: null },

      errorMessage: null,

      isLoading: false,

      loadingMessage: 'กำลังบันทึกเลขไมล์...',

      resultDialogTitle: 'แจ้งเตือน',

      resultDialogMessage: null,

      shouldNavigateAfterResult: false,

    };

  }



  componentDidMount = props => {

    this._isMounted = true;

    this._getUserToken();

    this._getPreviousRoute();

  };



  componentWillUnmount = props => {

    this._isMounted = false;

  };



  _getUserToken = async () => {

    const userToken = await getUserToken();



    if (userToken) {

      await this._setState('userToken', userToken);

    }

  };



  _getPreviousRoute = async () => {

    const { routes, index } = Navigator.getCurrentRoute();

    await this._setState('previousRoute', routes[index - 1]);

  };



  _setState = async (key, value) => {

    this._isMounted &&

      (await this.setState(oldState => {

        return {

          [key]: value,

        };

      }));

  };



  _renderItem = (item, key) => {

    const isDisabled =

      (item.title === 'ยกเลิก' &&

        this.state.userToken.VANCONFIG.VANCNF_FORCE_MILE == 1 &&

        this.state.previousRoute.name === 'OrderScreen') ||

      this.state.isLoading;



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

        <Text style={[styles.buttonText, item.titleStyle || {}]}>

          {item.title}

        </Text>

      </TouchableOpacity>

    );

  };



  _onPress = async item => {

    if (item.methodName === 'confirm') {

      this._onSubmit();

    } else if (item.methodName === 'back') {

      const userToken = await getUserToken();

      const { routes, index } = Navigator.getCurrentRoute();

      const { name: routeName } = routes[index - 1];



      if (

        userToken.VANCONFIG.VANCNF_FORCE_GPS == 1 &&

        (routeName === 'OrderScreen' || routeName === 'CustomerProfileDetail')

      ) {

        const vanCode = String(userToken?.VANCONFIG?.VANCNF_MACHINE || '').trim();

        const availability = await assessLongdoApiKeyAvailability(vanCode);

        if (!availability.ok) {

          Alert.alert('แจ้งเตือน', getLongdoApiKeyAlertMessage(availability.reason));

          return;

        }

        Navigator.pop(1, true);

        Navigator.navigate('CheckIn');

        return;

      }



      if (routeName === 'OrderScreen') Navigator.pop(1, true);

      Navigator.navigate('OrderChoice');

    }



    Keyboard.dismiss();

  };



  _navigateAfterSuccess = async () => {

    const userToken = await getUserToken();

    const { routes, index } = Navigator.getCurrentRoute();

    const { name: routeName } = routes[index - 1];



    if (

      userToken.VANCONFIG.VANCNF_FORCE_GPS == 1 &&

      (routeName === 'OrderScreen' || routeName === 'CustomerProfileDetail')

    ) {

      Navigator.pop(1, true);

      Navigator.navigate('CheckIn');

      return;

    }



    Navigator.pop(1, true);

    Navigator.navigate('OrderChoice');

  };



  _onCloseResultDialog = async () => {

    const shouldNavigate = this.state.shouldNavigateAfterResult;



    await this._setState('resultDialogMessage', null);

    await this._setState('shouldNavigateAfterResult', false);



    if (shouldNavigate) {

      await this._navigateAfterSuccess();

    }

  };



  _onSubmit = async () => {

    if (!this._validateForm()) {

      return;

    }



    this._setErrorMessage(null);



    try {

      await this._setState('isLoading', true);

      await this._setState('loadingMessage', 'กำลังบันทึกเลขไมล์...');



      const result = await this.props.saveVehicleMileageRecord(

        this.props.mile.item.mileage,

      );



      await this._setState('isLoading', false);

      await this._setState('resultDialogTitle', 'แจ้งเตือน');

      await this._setState('resultDialogMessage', result?.message || 'บันทึกเลขไมล์สำเร็จ');

      await this._setState('shouldNavigateAfterResult', true);

    } catch (error) {

      await this._setState('isLoading', false);

      await this._setState('resultDialogTitle', 'เกิดข้อผิดพลาด');

      await this._setState(

        'resultDialogMessage',

        error?.message || 'บันทึกเลขไมล์ไม่สำเร็จ',

      );

      await this._setState('shouldNavigateAfterResult', false);

    }

  };



  _validateForm = () => {

    if (

      this.props.mile.item.mileage === null ||

      this.props.mile.item.mileage === ''

    ) {

      this._setErrorMessage('กรุณากรอกเลขที่ไมล์รถ');

      return false;

    }



    if (

      isMileageLessThanLatest(

        this.props.mile.item.mileage,

        this.props.mile.latestMileage,

      )

    ) {

      this._setErrorMessage(

        getMileageLessThanLatestMessage(this.props.mile.latestMileage),

      );

      return false;

    }



    return true;

  };



  _setErrorMessage = value => {

    this.setState(oldState => {

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

        isLoading={this.state.isLoading}

        loadingMessage={this.state.loadingMessage}

        resultDialogTitle={this.state.resultDialogTitle}

        resultDialogMessage={this.state.resultDialogMessage}

        onCloseResultDialog={this._onCloseResultDialog}

      />

    );

  }

}



const mapStateToProps = state => ({

  mile: state.mile,

});



const mapDispatchToProps = dispatch => {

  return {

    setInitialState: () => {

      dispatch(setInitialState());

    },

    saveVehicleMileageRecord: mileage => {

      return dispatch(saveVehicleMileageRecord(mileage));

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

