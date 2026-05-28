import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MainTheme, MOBILE5INCH } from '../../../constant/lov';
import { strings } from '../../../locales/i18n';
import { getSettingConfig, getUserToken } from '../../../utils/Token';

type CompanyInfo = {
  CMPNY_TCOMPANYNAME?: string | null;
};

type Salesman = {
  SLMN_NAME?: string | null;
};

type UserTab = {
  USER_TH_POSITION?: string | null;
};

type VanConfig = {
  VANCNF_MACHINE?: string | null;
  VANCNF_REG_NAME?: string | null;
};

type UserTokenState = {
  COMPANYINFO?: CompanyInfo | null;
  SALESMAN?: Salesman | null;
  USERTAB?: UserTab | null;
  VANCONFIG?: VanConfig | null;
};

const margin = Dimensions.get('window').width > MOBILE5INCH ? 20 : 10;

const CTHeader: React.FC = () => {
  const [userToken, setUserToken] = useState<UserTokenState | null>(null);

  useEffect(() => {
    const loadUserToken = async () => {
      const nextUserToken = await getUserToken();
      const settingConfig = await getSettingConfig();
      const mergedUserToken = {
        ...(nextUserToken ?? {}),
        COMPANYINFO:
          nextUserToken?.COMPANYINFO ?? settingConfig?.COMPANYINFO ?? null,
        SALESMAN: nextUserToken?.SALESMAN ?? settingConfig?.SALESMAN ?? null,
        VANCONFIG: nextUserToken?.VANCONFIG ?? settingConfig?.VANCONFIG ?? null,
      };

      if (nextUserToken || settingConfig) {
        setUserToken(mergedUserToken);
      }
    };

    void loadUserToken();
  }, []);

  return (
    <View style={styles.container}>
      <Text
        style={[styles.title, { fontSize: hp('2.5%'), textAlign: 'center' }]}
        allowFontScaling={true}
      >
        {userToken?.COMPANYINFO?.CMPNY_TCOMPANYNAME ?? null}
      </Text>

      <Text
        style={[styles.title, { fontSize: hp('2%'), marginTop: 5 }]}
        allowFontScaling={false}
      >
        {userToken?.SALESMAN?.SLMN_NAME ?? null}
      </Text>

      <View style={styles.divider} />

      <Text
        style={[styles.title, { fontSize: hp('3%') }]}
        allowFontScaling={false}
      >
        {strings('user_detail.van_machine')}
        {userToken?.USERTAB?.USER_TH_POSITION
          ? ` ${userToken.USERTAB.USER_TH_POSITION}`
          : ''}
        {` ${userToken?.VANCONFIG?.VANCNF_MACHINE ?? ''}`}
      </Text>

      <Text
        style={[styles.title, { fontSize: hp('2%') }]}
        allowFontScaling={false}
      >
        {strings('user_detail.car_number')}
        {userToken?.VANCONFIG?.VANCNF_REG_NAME
          ? ` ${userToken.VANCONFIG.VANCNF_REG_NAME}`
          : ''}
      </Text>
    </View>
  );
};

export default CTHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
  },
  divider: {
    borderBottomWidth: 0.3,
    borderColor: MainTheme.colorSecondary,
    width: 350,
    marginTop: margin,
    marginBottom: margin,
  },
});
