import {campaignTypeSearchListApi} from '../api/campaign-type';
import * as types from '../constant/campaign-type';

export const setInitialState = () => (dispatch) => {
  dispatch({type: types.CAMPAIGN_TYPE_INITIAL_STATE});
};

export const setItem = (item) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({type: types.CAMPAIGN_TYPE_SET_ITEM, payload: item});
    resolve();
  });
};

export const campaignTypeSearchList = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({type: types.CAMPAIGN_TYPE_SEARCH_LIST});

    campaignTypeSearchListApi()
      .then((v) => {
        const {ReasonString, ResponseCode, ResponseData} = v;
        const responseData = JSON.parse(ResponseData);
        if (ResponseCode == '200') {
          if (responseData.RECORD_COUNT > 0) {
            dispatch({
              type: types.CAMPAIGN_TYPE_SEARCH_LIST_SUCCESS,
              payload: responseData.Sp005111,
            });
          } else {
            dispatch({
              type: types.CAMPAIGN_TYPE_SEARCH_LIST_FAIL,
              payload: 'Data not found',
            });
            // reject('Data not found')
          }
        } else {
          dispatch({
            type: types.CAMPAIGN_TYPE_SEARCH_LIST_FAIL,
            payload: ResponseCode + ReasonString,
          });
          // reject(ERROR_MESSAGES[0])
        }

        // resolve(v)
      })
      .catch((err) => {
        dispatch({
          type: types.CAMPAIGN_TYPE_SEARCH_LIST_FAIL,
          payload: err.message,
        });
        // reject(err.message)
      });
  });
};
