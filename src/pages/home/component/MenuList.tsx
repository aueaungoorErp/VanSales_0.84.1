import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SectionGrid } from 'react-native-super-grid';
import { homeMenuList, MenuItem } from '../constant/HomeMenuList';
import Navigator from '../../../services/Navigator';
import Request from '../../../utils/Request';
import { clearPassword } from '../../../services/SecureCredentials';
import {
  getLoginGuID,
  getSettingConfig,
  getUserToken,
  removeLoginGuID,
  removeLoginInfo,
  removeUserToken,
  setAccessTimeToken,
  setSettingConfig,
} from '../../../utils/Token';

const MenuList: React.FC = () => {
  const [userToken, setUserToken] = useState<any>(null);
  const [loginGUID, setLoginGUID] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const token = await getUserToken();
      if (token) setUserToken(token);

      const guid = await getLoginGuID();
      if (guid) setLoginGUID(guid);
    };
    init();
  }, []);

  const onPress = async (screen?: string, functionName?: string) => {
    if (functionName === 'logout') {
      await logout();
    } else if (screen) {
      Navigator.navigate(screen);
    }
  };

  const logout = async () => {
    const settingConfig = await getSettingConfig();

    Request.setTimeCutOff();
    await removeUserToken();

    // Always clear the saved password from the keychain on logout.
    // Fingerprint login is unaffected because it reads credentials from
    // the persisted userWithFinger data, not from the keychain.
    await clearPassword();

    await removeLoginGuID();
    await removeLoginInfo();
    await setAccessTimeToken('0');

    if (settingConfig) {
      await setSettingConfig({
        ...settingConfig,
        USER_CODE: null,
        USER_PASSWORD: null,
        SALESMAN: null,
        VANCONFIG: null,
        COMPANYINFO: null,
      });
    }

    Request.removeAllHeaders();
    Request.removeAllHeadersV3();
    Navigator.reset('Auth');
  };

  const renderItem = ({ item }: { item: MenuItem }) => {
    return (
      <View style={styles.itemShell}>
        <TouchableOpacity
          onPress={() =>
            onPress(
              item.screen ? item.screen : undefined,
              item.methodName ? item.methodName : undefined,
            )
          }
          style={styles.touchable}
        >
          {item.iconType === 'MaterialCommunityIcons' && item.iconName ? (
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons
                name={item.iconName}
                size={item.iconSize || 96}
                color={item.iconColor || '#444444'}
              />
            </View>
          ) : item.imgSrc ? (
            <Image
              style={styles.image}
              resizeMode="contain"
              source={item.imgSrc}
            />
          ) : null}
          <Text style={styles.title} numberOfLines={2} allowFontScaling={false}>
            {item.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const homeMenu = homeMenuList;
  const itemDimension = Dimensions.get('window').width > 450 ? 170 : 130;

  return (
    <SectionGrid
      itemDimension={itemDimension}
      sections={[{ data: homeMenu }]}
      style={styles.gridView}
      renderItem={renderItem}
      renderSectionHeader={({ section }) => (
        <Text style={{ color: 'green' }}>{section.title}</Text>
      )}
    />
  );
};

export default MenuList;

const styles = StyleSheet.create({
  gridView: {
    flex: 1,
  },
  itemShell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  touchable: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  image: {
    width: 96,
    height: 96,
    alignSelf: 'center',
    marginBottom: 8,
  },
  iconWrap: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: hp('2%'),
    color: '#444444',
  },
});
