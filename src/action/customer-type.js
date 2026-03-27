import qs from 'qs';
import {searchCustomerTypeListApi} from '../api/customer-type';
import * as types from '../constant/customer-type';

export const setInitialState = () => (dispatch) => {
  dispatch({type: types.CUSTOMER_TYPE_SET_INITIAL_STATE});
};

export const setIsError = (bool) => (dispatch) => {
  dispatch({type: types.CUSTOMER_TYPE_SET_IS_ERROR, payload: bool});
};

export const clearCustomerTypeList = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({type: types.CUSTOMER_TYPE_CLEAR_LIST});
    resolve();
  });
};

export const setCustomerType = (item) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({type: types.CUSTOMER_TYPE_SET_ITEM, payload: item});
    resolve();
  });
};

export const searchCustomerTypeList = (vanCNFEnabledAllar) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({type: types.CUSTOMER_TYPE_SEARCH_LIST});

    searchCustomerTypeListApi()
      .then((v) => {
        const {ReasonString, ResponseCode, ResponseData} = v;
        //console.log('searchCustomerTypeList v ', v);

        let responseData = JSON.parse(ResponseData);
        if (ResponseCode == 200) {
          const {RECORD_COUNT, OFFSET, FETCH, Ar000111} = responseData;

          //console.log('searchCustomerTypeList responseData ', responseData);
          if (Ar000111 && Ar000111.length > 0) {
            let typePickerItems = [];

            if (vanCNFEnabledAllar == 2) {
              typePickerItems.push({
                ARCAT_NAME: 'ทั้งหมด',
                ARCAT_KEY: null,
              });
              Ar000111.map((item, index) => {
                typePickerItems.push(item);
              });
            } else {
              Ar000111.map((item, index) => {
                typePickerItems.push(item);
              });
            }

            dispatch({
              type: types.CUSTOMER_TYPE_SEARCH_LIST_SUCCESS,
              payload: typePickerItems,
            });
          } else {
            dispatch({
              type: types.CUSTOMER_TYPE_SEARCH_LIST_SUCCESS,
              payload: [],
            });
          }
        } else {
          dispatch({type: types.CUSTOMER_TYPE_SEARCH_LIST_FAIL, payload: true});
          reject(ResponseCode + ReasonString);
        }

        resolve(v);
      })
      .catch((err) => {
        dispatch({type: types.CUSTOMER_TYPE_SEARCH_LIST_FAIL, payload: true});
        reject(err.message);
      });
  });
};
