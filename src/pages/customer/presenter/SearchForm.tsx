import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import type { ComponentType } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import {
  clearCustomerList,
  searchCustomerList,
  searchCustomerNextDestination,
  setInitialState,
  setKeyword,
} from '../../../action/customer';
import { setCustomerType } from '../../../action/customer-type';
import ISearchBar from '../../../component/input/ISearchBar';
import { MainTheme } from '../../../constant/lov';
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
  searchCustomerList: (nextPage?: boolean) => void | Promise<void>;
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
  const [textSearch, setTextSearch] = useState<string | null>(null);
  const [arcatKey, setArcatKey] = useState<string | null>(null);
  const [userToken, setUserTokenState] =
    useState<UserTokenState>(initialUserToken);

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

    if (nextUserToken?.VANCONFIG?.VANCNF_AR_LIMIT != 2) {
      await setKeyword(textSearch ? textSearch.trim() : null);
      await searchCustomerList(false);
      return;
    }

    await searchCustomerNextDestination();
  }, [
    searchCustomerList,
    searchCustomerNextDestination,
    setKeyword,
    setSafeUserToken,
    textSearch,
  ]);

  useEffect(() => {
    mountedRef.current = true;

    const init = async () => {
      await loadUserToken();
      await setInitialState();
      await clearCustomerList();
      await loadInitialCustomers();
    };

    void init();

    return () => {
      mountedRef.current = false;
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

    if (!customer.isLoading) {
      const limit = nextUserToken?.VANCONFIG?.VANCNF_AR_LIMIT;

      if (limit != 2) {
        await clearCustomerList();
        await setKeyword(textSearch ? textSearch.trim() : null);
        await searchCustomerList(false);
      } else {
        await clearCustomerList();
        await searchCustomerNextDestination();
      }
    }
  };

  const onSearch = async () => {
    const nextUserToken = await loadUserToken();

    if (!customer.isLoading) {
      if (nextUserToken?.VANCONFIG?.VANCNF_AR_LIMIT != 2) {
        if (customerType.listItems && customerType.listItems.length > 0) {
          let type =
            customerType.listItems.find(v => arcatKey == v.ARCAT_KEY) ?? null;

          if (!type) {
            type = { ARCAT_KEY: null, ARCAT_NAME: null };
          }

          await setCustomerType(type);
          await clearCustomerList();
          await setKeyword(textSearch ? textSearch.trim() : null);
          await searchCustomerList();
        } else {
          await clearCustomerList();
          await setKeyword(textSearch ? textSearch.trim() : null);
          await searchCustomerList(false);
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

    await onSearch();
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
  heroSection: {
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: MainTheme.colorQuaternary,
    marginBottom: 2,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#6B7280',
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
  searchSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
  },
});
