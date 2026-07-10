import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
const AntDesign = require('react-native-vector-icons/AntDesign').default;
import IActionButton from '../../../component/button/IActionButton';
import { MainTheme } from '../../../constant/lov';
import { strings } from '../../../locales/i18n';
import Navigator from '../../../services/Navigator';
import SettingForm, { type SettingFormActionController } from '../component/SettingForm.tsx';
import { settingConfigButtonGroup } from '../constant/settingConfigButtonGroup';
type SettingScreenProps = {
  navigation?: {
    addListener?: (eventName: string, callback: () => void | Promise<void>) => (() => void) | {
      remove?: () => void;
    };
  };
};
const SettingScreen: React.FC<SettingScreenProps> = ({
  navigation
}) => {
  const [vansalesConfig, setVanSaleConfig] = useState(false);
  const ktbConfig = false;
  const [canEditService, setCanEditService] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const actionControllerRef = useRef<SettingFormActionController | null>(null);
  useEffect(() => {
    if (ktbConfig && vansalesConfig) {
      Navigator.back();
    }
  }, [ktbConfig, vansalesConfig]);
  const onConnnectVanSales = (status: boolean) => {
    setVanSaleConfig(status);
  };
  const onActionsChange = (actions: SettingFormActionController) => {
    actionControllerRef.current = actions;
    setCanEditService(currentState => {
      return currentState === actions.canEditService ? currentState : actions.canEditService;
    });
    setIsActionLoading(currentState => {
      return currentState === actions.isLoading ? currentState : actions.isLoading;
    });
  };
  const handleButtonPress = async (methodName: 'confirm' | 'clear' | 'back') => {
    if (methodName === 'confirm') {
      await actionControllerRef.current?.onConfirmPress?.();
      return;
    }
    if (methodName === 'clear') {
      await actionControllerRef.current?.onClearPress?.();
      return;
    }
    Navigator.back();
  };
  return <View style={styles.container}>
      <View style={styles.heroSection}>
        <View style={styles.titleSection}>
          <AntDesign name="setting" color={MainTheme.colorQuaternary} size={30} />

          <Text style={styles.title} allowFontScaling={false}>
            {strings('login_setting.setting')}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SettingForm navigation={navigation} onConnnect={onConnnectVanSales} onActionsChange={onActionsChange}>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>จัดการการตั้งค่า</Text>

            <View style={styles.buttonGroup}>
              {settingConfigButtonGroup.map(item => <IActionButton key={item.methodName} title={item.title} variant={item.variant} style={styles.actionButton} disabled={isActionLoading} onPress={() => {
              handleButtonPress(item.methodName).catch(error => {});
            }} />)}

              {canEditService ? <IActionButton title="แก้ไขเซอร์วิส" variant="secondary" style={styles.actionButton} disabled={isActionLoading} onPress={() => {
              actionControllerRef.current?.onEditPress();
            }} /> : null}
            </View>
          </View>
        </SettingForm>
      </ScrollView>
    </View>;
};
export default SettingScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#F3F8F4'
  },
  heroSection: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: '#F3F8F4'
  },
  titleSection: {
    paddingLeft: 8,
    flexDirection: 'row',
    height: 50,
    alignItems: 'center'
  },
  title: {
    color: MainTheme.colorQuaternary,
    fontSize: hp('2.5%'),
    marginLeft: 8,
    fontWeight: '700'
  },
  heroCard: {
    backgroundColor: MainTheme.colorPrimary,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  heroHeading: {
    color: MainTheme.colorSecondary,
    fontSize: hp('2.3%'),
    fontWeight: '700',
    marginBottom: 6
  },
  heroDescription: {
    color: '#EDF9F2',
    fontSize: hp('1.7%'),
    lineHeight: 22
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 20
  },
  sectionCard: {
    backgroundColor: MainTheme.colorSecondary,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E3E8E4',
    paddingVertical: 16,
    paddingHorizontal: 14
  },
  sectionTitle: {
    color: MainTheme.colorQuaternary,
    fontSize: hp('2%'),
    fontWeight: '700',
    marginBottom: 12
  },
  buttonGroup: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 4,
    justifyContent: 'space-between',
    gap: 5,
    flexWrap: 'wrap'
  },
  actionButton: {
    width: '48%'
  }
});