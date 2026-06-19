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
  clearCustomerList,
  setCustomerType,
  searchCustomerList,
  searchCustomerNextDestination,
  setInitialState,
  setKeyword,
} from '../customer-route-action';
import ISearchBar from '../../../component/input/ISearchBar';
import { MainTheme } from '../../../constant/lov';
import {
  clearCustomerRouteLoadSession,
  setCustomerRouteLoadSession,
} from '../../../services/customerRouteLoadSession';
import { clearCustomerRouteDistanceCache } from '../../../services/longdomap';
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
};

type CustomerTypeState = {
  listItems: CustomerTypeItem[];
  item?: CustomerTypeItem | null;
};

type SearchFormOwnProps = {
  navigation?: unknown;
  screen?: string;
};

type SearchFormProps = SearchFormOwnProps & {
  customer: CustomerState;
  customerType: CustomerTypeState;
  setInitialState: () => void | Promise<void>;
  setKeyword: (criteria: string | null) => void | Promise<void>;
  searchCustomerList: (
    nextPage?: boolean,
  ) => Promise<{ items?: any[]; hasMore?: boolean; error?: string } | void>;
  clearCustomerList: () => void | Promise<void>;
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
    setInitialState,
    setKeyword,
    searchCustomerList,
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
  const [loadSummaryModal, setLoadSummaryModal] = useState<{
    totalLoaded: number;
    hasMore: boolean;
  } | null>(null);

  useEffect(() => {
    customerRef.current = customer;
  }, [customer]);

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

  const runTimedCustomerLoad = useCallback(
    async (reset: boolean) => {
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
      setIsTimedLoading(true);

      if (reset) {
        await clearCustomerRouteLoadSession();
        await clearCustomerRouteDistanceCache();
        await clearCustomerList();
      }

      const startedAt = Date.now();
      const startedCount = reset ? 0 : customerRef.current.listItems.length;
      let totalLoaded = startedCount;
      let nextPage = !reset && customerRef.current.listItems.length > 0;
      let hasMore = true;
      let lastResultError = null;

      while (mountedRef.current && activeTimedLoadIdRef.current === loadId) {
        const result = await searchCustomerList(nextPage);

        if (!mountedRef.current || activeTimedLoadIdRef.current !== loadId) {
          return;
        }

        const fetchedItems = Array.isArray(result?.items) ? result.items : [];
        totalLoaded += fetchedItems.length;
        hasMore = result?.hasMore === true;
        lastResultError = result?.error ?? null;

        await setCustomerRouteLoadSession({
          totalLoaded,
          hasMore,
          updatedAt: new Date().toISOString(),
        });

        if (lastResultError || !hasMore || Date.now() - startedAt >= 60000) {
          break;
        }

        nextPage = true;
      }

      if (!mountedRef.current || activeTimedLoadIdRef.current !== loadId) {
        return;
      }

      setIsTimedLoading(false);

      if (lastResultError) {
        return;
      }

      setLoadSummaryModal({
        totalLoaded,
        hasMore,
      });
    },
    [
      clearCustomerList,
      searchCustomerList,
      searchCustomerNextDestination,
    ],
  );

  useEffect(() => {
    mountedRef.current = true;

    const init = async () => {
      await loadUserToken();
      await setInitialState();
      await loadInitialCustomers();
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
              {`โหลดข้อมูลสำเร็จ ${loadSummaryModal?.totalLoaded ?? 0} รายการ`}
            </Text>
            <Text style={styles.modalMessage}>
              {loadSummaryModal?.hasMore
                ? 'ต้องการโหลดข้อมูลต่อหรือไม่'
                : 'ไม่มีข้อมูลเพิ่มเติมแล้ว'}
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
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    setInitialState: () => {
      return dispatch(setInitialState());
    },
    setKeyword: (criteria: string | null) => {
      return dispatch(setKeyword(criteria));
    },
    searchCustomerList: (nextPage?: boolean) => {
      return dispatch(searchCustomerList(nextPage));
    },
    clearCustomerList: () => {
      return dispatch(clearCustomerList());
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
