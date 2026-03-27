import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IButtonGroupCustom from '../../../component/button/IButtonGroupCustom';
import ILoading from '../../../component/loading/ILoading';
import ITextWithErrorMessage from '../../../component/text/ITextWithErrorMessage';
import ITextWithSuccessMessage from '../../../component/text/ITextWithSuccessMessage';
import { MainTheme } from '../../../constant/lov';
import { strings } from '../../../locales/i18n';
import Navigator from '../../../services/Navigator';
import { getListServiceSetting } from '../../../utils/Token';

const toInputValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
};

const SettingForm = (props) => {
  const {
    baseUrl,
    vanCNFMachine,
    setVanCNFMachine,
    setBaseUrl,
    buttonListItems,
    renderItem,
    successMessage,
    errorMessage,
    isLoading,
    vanConfig,
    salesMan,
    onApplySelectedService,
    setUSER_CODE,
    setUSER_PASSWORD,
  } = props;

  const [service, setService] = useState(null);
  const [listServiceSettings, setList] = useState([]);

  const applySelectedService = async (selectedService, nextValueOverride = null) => {
    if (!selectedService) {
      return;
    }

    const nextValue = nextValueOverride ?? selectedService.value ?? null;
    const {webURL, number, USER_CODE, USER_PASSWORD} = selectedService;

    if (nextValue) {
      setService(nextValue);
    }

    await setVanCNFMachine(number ?? null);
    await setBaseUrl(webURL ?? null);
    await setUSER_CODE(USER_CODE ?? null);
    await setUSER_PASSWORD(USER_PASSWORD ?? null);

    await onApplySelectedService?.({
      ...selectedService,
      value: nextValue,
    });
  };

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      const config = await getListServiceSetting();
      const nextList = Array.isArray(config) ? config : [];

      if (!isMounted) {
        return;
      }

      setList(nextList);

      const matchedService = _.find(nextList, (item) => {
        return item?.webURL === baseUrl && item?.number === vanCNFMachine;
      });

      if (matchedService?.value) {
        setService(matchedService.value);
      }
    };

    loadServices();

    const unsubscribe = props.navigation?.addListener?.('focus', loadServices);

    return () => {
      isMounted = false;

      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [baseUrl, props.navigation, vanCNFMachine]);

  const _onChangeService = async (value) => {
    if (value === 'add') {
      setService(null);
      Navigator.navigate('ServiceSetting', {
        service: 'add',
        _webServiceKey: null,
        _webURL: null,
        _serviceName: null,
        _number: null,
        _user_code: null,
        _user_password: null,
        setService,
        applySelectedService,
      });
      return;
    }

    const nextValue = value ?? listServiceSettings?.[0]?.value ?? null;
    if (!nextValue) {
      return;
    }

    const selectedService = _.find(listServiceSettings, ['value', nextValue]);
    if (!selectedService) {
      return;
    }

    await applySelectedService(selectedService, nextValue);
  };

  const _onEdit = () => {
    const selectedService = _.find(listServiceSettings, ['value', service]);
    if (!selectedService) {
      return;
    }

    Navigator.navigate('ServiceSetting', {
      service: 'edit',
      _webServiceKey: service,
      _webURL: selectedService.webURL,
      _serviceName: selectedService.serviceName,
      _number: selectedService.number,
      _user_code: selectedService.USER_CODE,
      _user_password: selectedService.USER_PASSWORD,
      setService,
      applySelectedService,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.fieldBlock}>
        <Text style={styles.label}>{strings('login_setting.web_service')}</Text>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={_onChangeService}
            items={[
              ...listServiceSettings,
              {label: 'เพิ่มเซอร์วิส...', value: 'add'},
            ]}
            value={service}
            style={{
              iconContainer: {
                top: 12,
                right: 0,
              },
              inputAndroid: styles.pickerInput,
              inputIOS: styles.pickerInput,
              placeholder: {
                color: MainTheme.placeholerTextInput,
              },
            }}
            placeholder={{
              label: 'เลือก',
              value: null,
            }}
            textInputProps={{
              underlineColorAndroid: 'transparent',
              underlineColor: 'transparent',
            }}
            useNativeAndroidPickerStyle={false}
            Icon={() => (
              <AntDesign
                name="down"
                size={20}
                color={MainTheme.colorPrimary}
                style={styles.pickerIcon}
              />
            )}
          />
        </View>
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>URL</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={toInputValue(baseUrl)}
            onChangeText={setBaseUrl}
            placeholder="URL"
            placeholderTextColor={MainTheme.placeholerTextInput}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.labelMuted}>{strings('login_setting.van_machine')}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputMuted}
            editable={false}
            value={toInputValue(vanCNFMachine)}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.labelMuted}>{strings('login_setting.employee')}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={toInputValue(salesMan?.SLMN_NAME)}
            editable={false}
            style={styles.inputMuted}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.labelMuted}>{strings('login_setting.car_number')}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={toInputValue(vanConfig?.VANCNF_REG_NAME)}
            editable={false}
            style={styles.inputMuted}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>

      <IButtonGroupCustom
        listItems={buttonListItems}
        renderItem={renderItem}
        style={iButtonGroupCustomStyles}
      />

      {service && (
        <View style={iButtonGroupCustomStyles.panel}>
          <Button
            large
            buttonStyle={{
              backgroundColor: MainTheme.colorSecondary,
              width: 100,
              elevation: 0,
              borderWidth: 0.5,
              borderColor: MainTheme.colorButtonBorder,
            }}
            title="แก้ไข"
            titleStyle={{color: MainTheme.colorPrimary, fontSize: hp('1.7%')}}
            onPress={_onEdit}
          />
        </View>
      )}

      <View style={styles.messageBox}>
        <ITextWithSuccessMessage message={successMessage} />
        <ITextWithErrorMessage message={errorMessage} />
        <ILoading isLoading={isLoading} />
      </View>
    </View>
  );
};

export default SettingForm;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  label: {
    color: MainTheme.colorPrimary,
    fontSize: hp('1.7%'),
    marginBottom: 6,
  },
  labelMuted: {
    color: MainTheme.placeholerTextInput,
    fontSize: hp('1.7%'),
    marginBottom: 6,
  },
  pickerContainer: {
    borderBottomWidth: 0.5,
    borderColor: '#d6d7da',
    paddingRight: 0,
  },
  pickerInput: {
    color: '#000000',
    fontSize: hp('1.7%'),
    paddingRight: 30,
    paddingVertical: 12,
  },
  pickerIcon: {
    marginTop: 2,
  },
  inputContainer: {
    borderBottomWidth: 0.5,
    borderColor: '#d6d7da',
    minHeight: 44,
    justifyContent: 'center',
  },
  input: {
    fontSize: hp('1.7%'),
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  inputMuted: {
    color: MainTheme.placeholerTextInput,
    fontSize: hp('1.7%'),
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  messageBox: {
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
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
