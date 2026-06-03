import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import { ConfirmDialog, ProgressDialog } from 'react-native-simple-dialogs';
import SnackBar from 'react-native-snackbar-component';
import { setInitialState as setCheckInInitialState } from '../../../action/check-in';
import {
  clearCustomerList,
  findCustomerById,
  searchCustomerList,
  searchCustomerNextDestination,
  setCustomerInfo,
  setError,
  setInitialState,
} from '../../../action/customer';
import { setCustomerType } from '../../../action/customer-type';
import { setInitialState as setMileInitialState } from '../../../action/mile';
import ErrorMessage from '../../../component/announce/ErrorMessage';
import { ListItem } from '../../../component/elements';
import IList from '../../../component/list/IList';
import { mainDivider, MainTheme } from '../../../constant/lov';
import Navigator from '../../../services/Navigator';
import { getUserToken } from '../../../utils/Token';

interface UserToken {
  VANCONFIG: {
    VANCNF_AR_LIMIT: number | null;
    VANCNF_FORCE_MILE?: number | null;
    VANCNF_FORCE_GPS?: number | null;
  };
}

interface CustomerItem {
  AR_KEY?: string;
  LAST_DO?: boolean;
  IS_SKIP?: boolean;
  AR_CODE?: string;
  AR_NAME?: string;
  ADDB_ADDB_1?: string;
  ADDB_ADDB_2?: string;
  ADDB_ADDB_3?: string;
  ADDB_SUB_DISTRICT?: string;
  ADDB_DISTRICT?: string;
  ADDB_PROVINCE?: string;
  ADDB_POST?: string;
  ARCAT_KEY?: string | null;
  ARCAT_NAME?: string | null;
}

interface CustomerState {
  listItems: CustomerItem[];
  isLoading: boolean;
  isNotFound: boolean;
  isError: boolean;
}

interface CustomerTypeState {
  listItems: CustomerItem[];
  item?: {
    ARCAT_KEY?: string | null;
    ARCAT_NAME?: string | null;
  };
  isLoading: boolean;
  isError: boolean;
}

interface StateProps {
  customer: CustomerState;
  customerType: CustomerTypeState;
}

interface DispatchProps {
  setInitialState: () => void;
  setMileInitialState: () => void;
  setCheckInInitialState: () => void;
  clearCustomerList: () => void;
  searchCustomerList: (nextPage: boolean) => void;
  setError: (bool: boolean) => void;
  findCustomerById: (id?: string) => void;
  setCustomerInfo: (data: CustomerItem) => void;
  setCustomerType: (value: CustomerItem) => void;
  searchCustomerNextDestination: () => void;
}

interface OwnProps {
  screen?: string;
}

type Props = StateProps & DispatchProps & OwnProps;

const ListItems: React.FC<Props> = ({
  customer,
  customerType,
  screen,
  clearCustomerList,
  findCustomerById,
  searchCustomerList,
  searchCustomerNextDestination,
  setCustomerInfo,
  setCustomerType,
  setCheckInInitialState,
  setMileInitialState,
  setError,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState<UserToken>({
    VANCONFIG: {
      VANCNF_AR_LIMIT: null,
      VANCNF_FORCE_MILE: null,
      VANCNF_FORCE_GPS: null,
    },
  });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const fetchToken = async () => {
      const token = await getUserToken();
      if (mountedRef.current && token) {
        setUserToken(token as UserToken);
      }
    };

    fetchToken();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const onListItemPress = useCallback(
    async (item: CustomerItem) => {
      try {
        setIsLoading(true);

        await findCustomerById(item.AR_KEY);
        setCustomerInfo(item);

        setIsLoading(false);

        setMileInitialState();
        setCheckInInitialState();

        const token = await getUserToken();
        if (screen === 'profile') {
          Navigator.navigate('CustomerProfileDetail');
          return;
        }

        if (token.VANCONFIG.VANCNF_FORCE_MILE === 1) {
          Navigator.navigate('Mile');
          return;
        }

        if (token.VANCONFIG.VANCNF_FORCE_GPS === 1) {
          Navigator.navigate('CheckIn');
          return;
        }

        Navigator.navigate('OrderChoice');
      } catch (error) {
        setErrorMessage(`เกิดข้อผิดพลาด: ${error}`);
      }

      setIsLoading(false);
    },
    [findCustomerById, setCustomerInfo, setCheckInInitialState, setMileInitialState, screen],
  );

  const onRefresh = useCallback(async () => {
    clearCustomerList();

    const selectedCustomerType =
      customerType.listItems.find(
        item => item.ARCAT_KEY === customerType.item?.ARCAT_KEY,
      ) ?? customerType.item ?? { ARCAT_KEY: null, ARCAT_NAME: null };

    setCustomerType(selectedCustomerType);

    if (userToken.VANCONFIG.VANCNF_AR_LIMIT !== 2) {
      searchCustomerList(false);
    } else {
      searchCustomerNextDestination();
    }
  }, [clearCustomerList, customerType, searchCustomerList, searchCustomerNextDestination, setCustomerType, userToken.VANCONFIG.VANCNF_AR_LIMIT]);

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
        const currentOffset = parseInt(`${event.nativeEvent.contentOffset.y}`, 10);

        if (
          currentOffset > 0 &&
          currentOffset >= maxOffset &&
          !customer.isLoading
        ) {
          searchCustomerList(true);
        }
      }
    },
    [customer.isLoading, searchCustomerList, userToken.VANCONFIG.VANCNF_AR_LIMIT],
  );

  const actionHandler = useCallback(() => {
    setError(false);
  }, [setError]);

  const renderItem = useCallback(
    ({ item, index }: { item: CustomerItem; index: number }) => (
      <ListItem
        key={item.AR_KEY || index}
        containerStyle={mainDivider}
        bottomDivider
        onPress={() => onListItemPress(item)}
      >
        <ListItem.Content key="content">
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 0.1, flexDirection: 'column' }}>
              {userToken.VANCONFIG.VANCNF_AR_LIMIT === 2 && item.LAST_DO ? (
                <AntDesign
                  name="check"
                  color={MainTheme.colorPrimary}
                  size={26}
                />
              ) : null}
              {userToken.VANCONFIG.VANCNF_AR_LIMIT === 2 && item.IS_SKIP ? (
                <AntDesign
                  name="stepforward"
                  color={MainTheme.colorPrimary}
                  size={26}
                />
              ) : null}
            </View>
            <View style={{ flex: 0.9, flexDirection: 'column' }}>
              {userToken.VANCONFIG.VANCNF_AR_LIMIT === 2 ? (
                <Text style={{ fontSize: hp('1.9%') }} allowFontScaling={false}>
                  {index + 1}
                </Text>
              ) : null}
              <Text
                style={{ fontSize: hp('1.9%'), fontWeight: 'bold' }}
                allowFontScaling={false}
              >
                {item.AR_CODE || '-'}
              </Text>
              <Text style={{ fontSize: hp('1.9%') }} allowFontScaling={false}>
                {item.AR_NAME || '-'}
              </Text>
              <Text style={{ fontSize: hp('1.8%') }} allowFontScaling={false}>
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
        </ListItem.Content>
        <ListItem.Chevron key="chevron" color="#666" size={30} />
      </ListItem>
    ),
    [onListItemPress, userToken.VANCONFIG.VANCNF_AR_LIMIT],
  );

  const renderList = useCallback(
    () => (
      <IList
        data={customer.listItems}
        renderItem={renderItem}
        refreshing={customer.isLoading || customerType.isLoading}
        onRefresh={onRefresh}
        onScroll={onScroll}
      />
    ),
    [customer.listItems, customer.isLoading, customerType.isLoading, onRefresh, onScroll, renderItem],
  );

  const isNotFound = customer.isNotFound && customer.listItems.length === 0;
  const isError =
    (customer.isError && customer.listItems.length === 0) ||
    customerType.isError;
  const isSnackBarVisible =
    customer.isError && customer.listItems.length > 0;

  return (
    <View style={{ flex: 1 }}>
      {!isNotFound && !isError ? renderList() : null}

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

      <ProgressDialog
        visible={isLoading}
        message="กำลังโหลดข้อมูลลูกค้า"
        animationType="fade"
        dialogStyle={{ borderRadius: 5 }}
      />

      <ConfirmDialog
        title="เกิดข้อผิดพลาด"
        visible={errorMessage !== null}
        positiveButton={{
          title: 'ตกลง',
          titleStyle: { color: '#000000' },
          onPress: () => setErrorMessage(null),
        }}
        animationType="fade"
        dialogStyle={{ borderRadius: 5 }}
      >
        <View>
          <Text>{errorMessage}</Text>
        </View>
      </ConfirmDialog>
    </View>
  );
};

const mapStateToProps = (state: any): StateProps => ({
  customer: state.customer,
  customerType: state.customerType,
});

const mapDispatchToProps = (dispatch: any): DispatchProps => {
  return {
    setInitialState: () => {
      dispatch(setInitialState());
    },
    setMileInitialState: () => {
      dispatch(setMileInitialState());
    },
    setCheckInInitialState: () => {
      dispatch(setCheckInInitialState());
    },
    clearCustomerList: () => dispatch(clearCustomerList()),
    searchCustomerList: nextPage => dispatch(searchCustomerList(nextPage)),
    setError: bool => {
      dispatch(setError(bool));
    },
    findCustomerById: id => dispatch(findCustomerById(id)),
    setCustomerInfo: data => {
      dispatch(setCustomerInfo(data));
    },
    setCustomerType: value => dispatch(setCustomerType(value)),
    searchCustomerNextDestination: () => {
      dispatch(searchCustomerNextDestination());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListItems);
