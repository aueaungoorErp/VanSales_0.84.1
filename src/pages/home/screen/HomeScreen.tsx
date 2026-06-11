import { isSensorAvailable } from '@sbaiahmed1/react-native-biometrics';
import React from 'react';
import { connect } from 'react-redux';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  clearNewUser,
  hydrateUserBiometricState,
  isSameUserIdentity,
  persistBiometricPreference,
  setUserWithFinger,
} from '../../../action/user';
import { MainTheme } from '../../../constant/lov';
import { saveCredentials } from '../../../services/SecureCredentials';
import CTHeader from '../../user/container/CTHeader';
import MenuList from '../component/MenuList';

type UserIdentity = {
  service: string | null;
  USER_CODE: string | null;
  USER_PASSWORD?: string | null;
};

type HomeScreenProps = {
  clearNewUser: () => void;
  hydrateUserBiometricState: () => Promise<void>;
  navigation?: unknown;
  persistBiometricPreference: (
    value: boolean,
    userInfo: UserIdentity,
  ) => Promise<void>;
  setUserWithFinger: (userInfo: UserIdentity | null) => void;
  user?: {
    isBiometrics?: boolean;
    newUser?: UserIdentity | null;
    userInfo?: UserIdentity | null;
    userWithFinger?: UserIdentity | null;
  };
};

const HomeScreen: React.FC<HomeScreenProps> = props => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isFingerModalVisible, setIsFingerModalVisible] = React.useState(false);
  const [isSavingPreference, setIsSavingPreference] = React.useState(false);
  const [pendingUser, setPendingUser] = React.useState<UserIdentity | null>(
    null,
  );

  React.useEffect(() => {
    void props.hydrateUserBiometricState();
  }, [props.hydrateUserBiometricState]);

  React.useEffect(() => {
    const latestUser = props.user?.newUser ?? null;
    const isBiometricsEnabled = !!props.user?.isBiometrics;
    const hasFingerLinkedUser = !!props.user?.userWithFinger?.USER_CODE;

    if (!latestUser?.USER_CODE) {
      return;
    }

    if (isSameUserIdentity(props.user?.userInfo, latestUser)) {
      if (isBiometricsEnabled && !hasFingerLinkedUser) {
        setPendingUser(latestUser);
        setIsFingerModalVisible(true);
      }
      props.clearNewUser();
      return;
    }

    setPendingUser(latestUser);
    setIsModalVisible(true);
  }, [
    props.clearNewUser,
    props.user?.isBiometrics,
    props.user?.newUser,
    props.user?.userInfo,
    props.user?.userWithFinger,
  ]);

  const closeModal = React.useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const closeFingerModal = React.useCallback(() => {
    setIsFingerModalVisible(false);
    setPendingUser(null);
  }, []);

  const handleDecline = React.useCallback(async () => {
    if (!pendingUser) {
      return;
    }

    setIsSavingPreference(true);
    try {
      await props.persistBiometricPreference(false, pendingUser);
      props.clearNewUser();
      closeModal();
      setPendingUser(null);
    } finally {
      setIsSavingPreference(false);
    }
  }, [
    closeModal,
    pendingUser,
    props.clearNewUser,
    props.persistBiometricPreference,
  ]);

  const handleAccept = React.useCallback(async () => {
    if (!pendingUser?.USER_CODE || !pendingUser?.USER_PASSWORD) {
      Alert.alert(
        'ไม่สามารถเปิดใช้งาน Biometrics',
        'ไม่พบข้อมูลผู้ใช้สำหรับเปิดใช้งาน Biometrics',
      );
      return;
    }

    setIsSavingPreference(true);

    try {
      const sensorInfo = await isSensorAvailable();

      if (!sensorInfo?.available || !sensorInfo?.isDeviceSecure) {
        Alert.alert(
          'ไม่สามารถเปิดใช้งาน Biometrics',
          'อุปกรณ์นี้ยังไม่รองรับหรือยังไม่ได้ตั้งค่า Biometrics',
        );
        return;
      }

      const saved = await saveCredentials(
        pendingUser.USER_CODE,
        pendingUser.USER_PASSWORD,
      );

      if (!saved) {
        Alert.alert(
          'ไม่สามารถเปิดใช้งาน Biometrics',
          'ไม่สามารถบันทึกข้อมูลเข้าสู่ระบบสำหรับ Biometrics ได้',
        );
        return;
      }

      const shouldPromptFingerUpdate = !isSameUserIdentity(
        props.user?.userWithFinger,
        pendingUser,
      );

      await props.persistBiometricPreference(true, pendingUser);
      props.clearNewUser();
      closeModal();

      if (shouldPromptFingerUpdate) {
        setIsFingerModalVisible(true);
      } else {
        setPendingUser(null);
      }
    } finally {
      setIsSavingPreference(false);
    }
  }, [
    closeModal,
    pendingUser,
    props.clearNewUser,
    props.persistBiometricPreference,
    props.user?.userWithFinger,
  ]);

  const handleFingerSave = React.useCallback(() => {
    if (pendingUser?.USER_CODE && pendingUser?.USER_PASSWORD) {
      props.setUserWithFinger(pendingUser);
    }
    closeFingerModal();
  }, [closeFingerModal, pendingUser, props.setUserWithFinger]);

  const handleFingerSkip = React.useCallback(() => {
    closeFingerModal();
  }, [closeFingerModal]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CTHeader />
      </View>
      <View style={styles.body}>
        <MenuList />
      </View>

      <Modal transparent visible={isModalVisible} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>เปิดใช้งาน Biometrics</Text>
            <Text style={styles.modalBody}>
              ต้องการเปิดใช้งานการสแกนใบหน้าหรือลายนิ้วมือเพื่อเข้าสู่ระบบครั้งถัดไปหรือไม่
            </Text>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                disabled={isSavingPreference}
                onPress={() => {
                  void handleDecline();
                }}
                style={[styles.modalButton, styles.secondaryButton]}
              >
                <Text style={styles.secondaryButtonText}>ไม่ต้องการ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={isSavingPreference}
                onPress={() => {
                  void handleAccept();
                }}
                style={[styles.modalButton, styles.primaryButton]}
              >
                <Text style={styles.primaryButtonText}>เปิดใช้งาน</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={isFingerModalVisible} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>เชื่อมลายนิ้วมือ</Text>
            <Text style={styles.modalBody}>
              ต้องการอัปเดตผู้ใช้นี้ให้เชื่อมกับลายนิ้วมือสำหรับเข้าสู่ระบบครั้งถัดไปหรือไม่
            </Text>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                onPress={handleFingerSkip}
                style={[styles.modalButton, styles.secondaryButton]}
              >
                <Text style={styles.secondaryButtonText}>ไม่บันทึก</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleFingerSave}
                style={[styles.modalButton, styles.primaryButton]}
              >
                <Text style={styles.primaryButtonText}>บันทึก</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: any) => ({
  hydrateUserBiometricState: () => dispatch(hydrateUserBiometricState()),
  persistBiometricPreference: (value: boolean, userInfo: UserIdentity) =>
    dispatch(persistBiometricPreference(value, userInfo)),
  clearNewUser: () => dispatch(clearNewUser()),
  setUserWithFinger: (userInfo: UserIdentity | null) =>
    dispatch(setUserWithFinger(userInfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: MainTheme.colorSecondary,
  },
  header: {
    flex: 0.3,
    flexDirection: 'column',
    backgroundColor: MainTheme.colorQuinary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 0.7,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '86%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 24,
    elevation: 6,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222222',
    textAlign: 'center',
  },
  modalBody: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: '#444444',
    textAlign: 'center',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: '#F2F2F2',
    marginRight: 8,
  },
  primaryButton: {
    backgroundColor: MainTheme.colorTertiary,
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#444444',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
