import { Alert } from 'react-native';
import moment from 'moment';
import qs from 'qs';
import * as appConfig from '../../appConfig';
import {
  closeCustomerAccountApi,
  customerSearchArLineListV3Api,
  customerSearchListApi,
  customerSearchListV3Api,
  customerSkipApi,
  executiveV3Api,
  getARL_KEY99,
  getARLV3Api,
  getArPricetabApi,
  getCustArprbKEYApi,
  NewArFileV3Api,
  readErpV3Api,
  searchCustomerNearByApi,
  updateErpV3Api,
} from '../api/customer';
import * as types from '../constant/customer';
import { getLoginGuID, getUserToken } from '../utils/Token';

const hasKongInName = item =>
  String(item?.AR_NAME || '')
    .toLowerCase()
    .includes('kong');

export const setInitialState = () => dispatch => {
  dispatch({ type: types.CUSTOMER_SET_INITIAL_STATE });
};

export const clearCustomerList = () => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.CUSTOMER_CLEAR_LIST });
    resolve();
  });
};

export const setCriteria = criteria => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.CUSTOMER_SET_CRITERIA, payload: criteria });
    resolve();
  });
};

export const setKeyword = criteria => dispatch => {
  dispatch({ type: types.CUSTOMER_SET_KEYWORD, payload: criteria });
};

export const findCustomerById = id => dispatch => {
  return new Promise(async (resolve, reject) => {
    const LoginGUID = await getLoginGuID();
    const userToken = await getUserToken();
    const VANCONFIG = userToken?.VANCONFIG ?? {};
    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': 'SHOWARSUMMARY', //SHOWARSUMMARY 39 แสดงสรุปยอดลูกหนี้
      'BPAPUS-PARAM': '{"AR_KEY": "' + id + '"}',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    executiveV3Api(bodyRequest)
      .then(async v => {
        const { ReasonString, ResponseCode, ResponseData } = v;
        let responseData = JSON.parse(ResponseData);
        if (ResponseCode == 200) {
          const arSummaryData = responseData?.SHOWARSUMMARY?.[0] || null;
          console.log('AR_SUMMARY all fields:', JSON.stringify(arSummaryData));
          console.log('AR_SUMMARY keys:', Object.keys(arSummaryData || {}));
          dispatch({
            type: types.CUSTOMER_SET_ARSUMMARY,
            payload: arSummaryData,
          });
          const date = moment().format('YYYYMMDD');
          const bodyRequest2 = {
            'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
            'BPAPUS-LOGIN-GUID': LoginGUID,
            'BPAPUS-FUNCTION': 'READARCDBYARKEY',
            'BPAPUS-PARAM':
              '{\r\n    "AR_KEY": "' +
              id +
              '",\r\n    "ARCD_DATE": "' +
              date +
              '",\r\n    "ARCD_DEFAULT": "Y"\r\n}',
            'BPAPUS-FILTER': '',
            'BPAPUS-ORDERBY': '',
            'BPAPUS-OFFSET': '0',
            'BPAPUS-FETCH': '0',
          };
          await readErpV3Api(bodyRequest2).then(async y => {
            let responseData2 = JSON.parse(y.ResponseData);
            if (
              y.ResponseCode == 200 &&
              parseInt(responseData2.RECORD_COUNT) > 0
            ) {
              const ARCD_KEY = responseData2.READARCDBYARKEY[0].ARCD_KEY;
              const bodyRequest3 = {
                'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
                'BPAPUS-LOGIN-GUID': LoginGUID,
                'BPAPUS-FUNCTION': 'SetAsArcdKey',
                'BPAPUS-PARAM':
                  '{\r\n    "ARCD_KEY": "' +
                  ARCD_KEY +
                  '",\r\n    "ARCD_DATE": "' +
                  date +
                  '"\r\n}',
                'BPAPUS-FILTER': '',
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '0',
              };
              await updateErpV3Api(bodyRequest3).then(z => {
                let responseData3 = JSON.parse(z.ResponseData);
                if (
                  z.ResponseCode == 200 &&
                  parseInt(responseData3.RECORD_COUNT) > 0
                ) {
                  dispatch({
                    type: types.CUSTOMER_SET_ARPRB,
                    payload: responseData3,
                  });
                  dispatch({
                    type: types.CUSTOMER_SET_ITEM_CREDIT_LIM,
                    payload: VANCONFIG.VANCNF_NOV_CRE_LIM,
                  });
                }
              });
            }
          });
          resolve(v);
        } else {
          reject(ResponseCode + ReasonString);
        }
      })
      .catch(error => {
        reject(error.message);
      });
  });
};

export const searchCustomerList = nextPage => async (dispatch, getState) => {
  console.log('aaaaa');
  dispatch({ type: types.CUSTOMER_SEARCH_LIST });
  let customer = await getState().customer;
  const customerType = await getState().customerType;
  const userToken = await getUserToken();
  const VANCONFIG = userToken?.VANCONFIG ?? {};
  const arLimit = Number(VANCONFIG?.VANCNF_AR_LIMIT);

  const criteria = {
    ARCAT_KEY: customerType.item,
    KEYWORD: customer.criteria.KEYWORD,
    OFFSET: nextPage
      ? (customer.criteria.OFFSET - 1) * customer.criteria.LIMIT
      : (1 - 1) * customer.criteria.LIMIT,
    LIMIT: customer.criteria.LIMIT,
  };
  console.log('aaaa');
  await customerSearchArLineListV3Api(criteria)
    .then(async v => {
      const { ReasonString, ResponseCode, ResponseData } = v;
      let responseData = JSON.parse(ResponseData);

      console.log('responseDatabb', responseData);

      if (ResponseCode == 200) {
        console.log('arLimit', arLimit);
        let RECORD_COUNT, OFFSET, FETCH, additionalData;

        if (arLimit === 2) {
          ({
            RECORD_COUNT,
            OFFSET,
            FETCH,
            Vans0107: additionalData,
          } = responseData);
        } else {
          ({
            RECORD_COUNT,
            OFFSET,
            FETCH,
            Vans0104: additionalData,
          } = responseData);
        }

        console.log('searchCustomerList raw route data', {
          arLimit,
          recordCount: RECORD_COUNT,
          offset: OFFSET,
          fetch: FETCH,
          additionalData: Array.isArray(additionalData)
            ? additionalData.filter(hasKongInName)
            : [],
        });

        if (responseData && additionalData && parseInt(RECORD_COUNT) > 0) {
          let Response = [];
          let found = false;
          for (let i in additionalData) {
            await customerSearchListV3Api(
              additionalData[i].AR_CODE,
              criteria.ARCAT_KEY,
            )
              .then(async v => {
                found = false;
                const { ReasonString, ResponseCode, ResponseData } = v;
                let responseData = JSON.parse(ResponseData);
                // console.log("customerSearchListV3Api ", responseData);
                if (ResponseCode == 200) {
                  const { RECORD_COUNT, OFFSET, FETCH, Ar000131 } =
                    responseData;
                  // console.log(parseInt(RECORD_COUNT));

                  if (responseData && Ar000131 && parseInt(RECORD_COUNT) > 0) {
                    let temp = Ar000131[0];
                    const ARPRB_KEY = await getCustArprbKEYApi(
                      parseFloat(Ar000131[0].AR_KEY),
                      VANCONFIG,
                    );
                    temp.AR_KEY = parseFloat(Ar000131[0].AR_KEY);
                    temp.AR_ARCAT = Ar000131[0].AR_ARCAT;
                    temp.ADDB_KEY = parseFloat(Ar000131[0].ADDB_KEY);

                    if (
                      Ar000131[0].ADDB_GPS_LAT_S &&
                      !isNaN(Ar000131[0].ADDB_GPS_LAT_S)
                    ) {
                      temp.ADDB_GPS_LAT_S = parseFloat(
                        Ar000131[0].ADDB_GPS_LAT_S,
                      );
                    } else {
                      temp.ADDB_GPS_LAT_S = null;
                    }
                    if (
                      Ar000131[0].ADDB_GPS_LONG_S &&
                      !isNaN(Ar000131[0].ADDB_GPS_LONG_S)
                    ) {
                      temp.ADDB_GPS_LONG_S = parseFloat(
                        Ar000131[0].ADDB_GPS_LONG_S,
                      );
                    } else {
                      temp.ADDB_GPS_LONG_S = null;
                    }

                    // temp.ADDB_GPS_LAT_S = parseFloat(
                    //   Ar000131[0].ADDB_GPS_LAT_S,
                    // );
                    // temp.ADDB_GPS_LONG_S = parseFloat(
                    //   Ar000131[0].ADDB_GPS_LONG_S,
                    // );
                    temp.ARPRB_KEY = ARPRB_KEY;

                    for (let j in Response) {
                      if (Response[j].AR_KEY == temp.AR_KEY) {
                        found = true;
                      }
                    }

                    if (!found) {
                      Response.push({ ...additionalData[i], ...temp });
                    }
                  }
                } else {
                  dispatch({
                    type: types.CUSTOMER_SEARCH_LIST_FAIL,
                    payload: ReasonString,
                  });
                }
              })
              .catch(error => {
                dispatch({
                  type: types.CUSTOMER_SEARCH_LIST_FAIL,
                  payload: error.message,
                });
              });
          }
          if (Response && Response.length > 0) {
            console.log(
              'searchCustomerList merged customer data',
              Response.filter(hasKongInName),
            );
            // console.log('Response 2222if  ', JSON.stringify(Response));
            dispatch(
              setCriteria({
                ...customer.criteria,
                OFFSET: nextPage ? customer.criteria.OFFSET + 1 : 2,
              }),
            );
            dispatch({
              type: types.CUSTOMER_SEARCH_LIST_SUCCESS,
              payload: Response,
            });
          } else {
            // console.log('Response 2222else  ', JSON.stringify(Response));
            dispatch({
              type: types.CUSTOMER_SEARCH_LIST_SUCCESS,
              payload: [],
            });
          }
        } else {
          dispatch({
            type: types.CUSTOMER_SEARCH_LIST_SUCCESS,
            payload: [],
          });
        }
      }
    })
    .catch(error => {
      dispatch({
        type: types.CUSTOMER_SEARCH_LIST_FAIL,
        payload: error.message,
      });
    });
  // customerSearchListApi(criteria)
  //   .then((v) => {
  //     const {RESULT_DATA, STATUS, ERROR_MESSAGES} = v;
  //     if (STATUS === '00') {
  //       const {RESULT} = RESULT_DATA;

  //       if (RESULT_DATA && RESULT && RESULT.length > 0) {
  //         dispatch(
  //           setCriteria({
  //             ...customer.criteria,
  //             OFFSET: nextPage ? customer.criteria.OFFSET + 1 : 2,
  //           }),
  //         );

  //         dispatch({type: types.CUSTOMER_SEARCH_LIST_SUCCESS, payload: RESULT});
  //       } else {
  //         dispatch({type: types.CUSTOMER_SEARCH_LIST_SUCCESS, payload: []});
  //       }
  //     } else if (STATUS === '10') {
  //       dispatch({
  //         type: types.CUSTOMER_SEARCH_LIST_FAIL,
  //         payload: ERROR_MESSAGES,
  //       });
  //     }
  //   })
  //   .catch((error) => {
  //     dispatch({type: types.CUSTOMER_SEARCH_LIST_FAIL, payload: error.message});
  //   });
};

export const searchCustomerNextDestination = () => (dispatch, getState) => {
  dispatch({ type: types.CUSTOMER_SEARCH_LIST });

  // const criteria = qs.stringify({});
  //const criteria = qs.stringify({});

  // console.log("customerSearchListApi(criteria)");

  // await customerSearchListV3Api(
  //   Vans0104[i].AR_CODE,
  //   criteria.ARCAT_KEY,
  // )

  //customerSearchListV3Api("","")
  //const result =
  dispatch(getCustomerNextDestination(''))
    .then(v => {
      //console.log("customerSearchListApi(criteria) v", JSON.stringify(v) + "customerSearchListApi(criteria) v");
      let responseData = v;
      console.log(
        'searchCustomerNextDestination responseData',
        Array.isArray(responseData) ? responseData.filter(hasKongInName) : [],
      );
      //if (ResponseCode == 200)
      {
        console.log('responseData.length ', responseData[0]);
        if (responseData.length > 0) {
          {
            dispatch({
              type: types.CUSTOMER_SEARCH_LIST_SUCCESS,
              payload: responseData,
            });
          }
        } else {
          dispatch({ type: types.CUSTOMER_SEARCH_LIST_SUCCESS, payload: [] });
        }
      }
      //else if (ResponseCode === '10') {
      // dispatch({
      //   type: types.CUSTOMER_SEARCH_LIST_FAIL,
      //   payload: ERROR_MESSAGES,
      // });
      //}
    })
    .catch(error => {
      dispatch({
        type: types.CUSTOMER_SEARCH_LIST_FAIL,
        payload: error.message,
      });
    });
};

//ดึงข้อมูลลูกค้า ตาม VAN_CNF VANCNF_AR_LIMIT โดย ค่า1 คือตามสายลูกค้า, ค่า 2 คือตามสายเดินรถ
export const getCustomerNextDestination = AR_CODE => dispatch => {
  console.log('getCustomerNextDestination');
  return new Promise(async (resolve, reject) => {
    const criteria = qs.stringify({
      ARCAT_KEY: null,
      KEYWORD: null,
      OFFSET: 0,
      LIMIT: 1,
      AR_NEXT: true,
    });

    const LoginGUID = await getLoginGuID();
    const userToken = await getUserToken();
    const VANCONFIG = userToken?.VANCONFIG ?? {};
    // console.log('settingConfig.vanCNFMachine ', VANCONFIG.VANCNF_MACHINE);

    var wsFunction = '';
    var wsorderby = '';

    const arLimit = Number(VANCONFIG?.VANCNF_AR_LIMIT);

    if (arLimit === 2) {
      wsFunction = 'Vans0107';
      wsorderby = ' ORDER BY VANRT_KEY ASC ';
    } else {
      wsFunction = 'Vans0104';
      wsorderby = ' -- ORDER BY AR_KEY ASC ';
    }

    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': wsFunction,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER':
        ' AND VANCNF_MACHINE=' + "'" + VANCONFIG.VANCNF_MACHINE + "'",
      'BPAPUS-ORDERBY': wsorderby,
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    //customerSearchListApi(criteria)

    await getARLV3Api(bodyRequest)
      .then(v => {
        // const {RESULT_DATA, STATUS, ERROR_MESSAGES} = v;
        const { ReasonString, ResponseCode, ResponseData } = v;

        //console.log('getARLV3Api v ', v);

        let responseData = JSON.parse(ResponseData);

        let RECORD_COUNT, OFFSET, FETCH, additionalData;

        if (arLimit === 2) {
          ({
            RECORD_COUNT,
            OFFSET,
            FETCH,
            Vans0107: additionalData,
          } = responseData);
        } else {
          ({
            RECORD_COUNT,
            OFFSET,
            FETCH,
            Vans0104: additionalData,
          } = responseData);
        }

        console.log('getCustomerNextDestination route data', {
          arLimit,
          machine: VANCONFIG.VANCNF_MACHINE,
          recordCount: RECORD_COUNT,
          offset: OFFSET,
          fetch: FETCH,
          additionalData: Array.isArray(additionalData)
            ? additionalData.filter(hasKongInName)
            : [],
        });

        //const { RECORD_COUNT, OFFSET, FETCH, Vans0107 } = responseData;

        //if (STATUS === '00') {
        if (ResponseCode == 200 && RECORD_COUNT > 0) {
          const { RESULT } = additionalData;

          if (additionalData && additionalData.length > 0) {
            if (AR_CODE === undefined || AR_CODE === '') {
              resolve(additionalData);
            } else {
              const currentIndex = additionalData.findIndex(
                item => item.AR_CODE == AR_CODE,
              );
              const nextPosition =
                currentIndex == additionalData.length - 1
                  ? additionalData[0]
                  : additionalData[currentIndex + 1];
              resolve([nextPosition]);
            }
          } else {
            reject('ไม่พบข้อมูลลูกค้า');
          }
        } else {
          reject('');
        }
      })
      .catch(error => {
        reject(error.message);
      });
  });
};

export const _getCustomerNextDestination = () => dispatch => {
  return new Promise((resolve, reject) => {
    const criteria = qs.stringify({
      ARCAT_KEY: null,
      KEYWORD: null,
      OFFSET: 0,
      LIMIT: 1,
      AR_NEXT: true,
    });

    customerSearchListApi(criteria)
      .then(v => {
        const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v;

        if (STATUS === '00') {
          const { RESULT } = RESULT_DATA;

          if (RESULT_DATA && RESULT && RESULT.length > 0) {
            resolve(RESULT);
          } else {
            reject('ไม่พบข้อมูลลูกค้า');
          }
        } else {
          reject(ERROR_MESSAGES);
        }
      })
      .catch(error => {
        reject(error.message);
      });
  });
};

export const setCustomerInfo = data => dispatch => {
  dispatch({ type: types.CUSTOMER_SET_ITEM_INFO, payload: data });
};

export const setCustomerCreditLimit = data => dispatch => {
  dispatch({ type: types.CUSTOMER_SET_ITEM_CREDIT_LIM, payload: data });
};

export const setCustomerCusAddb = data => dispatch => {
  dispatch({ type: types.CUSTOMER_SET_ITEM_CUS_ADDB, payload: data });
};

export const setCustomerLstVisitDoc = data => dispatch => {
  dispatch({ type: types.CUSTOMER_SET_ITEM_LST_VISIT_DOC, payload: data });
};

export const setCustomerLstBillDoc = data => dispatch => {
  dispatch({ type: types.CUSTOMER_SET_ITEM_LST_BILL_DOC, payload: data });
};

export const setCustomerCusPayInf = data => dispatch => {
  dispatch({ type: types.CUSTOMER_SET_ITEM_CUS_PAY_INF, payload: data });
};

export const clearCustomerTempCus = () => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.CUSTOMER_CLEAR_ITEM_TEMP_CUS, payload: data });
    resolve();
  });
};

export const setCustomerTempCus = data => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.CUSTOMER_SET_ITEM_TEMP_CUS, payload: data });
    resolve();
  });
};

export const setError = bool => dispatch => {
  dispatch({ type: types.CUSTOMER_SET_ERROR, payload: bool });
};

export const createTempCus = data => dispatch => {
  return new Promise(async (resolve, reject) => {
    const LoginGUID = await getLoginGuID();

    // เข้ากลุ่ม 99 14.หาสายลูกค้า (Ar000312)
    let ARL_KEY = '';
    const bodyRequest99 = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': 'Ar000312',
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "and ARL_CODE = '99'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    console.log('bodyRequest99', bodyRequest99);
    getARL_KEY99(bodyRequest99).then(v => {
      console.log('vvv', v);
      const { ReasonString, ResponseCode, ResponseData } = v;
      let responseData = JSON.parse(ResponseData);
      const { RECORD_COUNT, OFFSET, FETCH, Ar000312 } = responseData;

      let _CONTACT = data.CONTACTNAME.split(/\s+/);
      let _CTname = _CONTACT[0];
      let _CTsurname = _CONTACT[1]
        ? (_CONTACT[1] != '' ? _CONTACT[1] : '').replace('undefined', '')
        : _CTname;

      if (ResponseCode == '200' && parseInt(RECORD_COUNT) > 0) {
        ARL_KEY = Ar000312[0].ARL_KEY;

        // Prepare phone and fax numbers
        const phone = (data.TEL || '').replace('undefined', '');
        const fax = (data.FAX || '').replace('undefined', '');
        const district = data.ADDRESS3.replace('เขต ', '');

        // Build parameter object
        const paramObject = {
          AR_CODE: '/V',
          AR_NAME: data.NAME,
          ADDB_COMPANY: data.NAME,
          ADDB_PHONE: phone,
          ADDB_EMAIL: '',
          CT_INTL: 'คุณ',
          CT_NAME: _CTname,
          CT_SURNME: _CTsurname,
          AR_ENABLE: 'Y',
          AR_ARL: ARL_KEY,
          DFAR_TYPE: '1',
          ADDB_ADDB_1: data.ADDRESS1,
          ADDB_SUB_DISTRICT: data.ADDRESS2,
          ADDB_DISTRICT: district,
          ADDB_PROVINCE: data.PROVINCE,
          ADDB_POST: data.POSTCODE,
          ADDB_FAX: fax,
          ADDB_TAX_ID: data.TAXID,
          ARS_CRE_LIM: '0',
          ARCD_NAME: data.ARC_NAME,
          AR_SLMNCODE: data.SALESMANCODE || '',
          AR_AC: data.AR_AC || '',
        };

        const bodyRequest = {
          'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
          'BPAPUS-LOGIN-GUID': LoginGUID,
          'BPAPUS-FUNCTION': 'NEWARFILE',
          'BPAPUS-PARAM': JSON.stringify(paramObject),
          'BPAPUS-FILTER': '',
          'BPAPUS-ORDERBY': '',
          'BPAPUS-OFFSET': '0',
          'BPAPUS-FETCH': '0',
        };
        console.log('bodyRequestaa', bodyRequest);

        NewArFileV3Api(bodyRequest)
          .then(v => {
            const { ReasonString, ResponseCode, ResponseData } = v;
            console.log('createTempCus v ', v);
            let responseData = JSON.parse(ResponseData);
            const { RECORD_COUNT, OFFSET, FETCH } = responseData;

            if (ResponseCode == 200 && RECORD_COUNT > 0) {
              resolve(ReasonString);
            } else {
              reject(ReasonString);
            }
            // const {STATUS, ERROR_MESSAGES} = v;
            // if (STATUS === '00') {
            //   resolve(STATUS);
            // } else if (STATUS === '10') {
            //   reject(ERROR_MESSAGES);
            // }
          })
          .catch(err => {
            reject(err.message);
          });
      } else {
        reject('ไม่พบสายรหัสลูกค้า');
      }
    });

    // เข้ากลุ่ม 99
  });
};

export const searchCustomerNearBy = criteria => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.CUSTOMER_SEARCH_NEAR_BY });

    searchCustomerNearByApi(criteria)
      .then(v => {
        const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v;
        if (STATUS === '00') {
          const { RESULT } = RESULT_DATA;
          dispatch({
            type: types.CUSTOMER_SEARCH_NEAR_BY_SUCCESS,
            payload: RESULT,
          });
        } else if (STATUS === '10') {
          dispatch({
            type: types.CUSTOMER_SEARCH_NEAR_BY_FAIL,
            payload: ERROR_MESSAGES,
          });
          reject(ERROR_MESSAGES);
        }
        resolve(v);
      })
      .catch(error => {
        dispatch({
          type: types.CUSTOMER_SEARCH_NEAR_BY_FAIL,
          payload: error.message,
        });
        reject(error.message);
      });
  });
};

export const closeCustomerAccount = reason => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    let customer = getState().customer;

    const request = {
      AR_KEY: customer.item.INFO.AR_KEY,
      REMARK: reason,
    };

    closeCustomerAccountApi(request)
      .then(v => {
        const { STATUS, ERROR_MESSAGES } = v;
        if (STATUS === '10') reject(ERROR_MESSAGES);
        resolve(STATUS);
      })
      .catch(error => {
        reject(error.message);
      });
  });
};

export const _getARCustomerLine = () => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.CUSTOMER_GET_AR_LINE });

    const criteria = qs.stringify({
      OFFSET: 0,
      LIMIT: 13,
    });

    customerSearchListApi(criteria)
      .then(v => {
        const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v;

        if (STATUS === '00') {
          const { RESULT } = RESULT_DATA;
          dispatch({
            type: types.CUSTOMER_GET_AR_LINE_SUCCESS,
            payload: RESULT,
          });
        } else if (STATUS === '10') {
          dispatch({
            type: types.CUSTOMER_GET_AR_LINE_FAIL,
            payload: ERROR_MESSAGES,
          });
        }
        resolve(v);
      })
      .catch(error => {
        dispatch({
          type: types.CUSTOMER_GET_AR_LINE_FAIL,
          payload: error.message,
        });
      });
  });
};

//ดึงข้อมูลลูกค้า ตาม VAN_CNF VANCNF_AR_LIMIT โดย ค่า1 คือตามสายลูกค้า, ค่า 2 คือตามสายเดินรถ
export const getARCustomerLine = () => dispatch => {
  return new Promise(async (resolve, reject) => {
    console.log('getARLV3Api v ');
    dispatch({ type: types.CUSTOMER_GET_AR_LINE });
    const criteria = qs.stringify({
      OFFSET: 0,
      LIMIT: 13,
    });
    console.log('getARLV3Api dispatch ', dispatch);
    const LoginGUID = await getLoginGuID();
    const userToken = await getUserToken();
    const VANCONFIG = userToken?.VANCONFIG ?? {};
    // console.log('settingConfig.vanCNFMachine ', VANCONFIG.VANCNF_MACHINE);

    console.log('LoginGUID v ', LoginGUID);
    console.log(
      'LoginGUID VANCONFIG,VANCNF_AR_LIMIT ',
      VANCONFIG?.VANCNF_AR_LIMIT,
    );

    var wsFunction = '';
    var wsorderby = '';

    const arLimit = Number(VANCONFIG?.VANCNF_AR_LIMIT);

    if (arLimit === 2) {
      wsFunction = 'Vans0107';
      wsorderby = ' ORDER BY VANRT_KEY ASC ';
    } else {
      wsFunction = 'Vans0104';
      wsorderby = ' -- ORDER BY AR_KEY ASC ';
    }

    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': wsFunction,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER':
        ' AND VANCNF_MACHINE=' + "'" + VANCONFIG.VANCNF_MACHINE + "'",
      'BPAPUS-ORDERBY': wsorderby,
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    console.log('getARLV3Api bodyRequest ', bodyRequest);
    await getARLV3Api(bodyRequest)
      .then(v => {
        const { ReasonString, ResponseCode, ResponseData } = v;

        console.log('getARLV3Api v ', v);

        let responseData = JSON.parse(ResponseData);
        let RECORD_COUNT, OFFSET, FETCH, additionalData;

        if (arLimit === 2) {
          ({
            RECORD_COUNT,
            OFFSET,
            FETCH,
            Vans0107: additionalData,
          } = responseData);
        } else {
          ({
            RECORD_COUNT,
            OFFSET,
            FETCH,
            Vans0104: additionalData,
          } = responseData);
        }

        if (ResponseCode == 200 && RECORD_COUNT > 0) {
          dispatch({
            type: types.CUSTOMER_GET_AR_LINE_SUCCESS,
            payload: additionalData,
          });
        } else {
          dispatch({
            type: types.CUSTOMER_GET_AR_LINE_FAIL,
            payload: ReasonString,
          });
        }
        resolve(responseData);
      })
      .catch(error => {
        reject(error.message);
      });
  });
};

export const customerSkip = id => dispatch => {
  return new Promise((resolve, reject) => {
    customerSkipApi(id)
      .then(v => {
        const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v;

        if (STATUS === '00') {
          resolve();
        } else {
          reject(ERROR_MESSAGES);
        }
      })
      .catch(error => {
        reject(error.message);
      });
  });
};

export const getArPricetab = () => dispatch => {
  return new Promise(async (resolve, reject) => {
    const LoginGUID = await getLoginGuID();
    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': 'Sp000211',
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    await getArPricetabApi(bodyRequest)
      .then(v => {
        const { ReasonString, ResponseCode, ResponseData } = v;
        //console.log('getArPricetab v ', v);
        let responseData = JSON.parse(ResponseData);
        const { RECORD_COUNT, OFFSET, FETCH, Sp000211 } = responseData;

        if (ResponseCode == 200 && RECORD_COUNT > 0) {
          dispatch({
            type: types.CUSTOMER_GET_AR_PRICE_TAB_SUCCESS,
            payload: Sp000211,
          });
        } else {
          dispatch({
            type: types.CUSTOMER_GET_AR_PRICE_TAB_FAIL,
            payload: ReasonString,
          });
        }
        resolve(responseData);
      })
      .catch(error => {
        reject(error.message);
      });
  });
};
