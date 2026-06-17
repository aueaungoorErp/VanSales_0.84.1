import React, { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import IActionButton from '../../../component/button/IActionButton';
import ILoading from '../../../component/loading/ILoading';
import { MainTheme } from '../../../constant/lov';
import { testLongdoMapApiKey } from '../../../services/longdomap';
import Navigator from '../../../services/Navigator';
import {
  getLongdoMapApiKeyConfigs,
  getSettingConfig,
  setLongdoMapApiKeyConfigs,
} from '../../../utils/Token';

const AntDesign = require('react-native-vector-icons/AntDesign')
  .default as ComponentType<any>;

type LongdoApiKeyConfig = {
  key: string;
  outoflimit: boolean;
};

type LongdoKeyValidation = {
  status: 'success' | 'limit' | 'invalid' | 'error';
  message: string;
};

const createDefaultRow = (): LongdoApiKeyConfig => ({
  key: '',
  outoflimit: false,
});

const normalizeConfigsForUi = (configs: LongdoApiKeyConfig[]) => {
  return configs.length > 0 ? configs : [createDefaultRow()];
};

const getDuplicateLongdoKeyIndexes = (configs: LongdoApiKeyConfig[]) => {
  const indexesByKey: Record<string, number[]> = {};

  configs.forEach((item, index) => {
    const normalizedKey = String(item?.key ?? '').trim();
    if (!normalizedKey) {
      return;
    }

    if (!indexesByKey[normalizedKey]) {
      indexesByKey[normalizedKey] = [];
    }

    indexesByKey[normalizedKey].push(index);
  });

  return Object.values(indexesByKey).reduce<number[]>((result, indexes) => {
    if (indexes.length > 1) {
      result.push(...indexes);
    }
    return result;
  }, []);
};

const buildPersistableConfigs = (
  sourceConfigs: LongdoApiKeyConfig[],
  sourceValidations: Record<number, LongdoKeyValidation>,
) => {
  return sourceConfigs
    .map((item, index) => ({
      key: String(item?.key ?? '').trim(),
      outoflimit: Boolean(item?.outoflimit),
      status: sourceValidations[index]?.status ?? null,
    }))
    .filter(item => item.key !== '' && item.status === 'success')
    .map(item => ({
      key: item.key,
      outoflimit: item.outoflimit,
    }))
    .slice(0, 3);
};

const LongdoApiKeySettingScreen: React.FC = () => {
  const [configs, setConfigs] = useState<LongdoApiKeyConfig[]>([
    createDefaultRow(),
  ]);
  const [validations, setValidations] = useState<Record<number, LongdoKeyValidation>>(
    {},
  );
  const [testingIndex, setTestingIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vanCode, setVanCode] = useState<string | null>(null);

  const loadConfigs = async () => {
    const settingConfig = await getSettingConfig();
    const nextVanCode = settingConfig?.vanCNFMachine ?? null;
    setVanCode(nextVanCode);
    const storedConfigs = await getLongdoMapApiKeyConfigs(nextVanCode);
    setConfigs(normalizeConfigsForUi(storedConfigs));
    setValidations(
      storedConfigs.reduce<Record<number, LongdoKeyValidation>>((result, _, index) => {
        result[index] = {
          status: 'success',
          message: 'พร้อมใช้งาน',
        };
        return result;
      }, {}),
    );
  };

  useEffect(() => {
    void loadConfigs();
  }, []);

  const persistConfigs = async (
    nextConfigs: LongdoApiKeyConfig[],
    nextValidations: Record<number, LongdoKeyValidation>,
  ) => {
    const persistableConfigs = buildPersistableConfigs(
      nextConfigs,
      nextValidations,
    );

    await (setLongdoMapApiKeyConfigs as any)(persistableConfigs, vanCode ?? null);
  };

  const onChangeKey = (index: number, value: string) => {
    const nextConfigs = configs.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            key: value,
            outoflimit: false,
          }
        : item,
    );
    const duplicateIndexes = getDuplicateLongdoKeyIndexes(nextConfigs);

    setConfigs(nextConfigs);
    setValidations(current => {
      const nextValidations = { ...current };
      delete nextValidations[index];

      Object.keys(nextValidations).forEach(key => {
        if (
          nextValidations[Number(key)]?.message ===
          'API Key ซ้ำกับช่องอื่น'
        ) {
          delete nextValidations[Number(key)];
        }
      });

      duplicateIndexes.forEach(duplicateIndex => {
        nextValidations[duplicateIndex] = {
          status: 'invalid',
          message: 'API Key ซ้ำกับช่องอื่น',
        };
      });

      return nextValidations;
    });
  };

  const onAddKey = () => {
    if (configs.length >= 3) {
      return;
    }

    setConfigs(current => [...current, createDefaultRow()]);
  };

  const onRemoveKey = (index: number) => {
    const nextConfigs = configs.filter((_, itemIndex) => itemIndex !== index);
    setConfigs(normalizeConfigsForUi(nextConfigs));
    const nextValidations: Record<number, LongdoKeyValidation> = {};
    Object.keys(validations).forEach(key => {
      const numericKey = Number(key);
      if (numericKey < index) {
        nextValidations[numericKey] = validations[numericKey];
      } else if (numericKey > index) {
        nextValidations[numericKey - 1] = validations[numericKey];
      }
    });
    setValidations(nextValidations);
    void persistConfigs(normalizeConfigsForUi(nextConfigs), nextValidations);
  };

  const onTestKey = async (index: number) => {
    const targetConfig = configs[index];
    const key = String(targetConfig?.key ?? '').trim();
    const duplicateIndexes = getDuplicateLongdoKeyIndexes(configs);

    if (!key) {
      setValidations(current => ({
        ...current,
        [index]: {
          status: 'invalid',
          message: 'กรุณาระบุ Longdo Map API Key',
        },
      }));
      Alert.alert('ไม่สำเร็จ', `ช่องที่ ${index + 1}: กรุณาระบุ Longdo Map API Key`);
      return;
    }

    if (duplicateIndexes.includes(index)) {
      setValidations(current => ({
        ...current,
        [index]: {
          status: 'invalid',
          message: 'API Key ซ้ำกับช่องอื่น',
        },
      }));
      Alert.alert('ไม่สำเร็จ', `ช่องที่ ${index + 1}: API Key ซ้ำกับช่องอื่น`);
      return;
    }

    setTestingIndex(index);
    setIsLoading(true);

    try {
      const result = await testLongdoMapApiKey(key);
      const nextConfigs = configs.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              outoflimit: result.status === 'limit',
            }
          : item,
      );

      const nextValidations = {
        ...validations,
        [index]: {
          status: result.status,
          message: result.message,
        },
      };

      setConfigs(nextConfigs);
      setValidations(nextValidations);

      if (result.status === 'success') {
        await persistConfigs(nextConfigs, nextValidations);
      }

      Alert.alert(
        result.status === 'success' ? 'สำเร็จ' : 'ตรวจสอบ Longdo API Key',
        `ช่องที่ ${index + 1}: ${result.message}`,
      );
    } finally {
      setTestingIndex(null);
      setIsLoading(false);
    }
  };

  const getStatusText = (config: LongdoApiKeyConfig, index: number) => {
    const validation = validations[index];
    if (validation) {
      return validation.message;
    }

    if (!String(config.key ?? '').trim()) {
      return 'ยังไม่ได้กำหนด';
    }

    if (config.outoflimit) {
      return 'limit เต็ม';
    }

    return 'ยังไม่ทดสอบ';
  };

  const getStatusStyle = (config: LongdoApiKeyConfig, index: number) => {
    const validation = validations[index];
    if (validation?.status === 'success') {
      return styles.keySuccessText;
    }

    if (
      validation &&
      ['limit', 'invalid', 'error'].includes(validation.status)
    ) {
      return styles.keyErrorText;
    }

    if (config.outoflimit) {
      return styles.keyErrorText;
    }

    return styles.keyNeutralText;
  };

  const getInputStyle = (config: LongdoApiKeyConfig, index: number) => {
    const validation = validations[index];
    if (validation?.status === 'success') {
      return styles.inputSuccess;
    }

    if (
      config.outoflimit ||
      (validation && ['limit', 'invalid', 'error'].includes(validation.status))
    ) {
      return styles.inputError;
    }

    return null;
  };

  return (
    <View style={styles.screen}>
      <View style={styles.titleSection}>
        <AntDesign name="key" color={MainTheme.colorQuaternary} size={28} />
        <Text style={styles.title} allowFontScaling={false}>
          ตั้งค่า Longdo API Key
        </Text>
      </View>

      <ScrollView
        style={styles.form}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionCard}>
          <View style={styles.keyHeaderRow}>
            <Text style={styles.sectionTitle}>รายการ API Key</Text>
            {configs.length < 3 ? (
              <TouchableOpacity
                style={styles.addKeyButton}
                activeOpacity={0.7}
                onPress={onAddKey}
                disabled={isLoading}
              >
                <AntDesign name="plus" size={14} color={MainTheme.colorPrimary} />
                <Text style={styles.addKeyText}>เพิ่ม</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {configs.map((config, index) => (
            <View key={`longdo-config-${index}`} style={styles.fieldBlock}>
              <View style={styles.keyLabelRow}>
                <Text style={styles.label}>Longdo API Key {index + 1}</Text>
                <TouchableOpacity
                  style={styles.removeKeyButton}
                  activeOpacity={0.7}
                  onPress={() => onRemoveKey(index)}
                  disabled={isLoading}
                >
                  <AntDesign name="delete" size={14} color="#D64545" />
                  <Text style={styles.removeKeyText}>ลบ API Key</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={[styles.input, getInputStyle(config, index)]}
                value={config.key}
                onChangeText={value => onChangeKey(index, value)}
                placeholder="Longdo Map API Key"
                placeholderTextColor={MainTheme.placeholerTextInput}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={[styles.keyStatusText, getStatusStyle(config, index)]}>
                {getStatusText(config, index)}
              </Text>

              <IActionButton
                title={testingIndex === index ? 'กำลังทดสอบ...' : 'ทดสอบ Key นี้'}
                variant="secondary"
                disabled={isLoading}
                style={styles.testButton}
                onPress={() => {
                  onTestKey(index).catch(error => {
                    setTestingIndex(null);
                    setIsLoading(false);
                    Alert.alert(
                      'ไม่สำเร็จ',
                      error?.message || 'ทดสอบ Longdo API Key ไม่สำเร็จ',
                    );
                  });
                }}
              />
            </View>
          ))}
        </View>

        <View style={styles.messageBox}>
          <ILoading isLoading={isLoading} />
        </View>

        <View style={styles.footerButtonGroup}>
          <IActionButton
            title="ย้อนกลับ"
            variant="secondary"
            disabled={isLoading}
            onPress={() => Navigator.back()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default LongdoApiKeySettingScreen;

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
    fontWeight: '700',
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
  },
  keyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fieldBlock: {
    marginBottom: 16,
  },
  keyLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  inputError: {
    borderColor: MainTheme.colorDanger,
    borderWidth: 1.5,
    backgroundColor: '#FFF7F7',
  },
  inputSuccess: {
    borderColor: MainTheme.colorPrimary,
    borderWidth: 1.5,
    backgroundColor: '#F2FBF4',
  },
  addKeyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: MainTheme.colorButtonBorder,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: MainTheme.colorSecondary,
  },
  addKeyText: {
    color: MainTheme.colorPrimary,
    fontSize: hp('1.55%'),
    marginLeft: 4,
  },
  removeKeyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#F1B7B7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFF6F6',
    marginBottom: 8,
  },
  removeKeyText: {
    color: '#D64545',
    fontSize: hp('1.55%'),
    marginLeft: 4,
  },
  keyStatusText: {
    fontSize: hp('1.45%'),
    marginTop: 6,
  },
  keySuccessText: {
    color: MainTheme.colorPrimary,
  },
  keyErrorText: {
    color: '#D64545',
  },
  keyNeutralText: {
    color: '#6E776F',
  },
  testButton: {
    marginTop: 10,
  },
  messageBox: {
    minHeight: 34,
    marginBottom: 10,
  },
  footerButtonGroup: {
    paddingBottom: 10,
  },
});
