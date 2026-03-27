import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Alert,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {checkInFormButtonGroup} from '../../../constant/lov';
import ButtonGroup from '../presenter/ButtonGroup';
import {submit, checkDistance} from '../../../action/check-in';
import { UpdAddrBookV3Api} from '../../../api/check-in';

import Navigator from '../../../services/Navigator';
import {getUserToken,getLoginGuID } from '../../../utils/Token';
import * as appConfig from '../../../../appConfig';

import {getCurrentPosition} from '../../../action/geolocation';
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
      errorMessage: '',
      showDialog: false,
      isLoading: false,
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

  componentDidUpdate = (prevProps) => {
    if (this.props.geolocation.isError !== prevProps.geolocation.isError && this.props.geolocation.isError) {
      this._setState('showDialog', true);
    }
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

  _renderItem = (item, key) => {
    const isDisabled =
      (item.title === 'ยกเลิก' &&
        this.state.userToken.VANCONFIG.VANCNF_FORCE_GPS === 1 &&
        this.state.previousRoute.name === 'Order') ||
      (item.title === 'เช็คอิน' &&
        this.props.geolocation.position.latitude === null &&
        this.props.geolocation.position.longitude === null);

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
        disabled={isDisabled}>
        <Text style={[styles.buttonText, item.titleStyle || {}]}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  _onPress = async (item) => {
    const userToken = await getUserToken();
    const {routes, index} = Navigator.getCurrentRoute();
    const {name: routeName} = routes[index - 1];

    if (item.methodName === 'confirm') {
      if (await this._validateForm()) {
        if (
          userToken.VANCONFIG.VANCNF_WARN_NOGPS == 2 &&
          this.props.geolocation.position.latitude === null &&
          this.props.geolocation.position.longitude === null
        ) {
          console.log(
            'check in on press',
            userToken.VANCONFIG.VANCNF_WARN_NOGPS,
            this.props.geolocation.position.latitude,
          );
          this._setState('showDialog', true);
        }

        if (routeName === 'Order' || routeName === 'CustomerProfileDetail')
          Navigator.pop(1, true);
        Navigator.navigate('OrderChoice');
      }
    } else if (item.methodName === 'back') {
      if (routeName === 'Order' || routeName === 'CustomerProfileDetail')
        Navigator.pop(1, true);
      Navigator.navigate('OrderChoice');
    }
  };

  _getCurrentPosition = async () => {
    try {
      this._setState('showDialog', false);
      await this.props.getCurrentPosition();
      // await this.props.setIsSubmit(false)
    } catch (error) {
      console.log(error);
      this._setState('showDialog', true);
    }
  };

  _onSkip = () => {
    if (this.state.userToken.VANCONFIG.VANCNF_WARN_NOGPS === 1) {
      const {routes, index} = Navigator.getCurrentRoute();
      const {name: routeName} = routes[index - 1];
      if (routeName === 'Order' || routeName === 'CustomerProfileDetail')
        Navigator.pop(1, true);
      Navigator.navigate('OrderChoice');
    } else {
    }
  };

  _validateForm = async () => {
    try {
      var ret = false;
      if (
        this.state.userToken.VANCNF_RANGECHECKIN !== null &&
        this.state.userToken !== 0
      ) {
      

   if (  isNaN(parseFloat(this.props.customer.item.INFO.ADDB_GPS_LAT_S)) || isNaN(parseFloat(this.props.customer.item.INFO.ADDB_GPS_LONG_S)) )
      // ไม่มีพิกัดในฐานข้อมูล 
      {
        const AsyncAlert = async () => new Promise((resolve) => {
        Alert.alert(
               'คำเตือน',
               'ต้องการที่จะบันทึกพิกัดปัจจุบันสำหรับลูกค้ารายนี้ หรือไม่ ? \r\n',
          [
              {text: 'บันทึก', onPress: () => { resolve('YES'); }, },
              {text: 'ไม่บันทึก', onPress: () => { resolve('NO'); }, },              
          ],
          { cancelable: false },
        );
      });
        const x = await AsyncAlert() == 'YES' ? true : false;
    
    if (x) {
     // ไม่มีพิกัดในฐานข้อมูล ต้องการบันทึก 
    const LoginGUID = await getLoginGuID();
    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': 'UPDADDRBOOK',
      'BPAPUS-PARAM':
        '{"ADDB_KEY":  "' +
        this.props.customer.item.INFO.ADDB_KEY +
        '","ADDB_GPS_LAT_S": ' +
        this.props.geolocation.position.latitude +
        ',"ADDB_GPS_LONG_S": ' +
        this.props.geolocation.position.longitude +
        '}',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
      //console.log('createTempCus v ', bodyRequest);
      const u =await UpdAddrBookV3Api(bodyRequest)
      .then((v) => {
        const {ReasonString, ResponseCode, ResponseData} = v;
        //console.log('createTempCus v1 ', v);
        let responseData = JSON.parse(ResponseData);
        const {RECORD_COUNT, OFFSET, FETCH} = responseData;

        if (ResponseCode == 200 && RECORD_COUNT > 0) {
          return true;
        } else {
          return false;
        }      
      });

      // ไม่มีพิกัดในฐานข้อมูล ต้องการบันทึก บันทึกสำเร็จ
          if (u) {
           // this._setState('isLoading', false);
            this.props.customer.item.INFO.ADDB_GPS_LAT_S = this.props.geolocation.position.latitude;
            this.props.customer.item.INFO.ADDB_GPS_LONG_S = this.props.geolocation.position.longitude;
          }
      } else {
        // ไม่มีพิกัดในฐานข้อมูล ไม่ต้องการบันทึก 
        //this._setState('isLoading', false);
        return false
      };
      }

       this._setState('isLoading', true);
        console.log('กำลัง Checkin');
        console.log('กำลัง Checkin arInfo' , this.props.customer.item.INFO );
        console.log('กำลัง Checkin arInfo' , isNaN(parseFloat(this.props.customer.item.INFO.ADDB_GPS_LAT_S)));


       var cancheck = await this.props.checkDistance(
          this.props.customer.item.INFO,
          this.props.geolocation.position.latitude,
          this.props.geolocation.position.longitude,
          this.state.userToken.VANCONFIG.VANCNF_RANGECHECKIN,
        );
  
    if (cancheck){
        const AsyncAlert = async () => new Promise((resolve) => {
          Alert.alert(
                  'เช็คอิน',
                  'ทำรายการเช็คอินสำเร็จ',
            [
                {text: 'ตกลง', onPress: () => { resolve('YES'); }, },
            ],
            { cancelable: false },
          );
        });
              this._setState('isLoading', false);
              const x = await AsyncAlert() == 'YES' ? true : false; 
              console.log('เสร็จสิ้น Checkin x= ' , x);    
              ret = x;

          } 
      }

    } catch (error) {
      console.log('errorMessage >>> ' , error);
      this._setState('isLoading', false);

      const AsyncAlert = async () => new Promise((resolve) => {
        Alert.alert(
                'เช็คอินไม่สำเร็จ',
              error ,
          [
            //  {text: 'ไม่ยืนยัน', onPress: () => { resolve('NO'); }, },              
              {text: 'ตกลง', onPress: () => { resolve('NO'); }, },
          ],
          { cancelable: false },
        );
      });
          const x = await AsyncAlert() == 'YES' ? true : false; 
          ret = x ;
          }
    return ret;
  };

  _setState = (key, value) => {
    this._isMounted &&
      this.setState((oldState) => {
        return {
          [key]: value,
        };
      });
  };

  _setErrorMessage = (value) => {
    this._isMounted &&
      this.setState((oldState) => {
        return {
          errorMessage: value,
        };
      });
  };

  render() {
    return (
      <View>
        <Modal
          transparent
          visible={this.state.showDialog}
          animationType="fade"
          onRequestClose={() => this._setState('showDialog', false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dialogCard}>
              <Text style={styles.dialogTitle}>คำเตือน</Text>
              <Text style={styles.dialogMessage}>
                ไม่สามารถค้นหาพิกัดตำแหน่งของผู้ใช้งานได้
              </Text>
              <View style={styles.dialogButtonRow}>
                <TouchableOpacity
                  style={[styles.dialogButton, styles.primaryDialogButton]}
                  onPress={this._getCurrentPosition}>
                  <Text style={styles.primaryDialogButtonText}>ลองใหม่</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.dialogButton, styles.secondaryDialogButton]}
                  onPress={this._onSkip}>
                  <Text style={styles.secondaryDialogButtonText}>ข้าม</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          transparent
          visible={this.state.errorMessage !== ''}
          animationType="fade"
          onRequestClose={() => this._setState('errorMessage', '')}>
          <View style={styles.modalOverlay}>
            <View style={styles.dialogCard}>
              <Text style={styles.dialogTitle}>คำเตือน</Text>
              <Text style={styles.dialogMessage}>{this.state.errorMessage}</Text>
              <View style={styles.dialogButtonRow}>
                <TouchableOpacity
                  style={[styles.dialogButton, styles.primaryDialogButton]}
                  onPress={() => this._setState('errorMessage', '')}>
                  <Text style={styles.primaryDialogButtonText}>ตกลง</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          transparent
          visible={this.state.isLoading}
          animationType="fade"
          onRequestClose={() => null}>
          <View style={styles.modalOverlay}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={MainTheme.colorPrimary} />
              <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
            </View>
          </View>
        </Modal>

        <ButtonGroup
          errorMessage={this.state.errorMessage}
          renderItem={this._renderItem}
          buttonListItems={checkInFormButtonGroup}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  checkin: state.checkin,
  geolocation: state.geolocation,
  customer: state.customer,
});

const mapDispatchToProps = (dispatch) => {
  return {
    submit: () => {
      dispatch(submit());
    },
    getCurrentPosition: () => dispatch(getCurrentPosition()),
    // checkDistance: (arKey, lat, lnt) => dispatch(checkDistance(arKey, lat, lnt)),
    checkDistance: (arKey, lat, lnt, range) =>
      dispatch(checkDistance(arKey, lat, lnt, range)),
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  dialogCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  dialogMessage: {
    fontSize: 15,
    color: '#333333',
    marginBottom: 16,
  },
  dialogButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dialogButton: {
    minWidth: 84,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginLeft: 10,
    alignItems: 'center',
  },
  primaryDialogButton: {
    backgroundColor: MainTheme.colorPrimary,
  },
  secondaryDialogButton: {
    backgroundColor: MainTheme.colorSecondary,
    borderWidth: 1,
    borderColor: MainTheme.colorPrimary,
  },
  primaryDialogButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  secondaryDialogButtonText: {
    color: MainTheme.colorPrimary,
    fontWeight: 'bold',
  },
  loadingCard: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#333333',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CTButtonGroup);
