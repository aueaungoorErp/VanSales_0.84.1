import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  const isConnected = Boolean(vanCNFMachine && salesMan && vanConfig);

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
     

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>เลือกเว็บเซอร์วิส</Text>

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
                  top: 14,
                  right: 12,
                },
                inputAndroid: styles.pickerInput,
                inputIOS: styles.pickerInput,
                placeholder: {
                  color: MainTheme.placeholerTextInput,
                },
              }}
              placeholder={{
                label: 'เลือกเว็บเซอร์วิส',
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
                  size={18}
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
      </View>

      <View style={[styles.sectionCard ]}>
        <Text style={styles.sectionTitle}>รายละเอียดการเชื่อมต่อ</Text>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{strings('login_setting.van_machine')}</Text>
            <Text style={styles.summaryValue}>{toInputValue(vanCNFMachine) || '-'}</Text>
          </View>

          

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{strings('login_setting.car_number')}</Text>
            <Text style={styles.summaryValue}>{toInputValue(vanConfig?.VANCNF_REG_NAME) || '-'}</Text>
          </View>

          <View style={styles.summaryItemWide}>
            <Text style={styles.summaryLabel}>{strings('login_setting.employee')}</Text>
            <Text style={styles.summaryValue}>{toInputValue(salesMan?.SLMN_NAME) || '-'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>จัดการการตั้งค่า</Text>

          

        <IButtonGroupCustom
          listItems={buttonListItems}
          renderItem={renderItem}
          style={iButtonGroupCustomStyles}
        />

        {service && (
          <View style={iButtonGroupCustomStyles.panel}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={_onEdit}
              activeOpacity={0.7}>
              <Text style={styles.editButtonTitle}>แก้ไขเซอร์วิส</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

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
    paddingTop: 6,
    paddingBottom: 8,
  },
  heroPanel: {
    backgroundColor: '#E8F4EC',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D8E7DC',
  },
  panelEyebrow: {
    color: '#64806A',
    fontSize: hp('1.5%'),
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  panelTitle: {
    color: MainTheme.colorQuaternary,
    fontSize: hp('2.3%'),
    fontWeight: '700',
    marginBottom: 6,
  },
  panelDescription: {
    color: '#5A6F60',
    fontSize: hp('1.7%'),
    lineHeight: 22,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  statusBadgeSuccess: {
    backgroundColor: '#DDF3E3',
  },
  statusBadgeIdle: {
    backgroundColor: '#EEF1EF',
  },
  statusText: {
    fontSize: hp('1.6%'),
    fontWeight: '700',
  },
  statusTextSuccess: {
    color: '#237447',
  },
  statusTextIdle: {
    color: '#6D756F',
  },
  sectionCard: {
    backgroundColor: MainTheme.colorSecondary,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E3E8E4',
    paddingVertical:16,
    paddingLeft:8
  },
  sectionTitle: {
    color: MainTheme.colorQuaternary,
    fontSize: hp('2%'),
    fontWeight: '700',
    marginBottom: 12,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  label: {
    color: MainTheme.colorQuaternary,
    fontSize: hp('1.7%'),
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D8E2DB',
    borderRadius: 14,
    paddingRight: 12,
    backgroundColor: '#F8FBF9',
  },
  pickerInput: {
    color: '#000000',
    fontSize: hp('1.7%'),
    paddingLeft: 14,
    paddingRight: 36,
    paddingVertical: 12,
  },
  pickerIcon: {
    marginTop: 2,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#D8E2DB',
    borderRadius: 14,
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: '#F8FBF9',
  },
  input: {
    fontSize: hp('1.7%'),
    color: '#000000',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  summaryItem: {
  width: '48%',
    backgroundColor: '#F6FAF7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E9E4',
  },
  summaryItemWide: {
    width: '100%',
    backgroundColor: '#F6FAF7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E9E4',
  },
  summaryLabel: {
    color: '#6E776F',
    fontSize: hp('1.5%'),
    marginBottom: 6,
  },
  summaryValue: {
    color: MainTheme.colorQuaternary,
    fontSize: hp('1.8%'),
    fontWeight: '700',
  },
  messageBox: {
    alignContent: 'center',
    minHeight: 34,
    marginBottom: 10,
  },
  editButton: {
    height: 44,
    backgroundColor: MainTheme.colorSecondary,
   width:100,
    elevation: 0,
    borderWidth: 0.5,
    borderColor: MainTheme.colorButtonBorder,
    borderRadius: 8,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonTitle: {
    color: MainTheme.colorPrimary,
    fontSize: hp('1.7%'),
  },
});

const iButtonGroupCustomStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 4,
    justifyContent: 'space-between',
    gap: 5,
    flexWrap: 'wrap',
  },
  panel: {
    flex: 1,
    justifyContent: 'center',
    height: 50,
  },
});
