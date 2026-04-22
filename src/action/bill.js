import * as types from '../constant/bill';
import {billTodayGetListItemsApi, billSearchListItemsApi} from '../api/bill';
import {
  UpdateErpGetSellOrderDocInfoAPi,
  LookupErpCashSaleAPi,
  LookupErpBookAPi,
  UpdateErpGetInvoiceOrderDocInfoAPi,
  UpdateErpGetReceiveOrderDocInfoAPi,
  UpdateErpGetOtherDocInfoAPi,
  GetReportNameApi,
  GetPrintReportApi,
  GetPrintStatusApi,
} from '../api/report';
import {BPAPUS_BPAPSV, API_ENDPOINT_V3} from '../../appConfig';
import { getUserToken,getLoginGuID} from '../utils/Token';
import moment from 'moment';
export const setInitialState = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({type: types.BILL_SET_INITIAL_STATE});
    resolve();
  });
};

export const setCriteria = (criteria) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({type: types.BILL_SET_CRITERIA, payload: criteria});
    resolve();
  });
};

export const setError = (bool) => (dispatch) => {
  dispatch({type: types.BILL_SET_ERROR, payload: bool});
};

export const billTodayClearListItems = () => (dispatch) => {
  dispatch({type: types.BILL_TODAY_CLEAR_LIST_ITEMS});
};

export const billClearListItems = () => (dispatch) => {
  dispatch({type: types.BILL_CLEAR_LIST_ITEMS});
};

export const billTodayGetListItems = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const customer = getState().customer;

    dispatch({type: types.BILL_TODAY_GET_LIST_ITEMS});

    billTodayGetListItemsApi(customer.item.INFO.AR_CODE)
      .then((v) => {
        const {RESULT_DATA, STATUS, ERROR_MESSAGES} = v;

        if (STATUS === '00') {
          const {RESULT} = RESULT_DATA;

          if (RESULT_DATA && RESULT && RESULT.length > 0) {
            dispatch({
              type: types.BILL_TODAY_GET_LIST_ITEMS_SUCCESS,
              payload: RESULT,
            });
          } else {
            dispatch({
              type: types.BILL_TODAY_GET_LIST_ITEMS_SUCCESS,
              payload: [],
            });
            reject('ไม่พบข้อมูลบิลการขายของวันนี้');
          }
        } else if (STATUS === '10') {
          dispatch({
            type: types.BILL_TODAY_GET_LIST_ITEMS_FAIL,
            payload: ERROR_MESSAGES,
          });
          reject(ERROR_MESSAGES);
        }
        resolve(v);
      })
      .catch((error) => {
        dispatch({
          type: types.BILL_TODAY_GET_LIST_ITEMS_FAIL,
          payload: error.message,
        });
        reject(error.message);
      });
  });
};

export const billSearchListItems = (nextPage) => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    dispatch({type: types.BILL_SEARCH_LIST_ITEMS});
    const customer = getState().customer;
    const bill = getState().bill;
    const config = await getUserToken();
    const vanCnf = config.VANCNF_MACHINE;
    const fromDate = moment(bill.criteria.dateFrom).subtract(1, 'days');

    const toDate = moment(bill.criteria.dateTo);
    
    dispatch({type: types.BILL_TODAY_GET_LIST_ITEMS});
    let RESULT = [];

    const criteria = {
      FROM: customer.item.AR_SUMMARY.FIRST_DUE_DI_DATE,
      TO: customer.item.AR_SUMMARY.LAST_DI_DATE,
      AR_CODE: customer.item.INFO.AR_CODE,
      OFFSET: nextPage
        ? (bill.criteria.OFFSET - 1) * bill.criteria.LIMIT
        : (1 - 1) * bill.criteria.LIMIT,
      LIMIT: bill.criteria.LIMIT,
    };
    await LookupErpCashSaleAPi(vanCnf, fromDate.format('YYYY-MM-DD'), toDate.format('YYYY-MM-DD')).then(async (v) => {
      if (v && v.length != 0) {
        for (let obj of v) {
          if (obj.DT_DOCCODE.includes('Q') || obj.DT_DOCCODE.includes('BK')) {
            const response = await UpdateErpGetSellOrderDocInfoAPi(obj.DI_KEY);
          
            if (response.AROE?.AR_CODE == customer.item.INFO.AR_CODE) {
              RESULT.push({
                ...response,
                DI_ITEMS: parseFloat(obj.DI_ITEMS),
                DI_AMOUNT: parseFloat(obj.DI_AMOUNT),
              });
            }
          } else {
            const response = await UpdateErpGetInvoiceOrderDocInfoAPi(
              obj.DI_KEY,
            );
          
            if (response.ARDETAIL?.AR_CODE == customer.item.INFO.AR_CODE) {
              RESULT.push({
                ...response,
                DI_ITEMS: parseFloat(obj.DI_ITEMS),
                DI_AMOUNT: parseFloat(obj.DI_AMOUNT),
              });
            }
          }
        }
        dispatch(
          setCriteria({
            ...bill.criteria,
            OFFSET: nextPage ? bill.criteria.OFFSET + 1 : 2,
          }),
        );
        dispatch({type: types.BILL_SEARCH_LIST_ITEMS_SUCCESS, payload: RESULT});
        resolve(RESULT);
      } else {
        dispatch({type: types.BILL_SEARCH_LIST_ITEMS_SUCCESS, payload: []});
        resolve([]);
      }
    });
  });
};
