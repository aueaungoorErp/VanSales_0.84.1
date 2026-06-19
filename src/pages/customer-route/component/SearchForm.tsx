import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { ComponentType } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import {
  appendCustomerRouteBatchDetails,
  clearCustomerList,
  getCurrentPosition,
  restoreCustomerRouteCache,
  searchCustomerRoutePageOnly,
  setCustomerType,
  searchCustomerNextDestination,
  setInitialState,
  setKeyword,
} from '../customer-route-action';
import { useCustomerRouteBatchDetails } from '../api/useTanStack';
import ISearchBar from '../../../component/input/ISearchBar';
import { MainTheme } from '../../../constant/lov';
import {
  clearCustomerRouteLoadSession,
  getCustomerRouteLoadSession,
  mergeCustomerRouteLoadSession,
  setCustomerRouteLoadSession,
} from '../../../services/customerRouteLoadSession';
import { clearCustomerRouteDistanceCache } from '../../../services/longdomap';
import {
  hasCompleteCoordinate,
  parseCoordinate,
  isWithinDistanceThreshold,
} from '../../../services/longdomap';
import Navigator from '../../../services/Navigator';
import { getUserToken } from '../../../utils/Token';

const AntDesign = require('react-native-vector-icons/AntDesign')
  .default as ComponentType<any>;

type CustomerTypeItem = {
  ARCAT_KEY: string | null;
  ARCAT_NAME: string | null;
};

type UserTokenState = {
  VANCONFIG: {
    VANCNF_AR_LIMIT: number | null;
  };
};

type CustomerState = {
  isLoading?: boolean;
  listItems: any[];
  hasMore?: boolean;
  criteria: {
    KEYWORD?: string | null;
    OFFSET: number;
    LIMIT: number;
  };
};

type GeolocationState = {
  position: {
    latitude: string | null;
    longitude: string | null;
  };
};

type CustomerTypeState = {
  listItems: CustomerTypeItem[];
  item?: CustomerTypeItem | null;
};

type SearchFormOwnProps = {
  navigation?: unknown;
  screen?: string;
  onLoadingMessageChange?: (value: string) => void;
  onRegisterTimedLoadHandler?: (handler: (reset: boolean) => Promise<void>) => void;
  onTimedLoadingChange?: (value: boolean) => void;
};

type SearchFormProps = SearchFormOwnProps & {
  customer: CustomerState;
  customerType: CustomerTypeState;
  geolocation: GeolocationState;
  setInitialState: () => void | Promise<void>;
  setKeyword: (criteria: string | null) => void | Promise<void>;
  searchCustomerRoutePageOnly: (
    nextPage?: boolean,
  ) => Promise<
    | {
        items?: any[];
        hasMore?: boolean;
        error?: string;
        totalAvailable?: number;
        rawItemCount?: number;
        nextCriteriaOffset?: number;
      }
    | void
  >;
  appendCustomerRouteBatchDetails: (
    routeItems: any[],
    fetchCustomerDetailsBatch: (payload: {
      arCodes: Array<string | number>;
    }) => Promise<any>,
    hasMore?: boolean,
  ) => Promise<
    | {
        items?: any[];
        hasMore?: boolean;
        error?: string;
      }
    | void
  >;
  clearCustomerList: () => void | Promise<void>;
  getCurrentPosition: () => Promise<any>;
  restoreCustomerRouteCache: (payload: {
    items: any[];
    hasMore: boolean;
    offset: number;
    limit: number;
    keyword: string | null;
    arcatKey?: string | null;
  }) => Promise<any> | any;
  setCustomerType: (value: CustomerTypeItem) => void | Promise<void>;
  searchCustomerNextDestination: () => void | Promise<void>;
};

const initialUserToken: UserTokenState = {
  VANCONFIG: {
    VANCNF_AR_LIMIT: null,
  },
};

const SearchForm: React.FC<SearchFormProps> = props => {
  const {
    customer,
    customerType,
    geolocation,
    getCurrentPosition,
    onLoadingMessageChange,
    onRegisterTimedLoadHandler,
    onTimedLoadingChange,
    setInitialState,
    setKeyword,
    restoreCustomerRouteCache,
    searchCustomerRoutePageOnly,
    appendCustomerRouteBatchDetails,
    clearCustomerList,
    setCustomerType,
    searchCustomerNextDestination,
  } = props;
  const mountedRef = useRef(false);
  const activeTimedLoadIdRef = useRef(0);
  const customerRef = useRef(customer);
  const [textSearch, setTextSearch] = useState<string | null>(null);
  const [arcatKey, setArcatKey] = useState<string | null>(null);
  const [userToken, setUserTokenState] =
    useState<UserTokenState>(initialUserToken);
  const [isTimedLoading, setIsTimedLoading] = useState(false);
  const { mutateAsync: requestCustomerRouteBatchDetails } =
    useCustomerRouteBatchDetails();
  const [loadSummaryModal, setLoadSummaryModal] = useState<{
    totalLoaded: number;
    totalAvailable: number;
    remainingCount: number;
    hasMore: boolean;
    stoppedByTimeLimit: boolean;
  } | null>(null);

  useEffect(() => {
    customerRef.current = customer;
  }, [customer]);

  useEffect(() => {
    onTimedLoadingChange?.(isTimedLoading);
  }, [isTimedLoading, onTimedLoadingChange]);

  const setSafeUserToken = useCallback((value: UserTokenState) => {
    if (mountedRef.current) {
      setUserTokenState(value);
    }
  }, []);

  const loadUserToken = useCallback(async () => {
    const nextUserToken = await getUserToken();

    if (nextUserToken) {
      setSafeUserToken(nextUserToken);
      return nextUserToken;
    }

    return null;
  }, [setSafeUserToken]);

  const loadInitialCustomers = useCallback(async () => {
    const nextUserToken = await getUserToken();

    if (nextUserToken) {
      setSafeUserToken(nextUserToken);
    }

    await setKeyword(textSearch ? textSearch.trim() : null);
  }, [setKeyword, setSafeUserToken, textSearch]);

  const getCurrentSearchKeyword = useCallback(
    () => (textSearch ? textSearch.trim() : null),
    [textSearch],
  );

  const getCurrentPositionSnapshot = useCallback(
    () => ({
      latitude: parseCoordinate(geolocation.position.latitude),
      longitude: parseCoordinate(geolocation.position.longitude),
    }),
    [geolocation.position.latitude, geolocation.position.longitude],
  );

  const canReuseCachedCustomerList = useCallback(async () => {
    const cachedSession = await getCustomerRouteLoadSession();
    const currentKeyword = getCurrentSearchKeyword();
    const currentArcatKey = arcatKey ?? null;

    if (
      !cachedSession ||
      !Array.isArray(cachedSession.cachedItems) ||
      cachedSession.cachedItems.length === 0 ||
      !hasCompleteCoordinate(cachedSession.lastPosition) ||
      cachedSession.keyword !== currentKeyword ||
      (cachedSession.arcatKey ?? null) !== currentArcatKey
    ) {
      return null;
    }

    const positionResult = await getCurrentPosition().catch(error => {
      console.log('[CustomerRoute] getCurrentPosition for cache reuse error', error);
      return null;
    });

    const currentPosition =
      positionResult?.coords?.latitude !== undefined &&
      positionResult?.coords?.longitude !== undefined
        ? {
            latitude: positionResult.coords.latitude,
            longitude: positionResult.coords.longitude,
          }
        : getCurrentPositionSnapshot();

    if (!hasCompleteCoordinate(currentPosition)) {
      return null;
    }

    if (
      !isWithinDistanceThreshold(currentPosition, cachedSession.lastPosition, 15)
    ) {
      return null;
    }

    return cachedSession;
  }, [
    arcatKey,
    getCurrentPosition,
    getCurrentPositionSnapshot,
    getCurrentSearchKeyword,
  ]);

  const runTimedCustomerLoad = useCallback(
    async (reset: boolean) => {
      const timedLoadStartedAt = Date.now();
      const nextUserToken = await getUserToken();
      const limit = nextUserToken?.VANCONFIG?.VANCNF_AR_LIMIT;

      if (limit == 2) {
        await clearCustomerList();
        await searchCustomerNextDestination();
        return;
      }

      const loadId = activeTimedLoadIdRef.current + 1;
      activeTimedLoadIdRef.current = loadId;
      setLoadSummaryModal(null);
      onLoadingMessageChange?.('กำลังโหลดและคำนวณเส้นทาง');
      setIsTimedLoading(true);

      if (reset) {
        await clearCustomerRouteLoadSession();
        await clearCustomerRouteDistanceCache();
        await clearCustomerList();
        await mergeCustomerRouteLoadSession({
          cachedItems: [],
          totalLoaded: 0,
          totalAvailable: 0,
          hasMore: false,
          keyword: getCurrentSearchKeyword(),
          arcatKey,
          updatedAt: new Date().toISOString(),
        });
      }

      const startedAt = Date.now();
      const startedCount = reset ? 0 : customerRef.current.listItems.length;
      const currentKeyword = getCurrentSearchKeyword();
      let totalLoaded = startedCount;
      let nextPage = !reset && customerRef.current.listItems.length > 0;
      let hasMore = true;
      let lastResultError = null;
      let totalAvailable = startedCount;
      let stoppedByTimeLimit = false;
      let nextOffset = customerRef.current.criteria?.OFFSET ?? 1;
      let pageNumber = 0;
      const routeItemsToAppend: any[] = [];

      console.log('[CustomerRoute] timed fetch started', {
        reset,
        startedCount,
        initialOffset: nextOffset,
        limitPerPage: customerRef.current.criteria?.LIMIT ?? 20,
        keyword: currentKeyword,
        arcatKey,
      });

      while (mountedRef.current && activeTimedLoadIdRef.current === loadId) {
        pageNumber += 1;
        const pageStartedAt = Date.now();
        console.log('[CustomerRoute] customer fetch page started', {
          pageNumber,
          nextPage,
          criteriaOffset: customerRef.current.criteria?.OFFSET ?? nextOffset,
          loadedBeforePage: totalLoaded,
        });

        const result = await searchCustomerRoutePageOnly(nextPage);

        if (!mountedRef.current || activeTimedLoadIdRef.current !== loadId) {
          return;
        }

        const fetchedRouteItems = Array.isArray(result?.items) ? result.items : [];
        totalLoaded += fetchedRouteItems.length;
        routeItemsToAppend.push(...fetchedRouteItems);
        hasMore = result?.hasMore === true;
        lastResultError = result?.error ?? null;
        nextOffset = Number(result?.nextCriteriaOffset) || nextOffset;
        totalAvailable = Math.max(
          totalAvailable,
          Number(result?.totalAvailable) || totalAvailable,
        );
        const currentPositionSnapshot = getCurrentPositionSnapshot();

        console.log('[CustomerRoute] customer fetch page finished', {
          pageNumber,
          fetchedItems: fetchedRouteItems.length,
          rawItemCount: Number(result?.rawItemCount) || 0,
          totalLoaded,
          totalAvailable,
          hasMore,
          nextOffset,
          pageTimeMs: Date.now() - pageStartedAt,
          totalElapsedMs: Date.now() - timedLoadStartedAt,
        });

        await setCustomerRouteLoadSession({
          totalLoaded,
          totalAvailable,
          hasMore,
          updatedAt: new Date().toISOString(),
          cachedItems: [],
          lastPosition: {
            latitude: currentPositionSnapshot.latitude,
            longitude: currentPositionSnapshot.longitude,
          },
          keyword: currentKeyword,
          arcatKey: arcatKey ?? null,
          nextOffset,
          limit: customerRef.current.criteria?.LIMIT ?? 20,
        });

        if (Date.now() - startedAt >= 60000) {
          stoppedByTimeLimit = true;
          console.log('[CustomerRoute] timed fetch stopped by 1 minute limit', {
            pageNumber,
            totalLoaded,
            totalAvailable,
            elapsedMs: Date.now() - timedLoadStartedAt,
          });
          break;
        }

        if (lastResultError || !hasMore) {
          console.log('[CustomerRoute] timed fetch loop ended', {
            reason: lastResultError ? 'error' : 'no-more-data',
            pageNumber,
            totalLoaded,
            totalAvailable,
            elapsedMs: Date.now() - timedLoadStartedAt,
          });
          break;
        }

        nextPage = true;
      }

      if (!mountedRef.current || activeTimedLoadIdRef.current !== loadId) {
        return;
      }

      if (lastResultError) {
        setIsTimedLoading(false);
        return;
      }

      onLoadingMessageChange?.('กำลังโหลดและคำนวณเส้นทาง');
      console.log('[CustomerRoute] batch detail request prepared', {
        routeItemCount: routeItemsToAppend.length,
        arCodes: routeItemsToAppend.map(item => item?.AR_CODE).filter(Boolean),
        hasMore,
      });
      const batchMergeStartedAt = Date.now();
      const batchMergeResult = await appendCustomerRouteBatchDetails(
        routeItemsToAppend,
        requestCustomerRouteBatchDetails,
        hasMore,
      );

      if (!mountedRef.current || activeTimedLoadIdRef.current !== loadId) {
        return;
      }

      console.log('[CustomerRoute] batch detail completed', {
        routeItemCount: routeItemsToAppend.length,
        mergedItemCount: Array.isArray(batchMergeResult?.items)
          ? batchMergeResult.items.length
          : 0,
        hasMore,
        batchMergeTimeMs: Date.now() - batchMergeStartedAt,
        totalElapsedMs: Date.now() - timedLoadStartedAt,
      });

      setIsTimedLoading(false);

      if (batchMergeResult?.error) {
        return;
      }

      console.log('[CustomerRoute] timed fetch completed', {
        totalLoaded,
        totalAvailable,
        hasMore,
        stoppedByTimeLimit,
        totalElapsedMs: Date.now() - timedLoadStartedAt,
      });

      setLoadSummaryModal({
        totalLoaded,
        totalAvailable,
        remainingCount: Math.max(totalAvailable - totalLoaded, 0),
        hasMore,
        stoppedByTimeLimit,
      });
    },
    [
      clearCustomerList,
      arcatKey,
      getCurrentPositionSnapshot,
      getCurrentSearchKeyword,
      searchCustomerRoutePageOnly,
      appendCustomerRouteBatchDetails,
      searchCustomerNextDestination,
      requestCustomerRouteBatchDetails,
    ],
  );

  useEffect(() => {
    if (onRegisterTimedLoadHandler) {
      onRegisterTimedLoadHandler((reset: boolean) => runTimedCustomerLoad(reset));
    }
  }, [onRegisterTimedLoadHandler, runTimedCustomerLoad]);

  useEffect(() => {
    mountedRef.current = true;

    const init = async () => {
      await loadUserToken();
      await setInitialState();
      await loadInitialCustomers();

      const nextUserToken = await getUserToken();
      if (nextUserToken?.VANCONFIG?.VANCNF_AR_LIMIT == 2) {
        await runTimedCustomerLoad(true);
        return;
      }

      const cachedSession = await canReuseCachedCustomerList();
      if (cachedSession) {
        await clearCustomerList();
        if (mountedRef.current) {
          setArcatKey(cachedSession.arcatKey ?? null);
        }
        await restoreCustomerRouteCache({
          items: cachedSession.cachedItems,
          hasMore: cachedSession.hasMore,
          offset: cachedSession.nextOffset,
          limit: cachedSession.limit,
          keyword: cachedSession.keyword,
          arcatKey: cachedSession.arcatKey,
        });
        return;
      }

      await runTimedCustomerLoad(true);
    };

    void init();

    return () => {
      mountedRef.current = false;
      activeTimedLoadIdRef.current += 1;
    };
  }, []);

  const onRefresh = async () => {
    const nextUserToken = await getUserToken();
    const selectedCustomerType = customerType.listItems.find(
      item => item.ARCAT_KEY == arcatKey,
    ) ?? { ARCAT_KEY: null, ARCAT_NAME: null };

    await setCustomerType(selectedCustomerType);

    if (nextUserToken) {
      setSafeUserToken(nextUserToken);
    }

    if (!customer.isLoading && !isTimedLoading) {
      const limit = nextUserToken?.VANCONFIG?.VANCNF_AR_LIMIT;

      if (limit != 2) {
        await setKeyword(textSearch ? textSearch.trim() : null);
        await runTimedCustomerLoad(true);
      } else {
        await clearCustomerList();
        await searchCustomerNextDestination();
      }
    }
  };

  const onSearch = async () => {
    const nextUserToken = await loadUserToken();

    if (!customer.isLoading && !isTimedLoading) {
      if (nextUserToken?.VANCONFIG?.VANCNF_AR_LIMIT != 2) {
        if (customerType.listItems && customerType.listItems.length > 0) {
          let type =
            customerType.listItems.find(v => arcatKey == v.ARCAT_KEY) ?? null;

          if (!type) {
            type = { ARCAT_KEY: null, ARCAT_NAME: null };
          }

          await setCustomerType(type);
          await setKeyword(textSearch ? textSearch.trim() : null);
          await runTimedCustomerLoad(true);
        } else {
          await setKeyword(textSearch ? textSearch.trim() : null);
          await runTimedCustomerLoad(true);
        }
      } else {
        await clearCustomerList();
        await searchCustomerNextDestination();
      }
    }
  };

  const onSetCustomerType = async (value: string | null) => {
    if (mountedRef.current) {
      setArcatKey(value);
    }

    const nextUserToken = await loadUserToken();

    if (!customer.isLoading && !isTimedLoading) {
      const type =
        customerType.listItems.find(item => item.ARCAT_KEY == value) ?? {
          ARCAT_KEY: null,
          ARCAT_NAME: null,
        };

      await setCustomerType(type);

      if (nextUserToken?.VANCONFIG?.VANCNF_AR_LIMIT != 2) {
        await setKeyword(textSearch ? textSearch.trim() : null);
        await runTimedCustomerLoad(true);
      } else {
        await clearCustomerList();
        await searchCustomerNextDestination();
      }
    }
  };

  const navigateTo = (routeName: string) => {
    Navigator.navigate(routeName);
  };

  const types = customerType.listItems.map(item => ({
    label: item.ARCAT_NAME ?? '',
    value: item.ARCAT_KEY ? item.ARCAT_KEY : '',
  }));

  return (
    <View style={styles.container}>
      {userToken.VANCONFIG.VANCNF_AR_LIMIT != 2 ? (
        <View style={styles.typePickerSection}>
          <RNPickerSelect
            items={types}
            onValueChange={nextValue => {
              void onSetCustomerType(nextValue);
            }}
            style={{
              iconContainer: styles.typePickerIcon,
              inputAndroid: styles.typePickerInput,
              inputIOS: styles.typePickerInput,
            }}
            value={arcatKey}
            placeholder={{}}
            useNativeAndroidPickerStyle={false}
            textInputProps={{ underlineColorAndroid: 'transparent' }}
            Icon={() => {
              return (
                <AntDesign
                  name="down"
                  size={28}
                  color={MainTheme.colorPrimary}
                />
              );
            }}
          />
        </View>
      ) : null}

      <View style={styles.searchRow}>
        {userToken.VANCONFIG.VANCNF_AR_LIMIT != 2 ? (
          <View style={styles.searchFieldWrap}>
            <ISearchBar
              value={textSearch}
              round={true}
              lightTheme={false}
              placeholder="ลูกค้า"
              returnKeyType="search"
              onChangeText={(nextValue: string) => setTextSearch(nextValue)}
              onSubmitEditing={() => void onSearch()}
              onClear={() => setTextSearch(null)}
              style={{
                containerStyle: styles.searchBarContainer,
                inputContainerStyle: styles.searchBarInputContainer,
                inputStyle: styles.searchBarInput,
              }}
            />
          </View>
        ) : null}

        {userToken.VANCONFIG.VANCNF_AR_LIMIT != 2 ? (
          <TouchableOpacity
            onPress={() => {
              void onSearch();
            }}
            style={styles.iconButton}
          >
            <AntDesign
              name="search1"
              size={22}
              color={MainTheme.colorQuaternary}
            />
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={() => {
            void onRefresh();
          }}
          style={styles.iconButton}
        >
          <AntDesign name="sync" size={22} color={MainTheme.colorTertiary} />
        </TouchableOpacity>

        {userToken.VANCONFIG.VANCNF_AR_LIMIT == 2 ? (
          <TouchableOpacity
            onPress={() => {
              navigateTo('CustomerDestination');
            }}
            style={styles.iconButton}
          >
            <AntDesign name="sync" size={22} color={MainTheme.colorTertiary} />
          </TouchableOpacity>
        ) : null}

        {userToken.VANCONFIG.VANCNF_AR_LIMIT == 1 ? (
          <TouchableOpacity
            onPress={() => {
              navigateTo('CustomerRouteMapLine');
            }}
            style={styles.iconButton}
          >
            <AntDesign name="fork" size={22} color={MainTheme.colorTertiary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              navigateTo('CustomerRouteMapLine2');
            }}
            style={styles.iconButton}
          >
            <AntDesign name="fork" size={22} color={MainTheme.colorTertiary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.bottomDivider} />

      <Modal
        transparent
        visible={loadSummaryModal !== null}
        animationType="fade"
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
                    void runTimedCustomerLoad(false);
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

const mapStateToProps = (state: any) => ({
  customer: state.customer,
  customerType: state.customerType,
  geolocation: state.geolocation,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    setInitialState: () => {
      return dispatch(setInitialState());
    },
    setKeyword: (criteria: string | null) => {
      return dispatch(setKeyword(criteria));
    },
    getCurrentPosition: () => {
      return dispatch(getCurrentPosition());
    },
    searchCustomerRoutePageOnly: (nextPage?: boolean) => {
      return dispatch(searchCustomerRoutePageOnly(nextPage));
    },
    appendCustomerRouteBatchDetails: (
      routeItems: any[],
      fetchCustomerDetailsBatch: (payload: {
        arCodes: Array<string | number>;
      }) => Promise<any>,
      hasMore?: boolean,
    ) => {
      return dispatch(
        appendCustomerRouteBatchDetails(
          routeItems,
          fetchCustomerDetailsBatch,
          hasMore,
        ),
      );
    },
    clearCustomerList: () => {
      return dispatch(clearCustomerList());
    },
    restoreCustomerRouteCache: (payload: {
      items: any[];
      hasMore: boolean;
      offset: number;
      limit: number;
      keyword: string | null;
      arcatKey?: string | null;
    }) => {
      return dispatch(restoreCustomerRouteCache(payload));
    },
    setCustomerType: (value: CustomerTypeItem) => {
      return dispatch(setCustomerType(value));
    },
    searchCustomerNextDestination: () => {
      return dispatch(searchCustomerNextDestination());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 4,
    backgroundColor: '#FFFFFF',
  },
  typePickerSection: {
    borderWidth: 1,
    borderColor: '#D7DFE5',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#F9FBFA',
  },
  typePickerIcon: {
    top: 10,
    right: 6,
  },
  typePickerInput: {
    color: '#000000',
    paddingRight: 30,
    paddingVertical: 12,
    fontSize: 14,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchFieldWrap: {
    flex: 1,
  },
  searchBarContainer: {
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  searchBarInputContainer: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#D7DFE5',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  searchBarInput: {
    fontSize: 14,
    color: '#111827',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F7F5',
    borderWidth: 1,
    borderColor: '#D7DFE5',
  },
  bottomDivider: {
    borderBottomWidth: 0.5,
    width: '100%',
    borderColor: MainTheme.colorButtonBorder,
    marginTop: 10,
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
