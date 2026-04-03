import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { MainTheme } from '../../../constant/lov';
import { strings } from '../../../locales/i18n';
import Navigator from '../../../services/Navigator';
import CTSettingForm from '../container/CTSettingForm';

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
      <View style={styles.heroSection}>
        <View style={styles.titleSection}>
          <AntDesign
            name="setting"
            color={MainTheme.colorQuaternary}
            size={30}
          />

          <Text
            style={styles.title}
            allowFontScaling={false}>
            {strings('login_setting.setting')}
          </Text>
        </View>

      
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
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
    backgroundColor: '#F3F8F4',
  },
  heroSection: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: '#F3F8F4',
  },
  titleSection: {
    paddingLeft: 8,
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  title: {
    color: MainTheme.colorQuaternary,
    fontSize: hp('2.5%'),
    marginLeft: 8,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: MainTheme.colorPrimary,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  heroHeading: {
    color: MainTheme.colorSecondary,
    fontSize: hp('2.3%'),
    fontWeight: '700',
    marginBottom: 6,
  },
  heroDescription: {
    color: '#EDF9F2',
    fontSize: hp('1.7%'),
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 20,
  },
});
