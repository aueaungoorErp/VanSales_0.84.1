import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import CTSettingForm from '../container/CTSettingForm';
import KTBSettingForm from '../container/KTBSettingForm';
import {MainTheme} from '../../../constant/lov';
import Navigator from '../../../services/Navigator';
import {Icon} from 'react-native-elements';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {strings} from '../../../locales/i18n';

const Setting = (props) => {
  const [vansalesConfig, setVanSaleConfig] = useState(false);
  const [ktbConfig, setKTBConfig] = useState(false);

  const _onConnnectVanSales = (status) => {
    setVanSaleConfig(status);
  };

  const _onConnnectKTB = (status) => {
    setKTBConfig(status);
  };

  if (ktbConfig && vansalesConfig) {
    Navigator.back();
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Icon
          name="settings"
          type="material"
          color={MainTheme.colorQuaternary}
          size={30}
        />

        <Text
          style={{color: MainTheme.colorQuaternary, fontSize: hp('2.5%')}}
          allowFontScaling={false}>
          {' '}
          {strings('login_setting.setting')}{' '}
        </Text>
      </View>
      <ScrollView style={{flex: 1}}>
        <CTSettingForm
          navigation={props.navigation}
          onConnnect={_onConnnectVanSales}
        />
        {
        // <KTBSettingFormz
        //   navigation={props.navigation}
        //   onConnnect={_onConnnectKTB}
        // />
        }
      </ScrollView>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: MainTheme.colorSecondary,
    padding: 5,
  },
  titleSection: {
    paddingLeft: 15,
    flexDirection: 'row',
    borderBottomColor: MainTheme.colorQuaternary,
    borderBottomWidth: 0.5,
    height: 50,
    alignItems: 'center',
  },
});
