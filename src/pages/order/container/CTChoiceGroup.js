import React, { Component } from 'react';
import { Alert, Image, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { serverReady } from '../../../api/setting';
import { setHeader, setInitialState } from '../../../action/order';
import { MainTheme, orderChoiceButtonGroup } from '../../../constant/lov';
import Navigator from '../../../services/Navigator';
import { generateHeader } from '../../../utils/Order';
import { getSettingConfig, getUserToken } from '../../../utils/Token';
import ChoiceGroup from '../presenter/ChoiceGroup';

class CTChoiceGroup extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      userToken: null,
      isTimeDialogVisible: false,
      timeDialogMessage: '',
    };
  }

  componentDidMount = (props) => {
    this._isMounted = true;
    this._getUserToken();
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  _getUserToken = async () => {
    const userToken = await getUserToken();

    if (userToken) {
      this._isMounted &&
        this.setState({
          userToken,
        });
    }
  };

  _renderItem = ({item}) => {
    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => this._onPress(item)} style={styles.touchable}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={item.imgSrc}
          />
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  _isVisitOrSurvey = (item) => {
    return item.screen == 'OrderSurvey' || item.screen == 'OrderVisit';
  };

  _closeTimeDialog = () => {
    this.setState({
      isTimeDialogVisible: false,
      timeDialogMessage: '',
    });
  };

  _buildTimeDialogMessage = (vanConfig) => {
    const timeFrom = vanConfig?.VANCNF_TIME_FM;
    const timeTo = vanConfig?.VANCNF_TIME_TO;

    if (!timeFrom || !timeTo) {
      return 'ไม่สามารถทำรายการได้เนื่องจากเกินช่วงเวลาที่กำหนด';
    }

    return (
      'ไม่สามารถทำรายการได้เนื่องจากเกินช่วงเวลาที่กำหนด\n\r(' +
      timeFrom.substring(0, 2) +
      ':' +
      timeFrom.substring(2, 4) +
      ' น. - ' +
      timeTo.substring(0, 2) +
      ':' +
      timeTo.substring(2, 4) +
      ' น.)'
    );
  };

  _validateVanSalesTime = async () => {
    try {
      const settingConfig = await getSettingConfig();
      const vanConfig = settingConfig?.VANCONFIG;

      if (!settingConfig?.baseUrl || !vanConfig?.VANCNF_TIME_FM || !vanConfig?.VANCNF_TIME_TO) {
        return true;
      }

      const result = await this.props.serverReady(settingConfig.baseUrl);
      const responseDatetime = result?.RESPONSE_DATETIME;

      if (!responseDatetime) {
        return true;
      }

      const timeArray = responseDatetime.split(':');
      const currentTime = parseInt(timeArray[0] + timeArray[1], 10);
      const timeFrom = parseInt(vanConfig.VANCNF_TIME_FM, 10);
      const timeTo = parseInt(vanConfig.VANCNF_TIME_TO, 10);

      if (currentTime >= timeFrom && currentTime <= timeTo) {
        return true;
      }

      this.setState({
        isTimeDialogVisible: true,
        timeDialogMessage: this._buildTimeDialogMessage(vanConfig),
      });

      return false;
    } catch (error) {
      console.log('_validateVanSalesTime error', error);
      return true;
    }
  };

  _onPress = async (item) => {
    const userToken = await getUserToken();
    console.log('_onPress CTChoiceGroup item', item);

    if (this._isVisitOrSurvey(item)) {
      const isWithinVanSalesTime = await this._validateVanSalesTime();

      if (!isWithinVanSalesTime) {
        return;
      }
    }

    const data = generateHeader(this.props.customer.item.INFO, item.title);
    await this.props.setInitialState();
    await this.props.setHeader(data);

    if (item.screen == 'OrderSurvey') {
      const supported = await Linking.canOpenURL(
        userToken.VANCONFIG.VANCNF_URL_SURVEY,
      );
      console.log('supported', supported);
      if (supported) {
        console.log(
          'userToken ',
          JSON.stringify(userToken.VANCONFIG.VANCNF_URL_SURVEY),
        );
        await Linking.openURL(userToken.VANCONFIG.VANCNF_URL_SURVEY);
      } else {
        Alert.alert(
          `Don't know how to open this URL: ${userToken.VANCONFIG.VANCNF_URL_SURVEY}`,
        );
      }
    } else if (item.screen == 'OrderVisit') {
     // const supported = await Linking.canOpenURL('https://google.com');
      const supported = await Linking.canOpenURL(
        userToken.VANCONFIG.VANCNF_URL_VISIT,
      );

      if (supported) {
        console.log(
          'userToken ',
          JSON.stringify(userToken.VANCONFIG.VANCNF_URL_VISIT),
        );
        await Linking.openURL(userToken.VANCONFIG.VANCNF_URL_VISIT);
      } else {
        Alert.alert(
          `Don't know how to open this URL: ${userToken.VANCONFIG.VANCNF_URL_VISIT}`,
        );
      }
    } else {
      Navigator.navigate(item.screen, {
        from: 'OrderChoice',
        userToken: this.state.userToken,
        isFirst: true,
      });
    }
  };

  _filterPermissionListItems = () => {
    const userToken = this.state.userToken;
    let result = [];

    // console.log('orderChoiceButtonGroup', orderChoiceButtonGroup);

    if (userToken) {
      orderChoiceButtonGroup.map((value, index) => {
        if (value.orderType === 'return-product') {
          if (userToken.VANCONFIG.VANCNF_ENABLE_RTN == 'Y') {
            result.push(value);
          }
        } else if (value.orderType === 'survey') {
          if (userToken.VANCONFIG.VANCNF_URL_SURVEY != '') {
            result.push(value);
          }
        } else if (value.orderType === 'sale-product') {
          if (
            userToken.VANCONFIG.VANCNF_ENABLE_INV == 'Y' ||
            userToken.VANCONFIG.VANCNF_ENABLE_CASH == 'Y'
          ) {
            result.push(value);
          }
        } else if (value.orderType === 'visit') {
          if (userToken.VANCONFIG.VANCNF_URL_VISIT != '') {
            result.push(value);
          }
        } else if (value.orderType === 'reserv-product') {
          if (
            userToken.VANCONFIG.VANCNF_ENABLE_BOOK == 'Y'
          ) {
            result.push(value);
          }
        } else if (value.orderType === 'check-stock') {
          if (userToken.VANCONFIG.VANCNF_ENABLE_QUOTE == 'Y') {
            result.push(value);
          }
        } else {
          result.push(value);
        }
      });
    }

    return result;
  };

  render() {
    return (
      <>
        <ChoiceGroup
          listItems={this._filterPermissionListItems()}
          renderItem={this._renderItem}
          numColumns={3}
        />
        <Modal
          transparent
          animationType="fade"
          visible={this.state.isTimeDialogVisible}
          onRequestClose={this._closeTimeDialog}>
          <View style={styles.modalOverlay}>
            <View style={styles.dialogCard}>
              <Text style={styles.dialogTitle}>คำเตือน</Text>
              <Text style={styles.dialogMessage}>{this.state.timeDialogMessage}</Text>
              <TouchableOpacity
                style={styles.dialogButton}
                onPress={this._closeTimeDialog}
                activeOpacity={0.8}>
                <Text style={styles.dialogButtonText}>ตกลง</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  screen: state.screen,
  customer: state.customer,
  order: state.order,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setInitialState: (data) => dispatch(setInitialState(data)),
    setHeader: (data) => dispatch(setHeader(data)),
    serverReady: (data) => dispatch(serverReady(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CTChoiceGroup);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 170,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    overflow: 'hidden',
  },
  touchable: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 112,
    height: 112,
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: hp('1.95%'),
    lineHeight: hp('2.4%'),
    color: MainTheme.colorPrimary,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    elevation: 8,
  },
  dialogTitle: {
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
    color: '#101828',
    textAlign: 'center',
    marginBottom: 12,
  },
  dialogMessage: {
    fontSize: hp('1.9%'),
    lineHeight: hp('2.7%'),
    color: '#344054',
    textAlign: 'center',
    marginBottom: 18,
  },
  dialogButton: {
    alignSelf: 'center',
    minWidth: 120,
    borderRadius: 10,
    backgroundColor: MainTheme.colorPrimary,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  dialogButtonText: {
    color: '#FFFFFF',
    fontSize: hp('1.9%'),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
