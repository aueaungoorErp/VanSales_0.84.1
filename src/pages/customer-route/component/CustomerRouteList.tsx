import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import { ProgressDialog } from 'react-native-simple-dialogs';
import SnackBar from 'react-native-snackbar-component';
import { getCurrentPosition, setLastPosition, setError } from '../customer-route-action';
import ErrorMessage from '../../../component/announce/ErrorMessage';
import { ListItem } from '../../../component/elements';
import { mainDivider, MainTheme } from '../../../constant/lov';
import { assessLongdoApiKeyAvailability, formatDistanceLabel, getDistanceBetweenCoordinates, getLongdoApiKeyAlertMessage, hasCompleteCoordinate } from '../../../services/longdomap';
import { processCustomerRouteDistances, type CustomerRouteDistanceItem } from '../../../services/customerRouteDistancePipeline';
import { getCustomerRouteLoadSession } from '../../../services/customerRouteLoadSession';
import Navigator from '../../../services/Navigator';
import { getUserToken } from '../../../utils/Token';
import type { CustomerItem, CustomerListStateProps, UserToken } from '../../order/interface';
type GeolocationState = {
  position: {
    latitude: string | null;
    longitude: string | null;
  };
  isLoading?: boolean;
  isError?: boolean;
};
type CustomerRouteListStateProps = CustomerListStateProps & {
  geolocation: GeolocationState;
  longdomap: {
    lastPosition: {
      latitude: number | null;
      longitude: number | null;
    };
  };
};
type CustomerRouteItem = CustomerRouteDistanceItem;
const getCustomerRouteItemKey = (item: CustomerRouteItem | CustomerItem, index: number) => [item.AR_KEY ?? '', item.AR_CODE ?? '', item.ADDB_GPS_LAT_S ?? '', item.ADDB_GPS_LONG_S ?? '', index].join('|');
const setLoadingStage = (updateStage: ((value: string) => void) | undefined, message: string) => {
  updateStage?.(message);
};
type CustomerRouteListDispatchProps = {
  setError: (bool: boolean) => void;
  getCurrentPosition: () => Promise<any>;
  setLastPosition: (position: {
    latitude: number | null;
    longitude: number | null;
  }) => void;
};
type CustomerRouteListProps = CustomerRouteListStateProps & CustomerRouteListDispatchProps & {
  isTimedLoading?: boolean;
  geolocation: GeolocationState;
  loadingMessage?: string;
  onLoadingMessageChange?: (value: string) => void;
  managedSortedCustomers?: CustomerRouteDistanceItem[] | null;
  isLoadSummaryVisible?: boolean;
};
const CustomerRouteListBase: React.FC<CustomerRouteListProps> = ({
  customer,
  customerType,
  geolocation,
  getCurrentPosition,
  isTimedLoading,
  loadingMessage,
  longdomap,
  managedSortedCustomers = null,
  isLoadSummaryVisible = false,
  onLoadingMessageChange,
  setLastPosition,
  setError
}) => {
  const [userToken, setUserToken] = useState<UserToken>({
    VANCONFIG: {
      VANCNF_AR_LIMIT: null,
      VANCNF_FORCE_MILE: null,
      VANCNF_FORCE_GPS: null
    }
  });
  const [isUserTokenLoaded, setIsUserTokenLoaded] = useState(false);
  const [sortedCustomers, setSortedCustomers] = useState<CustomerRouteItem[]>([]);
  const [isPreparingList, setIsPreparingList] = useState(false);
  const [isBlockingLoadSticky, setIsBlockingLoadSticky] = useState(false);
  const [sortedListSignature, setSortedListSignature] = useState('');
  const mountedRef = useRef(true);
  const distanceJobRef = useRef(0);
  const longdoAlertReasonRef = useRef<string | null>(null);
  const currentListSignature = useMemo(() => customer.listItems.map(item => `${item.AR_KEY ?? ''}|${item.AR_CODE ?? ''}|${item.ADDB_GPS_LAT_S ?? ''}|${item.ADDB_GPS_LONG_S ?? ''}`).join('||'), [customer.listItems]);
  useEffect(() => {
    mountedRef.current = true;
    const fetchToken = async () => {
      try {
        const token = await getUserToken();
        if (mountedRef.current && token) {
          setUserToken(token as UserToken);
        }
      } finally {
        if (mountedRef.current) {
          setIsUserTokenLoaded(true);
        }
      }
    };
    void fetchToken();
    return () => {
      mountedRef.current = false;
    };
  }, []);
  useEffect(() => {
    if (geolocation.position.latitude && geolocation.position.longitude) {
      return;
    }
    void getCurrentPosition().catch(error => {});
  }, [geolocation.position.latitude, geolocation.position.longitude, getCurrentPosition]);
  useFocusEffect(useCallback(() => {
    if (!isUserTokenLoaded) {
      return undefined;
    }
    let mounted = true;
    const checkLongdoApiKeys = async () => {
      const vanCode = String((userToken?.VANCONFIG as any)?.VANCNF_MACHINE ?? '').trim();
      const availability = await assessLongdoApiKeyAvailability(vanCode);
      if (!mounted || availability.ok) {
        if (availability.ok) {
          longdoAlertReasonRef.current = null;
        }
        return;
      }
      if (longdoAlertReasonRef.current === availability.reason) {
        return;
      }
      longdoAlertReasonRef.current = availability.reason;
      Alert.alert('แจ้งเตือน', getLongdoApiKeyAlertMessage(availability.reason));
    };
    void checkLongdoApiKeys();
    return () => {
      mounted = false;
    };
  }, [isUserTokenLoaded, userToken]));
  useEffect(() => {
    if (!customer.listItems?.length) {
      setSortedCustomers([]);
      setSortedListSignature('');
      return;
    }
    const firstCustomer = customer.listItems[0];
  }, [customer.listItems]);
  useEffect(() => {
    const buildCustomerDistances = async () => {
      const jobId = distanceJobRef.current + 1;
      distanceJobRef.current = jobId;
      try {
        if (!isUserTokenLoaded) {
          return;
        }
        if (!customer.listItems?.length) {
          if (mountedRef.current) {
            setSortedCustomers([]);
            setSortedListSignature('');
            setIsPreparingList(false);
          }
          return;
        }
        if (isTimedLoading || managedSortedCustomers !== null) {
          if (mountedRef.current && distanceJobRef.current === jobId) {
            setIsPreparingList(isTimedLoading === true);
          }
          return;
        }
        if (mountedRef.current) {
          setLoadingStage(onLoadingMessageChange, 'กำลังโหลดและคำนวณเส้นทาง');
          setIsPreparingList(true);
        }
        const vanCode = String((userToken?.VANCONFIG as any)?.VANCNF_MACHINE ?? '').trim();
        const currentLocation = {
          latitude: geolocation.position.latitude,
          longitude: geolocation.position.longitude
        };
        const canCompareDistance = hasCompleteCoordinate(currentLocation);
        if (!canCompareDistance && !geolocation.isError) {
          if (mountedRef.current && distanceJobRef.current === jobId) {
            setIsPreparingList(true);
          }
          return;
        }
        const currentSession = await getCustomerRouteLoadSession();
        const pipelineResult = await processCustomerRouteDistances({
          listItems: customer.listItems,
          currentLocation,
          lastPosition: longdomap.lastPosition,
          vanCode,
          hasMore: customer.hasMore === true,
          totalAvailable: currentSession?.totalAvailable ?? customer.listItems.length,
          onSetLastPosition: setLastPosition,
          signal: {
            loadId: jobId,
            getCurrentLoadId: () => distanceJobRef.current
          }
        });
        if (pipelineResult.alertReason && longdoAlertReasonRef.current !== pipelineResult.alertReason) {
          longdoAlertReasonRef.current = pipelineResult.alertReason;
          Alert.alert('แจ้งเตือน', getLongdoApiKeyAlertMessage(pipelineResult.alertReason));
        }
        if (mountedRef.current && distanceJobRef.current === jobId) {
          setSortedCustomers(pipelineResult.sortedItems as CustomerRouteItem[]);
          setSortedListSignature(currentListSignature);
          setIsPreparingList(false);
        }
      } catch (error: any) {
        console.log('[CustomerRoute] build distance fatal fallback', {
          message: error?.message,
          status: error?.status,
          apiMessage: error?.apiMessage
        });
        const nextCustomers = customer.listItems.map(item => {
          const distance = getDistanceBetweenCoordinates({
            latitude: geolocation.position.latitude,
            longitude: geolocation.position.longitude
          }, {
            latitude: (item as any).ADDB_GPS_LAT_S ?? null,
            longitude: (item as any).ADDB_GPS_LONG_S ?? null
          });
          return {
            ...item,
            distance,
            distanceText: hasCompleteCoordinate({
              latitude: (item as any).ADDB_GPS_LAT_S ?? null,
              longitude: (item as any).ADDB_GPS_LONG_S ?? null
            }) ? formatDistanceLabel(distance) : 'ไม่มีข้อมูลพิกัด'
          };
        });
        if (mountedRef.current && distanceJobRef.current === jobId) {
          setSortedCustomers(nextCustomers);
          setSortedListSignature(currentListSignature);
          setIsPreparingList(false);
        }
      }
    };
    void buildCustomerDistances();
  }, [customer.hasMore, customer.listItems, currentListSignature, geolocation.isError, geolocation.isLoading, geolocation.position.latitude, geolocation.position.longitude, isTimedLoading, isUserTokenLoaded, longdomap.lastPosition, managedSortedCustomers, onLoadingMessageChange, setLastPosition, (userToken?.VANCONFIG as any)?.VANCNF_MACHINE]);
  const displayCustomers = managedSortedCustomers !== null ? managedSortedCustomers : sortedCustomers;
  const hasLatestSortedList = managedSortedCustomers !== null ? true : sortedListSignature === currentListSignature;
  const actionHandler = useCallback(() => {
    setError(false);
  }, [setError]);
  const handleContinuePress = useCallback((item: CustomerRouteItem) => {
    Navigator.navigate('CustomerMapDetail', {
      title: item.AR_NAME || 'รายละเอียดลูกค้า',
      customer: item
    });
  }, []);
  const renderItem = useCallback(({
    item,
    index
  }: {
    item: CustomerRouteItem;
    index: number;
  }) => <ListItem key={getCustomerRouteItemKey(item, index)} containerStyle={mainDivider} bottomDivider onPress={() => {
    handleContinuePress(item);
  }}>
        <ListItem.Content key="content">
          <View style={styles.cardContent}>
            <View style={styles.topRow}>
              <View style={styles.topRowSpacer} />
              <View style={styles.topLeftWrap}>
                <Text style={styles.indexText} allowFontScaling={false}>
                  {index + 1}
                </Text>
                <Text style={styles.codeText} allowFontScaling={false}>
                  {item.AR_CODE || '-'}
                </Text>
              </View>
              <Text style={styles.distanceText} allowFontScaling={false}>
                {item.distanceText}
              </Text>
            </View>

            <View style={styles.bottomRow}>
              <View style={styles.leadingStatus}>
                {userToken.VANCONFIG.VANCNF_AR_LIMIT === 2 && item.LAST_DO ? <AntDesign name="check" color={MainTheme.colorPrimary} size={22} /> : null}
                {userToken.VANCONFIG.VANCNF_AR_LIMIT === 2 && item.IS_SKIP ? <AntDesign name="step-forward" color={MainTheme.colorPrimary} size={22} /> : null}
              </View>

              <View style={styles.customerInfo}>
                <Text style={styles.nameText} allowFontScaling={false}>
                  {item.AR_NAME || '-'}
                </Text>
                <Text style={styles.addressText} allowFontScaling={false} numberOfLines={2}>
                  {item.ADDB_ADDB_1 ? `${item.ADDB_ADDB_1} ` : null}
                  {item.ADDB_ADDB_2 ? `${item.ADDB_ADDB_2} ` : null}
                  {item.ADDB_ADDB_3 ? `${item.ADDB_ADDB_3} ` : null}
                  {item.ADDB_SUB_DISTRICT ? `${item.ADDB_SUB_DISTRICT} ` : null}
                  {item.ADDB_DISTRICT ? `${item.ADDB_DISTRICT} ` : null}
                  {item.ADDB_PROVINCE ? `${item.ADDB_PROVINCE} ` : null}
                  {item.ADDB_POST ? `${item.ADDB_POST} ` : null}
                  {!item.ADDB_ADDB_1 && !item.ADDB_ADDB_2 && !item.ADDB_ADDB_3 && !item.ADDB_SUB_DISTRICT && !item.ADDB_DISTRICT && !item.ADDB_PROVINCE && !item.ADDB_POST ? '-' : null}
                </Text>
              </View>
            </View>
          </View>
        </ListItem.Content>
        <View style={styles.chevronButton}>
          <AntDesign name="right" color={MainTheme.colorPrimary} size={20} style={styles.chevronIcon} onPress={() => {
        handleContinuePress(item);
      }} />
        </View>
      </ListItem>, [handleContinuePress, userToken.VANCONFIG.VANCNF_AR_LIMIT]);
  const hasVisibleItems = displayCustomers.length > 0;
  const isRouteListLoading = isTimedLoading === true || customer.isLoading || customerType.isLoading || geolocation.isLoading || isPreparingList || !hasLatestSortedList;
  const nextShouldBlockWithProgress = isRouteListLoading && !hasVisibleItems;
  const isNotFound = !isRouteListLoading && !hasVisibleItems && customer.isNotFound && customer.listItems.length === 0;
  const isError = !isRouteListLoading && !hasVisibleItems && (customer.isError && customer.listItems.length === 0 || customerType.isError);
  const isSnackBarVisible = customer.isError && customer.listItems.length > 0;
  useEffect(() => {
    if (nextShouldBlockWithProgress) {
      setIsBlockingLoadSticky(true);
      return;
    }
    if (hasVisibleItems || isNotFound || isError || !isRouteListLoading) {
      setIsBlockingLoadSticky(false);
    }
  }, [hasVisibleItems, isError, isNotFound, isRouteListLoading, nextShouldBlockWithProgress]);
  const shouldBlockWithProgress = !isLoadSummaryVisible && (nextShouldBlockWithProgress || isBlockingLoadSticky);
  return <View style={styles.container}>
      {!isNotFound && !isError && hasVisibleItems ? <FlatList data={displayCustomers} renderItem={renderItem} keyExtractor={(item, index) => getCustomerRouteItemKey(item, index)} maintainVisibleContentPosition={{
      minIndexForVisible: 0
    }} /> : null}

      <ProgressDialog key={loadingMessage || 'กำลังโหลดและคำนวณเส้นทาง'} visible={shouldBlockWithProgress} message={loadingMessage || 'กำลังโหลดและคำนวณเส้นทาง'} animationType="fade" dialogStyle={{
      borderRadius: 5
    }} />

      <SnackBar visible={isSnackBarVisible} textMessage="Customer Not Found!" actionHandler={actionHandler} actionText="close" />
      <ErrorMessage isDisplaying={isNotFound} iconName="search1" iconType="AntDesign" />
      <ErrorMessage isDisplaying={isError} message="Customer Not Found." iconName="search1" iconType="AntDesign" />
    </View>;
};
const mapStateToProps = (state: any): CustomerRouteListStateProps => ({
  customer: state.customer,
  customerType: state.customerType,
  geolocation: state.geolocation,
  longdomap: state.longdomap
});
const mapDispatchToProps = (dispatch: any): CustomerRouteListDispatchProps => {
  return {
    getCurrentPosition: () => dispatch(getCurrentPosition()),
    setError: bool => {
      dispatch(setError(bool));
    },
    setLastPosition: position => dispatch(setLastPosition(position))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CustomerRouteListBase);
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  cardContent: {
    flex: 1
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  topRowSpacer: {
    width: 30
  },
  topLeftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  leadingStatus: {
    width: 30,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 2
  },
  customerInfo: {
    flex: 1,
    flexDirection: 'column',
    paddingRight: 12,
    maxWidth: '100%'
  },
  indexText: {
    fontSize: hp('1.9%'),
    marginRight: 6,
    color: '#6A7480'
  },
  codeText: {
    fontSize: hp('2%'),
    fontWeight: 'bold'
  },
  nameText: {
    fontSize: hp('1.9%'),
    marginBottom: 2
  },
  addressText: {
    fontSize: hp('1.8%'),
    color: '#5E6975'
  },
  distanceText: {
    fontSize: hp('1.75%'),
    fontWeight: 'bold',
    color: MainTheme.colorPrimary,
    textAlign: 'right',
    width: 86
  },
  chevronButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -8
  },
  chevronIcon: {
    textAlign: 'center'
  }
});