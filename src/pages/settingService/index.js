import _, { isNull } from 'lodash';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as appConfig from '../../../appConfig';
import { systemCheckApi2 } from '../../api/setting';
import ILoading from '../../component/loading/ILoading';
import ITextWithErrorMessage from '../../component/text/ITextWithErrorMessage';
import { MainTheme } from '../../constant/lov';
import { strings } from '../../locales/i18n';
import Navigator from '../../services/Navigator';
import { getListServiceSetting, saveListServiceSetting } from '../../utils/Token';

let listServiceSetting = [];
const DEFAULT_SERVICE_URL = appConfig.API_ENDPOINT_V3;

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
  const [webURL, setWebURL] = useState(_webURL || DEFAULT_SERVICE_URL);

  const [USER_CODE, setuser_code] = useState(_user_code || '');
  const [USER_PASSWORD, setuser_password] = useState(_user_password || '');


  const [serviceName, setServiceName] = useState(_serviceName || '');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [number, setNumber] = useState(_number || '');
  const [listServiceSettings, setList] = useState(listServiceSetting);

  const [isShow, setisShow] = useState(true);


  const _validateItem = () => {
    let validate = true

    if (isNull(serviceName) || serviceName == '') {
      setErrorMessage('กรุณาระบุ' + strings('login_setting.web_servicename'))
      validate = false
    } else if (isNull(webURL) || webURL == '') {
      setErrorMessage('กรุณาระบุ' + strings('login_setting.web_serviceurl'))
      validate = false
    } else if (isNull(number) || number == '') {
      setErrorMessage('กรุณาระบุ' + strings('login_setting.van_machine'))
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
    setWebURL(DEFAULT_SERVICE_URL);
    setServiceName('');
    setNumber('');
    setuser_code('');
    setuser_password('');
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
    await setisShow(!isShow);
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
      const response = await this.props.systemCheck(config);

      const { ResponseData, RESPONSE_DATETIME } = response;
      let responseData = JSON.parse(ResponseData);
      console.log('_onChangeService response', response);
      if (responseData && RESPONSE_DATETIME) {
        this.setState({
          successMessage: strings('login_setting.connect_success'),
          canLogin: true,
        });
      } else {
        this.setState({ canLogin: false });
      }
    }
    this.props.setIsLoading(false);

  };








  return (
    <View style={styles.screen}>
      <View style={styles.titleSection}>
        <AntDesign
          name="setting"
          color={MainTheme.colorQuaternary}
          size={30}
        />

        <Text
          style={styles.title}
          allowFontScaling={false}>
          {`${mode === 'add' ? 'เพิ่ม' : 'แก้ไข'}เว็ปเซอร์วิส`}
        </Text>
      </View>

      <ScrollView
        style={styles.form}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>ตั้งค่าการเชื่อมต่อหน่วยรถ</Text>
          <Text style={styles.heroText}>
            กรอก URL, หน่วยรถ และข้อมูลผู้ใช้ให้ครบถ้วนก่อนบันทึก ระบบจะใช้ค่าเริ่มต้นจาก API_ENDPOINT_V3 ให้อัตโนมัติ
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>ข้อมูลเซอร์วิส</Text>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>{strings('login_setting.web_servicename')}</Text>
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
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>{strings('login_setting.web_serviceurl')}</Text>
            <TextInput
              multiline={true}
              style={[styles.input, styles.multilineInput]}
              value={toInputValue(webURL)}
              underlineColorAndroid="transparent"
              placeholder={DEFAULT_SERVICE_URL}
              placeholderTextColor={MainTheme.placeholerTextInput}
              onChangeText={(value) => {
                setWebURL(value);
              }}
            />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>{strings('login_setting.van_machine')}</Text>
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
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>ข้อมูลผู้ใช้งาน</Text>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>{strings('login_setting.user_code')}</Text>
            <View style={styles.iconInputRow}>
              <Image
                style={styles.leadingIcon}
                resizeMode={'contain'}
                source={require('../../images/person.png')}
              />
              <TextInput
                placeholder={strings('login.user_code')}
                placeholderTextColor={MainTheme.placeholerTextInput}
                value={toInputValue(USER_CODE)}
                autoCapitalize={'characters'}
                style={styles.iconInput}
                underlineColorAndroid="transparent"
                onChangeText={(value) => {
                  setuser_code ? setuser_code(value.trim()) : null;
                }}
              />
            </View>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>{strings('login_setting.user_password')}</Text>
            <View style={styles.iconInputRow}>
              <Image
                style={styles.leadingIcon}
                resizeMode={'contain'}
                source={require('../../images/lock.png')}
              />
              <TextInput
                placeholder={strings('login.user_password')}
                secureTextEntry={isShow}
                placeholderTextColor={MainTheme.placeholerTextInput}
                value={toInputValue(USER_PASSWORD)}
                autoCapitalize={'characters'}
                style={styles.iconInput}
                underlineColorAndroid="transparent"
                onChangeText={(value) => {
                  setuser_password ? setuser_password(value) : null;
                }}
              />
              <AntDesign
                name={isShow ? 'eyeo' : 'eye'}
                size={22}
                onPress={async () => {
                  await _toggleShow();
                }}
                style={styles.trailingIcon}
              />
            </View>
          </View>
        </View>

        <View style={styles.messageBox}>
          <ITextWithErrorMessage message={errorMessage} />
          <ILoading isLoading={isLoading} />
        </View>

        <View style={iButtonGroupCustomStyles.container}>
          <TouchableOpacity style={[styles.primaryButton, {justifyContent: "center", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16}]} onPress={() => {
              mode === 'add' ? _onSave() : _onEdit();
            }} activeOpacity={0.7}>
              <Text style={{ color: MainTheme.colorSecondary, fontSize: hp('1.7%') }}>{`บันทึกและเชื่อมต่อ`}</Text>
            </TouchableOpacity>

          {mode === 'add' && (
            <TouchableOpacity style={[styles.secondaryButton, {justifyContent: "center", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16}]} onPress={() => {
                _onReset();
              }} activeOpacity={0.7}>
              <Text style={{ color: MainTheme.colorPrimary, fontSize: hp('1.7%') }}>{`ล้าง`}</Text>
            </TouchableOpacity>
          )}
          {mode === 'edit' && (
            <TouchableOpacity style={[styles.secondaryButton, {justifyContent: "center", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16}]} onPress={() => {
                _onDelete();
              }} activeOpacity={0.7}>
              <Text style={{ color: MainTheme.colorPrimary, fontSize: hp('1.7%') }}>{`ลบ`}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.secondaryButton, {justifyContent: "center", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16}]} onPress={() => {
              _onBack();
            }} activeOpacity={0.7}>
              <Text style={{ color: MainTheme.colorPrimary, fontSize: hp('1.7%') }}>{`ย้อนกลับ`}</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

export default ServiceSetting;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4FAF6',
  },
  form: {
    width: '100%',
  },
  formContent: {
    padding: 14,
    paddingBottom: 28,
  },
  titleSection: {
    paddingLeft: 15,
    flexDirection: 'row',
    borderBottomColor: MainTheme.colorQuaternary,
    borderBottomWidth: 0.5,
    height: 50,
    alignItems: 'center',
    backgroundColor: MainTheme.colorSecondary,
  },
  title: {
    color: MainTheme.colorQuaternary,
    fontSize: hp('2.5%'),
    marginLeft: 8,
  },
  heroCard: {
    backgroundColor: '#E8F5EC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D3E9D9',
  },
  heroTitle: {
    color: MainTheme.colorQuaternary,
    fontSize: hp('2.2%'),
    fontWeight: '700',
    marginBottom: 6,
  },
  heroText: {
    color: '#4C6656',
    fontSize: hp('1.7%'),
    lineHeight: 22,
  },
  sectionCard: {
    backgroundColor: MainTheme.colorSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8E4',
  },
  sectionTitle: {
    color: MainTheme.colorQuaternary,
    fontSize: hp('2%'),
    fontWeight: '700',
    marginBottom: 14,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  label: {
    fontSize: hp('1.7%'),
    color: MainTheme.colorQuaternary,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    fontSize: hp('1.7%'),
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: '#000000',
    backgroundColor: '#F9FCFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D6E2D9',
  },
  multilineInput: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  helperText: {
    marginTop: 6,
    color: '#708070',
    fontSize: hp('1.5%'),
  },
  iconInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FCFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D6E2D9',
    paddingHorizontal: 12,
  },
  leadingIcon: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
  iconInput: {
    flex: 1,
    fontSize: hp('1.7%'),
    paddingVertical: 12,
    color: '#000000',
  },
  trailingIcon: {
    color: MainTheme.colorTertiary,
    marginLeft: 8,
  },
  messageBox: {
    alignContent: 'center',
    minHeight: 30,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: MainTheme.colorPrimary,
    width: 150,
    elevation: 0,
    borderColor: MainTheme.colorPrimary,
    borderRadius: 12,
  },
  secondaryButton: {
    backgroundColor: MainTheme.colorSecondary,
    width: 100,
    elevation: 0,
    borderWidth: 1,
    borderColor: MainTheme.colorButtonBorder,
    borderRadius: 12,
  },
});

const iButtonGroupCustomStyles = StyleSheet.create({
  container: {
    flex: null,
    flexDirection: 'row',
    paddingVertical: 5,
    justifyContent: 'space-evenly',
    marginTop: 4,
    flexWrap: 'wrap',
    rowGap: 10,
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
