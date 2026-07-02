import { fetchCustomerDueDateFromErp } from '../api/LookupErpServices/lookup-erp-services';
import * as types from '../constant/customerSelect';
import {
  buildDueDateFromCreditTerm,
  formatDisplayDateToErpYyyymmdd,
  resolveDocumentDateForCreditTerms,
} from '../utils/customerDueDate';

export const setSelectedCustomer = customerInfo => dispatch => {
  const info = customerInfo ?? {};

  dispatch({
    type: types.CUSTOMER_SELECT_SET_SELECTED,
    payload: {
      AR_KEY: info.AR_KEY ?? null,
      AR_CODE: info.AR_CODE ?? null,
      AR_NAME: info.AR_NAME ?? null,
      INFO: info,
    },
  });
};

export const updateSelectedCustomerDueDate = displayDate => dispatch => {
  const yyyymmdd = formatDisplayDateToErpYyyymmdd(displayDate);

  if (!yyyymmdd) {
    return;
  }

  dispatch({
    type: types.CUSTOMER_SELECT_SET_DUE_DATE,
    payload: {
      display: displayDate,
      yyyymmdd,
      sourceField: 'manual',
      arcdDueDateRaw: null,
    },
  });
};

export const clearSelectedCustomerContext = () => dispatch => {
  dispatch({ type: types.CUSTOMER_SELECT_CLEAR });
};

export const loadCustomerDueDateFromErp =
  (arcdDate, arKeyOverride) => async (dispatch, getState) => {
    const customerSelectState = getState().customerSelect;
    const orderHeader = getState().order?.header;
    const arKey =
      arKeyOverride ??
      customerSelectState?.selected?.AR_KEY ??
      getState().customer?.item?.INFO?.AR_KEY;
    const resolvedArcdDate =
      arcdDate ?? resolveDocumentDateForCreditTerms(orderHeader);

    dispatch({ type: types.CUSTOMER_SELECT_FETCH_DUE_DATE_REQUEST });

    try {
      const result = await fetchCustomerDueDateFromErp({
        arKey,
        arcdDate: resolvedArcdDate,
      });

      dispatch({
        type: types.CUSTOMER_SELECT_FETCH_DUE_DATE_SUCCESS,
        payload: result,
      });

      return result;
    } catch (error) {
      console.log('[loadCustomerDueDateFromErp] error', {
        arKey,
        arcdDate: resolvedArcdDate,
        message: error?.message,
        status: error?.response?.status,
        response: error?.response?.data,
      });

      const fallbackDueDate = buildDueDateFromCreditTerm(
        null,
        resolvedArcdDate,
      );

      dispatch({
        type: types.CUSTOMER_SELECT_FETCH_DUE_DATE_FAIL,
        payload: error?.message ?? 'loadCustomerDueDateFromErp failed',
      });
      dispatch({
        type: types.CUSTOMER_SELECT_FETCH_DUE_DATE_SUCCESS,
        payload: {
          arCondition: null,
          asset: null,
          dueDate: fallbackDueDate,
        },
      });

      return {
        arCondition: null,
        asset: null,
        dueDate: fallbackDueDate,
      };
    }
  };
