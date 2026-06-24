import React, { useCallback, useRef, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  InteractionManager,
} from 'react-native';
import type { ViewStyle } from 'react-native';
import { MainTheme, mainContainer } from '../../../constant/lov';
import BackHandlerHOC from '../../../hoc/BackHandlerHOC';
import CustomerRouteList from '../component/CustomerRouteList';
import SearchForm from '../component/SearchForm';
import type { CustomerRouteDistanceItem } from '../../../services/customerRouteDistancePipeline';
import type { CustomerRouteLoadSummary } from '../../../services/customerRouteLoadSession';

type CustomerMapProps = {
  navigation?: unknown;
};

const CustomerMap: React.FC<CustomerMapProps> = props => {
  const [isTimedLoading, setIsTimedLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    'กำลังโหลดและคำนวณเส้นทาง',
  );
  const [managedSortedCustomers, setManagedSortedCustomers] = useState<
    CustomerRouteDistanceItem[] | null
  >(null);
  const [loadSummaryModal, setLoadSummaryModal] =
    useState<CustomerRouteLoadSummary | null>(null);
  const continueTimedLoadRef = useRef<(() => void) | null>(null);

  const handleTimedLoadingChange = useCallback((value: boolean) => {
    setIsTimedLoading(value);
  }, []);
  const handleLoadingMessageChange = useCallback((value: string) => {
    setLoadingMessage(value);
  }, []);
  const handleTimedLoadStart = useCallback(() => {
    setManagedSortedCustomers(null);
    setLoadSummaryModal(null);
  }, []);
  const handleRoundComplete = useCallback(
    (sortedItems: CustomerRouteDistanceItem[]) => {
      setManagedSortedCustomers(sortedItems);
    },
    [],
  );
  const handleLoadSummary = useCallback(
    (summary: CustomerRouteLoadSummary | null) => {
      if (summary === null) {
        setLoadSummaryModal(null);
        return;
      }

      InteractionManager.runAfterInteractions(() => {
        setLoadSummaryModal(summary);
        console.log('[CustomerRoute] load summary modal shown', summary);
      });
    },
    [],
  );

  const isLoadSummaryVisible = loadSummaryModal !== null;

  return (
    <View style={[styles.container, { paddingTop: 5 }]}>
      <SearchForm
        {...props}
        onLoadingMessageChange={handleLoadingMessageChange}
        onTimedLoadingChange={handleTimedLoadingChange}
        onTimedLoadStart={handleTimedLoadStart}
        onRoundComplete={handleRoundComplete}
        onLoadSummary={handleLoadSummary}
        continueTimedLoadRef={continueTimedLoadRef}
      />
      <CustomerRouteList
        isTimedLoading={isTimedLoading}
        loadingMessage={loadingMessage}
        onLoadingMessageChange={handleLoadingMessageChange}
        managedSortedCustomers={managedSortedCustomers}
        isLoadSummaryVisible={isLoadSummaryVisible}
      />

      <Modal
        transparent
        visible={isLoadSummaryVisible}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setLoadSummaryModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>โหลดข้อมูลสำเร็จ</Text>
            <Text style={styles.modalMessage}>
              {`โหลดแล้ว ${loadSummaryModal?.totalLoaded ?? 0} / ${
                loadSummaryModal?.totalAvailable ?? 0
              } รายการ`}
            </Text>
            <Text style={styles.modalMessage}>
              {loadSummaryModal?.hasMore
                ? loadSummaryModal?.stoppedByTimeLimit
                  ? `ครบ 1 นาทีแล้ว เหลืออีก ${
                      loadSummaryModal?.remainingCount ?? 0
                    } รายการ ต้องการโหลดข้อมูลต่อหรือไม่`
                  : `ยังเหลืออีก ${
                      loadSummaryModal?.remainingCount ?? 0
                    } รายการ ต้องการโหลดข้อมูลต่อหรือไม่`
                : (loadSummaryModal?.totalLoaded ?? 0) <
                  (loadSummaryModal?.totalAvailable ?? 0)
                ? `โหลดครบตามข้อมูลที่ใช้งานได้แล้ว ${
                    loadSummaryModal?.totalLoaded ?? 0
                  } จากทั้งหมด ${loadSummaryModal?.totalAvailable ?? 0} รายการ`
                : 'โหลดข้อมูลครบแล้ว'}
            </Text>

            <View style={styles.modalButtonRow}>
              {loadSummaryModal?.hasMore ? (
                <TouchableOpacity
                  style={styles.modalSecondaryButton}
                  onPress={() => setLoadSummaryModal(null)}
                >
                  <Text style={styles.modalSecondaryButtonText}>ไม่โหลดต่อ</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={styles.modalPrimaryButton}
                onPress={() => {
                  const shouldContinue = loadSummaryModal?.hasMore === true;
                  setLoadSummaryModal(null);

                  if (shouldContinue) {
                    continueTimedLoadRef.current?.();
                  }
                }}
              >
                <Text style={styles.modalPrimaryButtonText}>
                  {loadSummaryModal?.hasMore ? 'โหลดข้อมูลต่อ' : 'ปิด'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BackHandlerHOC(CustomerMap);

const styles = StyleSheet.create({
  container: mainContainer as ViewStyle,
  containerStyle: {
    width: '100%',
    height: 40,
    borderRadius: 6,
    borderColor: MainTheme.colorPrimary,
  },
  buttonStyle: {
    backgroundColor: MainTheme.colorSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  modalPrimaryButton: {
    minWidth: 96,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: MainTheme.colorPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  modalSecondaryButton: {
    minWidth: 96,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  modalSecondaryButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
});
