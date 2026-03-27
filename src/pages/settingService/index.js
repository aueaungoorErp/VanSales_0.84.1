import _, { isNull } from 'lodash';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as appConfig from '../../../app';
import { systemCheckApi2 } from '../../api/setting';
import ILoading from '../../component/loading/ILoading';
import ITextWithErrorMessage from '../../component/text/ITextWithErrorMessage';
import { MainTheme } from '../../constant/lov';
import { strings } from '../../locales/i18n';
import Navigator from '../../services/Navigator';
import { getListServiceSetting, saveListServiceSetting } from '../../utils/Token';

let listServiceSetting = [];

const createLocalId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const toInputValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
};


const ServiceSetting = (props) => {
  const {
    service,
    _webServiceKey,
    _webURL,
    _serviceName,
    _number,
    _user_code,
    _user_password,
    setService,
    applySelectedService,
  } = props.route.params;




  const mode = service;
  const [webURL, setWebURL] = useState(_webURL || appConfig.API_ENDPOINT_V3);

  const [USER_CODE, setuser_code] = useState(_user_code || null);
  const [USER_PASSWORD, setuser_password] = useState(_user_password || null);


  const [serviceName, setServiceName] = useState(_serviceName || null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [number, setNumber] = useState(_number || null);
  const [listServiceSettings, setList] = useState(listServiceSetting);

  const [isShow, setisShow] = useState(true);


  const _validateItem = () => {
    let validate = true

    if (isNull(serviceName) || serviceName == '') {
      setErrorMessage('กรุณาระบุ' + strings('login_setting.web_servicename'))
      validate = false
    } else if (isNull(USER_CODE) || USER_CODE == '') {
      setErrorMessage('กรุณาระบุ' + strings('login_setting.user_code'))
      validate = false
    } else if (isNull(USER_PASSWORD) || USER_PASSWORD == '') {
      setErrorMessage('กรุณาระบุ' + strings('login_setting.user_password'))
      validate = false
    }

    return validate
  }





  const _onSave = async () => {


    if (_validateItem()) {
      const config = await getListServiceSetting();
      setErrorMessage('');
      const list = [];

      try {
        setIsLoading(true);
        console.log('sreviceSetting', webURL, number, USER_CODE, USER_PASSWORD);
        const response = await systemCheckApi2(webURL, number, USER_CODE, USER_PASSWORD);
        console.log('response from systemCheckApi=>', response);
        const {ResponseData, ResponseCode, ReasonString, RESPONSE_DATETIME} = response;
        let responseData =
          ResponseData != '' ? JSON.parse(ResponseData) : ResponseData;
        const isConnected =
          ResponseCode == '200' &&
          ReasonString == 'Completed' &&
          !!responseData &&
          !!RESPONSE_DATETIME;

        if (isConnected) {
          if (config && config.length >= 0) {
            list.push(...config);
          }
          const uuid = createLocalId();
          list.push({
            label: serviceName,
            value: uuid,
            webURL,
            serviceName,
            number,
            USER_CODE,
            USER_PASSWORD
          });
          await saveListServiceSetting(list);
          const savedService = {
            label: serviceName,
            value: uuid,
            webURL,
            serviceName,
            number,
            USER_CODE,
            USER_PASSWORD,
          };
          setService?.(uuid);
          await applySelectedService?.(savedService, uuid);
          //setErrorMessage( strings('login_setting.connect_success'));

          Alert.alert(
            'สำเร็จ',
            strings('login_setting.connect') + strings('login_setting.web_service') + ' ' + serviceName + ' ' + strings('login_setting.success'),

            [{ text: 'ตกลง', onPress: () => Navigator.back() }],
            { cancelable: false },
          );

        } else if (ResponseCode == '607') {
          setErrorMessage('จำนวนสิทธิ์ใช้งานเกิน');
        } else {
          setErrorMessage('Web Service หรือ หน่วยรถ ไม่ถูกต้อง');
        }
        setIsLoading(false);
      } catch (error) {
        console.log('errr2 ==>', error)
        if (error == '607') {
          setErrorMessage('จำนวนสิทธิ์ใช้งานเกิน');
        } else { _error_massage(error); }

      } finally {
        setIsLoading(false);
      }
    }
  };

  const _onEdit = async () => {
    if (_validateItem()) {
      const config = await getListServiceSetting();
      setErrorMessage('');
      let savedService = null;
      try {
        //Find index of specific object using findIndex method.
        const objIndex = config.findIndex((obj) => obj.value === _webServiceKey);

        console.log('Before update: ', config[objIndex]);
        console.log('webURL ', webURL);
        console.log('_webURL ', _webURL);
        console.log('config[objIndex].webURL ', config[objIndex].webURL);

        if (_webURL != webURL) {

          const AsyncAlert = () => {
            return new Promise((resolve, reject) => {
              Alert.alert(
                'มีข้อมูลนี้ในระบบ',
                strings('announce.Alert2') + strings('login_setting.web_serviceurl'),
                [
                  { text: 'ใช่', onPress: () => resolve('YES') },
                  { text: 'ไม่ใช่', onPress: () => resolve('NO') }
                ],
                { cancelable: false }
              )
            })
          }

          const userResponse = await AsyncAlert()
          if (userResponse == 'NO') {
            return;
          }
        } else if (_serviceName != serviceName) {
          const AsyncAlert = () => {
            return new Promise((resolve, reject) => {
              Alert.alert(
                'มีข้อมูลนี้ในระบบ',
                strings('announce.Alert2') + strings('login_setting.web_servicename'),
                [
                  { text: 'ใช่', onPress: () => resolve('YES') },
                  { text: 'ไม่ใช่', onPress: () => resolve('NO') }
                ],
                { cancelable: false }
              )
            })
          }

          const userResponse = await AsyncAlert()
          if (userResponse == 'NO') {
            return;
          }
        }


        console.log('responseData 33> ');
        const response = await systemCheckApi2(webURL, number, USER_CODE, USER_PASSWORD);
        console.log('responseData 33> ', response);


        const {ResponseData, ResponseCode, ReasonString, RESPONSE_DATETIME} = response;
        let responseData =
          ResponseData != '' ? JSON.parse(ResponseData) : ResponseData;
        const isConnected =
          ResponseCode == '200' &&
          ReasonString == 'Completed' &&
          !!responseData &&
          !!RESPONSE_DATETIME;

        if (isConnected) {
          // if (config && config.length >= 0) {


          //Update object's name property.
          config[objIndex].webURL = webURL;
          config[objIndex].label = serviceName;
          config[objIndex].serviceName = serviceName;
          config[objIndex].number = number;
          config[objIndex].USER_CODE = USER_CODE;
          config[objIndex].USER_PASSWORD = USER_PASSWORD;
          savedService = {...config[objIndex]};
        } else if (ResponseCode == '607') {
          setErrorMessage('จำนวนสิทธิ์ใช้งานเกิน');
          return;
        } else {
          setErrorMessage('Web Service หรือ หน่วยรถ ไม่ถูกต้อง');
          return;
        }

        //Log object to console again.
        console.log('After update: ', config[objIndex]);
        //;
        //if (_webURL != webURL || _serviceName != serviceName || _number!= number  )
        {
          Alert.alert(
            'สำเร็จ',
            strings('login_setting.connect') + strings('login_setting.web_service') + ' ' + serviceName + ' ' + strings('login_setting.success'),
            //'ต้องการบันทึกข้อมูล ?',
            [{ text: 'ใช่', onPress: async () => { await saveListServiceSetting(config); setService?.(_webServiceKey); await applySelectedService?.(savedService, _webServiceKey); Navigator.back(); } }],
            { cancelable: true },
          );
        }

      } catch (error) {
        console.log('errr1 ==>',error)
        _error_massage(error);
      }
    }
  };

  const _onReset = () => {
    setWebURL(null);
    setServiceName(null);
    setNumber(null);
    setuser_code(null);
    setuser_password(null);
    setErrorMessage('');
  };

  const _onDelete = async () => {

    const AsyncAlert = () => {
      return new Promise((resolve, reject) => {
        Alert.alert(
          'แจ้งเตือน',
          strings('announce.AlertDelete') + ' ' + serviceName + ' ' + 'หรือไม่',
          [
            { text: 'ใช่', onPress: () => resolve('YES') },
            { text: 'ไม่ใช่', onPress: () => resolve('NO') }
          ],
          { cancelable: false }
        )
      })
    }

    const userResponse = await AsyncAlert()
    if (userResponse == 'NO') {
      return;
    }







    config = await getListServiceSetting();
    const list = _.reject(config, { value: _webServiceKey });
    await saveListServiceSetting(list);
    Navigator.back();
  };

  const _onBack = () => {
    Navigator.back();
  };


  const _handleChangePassword = async (input) => {
    const capitalizedInput = await input.toUpperCase();
    console.log('capitalizedInput ', capitalizedInput);
    setuser_password(capitalizedInput.trim());
  };

  const _toggleShow = async () => {
    //console.log("this.state.isShow ",this.state.isShow);
    await setisShow(!isShow);
    // await this.setState({isShow: !this.state.isShow});
  };


  function _error_massage(error) {
    setIsLoading(false);
    setErrorMessage(error);
  }




  _onChangeService = async (value) => {
    if (value) {
      this.props.setService(value);
      this.setState({ service: value });
      const service3 = _.find(this.state.listServiceSettings, ['value', value]);

      console.log('service service 2 >>>', service3);


      const { webURL, number, USER_CODE, USER_PASSWORD } = service3;
      const config = {
        baseUrl: webURL,
        vanCNFMachine: number,
        SALESMAN: null,
        VANCONFIG: null,
        USER_CODE: USER_CODE,
        USER_PASSWORD: USER_PASSWORD,
      };
      console.log('_onChangeService config ', config);
      this.props.setIsLoading(true);
      this.props.setErrorMessage(null);
      this.setState({ successMessage: null });
      console.log('sas');
      const response = await this.props.systemCheck(config);

      const { ResponseData, RESPONSE_DATETIME } = response;
      let responseData = JSON.parse(ResponseData);
      console.log('_onChangeService response', response);
      if (responseData && RESPONSE_DATETIME) {
        this.setState({
          successMessage: strings('login_setting.connect_success'),
          canLogin: true,
        });
        // }
        // }
      } else {
        // config.SALESMAN = '';
        // config.VANCONFIG = '';
        // await setSettingConfig(config);
        console.log('EEEEEEEEEE11111');
        //this.props.setErrorMessage(response.ResponseCode + response.ReasonString);
        this.setState({ canLogin: false });
      }
    }
    this.props.setIsLoading(false);

  };








  return (
    <View>
      <View style={styles.titleSection}>
        <Icon
          name="settings"
          type="material"
          color={MainTheme.colorQuaternary}
          size={30}
        />

        <Text
          style={{ color: MainTheme.colorQuaternary, fontSize: hp('2.5%') }}
          allowFontScaling={false}>
          {' '}
          {`${mode === 'add' ? 'เพิ่ม' : 'แก้ไข'}เว็ปเซอร์วิส`}{' '}
        </Text>
      </View>

      <View style={styles.form}>







        <View style={styles.itemInlineLabel}>
          {
            //<Label style={{fontSize: hp('1.7%')}}>{`ชื่อเว็ปเซอร์วิส`}</Label>
          }
          <Text style={[styles.label, { width: 125 }]}> 
            {strings('login_setting.web_servicename')} :
          </Text>


          <TextInput
            style={styles.input}
            placeholder={strings('login_setting.web_servicename')}
            placeholderTextColor={MainTheme.placeholerTextInput}
            value={toInputValue(serviceName)}
            underlineColorAndroid="transparent"
            onChangeText={(value) => {
              setServiceName(value);
            }}
          />

          {
            //  <TouchableOpacity style={{ marginLeft: 4 }} onPress={() =>                          
            // {
            //   Navigator.navigate('OrderCheckStockImageItems', {
            //     takePicture: async (data) => {
            //       await this.props.addStockImageItem(data.uri);
            //       Navigator.back();
            //     },
            //   });
            // }
            // }>

            // {
            //  // <TouchableOpacity style={{ marginLeft: 4 }} onPress={() => Navigator.navigate('ScanScreen', { route: 'EditBase' })}>
            // }
            //               <FontAwesome
            //                 name="qrcode"
            //                 size={25}
            //                 color={MainTheme.colorTertiary}
            //               />
            //  </TouchableOpacity>
          }
          <Text>{'   '}</Text>
        </View>

        <View style={styles.itemInlineLabel}>
          <Text style={styles.label}>
            {strings('login_setting.web_serviceurl')} :
          </Text>
          <TextInput
            multiline={true}
            style={[styles.input, styles.multilineInput]}
            value={toInputValue(webURL)}
            underlineColorAndroid="transparent"
            onChangeText={(value) => {
              setWebURL(value);
            }}
          />



        </View>


        <View style={styles.itemInlineLabel}>
          <Text style={[styles.label, { width: 100 }]}> 
            {strings('login_setting.user_code')} :
          </Text>
          <Image
            style={{ height: 20, width: 20 }}
            resizeMode={'contain'}
            source={require('../../images/person.png')}

          />

          <TextInput
            placeholder={strings('login.user_code')}
            placeholderTextColor={MainTheme.placeholerTextInput}
            value={toInputValue(USER_CODE)}
            autoCapitalize={'characters'}
            style={styles.input}
            underlineColorAndroid="transparent"
            onChangeText={(value) => {
              setuser_code ? setuser_code(value.trim()) : null;
              //setuser_code ? setuser_code('BUSINES') : null;

            }}
          />
        </View>

        <View style={styles.itemInlineLabel}>
          <Text style={[styles.label, { width: 100 }]}> 
            {strings('login_setting.user_password')} :
          </Text>
          <Image
            style={{ height: 20, width: 20 }}
            resizeMode={'contain'}
            source={require('../../images/lock.png')}

          />


          <TextInput
            placeholder={strings('login.user_password')}
            secureTextEntry={isShow}
            placeholderTextColor={MainTheme.placeholerTextInput}
            value={toInputValue(USER_PASSWORD)}
            autoCapitalize={'characters'}
            style={styles.input}
            underlineColorAndroid="transparent"
            //onChangeText={_handleChangePassword()}
            onChangeText={(value) => {
              setuser_password ? setuser_password(value) : null;

            }}
          />
          <Ionicons
            name={isShow ? 'eye-off' : 'eye'}
            size={25}
            onPress={async () => {
              await _toggleShow();
            }}
            style={{ color: MainTheme.colorTertiary }}
          />
        </View>


        <View style={styles.itemInlineLabel}>
          <Text style={[styles.label, { width: 110 }]}> 
            {strings('login_setting.van_machine')} :
          </Text>

          <TextInput
            style={styles.input}
            placeholder={strings('login_setting.van_machine')}
            placeholderTextColor={MainTheme.placeholerTextInput}
            value={toInputValue(number)}
            underlineColorAndroid="transparent"
            onChangeText={(value) => {
              setNumber(value);
            }}
          />
        </View>


        <View style={styles.MessageBox}>
          <ITextWithErrorMessage message={errorMessage} />
          <ILoading isLoading={isLoading} />
        </View>


        <View style={iButtonGroupCustomStyles.container}>
          <Button
            large
            buttonStyle={{
              backgroundColor: MainTheme.colorPrimary,
              width: 150,
              elevation: 0,
              borderColor: MainTheme.colorPrimary,
            }}
            title={`บันทึกและเชื่อมต่อ`}
            titleStyle={{ color: MainTheme.colorSecondary, fontSize: hp('1.7%') }}
            onPress={() => {
              mode === 'add' ? _onSave() : _onEdit();
            }}
          />

          {mode === 'add' && (
            <Button
              large
              buttonStyle={{
                backgroundColor: MainTheme.colorSecondary,
                width: 100,
                elevation: 0,
                borderWidth: 0.5,
                borderColor: MainTheme.colorButtonBorder,
              }}
              title={`ล้าง`}
              titleStyle={{ color: MainTheme.colorPrimary, fontSize: hp('1.7%') }}
              onPress={() => {
                _onReset();
              }}
            />
          )}
          {mode === 'edit' && (
            <Button
              large
              buttonStyle={{
                backgroundColor: MainTheme.colorSecondary,
                width: 100,
                elevation: 0,
                borderWidth: 0.5,
                borderColor: MainTheme.colorButtonBorder,
              }}
              title={`ลบ`}
              titleStyle={{ color: MainTheme.colorPrimary, fontSize: hp('1.7%') }}
              onPress={() => {
                _onDelete();
              }}
            />
          )}
          <Button
            large
            buttonStyle={{
              backgroundColor: MainTheme.colorSecondary,
              width: 100,
              elevation: 0,
              borderWidth: 0.5,
              borderColor: MainTheme.colorButtonBorder,
            }}
            title={`ย้อนกลับ`}
            titleStyle={{ color: MainTheme.colorPrimary, fontSize: hp('1.7%') }}
            onPress={() => {
              _onBack();
            }}
          />
        </View>


      </View>
    </View>
  );
};

export default ServiceSetting;

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
  titleSection: {
    paddingLeft: 15,
    flexDirection: 'row',
    borderBottomColor: MainTheme.colorQuaternary,
    borderBottomWidth: 0.5,
    height: 50,
    alignItems: 'center',
  },
  bodySection: {},
  itemInlineLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#d6d7da',
    minHeight: 44,
  },
  label: {
    fontSize: hp('1.7%'),
    color: '#000000',
  },
  input: {
    flex: 1,
    fontSize: hp('1.7%'),
    paddingVertical: 10,
    paddingHorizontal: 0,
    color: '#000000',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  MessageBox: {
    alignContent: 'center',
    marginTop: 15,
    height: 30,
  },
});

const iButtonGroupCustomStyles = StyleSheet.create({
  container: {
    flex: null,
    height: 60,
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  panel: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  buttonStyle: {
    backgroundColor: MainTheme.colorPrimary,
    width: 100,
    elevation: 0,
    borderColor: MainTheme.colorPrimary,
  },
});
