import {
  appendCustomerRouteBatchDetails as appendCustomerRouteBatchDetailsBase,
  clearCustomerList as clearCustomerListBase,
  searchCustomerRoutePageOnly as searchCustomerRoutePageOnlyBase,
  searchCustomerList as searchCustomerListBase,
  searchCustomerNextDestination as searchCustomerNextDestinationBase,
  setError as setErrorBase,
  setCriteria as setCriteriaBase,
  setInitialState as setInitialStateBase,
  setKeyword as setKeywordBase,
} from '../../action/customer';
import { setCustomerType as setCustomerTypeBase } from '../../action/customer-type';
import { getCurrentPosition as getCurrentPositionBase } from '../../action/geolocation';
import { setLastPosition as setLastPositionBase } from '../../action/longdomap';
import * as customerTypes from '../../constant/customer';

type Dispatch = (action: any) => any;
type GetState = () => any;

type SearchCustomerListResult = {
  items: any[];
  hasMore: boolean;
  error?: string;
  totalAvailable?: number;
  rawItemCount?: number;
  nextCriteriaOffset?: number;
};

type SearchCustomerRoutePageResult = {
  items: any[];
  hasMore: boolean;
  error?: string;
  totalAvailable?: number;
  rawItemCount?: number;
  nextCriteriaOffset?: number;
};

const CUSTOMER_ROUTE_PAGE_LIMIT = 1000;

export const setInitialState = () => async (dispatch: Dispatch) => {
  await dispatch(setInitialStateBase());
  return dispatch(
    setCriteriaBase({
      KEYWORD: null,
      OFFSET: 1,
      LIMIT: CUSTOMER_ROUTE_PAGE_LIMIT,
    }),
  );
};

export const clearCustomerList = () => (dispatch: Dispatch) =>
  dispatch(clearCustomerListBase());

export const setKeyword = (criteria: string | null) => (dispatch: Dispatch) =>
  dispatch(setKeywordBase(criteria));

export const setCriteria = (criteria: any) => (dispatch: Dispatch) =>
  dispatch(setCriteriaBase(criteria));

export const setError = (bool: boolean) => (dispatch: Dispatch) =>
  dispatch(setErrorBase(bool));

export const setCustomerType = (value: any) => (dispatch: Dispatch) =>
  dispatch(setCustomerTypeBase(value));

export const getCurrentPosition = () => (dispatch: Dispatch) =>
  dispatch(getCurrentPositionBase());

export const setLastPosition = (position: {
  latitude: number | null;
  longitude: number | null;
}) => (dispatch: Dispatch) => dispatch(setLastPositionBase(position));

export const searchCustomerList =
  (
    nextPage?: boolean,
    fetchCustomerDetailsBatch?: (payload: {
      arCodes: Array<string | number>;
    }) => Promise<any>,
  ) =>
  async (
    dispatch: Dispatch,
    getState: GetState,
  ): Promise<SearchCustomerListResult> => {
    const beforeCustomer = getState().customer;
    const beforeItems = Array.isArray(beforeCustomer?.listItems)
      ? beforeCustomer.listItems
      : [];
    const beforeCount = beforeItems.length;

    const result = await dispatch(
      searchCustomerListBase(nextPage, fetchCustomerDetailsBatch),
    );

    const afterCustomer = getState().customer;
    const afterItems = Array.isArray(afterCustomer?.listItems)
      ? afterCustomer.listItems
      : [];
    const appendedItems = afterItems.slice(beforeCount);

    return {
      items: appendedItems,
      hasMore:
        typeof result?.hasMore === 'boolean'
          ? result.hasMore
          : afterCustomer?.hasMore !== false,
      error: afterCustomer?.isError ? 'CUSTOMER_SEARCH_LIST_FAIL' : undefined,
      totalAvailable: result?.totalAvailable,
      rawItemCount: result?.rawItemCount,
      nextCriteriaOffset: result?.nextCriteriaOffset,
    };
  };

export const searchCustomerRoutePageOnly =
  (nextPage?: boolean) =>
  async (
    dispatch: Dispatch,
  ): Promise<SearchCustomerRoutePageResult> => {
    return dispatch(searchCustomerRoutePageOnlyBase(nextPage));
  };

export const appendCustomerRouteBatchDetails =
  (
    routeItems: any[],
    fetchCustomerDetailsBatch: (payload: {
      arCodes: Array<string | number>;
    }) => Promise<any>,
    hasMore?: boolean,
  ) =>
  async (dispatch: Dispatch) => {
    return dispatch(
      appendCustomerRouteBatchDetailsBase(
        routeItems,
        fetchCustomerDetailsBatch,
        hasMore,
      ),
    );
  };

export const searchCustomerNextDestination = () => (dispatch: Dispatch) =>
  dispatch(searchCustomerNextDestinationBase());

export const restoreCustomerRouteCache =
  (payload: {
    items: any[];
    hasMore: boolean;
    offset: number;
    limit: number;
    keyword: string | null;
    arcatKey?: string | null;
  }) =>
  (dispatch: Dispatch) => {
    dispatch(
      setCriteriaBase({
        KEYWORD: payload.keyword,
        OFFSET: payload.offset,
        LIMIT: payload.limit,
      }),
    );

    dispatch({
      type: customerTypes.CUSTOMER_SEARCH_LIST_SUCCESS,
      payload: payload.items,
      hasMore: payload.hasMore,
    });

    return {
      items: payload.items,
      hasMore: payload.hasMore,
    };
  };
