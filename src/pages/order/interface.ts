export interface UserToken {
  VANCONFIG: {
    VANCNF_AR_LIMIT: number | null;
    VANCNF_FORCE_MILE?: number | null;
    VANCNF_FORCE_GPS?: number | null;
  };
}

export interface CustomerItem {
  AR_KEY?: string;
  LAST_DO?: boolean;
  IS_SKIP?: boolean;
  AR_CODE?: string;
  AR_NAME?: string;
  ADDB_COMPANY?: string;
  ADDB_ADDB_1?: string;
  ADDB_ADDB_2?: string;
  ADDB_ADDB_3?: string;
  ADDB_SUB_DISTRICT?: string;
  ADDB_DISTRICT?: string;
  ADDB_PROVINCE?: string;
  ADDB_POST?: string;
  ADDB_GPS_LAT_S?: string | number | null;
  ADDB_GPS_LONG_S?: string | number | null;
  ARCAT_KEY?: string | null;
  ARCAT_NAME?: string | null;
}

export interface CustomerTypeItem {
  ARCAT_KEY?: string | null;
  ARCAT_NAME?: string | null;
}

export interface CustomerState {
  listItems: CustomerItem[];
  hasMore?: boolean;
  lastFetchCount?: number;
  isLoading: boolean;
  isNotFound: boolean;
  isError: boolean;
}

export interface CustomerTypeState {
  listItems: CustomerItem[];
  item?: CustomerTypeItem;
  isLoading: boolean;
  isError: boolean;
}

export interface CustomerListStateProps {
  customer: CustomerState;
  customerType: CustomerTypeState;
}

export interface CustomerListDispatchProps {
  setInitialState: () => void;
  setMileInitialState: () => void;
  setCheckInInitialState: () => void;
  clearCustomerList: () => void;
  searchCustomerList: (nextPage: boolean) => void;
  setError: (bool: boolean) => void;
  findCustomerById: (id?: string) => void;
  setCustomerInfo: (data: CustomerItem) => void;
  setSelectedCustomer: (data: CustomerItem) => void;
  setCustomerType: (value: CustomerItem) => void;
  searchCustomerNextDestination: () => void;
}

export interface CustomerListOwnProps {
  screen?: string;
}

export type CustomerListProps = CustomerListStateProps &
  CustomerListDispatchProps &
  CustomerListOwnProps;
