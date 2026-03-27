import { productCategorySearchListApi } from '../api/product-category';
import * as types from '../constant/product-category';

export const setInitialState = () => (dispatch) => {
  dispatch({ type: types.PRODUCT_CATEGORY_SET_INITIAL_STATE });
};

export const clearProductCateGoryList = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.PRODUCT_CATEGORY_CLEAR_LIST });
    resolve();
  });
};

export const setCriteria = (criteria) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.PRODUCT_CATEGORY_SET_CRITERIA, payload: criteria });
    resolve();
  });
};

export const setKeyword = (criteria) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.PRODUCT_CATEGORY_SET_KEYWORD, payload: criteria });
    resolve();
  });
};

export const clearItem = () => (dispatch) => {
  dispatch({ type: types.PRODUCT_CATEGORY_CLEAR_ITEM });
};

export const searchProductCateGoryList = (
  vanCNFEnabledAllic,
  forceIsTransfer = false,
) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.PRODUCT_CATEGORY_SEARCH_LIST });
    const customer = getState().customer;
    const order = getState().order;

    const criteria = {
      KEYWORD: null,
      ARCODE:
        order.header.AR_ORDER_TYPE === 'โอนย้ายสินค้า'
          ? order.header.AR_CODE
          : customer.item.INFO.AR_CODE,
      isTransfer:
        order.header.AR_ORDER_TYPE === 'โอนย้ายสินค้า' || forceIsTransfer
          ? true
          : false,
    };

    //console.log('productCategorySearchListApi', criteria);
    productCategorySearchListApi(criteria)
      .then((v) => {
        const { ReasonString, ResponseCode, ResponseData } = v;
        let responseData = JSON.parse(ResponseData);
        if (ResponseCode == 200) {
          const { RECORD_COUNT, OFFSET, FETCH, Ic000303 } = responseData;

          if (Ic000303 && Ic000303.length > 0) {
            let pickerItems = [];

            if (vanCNFEnabledAllic == 2) {
              //console.log('vanCNFEnabledAllic ', vanCNFEnabledAllic);
              pickerItems.push({
                ICDEPT_KEY: null,
                ICDEPT_THAIDESC: 'ทั้งหมด',
              });
              Ic000303.map((item, index) => {
                const objItem = {
                  ICDEPT_KEY: item.ICCAT_KEY,
                  ICDEPT_THAIDESC: item.ICCAT_NAME,
                };
                pickerItems.push(objItem);
              });
            } else {
              Ic000303.map((item, index) => {
                const objItem = {
                  ICDEPT_KEY: item.ICCAT_KEY,
                  ICDEPT_THAIDESC: item.ICCAT_NAME,
                };
                pickerItems.push(objItem);
              });
            }
            // console.log(
            //   'productCategorySearchListApi pickerItems ',
            //   pickerItems,
            // );
            dispatch({
              type: types.PRODUCT_CATEGORY_SEARCH_LIST_SUCCESS,
              payload: pickerItems,
            });
          } else {
            dispatch({
              type: types.PRODUCT_CATEGORY_SEARCH_LIST_SUCCESS,
              payload: [],
            });
          }
        } else {
          dispatch({
            type: types.PRODUCT_CATEGORY_SEARCH_LIST_FAIL,
            payload: ResponseCode + ReasonString,
          });
          reject(ResponseCode + ReasonString);
        }

        resolve(v);
      })
      .catch((err) => {
        dispatch({
          type: types.PRODUCT_CATEGORY_SEARCH_LIST_FAIL,
          payload: true,
        });
        reject(err.message);
      });
  });
};

export const setProductCategory = (item) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.PRODUCT_CATEGORY_SET_ITEM, payload: item });
    resolve();
  });
};
