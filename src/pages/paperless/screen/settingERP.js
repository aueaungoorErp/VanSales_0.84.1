import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { setSettingERP } from '../../../action/report';
import {
    mainDivider,
    settingErpChoice
} from '../../../constant/lov';
import { getUserToken } from '../../../utils/Token';
const SettingERP = () => {
  const dispatch = useDispatch();
  const settingERP = useSelector(({report}) => report.settingERP);
  const [userToken, setUserToken] = useState(null);

  const _getUserToken = async () => {
    const userToken = await getUserToken();
    if (userToken) {
      console.log('cs ', userToken.VANCONFIG);
      await setUserToken(userToken);
    }
  };

  // const _getWSv3SettingConfig = async () => {
  //   const config = await getSettingConfig();
  //   console.log('_getWSv3SettingConfig config ', config);
  //   if (config) {
  //     await setConfig(config);
  //   }
  // };

  useEffect(() => {
    _getUserToken();
  }, []);

  return (
    <View style={{flex: 1, padding: 10}}>
      <>
        {userToken &&
        userToken.VANCONFIG &&
        userToken.VANCONFIG.VANCNF_ENABLE_INV == 'Y' ? (
          <>
            <Text style={{ fontSize: hp('2%')}}>
              {'ใบขายเชื่อ'}
            </Text>
            <RNPickerSelect
              items={settingErpChoice}
              onValueChange={async (value) => {
                await dispatch(setSettingERP({...settingERP, cash: value}));
              }}
              value={settingERP.cash}
              placeholder={{
                label: 'เลือก',
                value: null,
              }}
              useNativeAndroidPickerStyle={true}
            />
            <View style={mainDivider} />
          </>
        ) : null}
        {userToken &&
        userToken.VANCONFIG &&
        userToken.VANCONFIG.VANCNF_ENABLE_SKUCOUNT == 'Y' ? (
          <>
            <Text style={{marginTop: 10, fontSize: hp('2%')}}>
              {'ใบตรวจนับ'}
            </Text>
            <RNPickerSelect
              items={settingErpChoice}
              onValueChange={async (value) => {
                await dispatch(setSettingERP({...settingERP, skucount: value}));
              }}
              value={settingERP.skucount}
              placeholder={{
                label: 'เลือก',
                value: null,
              }}
              useNativeAndroidPickerStyle={true}
            />
            <View style={mainDivider} />
          </>
        ) : null}

        {userToken &&
        userToken.VANCONFIG &&
        userToken.VANCONFIG.VANCNF_ENABLE_TRANSFER == 'Y' ? (
          <>
            <Text style={{marginTop: 10, fontSize: hp('2%')}}>
              {'ใบโอนย้าย'}
            </Text>
            <RNPickerSelect
              items={settingErpChoice}
              onValueChange={async (value) => {
                await dispatch(setSettingERP({...settingERP, transfer: value}));
              }}
              value={settingERP.transfer}
              placeholder={{
                label: 'เลือก',
                value: null,
              }}
              useNativeAndroidPickerStyle={true}
            />
            <View style={mainDivider} />
          </>
        ) : null}

        {userToken &&
        userToken.VANCONFIG &&
        userToken.VANCONFIG.VANCNF_ENABLE_RTN == 'Y' ? (
          <>
            <Text style={{marginTop: 10, fontSize: hp('2%')}}>
              {'ใบรับคืน'}
            </Text>
            <RNPickerSelect
              items={settingErpChoice}
              onValueChange={async (value) => {
                await dispatch(setSettingERP({...settingERP, return: value}));
              }}
              value={settingERP.return}
              placeholder={{
                label: 'เลือก',
                value: null,
              }}
              useNativeAndroidPickerStyle={true}
            />
            <View style={mainDivider} />
          </>
        ) : null}

        {userToken &&
        userToken.VANCONFIG &&
        userToken.VANCONFIG.VANCNF_ENABLE_BOOK == 'Y' ? (
          <>
            <Text style={{marginTop: 10, fontSize: hp('2%')}}>{'ใบจอง'}</Text>
            <RNPickerSelect
              items={settingErpChoice}
              onValueChange={async (value) => {
                await dispatch(setSettingERP({...settingERP, reserv: value}));
              }}
              value={settingERP.reserv}
              placeholder={{
                label: 'เลือก',
                value: null,
              }}
              useNativeAndroidPickerStyle={true}
            />
            <View style={mainDivider} />
          </>
        ) : null}

        {userToken &&
        userToken.VANCONFIG &&
        userToken.VANCONFIG.VANCNF_ENABLE_QUOTE == 'Y' ? (
          <>
            <Text style={{marginTop: 10, fontSize: hp('2%')}}>
              {'ใบเสนอราคา'}
            </Text>
            <RNPickerSelect
              items={settingErpChoice}
              onValueChange={async (value) => {
                await dispatch(
                  setSettingERP({...settingERP, quotation: value}),
                );
              }}
              value={settingERP.quotation}
              placeholder={{
                label: 'เลือก',
                value: null,
              }}
              useNativeAndroidPickerStyle={true}
            />
            <View style={mainDivider} />
          </>
        ) : null}
      </>
    </View>
  );
};

export default SettingERP;

const styles = StyleSheet.create({
  lineSection: {
    flexDirection: 'row',
  },
  inputAndroid: {
    color: '#000000',
    paddingTop: 15,
    fontSize: hp('1.7%'),
  },
  dropDown: {
    backgroundColor: 'red',
  },
});
