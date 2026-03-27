import {
  getWareLocationStockBalance,
} from '../api/drop-point';

import {
  getDPWareLocationByVANCNF_KEY,
  getDPWareLocationANDHoByVANCNF_KEY
} from '../api/drop-point_wh';

import {
  lookupErpV3Api,
  readErpV3Api,
  updateErpV3Api,
  parseResDataToJson,
} from '../api/bPlusApi';
import {getLoginGuID, getUserToken} from '../utils/Token';
import * as types from '../constant/drop-point';
import {BPAPUS_BPAPSV} from '../../appConfig';
import {
  BPAPUS_FUNCTION_WH_CODE,
  BPAPUS_FUNCTION_V_CODE,
  BPAPUS_FUNCTION_BK_CODE,
  BPAPUS_FUNCTION_DP_CODE
} from '../constant/bPlusApi';

export const setInitialState = () => (dispatch) => {
  dispatch({type: types.DROP_POINT_SET_INITIAL_STATE});
};

export const clearDropPointList = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({type: types.DROP_POINT_CLEAR_LIST_ITEMS});
    resolve();
  });
};

export const getDropPointListItems = () => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    const product = getState().product;
    console.log('dsad >> ' , product);
    const userTokens = await getUserToken();

//getDPWareLocationByVANCNF_KEY(product.item.SKU_CODE, userTokens.VANCONFIG)
getDPWareLocationANDHoByVANCNF_KEY(product.item.SKU_CODE, userTokens.VANCONFIG)
   .then((v) => {
        const {ReasonString, ResponseCode, ResponseData} = v;
        console.log('getDropPointListItems 5 ', v);
        //console.log('userTokens.VANCONFIG ', userTokens.VANCONFIG);
        let responseData = JSON.parse(ResponseData);
        if (ResponseCode == 200) {
          const {
            RECORD_COUNT,
            OFFSET,
            SKU_CODE,
            FETCH,
            ShowSkuBalance,
          } = responseData;
          if (
            ShowSkuBalance &&
            product.item.SKU_CODE == SKU_CODE &&
            ShowSkuBalance.length > 0
          ) {


            let RESULT = ShowSkuBalance
            .map((obj) => {
              {
                console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ', obj);
                return {...obj,QTY: parseFloat(obj.QTY)
                ,good_inVan_qty : product.item.good_inVan_qty
                ,UTQ_QTY : product.item.UTQ_QTY
                ,UTQ_NAME : product.item.UTQ_NAME               
                };
              }
            });
            console.log('getDropPointListItems RESULT', RESULT);
            dispatch({
              type: types.DROP_POINT_GET_LIST_ITEMS_SUCCESS,
              payload: RESULT,
            });
            }
            else {
            reject('ไม่พบข้อมูล');
          }
        } else {
          reject(ResponseCode + ReasonString);
        }
        resolve(v);
      })
 

    // getWareLocationStockBalance(product.item.SKU_CODE, userTokens.VANCONFIG)
    //   .then((v) => {
    //     const {ReasonString, ResponseCode, ResponseData} = v;
    //     console.log('getDropPointListItems 5 ', v);
    //     console.log('userTokens.VANCONFIG ', userTokens.VANCONFIG);
    //     let responseData = JSON.parse(ResponseData);
    //     if (ResponseCode == 200) {
    //       const {
    //         RECORD_COUNT,
    //         OFFSET,
    //         SKU_CODE,
    //         FETCH,
    //         ShowSkuBalance,
    //       } = responseData;
    //       if (
    //         ShowSkuBalance &&
    //         product.item.SKU_CODE == SKU_CODE &&
    //         ShowSkuBalance.length > 0
    //       ) {


    //         let RESULT = ShowSkuBalance
    //         //.filter(function (item) {
    //         //  return item.WL_CODE == WL_CODE;
    //         //})
    //         .map((obj) => {
    //           {
    //             console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ', obj);
    //             return {...obj,QTY: parseFloat(obj.QTY)};
    //           }
    //         });
    //         console.log('getDropPointListItems RESULT', RESULT);
    //         dispatch({
    //           type: types.DROP_POINT_GET_LIST_ITEMS_SUCCESS,
    //           payload: RESULT,
    //         });
    //         }
    //         else {
    //         reject('ไม่พบข้อมูล');
    //       }
    //     } else {
    //       reject(ResponseCode + ReasonString);
    //     }
    //     resolve(v);
    //   })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const searchDropPointList = (textInput) => async (
  dispatch,
  getState,
) => {
  dispatch({type: types.DROP_POINT_SEARCH_LIST_ITEMS});
  console.log('text', textInput);
  const V3GUID = await getLoginGuID();
  const userTokens = await getUserToken();
  console.log('userTokens', JSON.stringify(userTokens));
  // let dataObj1 = {
  //   'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
  //   'BPAPUS-LOGIN-GUID': V3GUID,
  //   'BPAPUS-FUNCTION': BPAPUS_FUNCTION_WH_CODE,
  //   'BPAPUS-PARAM': '',
  //   'BPAPUS-FILTER': textInput
  //     ? "and WL_NAME like '%" +
  //       textInput +
  //       "%' and WL_KEY = '" +
  //       userTokens.VANCONFIG.VANCNF_WL +
  //       "'"
  //     : "and WL_KEY = '" + userTokens.VANCONFIG.VANCNF_WL + "'",
  //   'BPAPUS-ORDERBY': '',
  //   'BPAPUS-OFFSET': '0',
  //   'BPAPUS-FETCH': '0',
  // };

   let dataObj1 = {
        'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': V3GUID,
        'BPAPUS-FUNCTION': BPAPUS_FUNCTION_DP_CODE,
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER': "and VANCNF_KEY = '" + userTokens.VANCONFIG.VANCNF_KEY + "'",
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      };


console.log('dataObj1 >>' , dataObj1);
  await lookupErpV3Api(dataObj1)
    .then((v) => {
      const {ResponseData, ResponseCode, ReasonString} = v.data;
      if (ResponseCode == 200) {
        const response = parseResDataToJson(v.data);
        if (
          response.Vans0106 &&
          response.RECORD_COUNT &&
          response.RECORD_COUNT > 0
        ) {
          dispatch({
            type: types.DROP_POINT_SEARCH_LIST_ITEMS_SUCCESS,
            payload: response.Vans0106,
          });
        } else {
          dispatch({
            type: types.DROP_POINT_SEARCH_LIST_ITEMS_SUCCESS,
            payload: [],
          });
        }
      } else {
        dispatch({type: types.DROP_POINT_SEARCH_LIST_ITEMS_FAIL});
      }
      resolve(v.data);
    })
    .catch((error) => {
      dispatch({type: types.DROP_POINT_SEARCH_LIST_ITEMS_FAIL});
    });
};



// export const searchDropPointList = (textInput) => async (
//   dispatch,
//   getState,
// ) => {
//   dispatch({type: types.DROP_POINT_SEARCH_LIST_ITEMS});
//   console.log('text', textInput);
//   const V3GUID = await getLoginGuID();
//   const userTokens = await getUserToken();
//   console.log('userTokens', JSON.stringify(userTokens));
//   let dataObj1 = {
//     'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
//     'BPAPUS-LOGIN-GUID': V3GUID,
//     'BPAPUS-FUNCTION': BPAPUS_FUNCTION_WH_CODE,
//     'BPAPUS-PARAM': '',
//     'BPAPUS-FILTER': textInput
//       ? "and WL_NAME like '%" +
//         textInput +
//         "%' and WL_KEY = '" +
//         userTokens.VANCONFIG.VANCNF_WL +
//         "'"
//       : "and WL_KEY = '" + userTokens.VANCONFIG.VANCNF_WL + "'",
//     'BPAPUS-ORDERBY': '',
//     'BPAPUS-OFFSET': '0',
//     'BPAPUS-FETCH': '0',
//   };
// console.log('dataObj1 >>' , dataObj1);
//   await lookupErpV3Api(dataObj1)
//     .then((v) => {
//       const {ResponseData, ResponseCode, ReasonString} = v.data;
//       if (ResponseCode == 200) {
//         const response = parseResDataToJson(v.data);
//         if (
//           response.Wh000220 &&
//           response.RECORD_COUNT &&
//           response.RECORD_COUNT > 0
//         ) {
//           dispatch({
//             type: types.DROP_POINT_SEARCH_LIST_ITEMS_SUCCESS,
//             payload: response.Wh000220,
//           });
//         } else {
//           dispatch({
//             type: types.DROP_POINT_SEARCH_LIST_ITEMS_SUCCESS,
//             payload: [],
//           });
//         }
//       } else {
//         dispatch({type: types.DROP_POINT_SEARCH_LIST_ITEMS_FAIL});
//       }
//       resolve(v.data);
//     })
//     .catch((error) => {
//       dispatch({type: types.DROP_POINT_SEARCH_LIST_ITEMS_FAIL});
//     });
// };
