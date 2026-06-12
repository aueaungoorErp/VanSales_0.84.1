import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import { ProgressDialog } from 'react-native-simple-dialogs';
import SnackBar from 'react-native-snackbar-component';
import { getCurrentPosition } from '../../../action/geolocation';
import {
  clearCustomerList,
  searchCustomerList,
  searchCustomerNextDestination,
  setError,
} from '../../../action/customer';
import { setCustomerType } from '../../../action/customer-type';
import ErrorMessage from '../../../component/announce/ErrorMessage';
import { ListItem } from '../../../component/elements';
import { mainDivider, MainTheme } from '../../../constant/lov';
import {
  formatDistanceLabel,
  getDistanceFromCurrentLocation,
  hasCompleteCoordinate,
} from '../../../services/longdomap';
import Navigator from '../../../services/Navigator';
import { getUserToken } from '../../../utils/Token';
import type {
  CustomerItem,
  CustomerListStateProps,
  UserToken,
} from '../../order/interface';

type GeolocationState = {
  position: {
    latitude: string | null;
    longitude: string | null;
  };
};

type CustomerRouteListStateProps = CustomerListStateProps & {
  geolocation: GeolocationState;
};

type CustomerRouteItem = CustomerItem & {
  distance: number | null;
  distanceText: string;
};

type CustomerRouteListDispatchProps = {
  clearCustomerList: () => void;
  searchCustomerList: (nextPage: boolean) => void;
  setError: (bool: boolean) => void;
  setCustomerType: (value: CustomerItem) => void;
  searchCustomerNextDestination: () => void;
  getCurrentPosition: () => Promise<any>;
};

type CustomerRouteListProps = CustomerRouteListStateProps &
  CustomerRouteListDispatchProps & {
    geolocation: GeolocationState;
  };

const CustomerRouteListBase: React.FC<CustomerRouteListProps> = ({
  customer,
  customerType,
  clearCustomerList,
  geolocation,
  getCurrentPosition,
  searchCustomerList,
  searchCustomerNextDestination,
  setCustomerType,
  setError,
}) => {
  const [userToken, setUserToken] = useState<UserToken>({
    VANCONFIG: {
      VANCNF_AR_LIMIT: null,
      VANCNF_FORCE_MILE: null,
      VANCNF_FORCE_GPS: null,
    },
  });
  const [sortedCustomers, setSortedCustomers] = useState<CustomerRouteItem[]>(
    [],
  );
  const [isPreparingList, setIsPreparingList] = useState(false);
  const [sortedListSignature, setSortedListSignature] = useState('');
  const mountedRef = useRef(true);
  const distanceJobRef = useRef(0);
  const currentListSignature = useMemo(
    () =>
      customer.listItems
        .map(
          item =>
            `${item.AR_KEY ?? ''}|${item.AR_CODE ?? ''}|${
              item.ADDB_GPS_LAT_S ?? ''
            }|${item.ADDB_GPS_LONG_S ?? ''}`,
        )
        .join('||'),
    [customer.listItems],
  );

  useEffect(() => {
    mountedRef.current = true;

    const fetchToken = async () => {
      const token = await getUserToken();
      if (mountedRef.current && token) {
        setUserToken(token as UserToken);
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

    void getCurrentPosition().catch(error => {
      console.log('[CustomerRoute] getCurrentPosition error', error);
    });
  }, [
    geolocation.position.latitude,
    geolocation.position.longitude,
    getCurrentPosition,
  ]);

  useEffect(() => {
    if (!customer.listItems?.length) {
      setSortedCustomers([]);
      setSortedListSignature('');
      return;
    }

    const firstCustomer = customer.listItems[0];

    console.log('[CustomerRoute] customer count', customer.listItems.length);
    console.log('[CustomerRoute] customer fields', Object.keys(firstCustomer));
    console.log('[CustomerRoute] first customer', firstCustomer);
  }, [customer.listItems]);

  useEffect(() => {
    const buildCustomerDistances = async () => {
      const jobId = distanceJobRef.current + 1;
      distanceJobRef.current = jobId;

      if (!customer.listItems?.length) {
        if (mountedRef.current) {
          setSortedCustomers([]);
          setSortedListSignature('');
          setIsPreparingList(false);
        }
        return;
      }

      if (mountedRef.current) {
        setIsPreparingList(true);
      }

      const currentLocation = {
        latitude: geolocation.position.latitude,
        longitude: geolocation.position.longitude,
      };
      const canCompareDistance = hasCompleteCoordinate(currentLocation);

      const nextCustomers = await Promise.all(
        customer.listItems.map(async item => {
          const customerLocation = {
            latitude: (item as any).ADDB_GPS_LAT_S ?? null,
            longitude: (item as any).ADDB_GPS_LONG_S ?? null,
          };

          if (!hasCompleteCoordinate(customerLocation)) {
            return {
              ...item,
              distance: null,
              distanceText: 'ไม่มีข้อมูลพิกัด',
            };
          }

          if (!canCompareDistance) {
            return {
              ...item,
              distance: null,
              distanceText: 'ไม่พบตำแหน่งปัจจุบัน',
            };
          }

          const distance = await getDistanceFromCurrentLocation(
            currentLocation,
            customerLocation,
          );

          return {
            ...item,
            distance,
            distanceText: formatDistanceLabel(distance),
          };
        }),
      );

      nextCustomers.sort((left, right) => {
        const leftHasDistance = typeof left.distance === 'number';
        const rightHasDistance = typeof right.distance === 'number';

        if (leftHasDistance && rightHasDistance) {
          return (left.distance ?? 0) - (right.distance ?? 0);
        }

        if (leftHasDistance) {
          return -1;
        }

        if (rightHasDistance) {
          return 1;
        }

        return 0;
      });

      if (mountedRef.current && distanceJobRef.current === jobId) {
        setSortedCustomers(nextCustomers);
        setSortedListSignature(currentListSignature);
        setIsPreparingList(false);
      }
    };

    void buildCustomerDistances();
  }, [
    customer.listItems,
    currentListSignature,
    geolocation.position.latitude,
    geolocation.position.longitude,
  ]);

  const onRefresh = useCallback(async () => {
    clearCustomerList();

    const selectedCustomerType = customerType.listItems.find(
      item => item.ARCAT_KEY === customerType.item?.ARCAT_KEY,
    ) ??
      customerType.item ?? { ARCAT_KEY: null, ARCAT_NAME: null };

    setCustomerType(selectedCustomerType);

    if (userToken.VANCONFIG.VANCNF_AR_LIMIT !== 2) {
      searchCustomerList(false);
    } else {
      searchCustomerNextDestination();
    }
  }, [
    clearCustomerList,
    customerType,
    searchCustomerList,
    searchCustomerNextDestination,
    setCustomerType,
    userToken.VANCONFIG.VANCNF_AR_LIMIT,
  ]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (userToken.VANCONFIG.VANCNF_AR_LIMIT !== 2) {
        const frameHeight = event.nativeEvent.layoutMeasurement.height;
        const contentHeight = event.nativeEvent.contentSize.height;
        const maxScrollableHeight = contentHeight - frameHeight;

        if (maxScrollableHeight <= 0) {
          return;
        }

        const maxOffset = 0.95 * parseInt(`${maxScrollableHeight}`, 10);
        const currentOffset = parseInt(
          `${event.nativeEvent.contentOffset.y}`,
          10,
        );

        if (
          currentOffset > 0 &&
          currentOffset >= maxOffset &&
          !customer.isLoading
        ) {
          searchCustomerList(true);
        }
      }
    },
    [
      customer.isLoading,
      searchCustomerList,
      userToken.VANCONFIG.VANCNF_AR_LIMIT,
    ],
  );

  const actionHandler = useCallback(() => {
    setError(false);
  }, [setError]);

  const handleContinuePress = useCallback((item: CustomerRouteItem) => {
    Navigator.navigate('CustomerMapDetail', {
      title: item.AR_NAME || 'รายละเอียดลูกค้า',
      customer: item,
    });
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: CustomerRouteItem; index: number }) => (
      <ListItem
        key={item.AR_KEY || index}
        containerStyle={mainDivider}
        bottomDivider
        onPress={() => {
          handleContinuePress(item);
        }}
      >
        <ListItem.Content key="content">
          <View style={styles.cardContent}>
            <View style={styles.topRow}>
              <View style={styles.topRowSpacer} />
              <View style={styles.topLeftWrap}>
                {userToken.VANCONFIG.VANCNF_AR_LIMIT === 2 ? (
                  <Text style={styles.indexText} allowFontScaling={false}>
                    {index + 1}
                  </Text>
                ) : null}
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
                {userToken.VANCONFIG.VANCNF_AR_LIMIT === 2 && item.LAST_DO ? (
                  <AntDesign
                    name="check"
                    color={MainTheme.colorPrimary}
                    size={22}
                  />
                ) : null}
                {userToken.VANCONFIG.VANCNF_AR_LIMIT === 2 && item.IS_SKIP ? (
                  <AntDesign
                    name="step-forward"
                    color={MainTheme.colorPrimary}
                    size={22}
                  />
                ) : null}
              </View>

              <View style={styles.customerInfo}>
                <Text style={styles.nameText} allowFontScaling={false}>
                  {item.AR_NAME || '-'}
                </Text>
                <Text
                  style={styles.addressText}
                  allowFontScaling={false}
                  numberOfLines={2}
                >
                  {item.ADDB_ADDB_1 ? `${item.ADDB_ADDB_1} ` : null}
                  {item.ADDB_ADDB_2 ? `${item.ADDB_ADDB_2} ` : null}
                  {item.ADDB_ADDB_3 ? `${item.ADDB_ADDB_3} ` : null}
                  {item.ADDB_SUB_DISTRICT ? `${item.ADDB_SUB_DISTRICT} ` : null}
                  {item.ADDB_DISTRICT ? `${item.ADDB_DISTRICT} ` : null}
                  {item.ADDB_PROVINCE ? `${item.ADDB_PROVINCE} ` : null}
                  {item.ADDB_POST ? `${item.ADDB_POST} ` : null}
                  {!item.ADDB_ADDB_1 &&
                  !item.ADDB_ADDB_2 &&
                  !item.ADDB_ADDB_3 &&
                  !item.ADDB_SUB_DISTRICT &&
                  !item.ADDB_DISTRICT &&
                  !item.ADDB_PROVINCE &&
                  !item.ADDB_POST
                    ? '-'
                    : null}
                </Text>
              </View>
            </View>
          </View>
        </ListItem.Content>
        <View style={styles.chevronButton}>
          <AntDesign
            name="right"
            color={MainTheme.colorPrimary}
            size={20}
            style={styles.chevronIcon}
            onPress={() => {
              handleContinuePress(item);
            }}
          />
        </View>
      </ListItem>
    ),
    [handleContinuePress, userToken.VANCONFIG.VANCNF_AR_LIMIT],
  );

  const isNotFound = customer.isNotFound && customer.listItems.length === 0;
  const isError =
    (customer.isError && customer.listItems.length === 0) ||
    customerType.isError;
  const isSnackBarVisible = customer.isError && customer.listItems.length > 0;
  const hasLatestSortedList = sortedListSignature === currentListSignature;
  const hasVisibleCustomers = sortedCustomers.length > 0;
  const isInitialLoading =
    !hasVisibleCustomers &&
    (customer.isLoading ||
      customerType.isLoading ||
      isPreparingList ||
      !hasLatestSortedList);
  const isPaginating =
    hasVisibleCustomers &&
    (customer.isLoading || isPreparingList || !hasLatestSortedList);

  return (
    <View style={styles.container}>
      {!isNotFound && !isError && !isInitialLoading ? (
        <FlatList
          data={sortedCustomers}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          ListFooterComponent={
            isPaginating ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator
                  size="small"
                  color={MainTheme.colorPrimary}
                />
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={customer.isLoading || customerType.isLoading}
              onRefresh={() => {
                void onRefresh();
              }}
            />
          }
          onScroll={event => {
            onScroll(event);
          }}
        />
      ) : null}

      <ProgressDialog
        visible={isInitialLoading}
        message="กำลังโหลดและคำนวณเส้นทาง"
        animationType="fade"
        dialogStyle={{ borderRadius: 5 }}
      />

      <SnackBar
        visible={isSnackBarVisible}
        textMessage="Customer Not Found!"
        actionHandler={actionHandler}
        actionText="close"
      />
      <ErrorMessage
        isDisplaying={isNotFound}
        iconName="search1"
        iconType="AntDesign"
      />
      <ErrorMessage
        isDisplaying={isError}
        message="Customer Not Found."
        iconName="search1"
        iconType="AntDesign"
      />
    </View>
  );
};

const mapStateToProps = (state: any): CustomerRouteListStateProps => ({
  customer: state.customer,
  customerType: state.customerType,
  geolocation: state.geolocation,
});

const mapDispatchToProps = (dispatch: any): CustomerRouteListDispatchProps => {
  return {
    clearCustomerList: () => dispatch(clearCustomerList()),
    getCurrentPosition: () => dispatch(getCurrentPosition()),
    searchCustomerList: nextPage => dispatch(searchCustomerList(nextPage)),
    setError: bool => {
      dispatch(setError(bool));
    },
    setCustomerType: value => dispatch(setCustomerType(value)),
    searchCustomerNextDestination: () => {
      dispatch(searchCustomerNextDestination());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomerRouteListBase);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardContent: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  topRowSpacer: {
    width: 30,
  },
  topLeftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leadingStatus: {
    width: 30,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 2,
  },
  customerInfo: {
    flex: 1,
    flexDirection: 'column',
    paddingRight: 12,
    maxWidth: '100%',
  },
  indexText: {
    fontSize: hp('1.9%'),
    marginRight: 6,
    color: '#6A7480',
  },
  codeText: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
  },
  nameText: {
    fontSize: hp('1.9%'),
    marginBottom: 2,
  },
  addressText: {
    fontSize: hp('1.8%'),
    color: '#5E6975',
  },
  distanceText: {
    fontSize: hp('1.75%'),
    fontWeight: 'bold',
    color: MainTheme.colorPrimary,
    textAlign: 'right',
    width: 86,
  },
  footerLoading: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -8,
  },
  chevronIcon: {
    textAlign: 'center',
  },
});
