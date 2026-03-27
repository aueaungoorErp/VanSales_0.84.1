import {
  getSalesTargetApi,
  getReportDataApi,
  getReportDataNoGroupApi,
} from '../api/report';
import * as types from '../constant/report';
import { BPAPUS_BPAPSV, API_ENDPOINT_V3 } from '../../appConfig';
import { lookupErpV3Api, showPriceErpV3Api } from '../api/bPlusApi';
import {
  UpdateErpGetSellOrderDocInfoAPi,
  LookupErpCashSaleAPi,
  UpdateErpGetInvoiceOrderDocInfoAPi,
  UpdateErpGetReceiveOrderDocInfoAPi,
  UpdateErpGetOtherDocInfoAPi,
  GetReportNameApi,
  GetPrintReportApi,
  GetPrintStatusApi,
} from '../api/report';
import moment from 'moment';
import { getLoginGuID, getUserToken, getSettingConfig } from '../utils/Token';
import { decimal2digitWithCommas } from '../utils/FormatUtil';
import { BPAPUS_DT_PROPERTIES } from '../constant/bPlusApi';
import RNFetchBlob from 'react-native-blob-util';
export const setInitialState = () => (dispatch) => {
  dispatch({ type: types.REPORT_SET_INITIAL_STATE });
};

export const setErrorMessage = (message) => (dispatch) => {
  dispatch({ type: types.REPORT_SET_ERROR_MESSAGE, payload: message });
};

export const setReportSaleInitialState = () => (dispatch) => {
  dispatch({ type: types.REPORT_SALE_SET_INITIAL_STATE });
};

export const setDate = (data) => (dispatch) => {
  dispatch({ type: types.REPORT_SET_DATE, payload: data });
};
export const setSettingERP = (data) => (dispatch) => {
  dispatch({ type: types.SET_SETTING_ERP, payload: data });
};

export const getSalesTarget = (data) => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    const { VANCONFIG } = await getUserToken();
    //console.log('VANCONFIG', JSON.stringify(VANCONFIG));
    console.log('หห  data', JSON.stringify(data));
    getSalesTargetApi({
      FROM: moment(data.FROM.replace(/T/, ' ').replace(/\..+/, '')).format('YYYYMMDDhhmm'),
      TO: moment(data.TO.replace(/T/, ' ').replace(/\..+/, '')).format('YYYYMMDDhhmm'),
    })
      .then((v) => {
        console.log('VVV getDaleee', JSON.stringify(v));
        const { RECORD_COUNT, SHOWINCOMEBYVAN } = v;
        const x = SHOWINCOMEBYVAN?.find((obj) => {
          return obj.VANCNF_MACHINE == VANCONFIG?.VANCNF_MACHINE;
        });

        if (parseInt(RECORD_COUNT) > 0) {
          getSalesTargetApi({
            FROM: moment().format('YYYYMMDDhhmm'),
            TO: moment().format('YYYYMMDDhhmm'),
          }).then((res) => {
            const y = res.SHOWINCOMEBYVAN?.find((obj) => {
              return obj.VANCNF_MACHINE == VANCONFIG?.VANCNF_MACHINE;
            });

            if (
              parseFloat(x?.SHOWAMOUNT) == 0 &&
              VANCONFIG &&
              VANCONFIG.VANCNF_FORCAST
            ) {
              const result = {
                TODAY_SALE: '0.00',
                TODAY_SALE_PERCENT: '0.00',
                MONTH_TARGET_PERCENT: '100.00',
                MONTH_TARGET: decimal2digitWithCommas(
                  VANCONFIG?.VANCNF_FORCAST,
                ),
                CUMULATIVE: '0.00',
                CUMULATIVE_PERCENT: '0.00',
                MAX_MIN_TARGET: decimal2digitWithCommas(
                  0.0 - parseFloat(VANCONFIG?.VANCNF_FORCAST),
                ),
                MAX_MIN_TARGET_PERCENT: '-100.00',
              };
              console.log('result ', result);

              dispatch({
                type: types.REPORT_SALE_GET_ITEM_SUCCESS,
                payload: result,
              });
              resolve(result);
            } else {
              if (VANCONFIG && VANCONFIG.VANCNF_FORCAST) {
                const cumulativePercent =
                  (parseFloat(x?.SHOWAMOUNT) * 100) /
                  parseFloat(VANCONFIG.VANCNF_FORCAST);
                const maxMinTerget =
                  (x?.SHOWAMOUNT || 0) - parseFloat(VANCONFIG.VANCNF_FORCAST);
                const maxMinTergetPercent = cumulativePercent - 100.0;
                const todayPercent =
                  (parseFloat(y?.SHOWAMOUNT) * 100) /
                  parseFloat(VANCONFIG.VANCNF_FORCAST);

                console.log('cumulativePercent ', cumulativePercent);
                console.log('maxMinTerget ', maxMinTerget);
                console.log('maxMinTergetPercent ', maxMinTergetPercent);
                console.log('todayPercent ', todayPercent);

                dispatch({
                  type: types.REPORT_SALE_GET_ITEM_SUCCESS,
                  payload: {
                    TODAY_SALE:
                      y?.SHOWAMOUNT == 0
                        ? '0.00'
                        : decimal2digitWithCommas(y?.SHOWAMOUNT),
                    TODAY_SALE_PERCENT:
                      todayPercent == 0
                        ? '0.00'
                        : decimal2digitWithCommas(todayPercent),
                    MONTH_TARGET_PERCENT: '100.00',
                    MONTH_TARGET: decimal2digitWithCommas(
                      VANCONFIG?.VANCNF_FORCAST,
                    ),
                    CUMULATIVE: decimal2digitWithCommas(
                      parseFloat(x?.SHOWAMOUNT),
                    ),
                    CUMULATIVE_PERCENT: decimal2digitWithCommas(
                      parseFloat(cumulativePercent),
                    ),
                    MAX_MIN_TARGET: decimal2digitWithCommas(
                      parseFloat(maxMinTerget),
                    ),
                    MAX_MIN_TARGET_PERCENT: decimal2digitWithCommas(
                      parseFloat(maxMinTergetPercent),
                    ),
                  },
                });

                resolve({
                  TODAY_SALE: decimal2digitWithCommas(y?.SHOWAMOUNT),
                  TODAY_SALE_PERCENT: decimal2digitWithCommas(todayPercent),
                  MONTH_TARGET_PERCENT: '100.00',
                  MONTH_TARGET: decimal2digitWithCommas(
                    parseFloat(VANCONFIG.VANCNF_FORCAS),
                  ),
                  CUMULATIVE: parseFloat(x?.SHOWAMOUNT),
                  CUMULATIVE_PERCENT: parseFloat(cumulativePercent),
                  MAX_MIN_TARGET: parseFloat(maxMinTerget),
                  MAX_MIN_TARGET_PERCENT: parseFloat(maxMinTergetPercent),
                });
              } else {
                // กรณี VANCONFIG หรือ VANCNF_FORCAST เป็น undefined
                const defaultResult = {
                  TODAY_SALE: decimal2digitWithCommas(y?.SHOWAMOUNT || 0),
                  TODAY_SALE_PERCENT: '0.00',
                  MONTH_TARGET_PERCENT: '0.00',
                  MONTH_TARGET: '0.00',
                  CUMULATIVE: decimal2digitWithCommas(x?.SHOWAMOUNT || 0),
                  CUMULATIVE_PERCENT: '0.00',
                  MAX_MIN_TARGET: '0.00',
                  MAX_MIN_TARGET_PERCENT: '0.00',
                };
                dispatch({
                  type: types.REPORT_SALE_GET_ITEM_SUCCESS,
                  payload: defaultResult,
                });
                resolve(defaultResult);
              }
            }
          }).catch((error) => {
            // handle error จาก getSalesTargetApi ครั้งที่สอง
            reject(error.message || error);
          });
        } else if (parseInt(RECORD_COUNT) == 0) {
          dispatch({
            type: types.REPORT_SALE_GET_ITEM_SUCCESS,
            payload: [],
          });
          resolve([]);
        } else {
          reject('ERROR');
        }
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const getReportData = (uri, pattern, data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.REPORT_GET_DATA });

    getReportDataApi(uri, data)
      .then((v) => {
        const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v;

        if (STATUS === '00') {
          let listItems = [];
          console.log('RESULT_DATA', RESULT_DATA);

          if (pattern === 'A' || pattern === 'A') {
            const { RESULT } = RESULT_DATA.RPT_DATA;
            listItems = RESULT;
          } else if (pattern === 'B') {
            const { ITEMS } = RESULT_DATA;
            listItems = ITEMS;
          } else if (pattern === 'D') {
            const { RESULT } = RESULT_DATA;
            listItems = RESULT;
          }

          if (pattern === 'C' || listItems.length > 0) {
            dispatch({
              type: types.REPORT_GET_DATA_SUCCESS,
              payload: RESULT_DATA,
            });
          } else if (listItems.length == 0) {
            dispatch({
              type: types.REPORT_SET_ERROR_MESSAGE,
              payload: 'ไม่พบข้อมูลรายงาน',
            });
          }
        } else if (STATUS === '10') {
          reject(ERROR_MESSAGES[0]);
        }
        resolve(v);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const getReportDataNoGroup = (uri, pattern, data) => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      // ตรวจสอบว่ามี token หรือไม่ก่อนเรียก API
      const userToken = await getUserToken();
      if (!userToken || !userToken.VANCONFIG) {
        console.log('getReportDataNoGroup: userToken or VANCONFIG is not available');
        dispatch({
          type: types.REPORT_SET_ERROR_MESSAGE,
          payload: 'ไม่พบการส่งรหัสหน่วยรถ',
        });
        resolve([]);
        return;
      }
      
      // ตรวจสอบว่ามี settingConfig (baseUrl) หรือไม่
      const settingConfig = await getSettingConfig();
      if (!settingConfig || !settingConfig.baseUrl) {
        console.log('getReportDataNoGroup: settingConfig or baseUrl is not available');
        // ไม่ต้องเรียก API เพราะยังไม่ได้ตั้งค่า baseUrl
        // แต่ไม่ต้องแสดง error เพราะ getReportV3 อาจจะทำงานได้แล้ว
        resolve([]);
        return;
      }
      
      dispatch({ type: types.REPORT_GET_DATA });

      let api = null;

    if (
      uri === 'DocumentItems' ||
      uri === 'DocumentItemsDetails' ||
      uri === 'PerformanceByArlineItem' ||
      uri === 'PeformanceByProductCategory' ||
      uri === 'SalesOrderBySaleman' ||
      uri === 'StockBalanceByWL' ||
      uri === 'SalesOrderByCategory' ||
      uri === 'SalesOrderByProduct' ||
      uri === 'SalesOrderByArline' ||
      uri === 'SalesOrderByDocType' ||
      uri === 'SalesOrderByPmt'
    ) {
      if (uri === 'PerformanceByArlineItem') uri = 'PerformanceByArlineNew';

      if (uri === 'PeformanceByProductCategory')
        uri = 'PeformanceByProductCategoryNew';
      if (uri == 'DocumentItemsDetails') {
        uri = 'DocumentItemsDetails';
      }

      api = getReportDataApi(uri, data);
    } else {
      api = getReportDataNoGroupApi(uri, data);
    }

    // console.log('getReportDataNoGroup >>>>>>>>>');
    api
      .then((v) => {
        const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v;

        console.log('getReportDataNoGroup >>>>>>>>>', v);
        if (STATUS === '00') {
          let listItems = [];
          console.log('RESULT_DATA v', v);

          if (pattern === 'A' || pattern === 'A') {
            const { RESULT } = RESULT_DATA.RPT_DATA;
            listItems = RESULT;
          } else if (pattern === 'B') {
            // const { ITEMS } = RESULT_DATA
            // listItems = ITEMS
            if (uri === 'PeformanceByProductCategoryNew') {
              listItems = RESULT_DATA;
            } else {
              const { RESULT } = RESULT_DATA.RPT_DATA;
              listItems = RESULT;
            }
          } else if (pattern === 'D') {
            const { RESULT } = RESULT_DATA;
            listItems = RESULT;
          }

          if (
            pattern === 'C' ||
            listItems.length > 0 ||
            (uri === 'PeformanceByProductCategoryNew' &&
              listItems.RPT_DATA.RESULT.length > 0)
          ) {
            dispatch({
              type: types.REPORT_GET_DATA_SUCCESS,
              payload: RESULT_DATA,
            });
          } else if (
            uri === 'PeformanceByProductCategoryNew' &&
            listItems.RPT_DATA.RESULT.length === 0
          ) {
            dispatch({
              type: types.REPORT_SET_ERROR_MESSAGE,
              payload: 'ไม่พบข้อมูลรายงาน',
            });
          } else if (listItems.length == 0) {
            dispatch({
              type: types.REPORT_SET_ERROR_MESSAGE,
              payload: 'ไม่พบข้อมูลรายงาน',
            });
          }
        } else if (STATUS === '10') {
          reject(ERROR_MESSAGES[0]);
        }
        resolve(v);
      })
      .catch((error) => {
        reject(error.message || error);
      });
    } catch (error) {
      console.log('getReportDataNoGroup unexpected error: ', error);
      reject(error?.message || error);
    }
  });
};

export const getReportV3 = (uri, pattern, data) => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fromDate = moment(data.FROM.replace(/T/, ' ').replace(/\..+/, '')).format('YYYY-MM-DD');
      const toDate = moment(data.TO.replace(/T/, ' ').replace(/\..+/, '')).format('YYYY-MM-DD');
      const LoginGUID = await getLoginGuID();
      const userToken = await getUserToken();
      const VANCONFIG = userToken?.VANCONFIG;
      
      console.log('getReportV3: LoginGUID=', LoginGUID, 'VANCONFIG=', VANCONFIG);
      
      // ตรวจสอบว่ามี LoginGUID หรือไม่
      if (!LoginGUID) {
        console.log('getReportV3: LoginGUID is not available');
        reject('ไม่พบการส่งรหัสหน่วยรถ');
        return;
      }
      
      // ตรวจสอบว่า VANCONFIG มีค่าหรือไม่
      if (!VANCONFIG || !VANCONFIG.VANCNF_MACHINE) {
        console.log('getReportV3: VANCONFIG is not available');
        reject('ไม่พบการส่งรหัสหน่วยรถ');
        return;
      }
      
      let api = null;
      let RESULT = [];
      let FinalRESULT = [];
      let DATA = [];
      console.log('uri ', uri);
      const vanCnf = VANCONFIG.VANCNF_MACHINE;
      if (uri === 'DocumentItems') {
        await LookupErpCashSaleAPi(vanCnf, fromDate, toDate, uri).then(async (v) => {
          console.log('getReportV3 VVVVVVVV ==>', v);
        if (v && v.length != 0) {
          for (let obj of v) {
            let isNew = true;
            for (let obj2 of RESULT) {
              if (obj2.GROUP_NAME == moment(obj.DI_DATE).format('DD/MM/YYYY')) {
                obj2.ITEMS = [...obj2.ITEMS, obj];
                isNew = false;
                continue;
              }
            }
            if (isNew) {
              RESULT.push({
                GROUP_NAME: moment(obj.DI_DATE).format('DD/MM/YYYY'),
                ITEMS: [obj],
              });
            }
          }
          for (const i in RESULT) {
            let tempArr = [];
            for (const inObj of RESULT[i].ITEMS) {
              console.log('inObj ', inObj);
              let isNew = true;
              for (let inObj2 of tempArr) {
                if (inObj2.DOCCODE == inObj.DOCCODE) {
                  inObj2.ITEMS = [...inObj2.ITEMS, inObj];
                  isNew = false;
                  continue;
                }
              }
              if (isNew && !inObj.DT_DOCCODE.includes('DM')) {
                tempArr.push({
                  DOCGROUP: inObj.DT_THAIDESC,
                  DOCCODE: inObj.DT_PROPERTIES,
                  ITEMS: [inObj],
                });
              }
            }
            RESULT[i].ITEMS = tempArr;
          }

          for (const i of RESULT) {
            //Loop Date
            let tempFR = [];
            let GROUP_AMT = 0.0;
            for (let j of i.ITEMS) {
              //Loop Type
              let ITEM_TRH_N_ITEMS = 0.0,
                ITEM_TRH_N_QTY = 0.0,
                ITEM_ARD_G_KEYIN = 0.0,
                ITEM_ARD_TDSC_KEYINV = 0.0,
                ITEM_AMT = 0.0;
              for (const k in j.ITEMS) {
                //Loop Items of each bill
                // ตรวจสอบว่าเป็นใบจองสินค้าจาก DT_ENGDESC หรือ DT_PROPERTIES
                const isBookingDocument = 
                  j.ITEMS[k].DT_ENGDESC === 'Book' || 
                  j.ITEMS[k].DT_PROPERTIES === '207' ||
                  (j.ITEMS[k].DT_THAIDESC && j.ITEMS[k].DT_THAIDESC.includes('ใบจอง'));
                
                console.log('DocumentItems: === Loop item ===');
                console.log('DocumentItems: DT_DOCCODE =', j.ITEMS[k].DT_DOCCODE);
                console.log('DocumentItems: DT_ENGDESC =', j.ITEMS[k].DT_ENGDESC);
                console.log('DocumentItems: DT_PROPERTIES =', j.ITEMS[k].DT_PROPERTIES);
                console.log('DocumentItems: isBookingDocument =', isBookingDocument);
                
                if (isBookingDocument) {
                  console.log('DocumentItems: >>> เข้าเงื่อนไขใบจอง <<<');
                  // console.log('111');
                  const response = await UpdateErpGetSellOrderDocInfoAPi(
                    j.ITEMS[k].DI_KEY,
                  );
                  console.log('DocumentItems: response =', JSON.stringify(response));
                  
                  // ตรวจสอบว่า response มีข้อมูลหรือไม่ ก่อนใช้งาน
                  if (!response || (Array.isArray(response) && response.length === 0) || !response.TRANSTKD || !response.DOCINFO) {
                    console.log('DocumentItems: response is empty or invalid for booking document');
                    console.log('DocumentItems: originalData from LookupErpCashSaleAPi =', JSON.stringify(j.ITEMS[k]));
                    // ใช้ข้อมูลจาก j.ITEMS[k] แทน (ข้อมูลจาก LookupErpCashSaleAPi)
                    const originalData = j.ITEMS[k];
                    const newObj = {
                      DI_REF: originalData.DI_REF || originalData.DI_KEY || '',
                      AR_NAME: originalData.AR_NAME || originalData.AR_CODE || '',
                      PAYNAME: originalData.DI_KEY || '',
                      TRH_N_ITEMS: parseFloat(originalData.DI_ITEMS) || 1,
                      TRH_N_QTY: parseFloat(originalData.DI_ITEMS) || 1,
                      ARD_G_KEYIN: parseFloat(originalData.DI_AMOUNT) || 0,
                      ARD_TDSC_KEYINV: 0,
                      ARD_A_AMT: parseFloat(originalData.DI_AMOUNT) || 0,
                    };
                    console.log('DocumentItems: newObj created =', JSON.stringify(newObj));

                    ITEM_TRH_N_ITEMS += newObj.TRH_N_ITEMS;
                    ITEM_TRH_N_QTY += newObj.TRH_N_QTY;
                    ITEM_ARD_G_KEYIN += newObj.ARD_G_KEYIN;
                    ITEM_ARD_TDSC_KEYINV += newObj.ARD_TDSC_KEYINV;
                    GROUP_AMT += newObj.ARD_A_AMT;
                    ITEM_AMT += newObj.ARD_A_AMT;
                    j.ITEMS[k] = newObj;
                    continue;
                  }
                  
                  let TRH_N_QTY = 0.0;

                  for (let item of response.TRANSTKD) {
                    TRH_N_QTY += parseFloat(item.TRD_QTY);
                  }
                  
                  // ใช้ AROE สำหรับใบจอง หรือ ARDETAIL สำหรับเอกสารอื่น
                  const arData = response.AROE || response.ARDETAIL || {};
                  const newObj = {
                    DI_REF: response.DOCINFO.DI_REF,
                    AR_NAME: arData.AR_NAME || '',
                    PAYNAME: response.DOCINFO.DI_KEY,
                    TRH_N_ITEMS: response.TRANSTKD.length,
                    TRH_N_QTY: parseFloat(TRH_N_QTY),
                    ARD_G_KEYIN: parseFloat(arData.AROE_G_KEYIN || arData.ARD_G_KEYIN || 0),
                    ARD_TDSC_KEYINV: parseFloat(arData.AROE_TDSC_KEYINV || arData.ARD_TDSC_KEYINV || 0),
                    ARD_A_AMT: parseFloat(arData.AROE_A_AMT || arData.ARD_A_AMT || 0),
                  };

                  ITEM_TRH_N_ITEMS += newObj.TRH_N_ITEMS;
                  ITEM_TRH_N_QTY += parseFloat(TRH_N_QTY);
                  ITEM_ARD_G_KEYIN += newObj.ARD_G_KEYIN;
                  ITEM_ARD_TDSC_KEYINV += newObj.ARD_TDSC_KEYINV;
                  GROUP_AMT += newObj.ARD_A_AMT;
                  ITEM_AMT += newObj.ARD_A_AMT;
                  j.ITEMS[k] = newObj;
                } else if (j.ITEMS[k].DT_DOCCODE.includes('DM')) {
                  //console.log('222');
                  // const response = await UpdateErpGetOtherDocInfoAPi(
                  //   j.ITEMS[k].DI_KEY,
                  // );
                  // let TRH_N_QTY = 0.0;
                  // console.log(response);
                  // for (let j of response.TRANSTKD) {
                  //   TRH_N_QTY += parseFloat(j.TRD_QTY);
                  // }
                  // const newObj = {
                  //   DI_REF: response.DOCINFO.DI_REF,
                  //   AR_NAME: response.ARDETAIL.AR_NAME,
                  //   PAYNAME: response.DOCINFO.DI_KEY,
                  //   TRH_N_ITEMS: response.TRANSTKD.length,
                  //   TRH_N_QTY: parseFloat(TRH_N_QTY),
                  //   ARD_G_KEYIN: parseFloat(response.ARDETAIL.ARD_G_KEYIN),
                  //   ARD_TDSC_KEYINV: parseFloat(
                  //     response.ARDETAIL.ARD_TDSC_KEYINV,
                  //   ),
                  //   ARD_A_AMT: parseFloat(response.ARDETAIL.ARD_A_AMT),
                  // };
                  // ITEM_TRH_N_ITEMS += newObj.TRH_N_ITEMS;
                  // ITEM_TRH_N_QTY += parseFloat(TRH_N_QTY);
                  // ITEM_ARD_G_KEYIN += parseFloat(response.ARDETAIL.ARD_G_KEYIN);
                  // ITEM_ARD_TDSC_KEYINV += parseFloat(
                  //   response.ARDETAIL.ARD_TDSC_KEYINV,
                  // );
                  // ITEM_AMT += parseFloat(response.ARDETAIL.ARD_A_AMT);
                  // j.ITEMS[k] = newObj;
                } else {
                  console.log('pdateErpGetInvoiceOrderDocInfoAPi1');

                  const response = await UpdateErpGetInvoiceOrderDocInfoAPi(
                    j.ITEMS[k].DI_KEY,
                  );

                  console.log('response >>>> 2 ');
                  console.log('DocumentItems: DI_KEY =', j.ITEMS[k].DI_KEY);
                  console.log('DocumentItems: DT_DOCCODE =', j.ITEMS[k].DT_DOCCODE);
                  console.log('DocumentItems: response.ARDETAIL =', JSON.stringify(response?.ARDETAIL));

                  // ตรวจสอบกรณี response เป็น array ว่าง หรือไม่มีข้อมูล
                  if (!response || Array.isArray(response) && response.length === 0 || !response.DOCINFO) {
                    console.log('response is empty or invalid, skipping...');
                    continue;
                  }

                  if (response.DOCINFO.DT_KEY == VANCONFIG.VANCNF_RTN_DT) {
                    //console.log('pdateErpGetInvoiceOrderDocInfoAPi response.TRANSTKD', response.TRANSTKD);
                    for (let obj3 of response.TRANSTKD) {
                      obj3.TRD_G_KEYIN = -1 * parseFloat(obj3.TRD_G_KEYIN);
                      obj3.TRD_G_AMT = -1 * parseFloat(obj3.TRD_G_AMT);
                      obj3.TRD_B_AMT = -1 * parseFloat(obj3.TRD_B_AMT);
                      obj3.TRD_N_AMT = -1 * parseFloat(obj3.TRD_N_AMT);
                      obj3.TRD_QTY = -1 * parseFloat(obj3.TRD_QTY);
                      obj3.TRD_Q_FREE = -1 * parseFloat(obj3.TRD_Q_FREE);
                      //console.log('pdateErpGetInvoiceOrderDocInfoAPi response.TRANSTKD22', obj3.TRD_QTY);
                      //console.log('pdateErpGetInvoiceOrderDocInfoAPi response.TRANSTKD2', obj3.TRD_N_AMT);
                    }
                    response.ARDETAIL.ARD_G_KEYIN = -1 * Math.abs(parseFloat(response.ARDETAIL.ARD_G_KEYIN));
                  }


                  let TRH_N_QTY = 0.0;
                  for (let j of response.TRANSTKD) {
                    TRH_N_QTY += parseFloat(j.TRD_QTY);
                  }
                  
                  // สำหรับใบขายสด (DT_PROPERTIES = "302") ใช้ ARD_G_KEYIN - ARD_TDSC_KEYINV (ยอดสุทธิหลังหักส่วนลด)
                  const isCashSale = response.DOCINFO.DT_PROPERTIES === "302";
                  const saleAmount = isCashSale 
                    ? parseFloat(response.ARDETAIL.ARD_G_KEYIN) - parseFloat(response.ARDETAIL.ARD_TDSC_KEYINV || 0)
                    : parseFloat(response.ARDETAIL.ARD_A_AMT);
                  
                  console.log('DocumentItems: isCashSale =', isCashSale);
                  console.log('DocumentItems: ARD_G_KEYIN =', response.ARDETAIL.ARD_G_KEYIN);
                  console.log('DocumentItems: ARD_TDSC_KEYINV =', response.ARDETAIL.ARD_TDSC_KEYINV);
                  console.log('DocumentItems: saleAmount =', saleAmount);
                  
                  const newObj = {
                    DI_REF: response.DOCINFO.DI_REF,
                    AR_NAME: response.ARDETAIL.AR_NAME,
                    PAYNAME: response.DOCINFO.DI_KEY,
                    TRH_N_ITEMS: response.TRANSTKD.length,
                    TRH_N_QTY: parseFloat(TRH_N_QTY),
                    ARD_G_KEYIN: parseFloat(response.ARDETAIL.ARD_G_KEYIN),
                    ARD_TDSC_KEYINV: parseFloat(
                      response.ARDETAIL.ARD_TDSC_KEYINV,
                    ),
                    ARD_A_AMT: saleAmount,
                  };

                  ITEM_TRH_N_ITEMS += newObj.TRH_N_ITEMS;
                  ITEM_TRH_N_QTY += parseFloat(TRH_N_QTY);
                  ITEM_ARD_G_KEYIN += parseFloat(response.ARDETAIL.ARD_G_KEYIN);
                  ITEM_ARD_TDSC_KEYINV += parseFloat(
                    response.ARDETAIL.ARD_TDSC_KEYINV,
                  );
                  ITEM_AMT += saleAmount;
                  GROUP_AMT += saleAmount;
                  j.ITEMS[k] = newObj;
                }
              }

              tempFR.push({
                DOCCODE: j.DOCCODE,
                DOCGROUP: j.DOCGROUP,
                ITEMS: j.ITEMS,
                ITEM_TRH_N_ITEMS: parseFloat(ITEM_TRH_N_ITEMS),
                ITEM_TRH_N_QTY: parseFloat(ITEM_TRH_N_QTY),
                ITEM_ARD_G_KEYIN: parseFloat(ITEM_ARD_G_KEYIN),
                ITEM_ARD_TDSC_KEYINV: parseFloat(ITEM_ARD_TDSC_KEYINV),
                ITEM_AMT: parseFloat(ITEM_AMT),
              });
            }
            FinalRESULT.push({
              GROUP_NAME: i.GROUP_NAME,
              ITEMS: tempFR,
              GROUP_AMT: GROUP_AMT,
            });
          }


          console.log('FinalRESULT >> ', JSON.stringify(FinalRESULT));

          let tempX = [];
          let item_result = []; // กรุ๊บ  Data ใหม่เหอะ

          // Bazz แก้ตรงนี้
          for (let obj of FinalRESULT) {
            for (let _items of obj.ITEMS) {
              item_result.push(_items);
            }
          }

          {

            //loop GroupName
            let tempIn = [];
            for (let objA of item_result) {

              //Loop Category
              if (tempIn.length == 0) {
                tempIn.push({
                  ITEM_NAME: objA.DOCGROUP,
                  ITEM_TRH_N_ITEMS: parseFloat(objA.ITEM_TRH_N_ITEMS),
                  ITEM_TRH_N_QTY: parseFloat(objA.ITEM_TRH_N_QTY),
                  ITEM_ARD_G_KEYIN: parseFloat(objA.ITEM_ARD_G_KEYIN),
                  ITEM_ARD_TDSC_KEYINV: parseFloat(objA.ITEM_ARD_TDSC_KEYINV),
                  ITEM_AMT: parseFloat(objA.ITEM_AMT),
                });
              } else {
                for (let i in tempIn) {
                  if (objA.DOCGROUP == tempIn[i].ITEM_NAME) {

                    tempIn[i] = {
                      ITEM_NAME: objA.DOCGROUP,
                      ITEM_TRH_N_ITEMS: tempIn[i].ITEM_TRH_N_ITEMS + objA.ITEM_TRH_N_ITEMS,
                      ITEM_TRH_N_QTY: tempIn[i].ITEM_TRH_N_QTY + objA.ITEM_TRH_N_QTY,
                      ITEM_ARD_G_KEYIN: tempIn[i].ITEM_ARD_G_KEYIN + objA.ITEM_ARD_G_KEYIN,
                      ITEM_ARD_TDSC_KEYINV: tempIn[i].ITEM_ARD_TDSC_KEYINV +
                        objA.ITEM_ARD_TDSC_KEYINV,
                      ITEM_AMT: tempIn[i].ITEM_AMT + objA.ITEM_AMT,
                    };

                  } else {
                    let found = false;

                    for (let g in tempIn) {
                      if (tempIn[g].ITEM_NAME == objA.DOCGROUP) {
                        found = true;
                      }
                    }
                    console.log('ไป found', found);

                    if (found == false) {
                      tempIn.push({
                        ITEM_NAME: objA.DOCGROUP,
                        ITEM_TRH_N_ITEMS: parseFloat(objA.ITEM_TRH_N_ITEMS),
                        ITEM_TRH_N_QTY: parseFloat(objA.ITEM_TRH_N_QTY),
                        ITEM_ARD_G_KEYIN: parseFloat(objA.ITEM_ARD_G_KEYIN),
                        ITEM_ARD_TDSC_KEYINV: parseFloat(
                          objA.ITEM_ARD_TDSC_KEYINV,
                        ),
                        ITEM_AMT: parseFloat(objA.ITEM_AMT),
                      });
                    }
                  };
                }
              }
            }
            tempX.push(tempIn);
          }

          tempX = tempX.flat();
          console.log('tempX >>', tempX)



          let arr = [];
          let SUM_TRH_N_QTY = 0.0;
          let SUM_TRH_N_ITEMS = 0.0;
          let SUM_ARD_G_KEYIN = 0.0;
          let SUM_ARD_TDSC_KEYINV = 0.0;
          let SUM_AMT = 0.0;
          for (let g of tempX) {

            if (arr.length == 0) {
              arr.push({
                GROUP_NAME: g.ITEM_NAME,
                GROUP_ITEM_TRH_N_ITEMS: g.ITEM_TRH_N_ITEMS,
                GROUP_ITEM_TRH_N_QTY: g.ITEM_TRH_N_QTY,
                GROUP_ITEM_ARD_G_KEYIN: g.ITEM_ARD_G_KEYIN,
                GROUP_ITEM_ARD_TDSC_KEYINV: g.ITEM_ARD_TDSC_KEYINV,
                GROUP_ITEM_AMT: g.ITEM_AMT,
              });
            } else {
              let newOne = true;
              for (let k in arr) {
                if (arr[k].GROUP_NAME == g.ITEM_NAME) {

                  // console.log('arr[k].GROUP_NAME'  ,arr[k].GROUP_NAME)
                  // console.log('g.ITEM_NAME >>'  ,g.ITEM_NAME)
                  // arr[k] = {
                  //   GROUP_NAME: g.ITEM_NAME  ,
                  //   GROUP_ITEM_TRH_N_ITEMS:
                  //     g.ITEM_TRH_N_ITEMS + arr[k].GROUP_ITEM_TRH_N_ITEMS,
                  //   GROUP_ITEM_TRH_N_QTY:
                  //     g.ITEM_TRH_N_QTY + arr[k].GROUP_ITEM_TRH_N_QTY,
                  //   GROUP_ITEM_ARD_G_KEYIN:
                  //     g.ITEM_ARD_G_KEYIN + arr[k].GROUP_ITEM_ARD_G_KEYIN,
                  //   GROUP_ITEM_ARD_TDSC_KEYINV:
                  //     g.ITEM_ARD_TDSC_KEYINV +
                  //     arr[k].GROUP_ITEM_ARD_TDSC_KEYINV,
                  //   GROUP_ITEM_AMT: g.ITEM_AMT + arr[k].GROUP_ITEM_AMT,
                  //};
                  newOne = false;
                }
              }
              if (newOne) {
                arr.push({
                  GROUP_NAME: g.ITEM_NAME,
                  GROUP_ITEM_TRH_N_ITEMS: g.ITEM_TRH_N_ITEMS,
                  GROUP_ITEM_TRH_N_QTY: g.ITEM_TRH_N_QTY,
                  GROUP_ITEM_ARD_G_KEYIN: g.ITEM_ARD_G_KEYIN,
                  GROUP_ITEM_ARD_TDSC_KEYINV: g.ITEM_ARD_TDSC_KEYINV,
                  GROUP_ITEM_AMT: g.ITEM_AMT,
                });
              }
            }
          }
          for (let i of arr) {
            SUM_TRH_N_QTY += i.GROUP_ITEM_TRH_N_ITEMS;
            SUM_TRH_N_ITEMS += i.GROUP_ITEM_TRH_N_QTY;
            SUM_ARD_G_KEYIN += i.GROUP_ITEM_ARD_G_KEYIN;
            SUM_ARD_TDSC_KEYINV += i.GROUP_ITEM_ARD_TDSC_KEYINV;
            SUM_AMT += i.GROUP_ITEM_AMT;
          }
          DATA = {
            ITEMS: FinalRESULT,
            SUMMARY_SECTION: {
              GROUP: arr,
              SUM_TRH_N_QTY: SUM_TRH_N_QTY,
              SUM_TRH_N_ITEMS: SUM_TRH_N_ITEMS,
              SUM_ARD_G_KEYIN: SUM_ARD_G_KEYIN,
              SUM_ARD_TDSC_KEYINV: SUM_ARD_TDSC_KEYINV,
              SUM_AMT: SUM_AMT,
            },
          };

          // console.log('DATA =>> 1 ', JSON.stringify(DATA));
          if (DATA?.ITEMS?.length > 0) {
            dispatch({
              type: types.REPORT_GET_DATA_SUCCESS,
              payload: DATA,
            });
          } else if (DATA.ITEMS.length == 0) {
            dispatch({
              type: types.REPORT_SET_ERROR_MESSAGE,
              payload: 'ไม่พบข้อมูลรายงาน',
            });
          }
          resolve(DATA);
        } else {
          dispatch({
            type: types.REPORT_SET_ERROR_MESSAGE,
            payload: 'ไม่พบข้อมูลรายงาน',
          });
          resolve([]);
        }
      });
    } else if (uri === 'SalesOrderByProduct') {
      await LookupErpCashSaleAPi(vanCnf, fromDate, toDate, uri).then(async (v) => {
        if (v && v.length != 0) {
          for (let obj of v) {
            let response = null;

            let isNew = true;
            for (let obj2 of RESULT) {
              if (obj2.GROUP_NAME == moment(obj.DI_DATE).format('DD/MM/YYYY')) {
                if (
                  obj.DT_DOCCODE.includes('Q') ||
                  obj.DT_DOCCODE.includes('BK')
                ) {
                  response = await UpdateErpGetSellOrderDocInfoAPi(obj.DI_KEY);
                } else {
                  console.log('pdateErpGetInvoiceOrderDocInfoAPi2');
                  response = await UpdateErpGetInvoiceOrderDocInfoAPi(
                    obj.DI_KEY,
                  );
                }

                // console.log('pdateErpGetInvoiceOrderDocInfoAPi response DT_KEY' , response.DOCINFO.DT_KEY );
                console.log('pdateErpGetInvoiceOrderDocInfoAPi response VANCNF_RTN_DT', VANCONFIG.VANCNF_RTN_DT);
                console.log('pdateErpGetInvoiceOrderDocInfoAPi response', response.DOCINFO.DT_KEY);
                if (response.DOCINFO.DT_KEY == VANCONFIG.VANCNF_RTN_DT) {
                  console.log('pdateErpGetInvoiceOrderDocInfoAPi response.TRANSTKD', response.TRANSTKD);
                  for (let obj3 of response.TRANSTKD) {
                    obj3.TRD_G_KEYIN = -1 * parseFloat(obj3.TRD_G_KEYIN);
                    obj3.TRD_G_AMT = -1 * parseFloat(obj3.TRD_G_AMT);
                    obj3.TRD_B_AMT = -1 * parseFloat(obj3.TRD_B_AMT);
                    obj3.TRD_N_AMT = -1 * parseFloat(obj3.TRD_N_AMT);
                    obj3.TRD_QTY = -1 * parseFloat(obj3.TRD_QTY);
                    obj3.TRD_Q_FREE = -1 * parseFloat(obj3.TRD_Q_FREE);

                    console.log('pdateErpGetInvoiceOrderDocInfoAPi response.TRANSTKD22', obj3.TRD_QTY);
                    console.log('pdateErpGetInvoiceOrderDocInfoAPi response.TRANSTKD2', obj3.TRD_N_AMT);
                  }
                }


                let t = obj2.ITEMS;
                if (parseInt(response.RECORD_COUNT) > 0) {
                  t.push(response?.TRANSTKD);
                  obj2.ITEMS = t;
                  isNew = false;
                }
                continue;
              }
            }
            if (isNew) {
              if (
                obj.DT_DOCCODE.includes('Q') ||
                obj.DT_DOCCODE.includes('BK')
              ) {
                response = await UpdateErpGetSellOrderDocInfoAPi(obj.DI_KEY);
              } else {
                console.log('pdateErpGetInvoiceOrderDocInfoAPi3');
                response = await UpdateErpGetInvoiceOrderDocInfoAPi(obj.DI_KEY);
              }
              if (parseInt(response.RECORD_COUNT) > 0) {
                RESULT.push({
                  GROUP_NAME: moment(obj.DI_DATE).format('DD/MM/YYYY'),
                  ITEMS: [response?.TRANSTKD],
                });
              }
            }
          }

          for (let g in RESULT) {
            RESULT[g].ITEMS = RESULT[g].ITEMS.flat();
          }
          console.log(
            'getReportV3 LookupErpCashSaleAPi RESULT1_1',
            JSON.stringify(RESULT),
          );

          for (const i in RESULT) {
            //Loop Date
            let tempFR = [];
            let GROUP_SUM_QTY = 0.0;
            let GROUP_SUM_FREE_QTY = 0.0;
            let GROUP_SUM_AMT = 0.0;

            for (let j of RESULT[i].ITEMS) {
              let isNew = true;
              for (let inTemp of tempFR) {
                //if (j!==undefined)
                //{
                if (inTemp.DOCCODE == (j && j.SKU_CODE)) {
                  inTemp.SKUSELLQTY += parseFloat(j && j.TRD_QTY);
                  inTemp.SKUFREEQTY += parseFloat(j && j.TRD_Q_FREE);
                  inTemp.SKUAMT += parseFloat(j && j.TRD_N_AMT);
                  inTemp.ITEMS = [...inTemp.ITEMS, j];
                  isNew = false;

                  GROUP_SUM_QTY += parseFloat(j && j.TRD_QTY);
                  GROUP_SUM_FREE_QTY += parseFloat(j && j.TRD_Q_FREE);
                  GROUP_SUM_AMT += parseFloat(j && j.TRD_N_AMT);
                  continue;
                }
              }
              if (isNew) {
                tempFR.push({
                  SKU_NAME: j && j.SKU_NAME,
                  DOCCODE: j && j.SKU_CODE,
                  SKUSELLQTY: parseFloat(j && j.TRD_QTY),
                  SKUFREEQTY: parseFloat(j && j.TRD_Q_FREE),
                  SKUAMT: parseFloat(j && j.TRD_N_AMT),
                  ITEMS: [j],
                });
                GROUP_SUM_QTY += parseFloat(j && j.TRD_QTY);
                GROUP_SUM_FREE_QTY += parseFloat(j && j.TRD_Q_FREE);
                GROUP_SUM_AMT += parseFloat(j && j.TRD_N_AMT);
              }
              //}
            }

            RESULT[i].ITEMS = tempFR;
            RESULT[i].GROUP_SUM_QTY = GROUP_SUM_QTY;
            RESULT[i].GROUP_SUM_FREE_QTY = GROUP_SUM_FREE_QTY;
            RESULT[i].GROUP_SUM_AMT = GROUP_SUM_AMT;
            // RESULT[i].GROUP_SUM_QTY = 66;
            // RESULT[i].GROUP_SUM_FREE_QTY = 77;
            // RESULT[i].GROUP_SUM_AMT = 88;
          }

          console.log(
            'getReportV3 LookupErpCashSaleAPi RESULT2.1',
            JSON.stringify(RESULT),
          );
          let SUM_QTY = 0.0;
          let SUM_FREE_QTY = 0.0;
          let SUM_AMT = 0.0;
          let SUMMARY_SECTION = [];
          for (const i in RESULT) {
            for (let obj of RESULT[i].ITEMS) {
              let isNew = true;
              for (let inTemp of SUMMARY_SECTION) {
                if (inTemp.ITEM_NAME == obj.SKU_NAME) {
                  inTemp.ITEM_SELL_QTY += parseFloat(obj.SKUSELLQTY);
                  inTemp.ITEM_FREE_QTY += parseFloat(obj.SKUFREEQTY);
                  inTemp.ITEM_AMT += parseFloat(obj.SKUAMT);
                  isNew = false;

                  SUM_QTY += parseFloat(obj.SKUSELLQTY);
                  SUM_FREE_QTY += parseFloat(obj.SKUFREEQTY);
                  SUM_AMT += parseFloat(obj.SKUAMT);
                  continue;
                }
              }
              if (isNew) {
                SUMMARY_SECTION.push({
                  ITEM_NAME: obj.SKU_NAME,
                  ITEM_SELL_QTY: parseFloat(obj.SKUSELLQTY),
                  ITEM_FREE_QTY: parseFloat(obj.SKUFREEQTY),
                  ITEM_AMT: parseFloat(obj.SKUAMT),
                });
                SUM_QTY += parseFloat(obj.SKUSELLQTY);
                SUM_FREE_QTY += parseFloat(obj.SKUFREEQTY);
                SUM_AMT += parseFloat(obj.SKUAMT);
              }
            }
          }
          FinalRESULT = {
            ITEMS: RESULT,
            SUMMARY_SECTION: SUMMARY_SECTION,
            SUM_QTY: SUM_QTY,
            SUM_FREE_QTY: SUM_FREE_QTY,
            SUM_AMT: SUM_AMT,
          };
          if (FinalRESULT.ITEMS.length > 0) {
            dispatch({
              type: types.REPORT_GET_DATA_SUCCESS,
              payload: FinalRESULT,
            });
          } else if (FinalRESULT.ITEMS.length == 0) {
            dispatch({
              type: types.REPORT_SET_ERROR_MESSAGE,
              payload: 'ไม่พบข้อมูลรายงาน',
            });
          }
          resolve(FinalRESULT);
        } else {
          dispatch({
            type: types.REPORT_SET_ERROR_MESSAGE,
            payload: 'ไม่พบข้อมูลรายงาน',
          });
          resolve([]);
        }
      });
    } else if (uri === 'SalesOrderByCategory') {
      await LookupErpCashSaleAPi(vanCnf, fromDate, toDate, uri).then(async (v) => {
        if (v && v.length != 0) {
          for (let obj of v) {
            let response = null;

            let isNew = true;
            for (let obj2 of RESULT) {
              if (obj2.GROUP_NAME == moment(obj.DI_DATE).format('DD/MM/YYYY')) {
                if (
                  obj.DT_DOCCODE.includes('Q') ||
                  obj.DT_DOCCODE.includes('BK')
                ) {
                  response = await UpdateErpGetSellOrderDocInfoAPi(obj.DI_KEY);
                } else {
                  console.log('pdateErpGetInvoiceOrderDocInfoAPi4');
                  response = await UpdateErpGetInvoiceOrderDocInfoAPi(
                    obj.DI_KEY,
                  );
                }

                // console.log('pdateErpGetInvoiceOrderDocInfoAPi response DT_KEY' , response.DOCINFO.DT_KEY );
                console.log('pdateErpGetInvoiceOrderDocInfoAPi response VANCNF_RTN_DT', VANCONFIG.VANCNF_RTN_DT);
                console.log('pdateErpGetInvoiceOrderDocInfoAPi response', response.DOCINFO.DT_KEY);
                if (response.DOCINFO.DT_KEY == VANCONFIG.VANCNF_RTN_DT) {
                  console.log('pdateErpGetInvoiceOrderDocInfoAPi response.TRANSTKD', response.TRANSTKD);
                  for (let obj3 of response.TRANSTKD) {
                    obj3.TRD_G_KEYIN = -1 * parseFloat(obj3.TRD_G_KEYIN);
                    obj3.TRD_G_AMT = -1 * parseFloat(obj3.TRD_G_AMT);
                    obj3.TRD_B_AMT = -1 * parseFloat(obj3.TRD_B_AMT);
                    obj3.TRD_N_AMT = -1 * parseFloat(obj3.TRD_N_AMT);
                    obj3.TRD_QTY = -1 * parseFloat(obj3.TRD_QTY);
                    obj3.TRD_Q_FREE = -1 * parseFloat(obj3.TRD_Q_FREE);

                    console.log('pdateErpGetInvoiceOrderDocInfoAPi response.TRANSTKD22', obj3.TRD_QTY);
                    console.log('pdateErpGetInvoiceOrderDocInfoAPi response.TRANSTKD2', obj3.TRD_N_AMT);
                  }
                }

                let t = obj2.ITEMS;
                if (parseInt(response.RECORD_COUNT) > 0) {
                  t.push(response?.TRANSTKD);
                  obj2.ITEMS = t;
                  isNew = false;
                }
                continue;
              }
            }
            if (isNew) {
              if (
                obj.DT_DOCCODE.includes('Q') ||
                obj.DT_DOCCODE.includes('BK')
              ) {
                response = await UpdateErpGetSellOrderDocInfoAPi(obj.DI_KEY);
              } else {
                console.log('pdateErpGetInvoiceOrderDocInfoAPi');
                response = await UpdateErpGetInvoiceOrderDocInfoAPi(obj.DI_KEY);
              }
              if (response?.TRANSTKD != undefined) {
                RESULT.push({
                  GROUP_NAME: moment(obj.DI_DATE).format('DD/MM/YYYY'),
                  ITEMS: [response?.TRANSTKD],
                });
              }
            }
          }

          for (let g in RESULT) {
            RESULT[g].ITEMS = RESULT[g].ITEMS.flat();
          }
          // console.log(
          //   'getReportV3 LookupErpCashSaleAPi RESULT1_2',
          //   JSON.stringify(RESULT),
          // );

          for (let h in RESULT) {
            console.log('RESULT[h] ==>>', RESULT[h]);
            console.log('RESULT[h].ITEMS==>>', RESULT[h].ITEMS[0] === undefined);
            console.log('RESULT[h].ITEMS==>>', RESULT[h].ITEMS[0]);



            if (RESULT[h].ITEMS[0] !== undefined) {
              for (let g in RESULT[h].ITEMS) {

                if (RESULT[h].ITEMS[g] !== undefined) {
                  console.log('RESULT[h].ITEMS[g]==>>', RESULT[h].ITEMS[g]);
                  const GOODS_CODE = RESULT[h].ITEMS[g].GOODS_CODE;
                  const data = {
                    'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
                    'BPAPUS-LOGIN-GUID': LoginGUID,
                    'BPAPUS-FUNCTION': 'ShowGoodsInfo',
                    'BPAPUS-PARAM':
                      '{\r\n    "GOODS_CODE": "' +
                      GOODS_CODE +
                      '",\r\n    "ARPRB_CODE": "0"\r\n}',
                    'BPAPUS-FILTER': '',
                    'BPAPUS-ORDERBY': '',
                    'BPAPUS-OFFSET': '0',
                    'BPAPUS-FETCH': '1',
                  };
                  console.log('showPriceErpV3Api data ', data);
                  await showPriceErpV3Api(data).then((v) => {
                    const { ReasonString, ResponseCode, ResponseData } = v;
                    let responseData = JSON.parse(ResponseData);

                    if (ResponseCode == 200) {
                      console.log(
                        'showPriceErpV3Api',
                        JSON.stringify(responseData),
                      );
                      if (parseInt(responseData.RECORD_COUNT) > 0) {
                        RESULT[h].ITEMS[g] = {
                          ...RESULT[h].ITEMS[g],
                          ICCAT_CODE: responseData.GoodsInfo[0].ICCAT_CODE,
                          ICCAT_NAME: responseData.GoodsInfo[0].ICCAT_NAME,
                        };
                      }
                    }
                  });
                }
              }
            }
            // RESULT[h].ITEMS = RESULT[g].ITEMS.flat();
          }

          for (const i in RESULT) {
            //Loop Date
            let tempFR = [];
            let GROUP_SUM_QTY = 0.0;
            let GROUP_SUM_AMT = 0.0;
            let GROUP_SUM_QFREE = 0.0;


            for (let j of RESULT[i].ITEMS) {
              if (j !== undefined) {
                let isNew = true;
                for (let inTemp of tempFR) {
                  console.log('JJJJ', j)
                  if (inTemp.ICCAT_NAME == j.ICCAT_NAME) {
                    inTemp.SKUQTY += parseFloat(j.TRD_QTY);
                    inTemp.SKUAMT += parseFloat(j.TRD_N_AMT);
                    inTemp.SKUQFREE += parseFloat(j.TRD_Q_FREE);
                    //     inTemp.ITEMS = [...inTemp.ITEMS, j];
                    isNew = false;

                    GROUP_SUM_QTY += parseFloat(j.TRD_QTY);
                    GROUP_SUM_AMT += parseFloat(j.TRD_N_AMT);
                    GROUP_SUM_QFREE += parseFloat(j.TRD_Q_FREE);
                    continue;
                  }
                }
                if (isNew) {
                  tempFR.push({
                    ICCAT_NAME: j.ICCAT_NAME,
                    SKUQTY: parseFloat(j.TRD_QTY),
                    SKUAMT: parseFloat(j.TRD_N_AMT),
                    SKUQFREE: parseFloat(j.TRD_Q_FREE),
                  });
                  GROUP_SUM_QTY += parseFloat(j.TRD_QTY);
                  GROUP_SUM_AMT += parseFloat(j.TRD_N_AMT);
                  GROUP_SUM_QFREE += parseFloat(j.TRD_Q_FREE);
                }
              }
            }


            RESULT[i].ITEMS = tempFR;
            RESULT[i].GROUP_SUM_QTY = GROUP_SUM_QTY;
            RESULT[i].GROUP_SUM_AMT = GROUP_SUM_AMT;
            RESULT[i].GROUP_SUM_QFREE = GROUP_SUM_QFREE;

          }

          console.log(
            'getReportV3 LookupErpCashSaleAPi RESULT2.2',
            JSON.stringify(RESULT),
          );
          let SUM_QTY = 0.0;
          let SUM_AMT = 0.0;
          let SUM_QFREE = 0.0;


          let SUMMARY_SECTION = [];
          for (const i in RESULT) {
            for (let obj of RESULT[i].ITEMS) {
              let isNew = true;
              for (let inTemp of SUMMARY_SECTION) {
                if (inTemp.ITEM_NAME == obj.ICCAT_NAME) {
                  inTemp.ITEM_QTY += parseFloat(obj.SKUQTY);
                  inTemp.ITEM_AMT += parseFloat(obj.SKUAMT);
                  inTemp.ITEM_QFREE += parseFloat(obj.SKUQFREE);

                  isNew = false;

                  SUM_QTY += parseFloat(obj.SKUQTY);
                  SUM_AMT += parseFloat(obj.SKUAMT);
                  SUM_QFREE += parseFloat(obj.SKUQFREE);

                  continue;
                }
              }
              if (isNew) {
                SUMMARY_SECTION.push({
                  ITEM_NAME: obj.ICCAT_NAME,
                  ITEM_QTY: parseFloat(obj.SKUQTY),
                  ITEM_AMT: parseFloat(obj.SKUAMT),
                  ITEM_QFREE: parseFloat(obj.SKUQFREE),
                });
                SUM_QTY += parseFloat(obj.SKUQTY);
                SUM_AMT += parseFloat(obj.SKUAMT);
                SUM_QFREE += parseFloat(obj.SKUQFREE);

              }
            }
          }
          FinalRESULT = {
            ITEMS: RESULT,
            SUMMARY_SECTION: SUMMARY_SECTION,
            SUM_QTY: SUM_QTY,
            SUM_AMT: SUM_AMT,
            SUM_QFREE: SUM_QFREE,
          };
          console.log(
            'getReportV3 LookupErpCashSaleAPi RESULT3',
            JSON.stringify(FinalRESULT),
          );
          if (FinalRESULT.ITEMS.length > 0) {
            dispatch({
              type: types.REPORT_GET_DATA_SUCCESS,
              payload: FinalRESULT,
            });
          } else if (FinalRESULT.ITEMS.length == 0) {
            dispatch({
              type: types.REPORT_SET_ERROR_MESSAGE,
              payload: 'ไม่พบข้อมูลรายงาน',
            });
          }
          resolve(FinalRESULT);
        } else {
          dispatch({
            type: types.REPORT_SET_ERROR_MESSAGE,
            payload: 'ไม่พบข้อมูลรายงาน',
          });
          resolve([]);
        }
      });
    } else if (uri === 'SalesOrderByArline') {
      console.log('SalesOrderByArline >>> ');
      await LookupErpCashSaleAPi(vanCnf, fromDate, toDate, uri).then(async (v) => {
        if (v && v.length != 0) {
          for (let obj of v) {
            let response = null;
            console.log(
              'getReportV3 LookupErpCashSaleAPi RESULT0',
              JSON.stringify(obj),
            );
            let isNew = true;
            for (let obj2 of RESULT) {

              // console.log('response =>>>> ',obj2.GROUP_NAME);
              // console.log('response =>>>> ',moment(obj.DI_DATE).format('DD/MM/YYYY'));
              // console.log('response =>>>> ',obj2.GROUP_NAME == moment(obj.DI_DATE).format('DD/MM/YYYY'));

              if (obj2.GROUP_NAME == moment(obj.DI_DATE).format('DD/MM/YYYY')) {
                if (
                  obj.DT_DOCCODE.includes('Q') ||
                  obj.DT_DOCCODE.includes('BK')
                ) {
                  response = await UpdateErpGetSellOrderDocInfoAPi(obj.DI_KEY);
                } else {
                  console.log('pdateErpGetInvoiceOrderDocInfoAPi6');
                  response = await UpdateErpGetInvoiceOrderDocInfoAPi(
                    obj.DI_KEY,
                  );
                }

                if (response.DOCINFO.DT_KEY == VANCONFIG.VANCNF_RTN_DT) {
                  //console.log('pdateErpGetInvoiceOrderDocInfoAPi response.TRANSTKD', response.TRANSTKD);
                  for (let obj3 of response.TRANSTKD) {
                    obj3.TRD_G_KEYIN = -1 * parseFloat(obj3.TRD_G_KEYIN);
                    obj3.TRD_G_AMT = -1 * parseFloat(obj3.TRD_G_AMT);
                    obj3.TRD_B_AMT = -1 * parseFloat(obj3.TRD_B_AMT);
                    obj3.TRD_N_AMT = -1 * parseFloat(obj3.TRD_N_AMT);
                    obj3.TRD_QTY = -1 * parseFloat(obj3.TRD_QTY);
                    obj3.TRD_Q_FREE = -1 * parseFloat(obj3.TRD_Q_FREE);

                    //console.log('pdateErpGetInvoiceOrderDocInfoAPi response.TRANSTKD22', obj3.TRD_QTY);
                    //console.log('pdateErpGetInvoiceOrderDocInfoAPi response.TRANSTKD2', obj3.TRD_N_AMT);
                  }
                }
                //console.log('pdateErpGetInvoiceOrderDocInfoAPi responseAROE' , response);

                let t = obj2.ITEMS;
                let SKUSELLQTY = 0;
                let SKUFREEQTY = 0;

                if (parseInt(response.RECORD_COUNT) > 0) {
                  for (let objK of response?.TRANSTKD) {
                    SKUSELLQTY = SKUSELLQTY + parseInt(objK.TRD_QTY);
                    SKUFREEQTY = SKUFREEQTY + parseInt(objK.TRD_Q_FREE);

                  }
                  t.push({ ...response?.ARDETAIL, SKUSELLQTY: SKUSELLQTY, SKUFREEQTY: SKUFREEQTY });
                  obj2.ITEMS = t;
                  isNew = false;
                }
                continue;
              }
            }
            if (isNew) {
              if (
                obj.DT_DOCCODE.includes('Q') ||
                obj.DT_DOCCODE.includes('BK')
              ) {
                response = await UpdateErpGetSellOrderDocInfoAPi(obj.DI_KEY);
              } else {
                console.log('999');
                console.log('pdateErpGetInvoiceOrderDocInfoAPi7');
                response = await UpdateErpGetInvoiceOrderDocInfoAPi(obj.DI_KEY);
              }
              // console.log('response =>>>> ', JSON.stringify(response) );
              // console.log('response =>>>> ',response.RECORD_COUNT);
              let SKUSELLQTY = 0;
              let SKUFREEQTY = 0;

              //if ( JSON.stringify(response) !== '[]' )
              if (response.RECORD_COUNT > 0) {

                for (let objK of response?.TRANSTKD) {
                  SKUSELLQTY = SKUSELLQTY + parseInt(objK.TRD_QTY);
                  SKUFREEQTY = SKUFREEQTY + parseInt(objK.TRD_Q_FREE);

                }
                RESULT.push({
                  GROUP_NAME: moment(obj.DI_DATE).format('DD/MM/YYYY'), //'...999'
                  ITEMS: response?.AROE
                    ? [{ ...response?.AROE, SKUSELLQTY: SKUSELLQTY, SKUFREEQTY: SKUFREEQTY }]
                    : [{ ...response?.ARDETAIL, SKUSELLQTY: SKUSELLQTY, SKUFREEQTY: SKUFREEQTY }],
                });
              }
            }
          }

          for (let g in RESULT) {
            RESULT[g].ITEMS = RESULT[g].ITEMS.flat();
          }
          console.log(
            'getReportV3 LookupErpCashSaleAPi RESULT1_3',
            JSON.stringify(RESULT),
          );

          for (let h in RESULT) {

            for (let g in RESULT[h].ITEMS) {
              const AR_CODE = RESULT[h].ITEMS[g].AR_CODE;
              const data = {
                'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
                'BPAPUS-LOGIN-GUID': LoginGUID,
                'BPAPUS-FUNCTION': 'Vans0104',
                'BPAPUS-PARAM': '',
                'BPAPUS-FILTER': "and AR_CODE = '" + AR_CODE + "'",
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '1',
              };
              console.log('lookupErpV3Api data ', data);
              await lookupErpV3Api(data).then((v) => {
                const { ReasonString, ResponseCode, ResponseData } = v.data;
                let responseData = JSON.parse(ResponseData);
                console.log('lookupErpV3Api2 responseData ', responseData);
                if (ResponseCode == 200) {
                  console.log('lookupErpV3Api3', JSON.stringify(responseData));
                  if (parseInt(responseData.RECORD_COUNT) > 0) {
                    RESULT[h].ITEMS[g] = {
                      ...RESULT[h].ITEMS[g],
                      ARL_NAME: responseData.Vans0104[0].ARL_NAME,
                      ARL_KEY: responseData.Vans0104[0].ARL_KEY,
                      ARL_CODE: responseData.Vans0104[0].ARL_CODE,
                    };
                  }
                }
              });
            }
          }
          console.log(
            'getReportV3 LookupErpCashSaleAPi RESULT1.5',
            JSON.stringify(RESULT),
          );

          for (const i in RESULT) {
            //Loop Date
            let tempFR = [];
            let GROUP_SUM_QTY = 0.0;
            let GROUP_SUM_AMT = 0.0;
            let GROUP_SUM_QFREE = 0.0;

            for (let j of RESULT[i].ITEMS) {
              let isNew = true;
              for (let inTemp of tempFR) {
                if (inTemp.ARL_NAME == j.ARL_NAME) {
                  inTemp.SKUSELLQTY += parseFloat(j.SKUSELLQTY);
                  inTemp.SKUAMT += j.AROE_A_AMT
                    ? parseFloat(j.AROE_A_AMT)
                    : parseFloat(j.ARD_A_AMT);
                  inTemp.SKUQFREE += parseFloat(j.SKUFREEQTY);

                  //     inTemp.ITEMS = [...inTemp.ITEMS, j];
                  isNew = false;

                  GROUP_SUM_QTY += parseFloat(j.SKUSELLQTY);
                  GROUP_SUM_AMT += j.AROE_A_AMT
                    ? parseFloat(j.AROE_A_AMT)
                    : parseFloat(j.ARD_A_AMT);
                  GROUP_SUM_QFREE += parseFloat(j.SKUFREEQTY);

                  continue;
                }
              }
              if (isNew) {
                if (j.ARL_NAME != null) {
                  tempFR.push({
                    ARL_NAME: j.ARL_NAME,
                    SKUSELLQTY: parseFloat(j.SKUSELLQTY),
                    SKUAMT: j.AROE_A_AMT
                      ? parseFloat(j.AROE_A_AMT)
                      : parseFloat(j.ARD_A_AMT),
                    SKUQFREE: parseFloat(j.SKUFREEQTY),

                  });
                  GROUP_SUM_QTY += parseFloat(j.SKUSELLQTY);
                  GROUP_SUM_AMT += j.AROE_A_AMT
                    ? parseFloat(j.AROE_A_AMT)
                    : parseFloat(j.ARD_A_AMT);
                  GROUP_SUM_QFREE += parseFloat(j.SKUFREEQTY);

                }
              }
            }

            RESULT[i].ITEMS = tempFR;
            RESULT[i].GROUP_SUM_QTY = GROUP_SUM_QTY;
            RESULT[i].GROUP_SUM_AMT = GROUP_SUM_AMT;
            RESULT[i].GROUP_SUM_QFREE = GROUP_SUM_QFREE;

          }

          console.log(
            'getReportV3 LookupErpCashSaleAPi RESULT2.3',
            JSON.stringify(RESULT),
          );
          let SUM_QTY = 0.0;
          let SUM_AMT = 0.0;
          let SUM_QFREE = 0.0;


          let SUMMARY_SECTION = [];
          for (const i in RESULT) {
            for (let obj of RESULT[i].ITEMS) {
              let isNew = true;
              for (let inTemp of SUMMARY_SECTION) {
                if (inTemp.ITEM_NAME == obj.ARL_NAME) {
                  inTemp.ITEM_QTY += parseFloat(obj.SKUSELLQTY);
                  inTemp.ITEM_AMT += parseFloat(obj.SKUAMT);
                  inTemp.ITEM_QFREE += parseFloat(obj.SKUQFREE);

                  isNew = false;

                  SUM_QTY += parseFloat(obj.SKUSELLQTY);
                  SUM_AMT += parseFloat(obj.SKUAMT);
                  SUM_QFREE += parseFloat(obj.SKUQFREE);

                  continue;
                }
              }
              if (isNew) {
                SUMMARY_SECTION.push({
                  ITEM_NAME: obj.ARL_NAME,
                  ITEM_QTY: parseFloat(obj.SKUSELLQTY),
                  ITEM_AMT: parseFloat(obj.SKUAMT),
                  ITEM_QFREE: parseFloat(obj.SKUQFREE),

                });
                SUM_QTY += parseFloat(obj.SKUSELLQTY);
                SUM_AMT += parseFloat(obj.SKUAMT);
                SUM_QFREE += parseFloat(obj.SKUQFREE);

              }
            }
          }
          FinalRESULT = {
            ITEMS: RESULT,
            SUMMARY_SECTION: SUMMARY_SECTION,
            SUM_QTY: SUM_QTY,
            SUM_AMT: SUM_AMT,
            SUM_QFREE: SUM_QFREE,

          };
          console.log(
            'getReportV3 LookupErpCashSaleAPi RESULT4',
            JSON.stringify(FinalRESULT),
          );
          if (FinalRESULT.ITEMS.length > 0) {
            dispatch({
              type: types.REPORT_GET_DATA_SUCCESS,
              payload: FinalRESULT,
            });
          } else if (FinalRESULT.ITEMS.length == 0) {
            dispatch({
              type: types.REPORT_SET_ERROR_MESSAGE,
              payload: 'ไม่พบข้อมูลรายงาน',
            });
          }

          resolve(FinalRESULT);
        } else {
          dispatch({
            type: types.REPORT_SET_ERROR_MESSAGE,
            payload: 'ไม่พบข้อมูลรายงาน',
          });
          resolve([]);
        }
      });
    } else if (uri === 'SalesOrderByDocType') {
      console.log('LookupErpCashSaleAPi >>> ');
      await LookupErpCashSaleAPi(vanCnf, fromDate, toDate, uri).then(async (v) => {
        if (v && v.length != 0) {
          for (let obj of v) {
            let response = null;
            console.log(
              'getReportV3 LookupErpCashSaleAPi RESULT1_4',
              JSON.stringify(obj),
            );
            let isNew = true;
            for (let obj2 of RESULT) {
              if (obj2.GROUP_NAME == moment(obj.DI_DATE).format('DD/MM/YYYY')) {
                // if (
                //   obj.DT_DOCCODE.includes('Q') ||
                //   obj.DT_DOCCODE.includes('BK')
                // ) {
                //   response =
                // } else {
                //   response = await UpdateErpGetInvoiceOrderDocInfoAPi(
                //     obj.DI_KEY,
                //   );
                // }



                console.log(
                  'getReportV3 LookupErpCashSaleAPi obj2',
                  JSON.stringify(obj2),
                );
                //  console.log('pdateErpGetInvoiceOrderDocInfoAPi response DT_KEY' , robj.DT_KEY );
                console.log('pdateErpGetInvoiceOrderDocInfoAPi response VANCNF_RTN_DT', VANCONFIG.VANCNF_RTN_DT);
                //  console.log('pdateErpGetInvoiceOrderDocInfoAPi response', obj.DT_KEY);
                for (let obj3 of obj2.ITEMS) {
                  console.log('pdateErpGetInvoiceOrderDocInfoAPi obj2.ITEMS.DT_KEY', obj3.DT_KEY);

                  if (obj3.DT_KEY == VANCONFIG.VANCNF_RTN_DT) {

                    obj3.DI_AMOUNT = -1 * parseFloat(obj3.DI_AMOUNT);
                    //obj3.DI_ITEMS = -1 * parseFloat(obj3.DI_ITEMS);

                    //  console.log('pdateErpGetInvoiceOrderDocInfoAPi response.TRANSTKD22', obj3.TRD_QTY);
                    //  console.log('pdateErpGetInvoiceOrderDocInfoAPi response.TRANSTKD2', obj3.TRD_N_AMT);
                  }
                }



                let t = obj2.ITEMS;
                t.push(obj);
                obj2.ITEMS = t;
                isNew = false;
                continue;
              }
            }
            if (isNew) {
              // if (
              //   obj.DT_DOCCODE.includes('Q') ||
              //   obj.DT_DOCCODE.includes('BK')
              // ) {
              //   response = await UpdateErpGetSellOrderDocInfoAPi(obj.DI_KEY);
              // } else {
              //   response = await UpdateErpGetInvoiceOrderDocInfoAPi(obj.DI_KEY);
              // }
              RESULT.push({
                GROUP_NAME: moment(obj.DI_DATE).format('DD/MM/YYYY'),
                ITEMS: [obj],
              });
            }
          }

          for (let g in RESULT) {
            RESULT[g].ITEMS = RESULT[g].ITEMS.flat();
          }
          console.log(
            'getReportV3 LookupErpCashSaleAPi RESULT1_6',
            JSON.stringify(RESULT),
          );

          for (const i in RESULT) {
            //Loop Date
            let tempFR = [];
            let GROUP_SUMDOCOUNT = 0.0;
            let GROUP_SUM_AMT = 0.0;

            for (let j of RESULT[i].ITEMS) {
              // ถ้า DI_AMOUNT เป็น 0 หรือเป็นใบขายสด/เชื่อ ต้องเรียก API เพื่อดึงยอดจริง
              let actualAmount = parseFloat(j.DI_AMOUNT);
              
              if (actualAmount === 0 || j.DT_PROPERTIES === "302" || j.DT_PROPERTIES === "307") {
                console.log('SalesOrderByDocType: DI_AMOUNT is 0, fetching from API...');
                console.log('SalesOrderByDocType: DI_KEY =', j.DI_KEY);
                console.log('SalesOrderByDocType: DT_PROPERTIES =', j.DT_PROPERTIES);
                
                try {
                  const response = await UpdateErpGetInvoiceOrderDocInfoAPi(j.DI_KEY);
                  if (response && response.ARDETAIL) {
                    // ใบขายสด (302): ใช้ ARD_G_KEYIN - ส่วนลด
                    // ใบขายเชื่อ (307): ใช้ ARD_A_AMT
                    if (j.DT_PROPERTIES === "302") {
                      actualAmount = parseFloat(response.ARDETAIL.ARD_G_KEYIN || 0) - parseFloat(response.ARDETAIL.ARD_TDSC_KEYINV || 0);
                      console.log('SalesOrderByDocType: Cash sale, using ARD_G_KEYIN - discount =', actualAmount);
                    } else {
                      actualAmount = parseFloat(response.ARDETAIL.ARD_A_AMT || 0);
                      console.log('SalesOrderByDocType: Credit sale, using ARD_A_AMT =', actualAmount);
                    }
                  }
                } catch (error) {
                  console.log('SalesOrderByDocType: Error fetching document details:', error);
                }
              }
              
              let isNew = true;
              for (let inTemp of tempFR) {
                console.log('inTemp.DT_THAIDESC ', inTemp);
                console.log('j.DOCGROUP ', j);
                if (inTemp.DOCGROUP == j.DT_THAIDESC) {
                  inTemp.DOCOUNT += 1;
                  inTemp.SKUAMT += actualAmount;
                  //     inTemp.ITEMS = [...inTemp.ITEMS, j];
                  isNew = false;

                  GROUP_SUMDOCOUNT += 1;
                  GROUP_SUM_AMT += actualAmount;
                  continue;
                }
              }
              if (isNew) {
                tempFR.push({
                  DOCGROUP: j.DT_THAIDESC,
                  DOCOUNT: 1,
                  SKUAMT: actualAmount,
                });
                GROUP_SUMDOCOUNT += 1;
                GROUP_SUM_AMT += actualAmount;
              }
            }

            RESULT[i].ITEMS = tempFR;
            RESULT[i].GROUP_SUMDOCOUNT = GROUP_SUMDOCOUNT;
            RESULT[i].GROUP_SUM_AMT = GROUP_SUM_AMT;
          }

          console.log(
            'getReportV3 LookupErpCashSaleAPi RESULT2.4',
            JSON.stringify(RESULT),
          );
          let SUM_DOCOUNT = 0.0;
          let SUM_AMT = 0.0;
          let SUMMARY_SECTION = [];
          for (const i in RESULT) {
            for (let obj of RESULT[i].ITEMS) {
              let isNew = true;
              for (let inTemp of SUMMARY_SECTION) {
                if (inTemp.ITEM_NAME == obj.DOCGROUP) {
                  inTemp.ITEM_DO_COUNT += parseFloat(obj.DOCOUNT);
                  inTemp.ITEM_AMT += parseFloat(obj.SKUAMT);
                  isNew = false;

                  SUM_DOCOUNT += parseFloat(obj.DOCOUNT);
                  SUM_AMT += parseFloat(obj.SKUAMT);
                  continue;
                }
              }
              if (isNew) {
                console.log('NEW DOC');
                SUMMARY_SECTION.push({
                  ITEM_NAME: obj.DOCGROUP,
                  ITEM_DO_COUNT: parseFloat(obj.DOCOUNT),
                  ITEM_AMT: parseFloat(obj.SKUAMT),
                });
                SUM_DOCOUNT += parseFloat(obj.DOCOUNT);
                SUM_AMT += parseFloat(obj.SKUAMT);
              }
            }
          }

          console.log(
            'getReportV3 LookupErpCashSaleAPi RESULT5 ITEMS',
            JSON.stringify(RESULT),
          );




          FinalRESULT = {
            ITEMS: RESULT,
            SUMMARY_SECTION: SUMMARY_SECTION,
            SUM_DOCOUNT: SUM_DOCOUNT,
            SUM_AMT: SUM_AMT,
          };
          console.log(
            'getReportV3 LookupErpCashSaleAPi RESULT6',
            JSON.stringify(FinalRESULT),
          );
          if (FinalRESULT.ITEMS.length > 0) {
            dispatch({
              type: types.REPORT_GET_DATA_SUCCESS,
              payload: FinalRESULT,
            });
          } else if (FinalRESULT.ITEMS.length == 0) {
            dispatch({
              type: types.REPORT_SET_ERROR_MESSAGE,
              payload: 'ไม่พบข้อมูลรายงาน',
            });
          }
          resolve(FinalRESULT);
        } else {
          dispatch({
            type: types.REPORT_SET_ERROR_MESSAGE,
            payload: 'ไม่พบข้อมูลรายงาน',
          });
          resolve([]);
        }
      });
    } else if (uri === 'DocumentItemsDetails') {
      await LookupErpCashSaleAPi(vanCnf, fromDate, toDate, uri).then(async (v) => {
        console.log('getReportV3 VVVVVVVV ==>', v);
        if (v && v.length != 0) {
          for (let obj of v) {
            let isNew = true;
            for (let obj2 of RESULT) {
              if (obj2.GROUP_NAME == moment(obj.DI_DATE).format('DD/MM/YYYY')) {
                obj2.ITEMS = [...obj2.ITEMS, obj];
                isNew = false;
                continue;
              }
            }
            if (isNew) {
              RESULT.push({
                GROUP_NAME: moment(obj.DI_DATE).format('DD/MM/YYYY'),
                ITEMS: [obj],
              });
            }
          }
          for (const i in RESULT) {
            let tempArr = [];
            for (const inObj of RESULT[i].ITEMS) {
              console.log('inObj ', inObj);
              let isNew = true;
              for (let inObj2 of tempArr) {
                if (inObj2.DOCCODE == inObj.DOCCODE) {
                  inObj2.ITEMS = [...inObj2.ITEMS, inObj];
                  isNew = false;
                  continue;
                }
              }
              if (isNew && !inObj.DT_DOCCODE.includes('DM')) {
                tempArr.push({
                  DOCGROUP: inObj.DT_THAIDESC,
                  DOCCODE: inObj.DT_PROPERTIES,
                  ITEMS: [inObj],
                });
              }
            }
            RESULT[i].ITEMS = tempArr;
          }
          console.log(
            'getReportV3 LookupErpCashSaleAPi RESULT1_7',
            JSON.stringify(RESULT),
          );

          for (const i of RESULT) {
            //Loop Date
            let tempFR = [];
            for (let j of i.ITEMS) {
              //Loop Type
              let ITEM_TRH_N_ITEMS = 0.0,
                ITEM_TRH_N_QTY = 0.0,
                ITEM_ARD_G_KEYIN = 0.0,
                ITEM_ARD_TDSC_KEYINV = 0.0,
                ITEM_AMT = 0.0;
              for (const k in j.ITEMS) {
                //Loop Items of each bill
                // ตรวจสอบว่าเป็นใบจองสินค้าจาก DT_ENGDESC หรือ DT_PROPERTIES
                const isBookingDocument = 
                  j.ITEMS[k].DT_ENGDESC === 'Book' || 
                  j.ITEMS[k].DT_PROPERTIES === '207' ||
                  (j.ITEMS[k].DT_THAIDESC && j.ITEMS[k].DT_THAIDESC.includes('ใบจอง'));
                
                console.log('DocumentItemsDetails: DT_DOCCODE =', j.ITEMS[k].DT_DOCCODE);
                console.log('DocumentItemsDetails: isBookingDocument =', isBookingDocument);
                
                if (isBookingDocument) {
                  console.log('DocumentItemsDetails: >>> เข้าเงื่อนไขใบจอง <<<');
                  const response = await UpdateErpGetSellOrderDocInfoAPi(
                    j.ITEMS[k].DI_KEY,
                  );
                  console.log('111 response', JSON.stringify(response));
                  
                  // ตรวจสอบว่า response และ TRANSTKD มีค่าก่อนใช้งาน
                  if (!response || !response.TRANSTKD || !Array.isArray(response.TRANSTKD)) {
                    console.log('DocumentItemsDetails: response is empty or invalid for booking document');
                    console.log('DocumentItemsDetails: originalData from LookupErpCashSaleAPi =', JSON.stringify(j.ITEMS[k]));
                    // ใช้ข้อมูลจาก j.ITEMS[k] (ข้อมูลจาก LookupErpCashSaleAPi)
                    const originalData = j.ITEMS[k];
                    const newObj = {
                      DOCGROUP: originalData.DI_REF || originalData.DI_KEY || '',
                      AR_NAME: originalData.AR_NAME || originalData.AR_CODE || '',
                      PAYNAME: originalData.DI_KEY || '',
                      AR_CODE: originalData.AR_CODE || '',
                      TRH_N_ITEMS: parseFloat(originalData.DI_ITEMS) || 1,
                      TRH_N_QTY: parseFloat(originalData.DI_ITEMS) || 1,
                      ARD_G_KEYIN: parseFloat(originalData.DI_AMOUNT) || 0,
                      ARD_TDSC_KEYINV: 0,
                      ITEMS: [],
                      SUM_TRD_B_SELL: parseFloat(originalData.DI_AMOUNT) || 0,
                      SUM_TRD_B_VAT: 0,
                      ARD_A_AMT: parseFloat(originalData.DI_AMOUNT) || 0,
                    };
                    console.log('DocumentItemsDetails: newObj created =', JSON.stringify(newObj));
                    
                    ITEM_TRH_N_ITEMS += newObj.TRH_N_ITEMS;
                    ITEM_TRH_N_QTY += newObj.TRH_N_QTY;
                    ITEM_ARD_G_KEYIN += newObj.ARD_G_KEYIN;
                    ITEM_ARD_TDSC_KEYINV += newObj.ARD_TDSC_KEYINV;
                    ITEM_AMT += newObj.ARD_A_AMT;
                    j.ITEMS[k] = newObj;
                  } else {
                  
                  let TRH_N_QTY = 0.0;
                  let SUM_TRD_B_SELL = 0.0;
                  let SUM_TRD_B_VAT = 0.0;
                  let ARD_A_AMT = 0.0;
                  // for (let j of response.TRANSTKD) {
                  //   TRH_N_QTY += parseFloat(j.TRD_QTY);
                  // }
                  const items = response.TRANSTKD.map((obj) => {
                    TRH_N_QTY += parseFloat(obj.TRD_QTY);
                    SUM_TRD_B_SELL += parseFloat(obj.TRD_B_SELL);
                    SUM_TRD_B_VAT += parseFloat(obj.TRD_B_VAT);
                    ARD_A_AMT += parseFloat(obj.TRD_N_AMT);
                    return {
                      TRD_KEYIN: obj.TRD_KEYIN,
                      TRD_SH_NAME: obj.SKU_NAME,
                      TRD_SH_QTY: parseFloat(obj.TRD_QTY),
                      TRD_Q_FREE: parseFloat(obj.TRD_Q_FREE),
                      TRD_SH_UPRC: parseFloat(obj.TRD_U_PRC),
                      TRD_DSC_KEYIN: isNaN(parseFloat(obj.TRD_DSC_KEYIN) ? 0 : parseFloat(obj.TRD_DSC_KEYIN)),
                      TRD_SH_GAMT: parseFloat(obj.TRD_G_AMT),
                    };
                  });

                  const newObj = {
                    DOCGROUP: response.DOCINFO.DI_REF,
                    AR_NAME: response.AROE
                      ? response.AROE.AR_NAME
                      : response.ARDETAIL.AR_NAME,
                    PAYNAME: response.DOCINFO.DI_KEY,
                    AR_CODE: response.AROE
                      ? response.AROE.AR_CODE
                      : response.ARDETAIL.AR_CODE,
                    TRH_N_ITEMS: response.TRANSTKD.length,
                    TRH_N_QTY: parseFloat(TRH_N_QTY),
                    ARD_G_KEYIN: response.AROE
                      ? parseFloat(response.AROE.AROE_G_KEYIN)
                      : parseFloat(response.ARDETAIL.ARD_G_KEYIN),
                    ARD_TDSC_KEYINV: response.AROE
                      ? parseFloat(response.AROE.AROE_TDSC_KEYINV)
                      : parseFloat(response.ARDETAIL.ARD_TDSC_KEYINV),

                    ITEMS: items,
                    SUM_TRD_B_SELL: parseFloat(SUM_TRD_B_SELL),
                    SUM_TRD_B_VAT: parseFloat(SUM_TRD_B_VAT),
                    ARD_A_AMT: ARD_A_AMT,
                  };

                  ITEM_TRH_N_ITEMS += newObj.TRH_N_ITEMS;
                  ITEM_TRH_N_QTY += parseFloat(TRH_N_QTY);
                  ITEM_ARD_G_KEYIN += newObj.ARD_G_KEYIN;
                  ITEM_ARD_TDSC_KEYINV += newObj.ARD_TDSC_KEYINV;
                  ITEM_AMT += newObj.ARD_A_AMT;
                  j.ITEMS[k] = newObj;
                  }
                } else if (j.ITEMS[k].DT_DOCCODE.includes('DM')) {
                  //console.log('222');
                  // const response = await UpdateErpGetOtherDocInfoAPi(
                  //   j.ITEMS[k].DI_KEY,
                  // );
                  // let TRH_N_QTY = 0.0;
                  // console.log(response);
                  // for (let j of response.TRANSTKD) {
                  //   TRH_N_QTY += parseFloat(j.TRD_QTY);
                  // }
                  // const newObj = {
                  //   DI_REF: response.DOCINFO.DI_REF,
                  //   AR_NAME: response.ARDETAIL.AR_NAME,
                  //   PAYNAME: response.DOCINFO.DI_KEY,
                  //   TRH_N_ITEMS: response.TRANSTKD.length,
                  //   TRH_N_QTY: parseFloat(TRH_N_QTY),
                  //   ARD_G_KEYIN: parseFloat(response.ARDETAIL.ARD_G_KEYIN),
                  //   ARD_TDSC_KEYINV: parseFloat(
                  //     response.ARDETAIL.ARD_TDSC_KEYINV,
                  //   ),
                  //   ARD_A_AMT: parseFloat(response.ARDETAIL.ARD_A_AMT),
                  // };
                  // ITEM_TRH_N_ITEMS += newObj.TRH_N_ITEMS;
                  // ITEM_TRH_N_QTY += parseFloat(TRH_N_QTY);
                  // ITEM_ARD_G_KEYIN += parseFloat(response.ARDETAIL.ARD_G_KEYIN);
                  // ITEM_ARD_TDSC_KEYINV += parseFloat(
                  //   response.ARDETAIL.ARD_TDSC_KEYINV,
                  // );
                  // ITEM_AMT += parseFloat(response.ARDETAIL.ARD_A_AMT);
                  // j.ITEMS[k] = newObj;
                } else {
                  //console.log('333');
                  console.log('222');
                  console.log('pdateErpGetInvoiceOrderDocInfoAPi8');
                  console.log('DocumentItemsDetails: DI_KEY =', j.ITEMS[k].DI_KEY);
                  console.log('DocumentItemsDetails: DT_DOCCODE =', j.ITEMS[k].DT_DOCCODE);
                  console.log('DocumentItemsDetails: DT_PROPERTIES =', j.ITEMS[k].DT_PROPERTIES);
                  const response = await UpdateErpGetInvoiceOrderDocInfoAPi(
                    j.ITEMS[k].DI_KEY,
                  );
                  console.log('222 response', JSON.stringify(response));
                  
                  // ตรวจสอบว่า response และ TRANSTKD มีค่าก่อนใช้งาน
                  if (!response || !response.TRANSTKD || !Array.isArray(response.TRANSTKD)) {
                    console.log('222 response.TRANSTKD is not available, creating empty ITEMS...');
                    // สร้าง newObj ที่มี ITEMS เป็น array ว่าง
                    const newObj = {
                      DOCGROUP: response?.DOCINFO?.DI_REF || j.ITEMS[k].DI_REF || '',
                      AR_NAME: response?.AROE?.AR_NAME || response?.ARDETAIL?.AR_NAME || j.ITEMS[k].AR_NAME || '',
                      PAYNAME: response?.DOCINFO?.DI_KEY || j.ITEMS[k].DI_KEY || '',
                      AR_CODE: response?.AROE?.AR_CODE || response?.ARDETAIL?.AR_CODE || j.ITEMS[k].AR_CODE || '',
                      TRH_N_ITEMS: 0,
                      TRH_N_QTY: 0,
                      ARD_G_KEYIN: 0,
                      ARD_TDSC_KEYINV: 0,
                      ITEMS: [],
                      SUM_TRD_B_SELL: 0,
                      SUM_TRD_B_VAT: 0,
                      ARD_A_AMT: 0,
                    };
                    j.ITEMS[k] = newObj;
                  } else {
                  
                  let TRH_N_QTY = 0.0;
                  let SUM_TRD_B_SELL = 0.0;
                  let SUM_TRD_B_VAT = 0.0;
                  let ARD_A_AMT = 0.0;
                  const items = response.TRANSTKD.map((obj) => {
                    TRH_N_QTY += parseFloat(obj.TRD_QTY);
                    SUM_TRD_B_SELL += parseFloat(obj.TRD_B_SELL);
                    SUM_TRD_B_VAT += parseFloat(obj.TRD_B_VAT);
                    ARD_A_AMT += parseFloat(obj.TRD_N_AMT);
                    return {
                      TRD_KEYIN: obj.TRD_KEYIN,
                      TRD_SH_NAME: obj.SKU_NAME,
                      TRD_SH_QTY: parseFloat(obj.TRD_QTY),
                      TRD_Q_FREE: parseFloat(obj.TRD_Q_FREE),
                      TRD_SH_UPRC: parseFloat(obj.TRD_U_PRC),
                      //TRD_DSC_KEYIN: parseFloat(obj.TRD_DSC_KEYIN),
                      TRD_DSC_KEYIN: isNaN(parseFloat(obj.TRD_DSC_KEYIN) ? 0 : parseFloat(obj.TRD_DSC_KEYIN)),
                      TRD_SH_GAMT: parseFloat(obj.TRD_G_AMT),
                    };
                  });
                  
                  // สำหรับใบขายสด (DT_PROPERTIES = "302") ใช้ ARD_G_KEYIN - ARD_TDSC_KEYINV (ยอดสุทธิหลังหักส่วนลด)
                  const isCashSale = response.DOCINFO.DT_PROPERTIES === "302";
                  console.log('DocumentItemsDetails: isCashSale =', isCashSale);
                  console.log('DocumentItemsDetails: ARD_A_AMT from TRD_N_AMT =', ARD_A_AMT);
                  
                  if (isCashSale && ARD_A_AMT === 0) {
                    const ardGKeyin = response.AROE
                      ? parseFloat(response.AROE.AROE_G_KEYIN || 0)
                      : parseFloat(response.ARDETAIL.ARD_G_KEYIN || 0);
                    const ardDiscount = response.AROE
                      ? parseFloat(response.AROE.AROE_TDSC_KEYINV || 0)
                      : parseFloat(response.ARDETAIL.ARD_TDSC_KEYINV || 0);
                    ARD_A_AMT = ardGKeyin - ardDiscount;
                    console.log('DocumentItemsDetails: ARD_G_KEYIN =', ardGKeyin);
                    console.log('DocumentItemsDetails: ARD_TDSC_KEYINV =', ardDiscount);
                    console.log('DocumentItemsDetails: Using net amount =', ARD_A_AMT);
                  }
                  
                  const newObj = {
                    DOCGROUP: response.DOCINFO.DI_REF,
                    AR_NAME: response.AROE
                      ? response.AROE.AR_NAME
                      : response.ARDETAIL.AR_NAME,
                    AR_CODE: response.AROE
                      ? response.AROE.AR_CODE
                      : response.ARDETAIL.AR_CODE,
                    PAYNAME: response.DOCINFO.DI_KEY,
                    TRH_N_ITEMS: response.TRANSTKD.length,
                    TRH_N_QTY: parseFloat(TRH_N_QTY),
                    ARD_G_KEYIN: response.AROE
                      ? parseFloat(response.AROE.AROE_G_KEYIN)
                      : parseFloat(response.ARDETAIL.ARD_G_KEYIN),
                    ARD_TDSC_KEYINV: response.AROE
                      ? parseFloat(response.AROE.AROE_TDSC_KEYINV)
                      : parseFloat(response.ARDETAIL.ARD_TDSC_KEYINV),

                    ITEMS: items,
                    SUM_TRD_B_SELL: parseFloat(SUM_TRD_B_SELL),
                    SUM_TRD_B_VAT: parseFloat(SUM_TRD_B_VAT),
                    ARD_A_AMT: ARD_A_AMT,
                  };

                  ITEM_TRH_N_ITEMS += newObj.TRH_N_ITEMS;
                  ITEM_TRH_N_QTY += parseFloat(TRH_N_QTY);
                  ITEM_ARD_G_KEYIN += newObj.ARD_G_KEYIN;
                  ITEM_ARD_TDSC_KEYINV += newObj.ARD_TDSC_KEYINV;
                  ITEM_AMT += newObj.ARD_A_AMT;

                  j.ITEMS[k] = newObj;
                  }
                }
              }

              tempFR.push({
                DOCCODE: j.DOCCODE,
                DOCGROUP: j.DOCGROUP,
                ITEMS: j.ITEMS,
                ITEM_TRH_N_ITEMS: parseFloat(ITEM_TRH_N_ITEMS),
                ITEM_TRH_N_QTY: parseFloat(ITEM_TRH_N_QTY),
                ITEM_ARD_G_KEYIN: parseFloat(ITEM_ARD_G_KEYIN),
                ITEM_ARD_TDSC_KEYINV: parseFloat(ITEM_ARD_TDSC_KEYINV),
                ITEM_AMT: parseFloat(ITEM_AMT),
              });
            }
            FinalRESULT.push({ GROUP_NAME: i.GROUP_NAME, ITEMS: tempFR });
          }
          console.log(
            'getReportV3 LookupErpCashSaleAPi FinalRESULT1',
            JSON.stringify(FinalRESULT),
          );
          let tempX = [];
          for (let obj of FinalRESULT) {
            //loop GroupName
            let tempIn = [];
            for (let objA of obj.ITEMS) {
              //Loop Category
              if (tempIn.length == 0) {
                tempIn.push({
                  ITEM_NAME: objA.DOCGROUP,
                  ITEM_TRH_N_ITEMS: parseFloat(objA.ITEM_TRH_N_ITEMS),
                  ITEM_TRH_N_QTY: parseFloat(objA.ITEM_TRH_N_QTY),
                  ITEM_ARD_G_KEYIN: parseFloat(objA.ITEM_ARD_G_KEYIN),
                  ITEM_ARD_TDSC_KEYINV: parseFloat(objA.ITEM_ARD_TDSC_KEYINV),
                  ITEM_AMT: parseFloat(objA.ITEM_AMT),
                });
              } else {
                for (let i in tempIn) {
                  if (objA.DOCGROUP == tempIn[i].ITEM_NAME) {
                    tempIn[i] = {
                      ITEM_NAME: objA.DOCGROUP,
                      ITEM_TRH_N_ITEMS:
                        tempIn[i].ITEM_TRH_N_ITEMS + objA.ITEM_TRH_N_ITEMS,
                      ITEM_TRH_N_QTY:
                        tempIn[i].ITEM_TRH_N_QTY + objA.ITEM_TRH_N_QTY,
                      ITEM_ARD_G_KEYIN:
                        tempIn[i].ITEM_ARD_G_KEYIN + objA.ITEM_ARD_G_KEYIN,
                      ITEM_ARD_TDSC_KEYINV:
                        tempIn[i].ITEM_ARD_TDSC_KEYINV +
                        objA.ITEM_ARD_TDSC_KEYINV,
                      ITEM_AMT: tempIn[i].ITEM_AMT + objA.ITEM_AMT,
                    };
                  } else {
                    tempIn.push({
                      ITEM_NAME: objA.DOCGROUP,
                      ITEM_TRH_N_ITEMS: parseFloat(objA.ITEM_TRH_N_ITEMS),
                      ITEM_TRH_N_QTY: parseFloat(objA.ITEM_TRH_N_QTY),
                      ITEM_ARD_G_KEYIN: parseFloat(objA.ITEM_ARD_G_KEYIN),
                      ITEM_ARD_TDSC_KEYINV: parseFloat(
                        objA.ITEM_ARD_TDSC_KEYINV,
                      ),
                      ITEM_AMT: parseFloat(objA.ITEM_AMT),
                    });
                  }
                }
              }
            }

            tempX.push(tempIn);
          }

          tempX = tempX.flat();
          let arr = [];
          let SUM_TRH_N_QTY = 0.0;
          let SUM_TRH_N_ITEMS = 0.0;
          let SUM_ARD_G_KEYIN = 0.0;
          let SUM_ARD_TDSC_KEYINV = 0.0;
          let SUM_AMT = 0.0;
          for (let g of tempX) {
            if (arr.length == 0) {
              arr.push({
                GROUP_NAME: g.ITEM_NAME,
                GROUP_ITEM_TRH_N_ITEMS: g.ITEM_TRH_N_ITEMS,
                GROUP_ITEM_TRH_N_QTY: g.ITEM_TRH_N_QTY,
                GROUP_ITEM_ARD_G_KEYIN: g.ITEM_ARD_G_KEYIN,
                GROUP_ITEM_ARD_TDSC_KEYINV: g.ITEM_ARD_TDSC_KEYINV,
                GROUP_ITEM_AMT: g.ITEM_AMT,
              });
            } else {
              let newOne = true;

              for (let k in arr) {
                if (arr[k].GROUP_NAME == g.ITEM_NAME) {
                  arr[k] = {
                    GROUP_NAME: g.ITEM_NAME,
                    GROUP_ITEM_TRH_N_ITEMS:
                      g.ITEM_TRH_N_ITEMS + arr[k].GROUP_ITEM_TRH_N_ITEMS,
                    GROUP_ITEM_TRH_N_QTY:
                      g.ITEM_TRH_N_QTY + arr[k].GROUP_ITEM_TRH_N_QTY,
                    GROUP_ITEM_ARD_G_KEYIN:
                      g.ITEM_ARD_G_KEYIN + arr[k].GROUP_ITEM_ARD_G_KEYIN,
                    GROUP_ITEM_ARD_TDSC_KEYINV:
                      g.ITEM_ARD_TDSC_KEYINV +
                      arr[k].GROUP_ITEM_ARD_TDSC_KEYINV,
                    GROUP_ITEM_AMT: g.ITEM_AMT + arr[k].GROUP_ITEM_AMT,
                  };
                  newOne = false;
                }
              }
              if (newOne) {
                arr.push({
                  GROUP_NAME: g.ITEM_NAME,
                  GROUP_ITEM_TRH_N_ITEMS: g.ITEM_TRH_N_ITEMS,
                  GROUP_ITEM_TRH_N_QTY: g.ITEM_TRH_N_QTY,
                  GROUP_ITEM_ARD_G_KEYIN: g.ITEM_ARD_G_KEYIN,
                  GROUP_ITEM_ARD_TDSC_KEYINV: g.ITEM_ARD_TDSC_KEYINV,
                  GROUP_ITEM_AMT: g.ITEM_AMT,
                });
              }
            }
          }
          for (let i of arr) {
            SUM_TRH_N_QTY += i.GROUP_ITEM_TRH_N_ITEMS;
            SUM_TRH_N_ITEMS += i.GROUP_ITEM_TRH_N_QTY;
            SUM_ARD_G_KEYIN += i.GROUP_ITEM_ARD_G_KEYIN;
            SUM_ARD_TDSC_KEYINV += i.GROUP_ITEM_ARD_TDSC_KEYINV;
            SUM_AMT += i.GROUP_ITEM_AMT;
          }
          DATA = {
            ITEMS: FinalRESULT,
            SUMMARY_SECTION: {
              GROUP: arr,
              SUM_TRH_N_QTY: SUM_TRH_N_QTY,
              SUM_TRH_N_ITEMS: SUM_TRH_N_ITEMS,
              SUM_ARD_G_KEYIN: SUM_ARD_G_KEYIN,
              SUM_ARD_TDSC_KEYINV: SUM_ARD_TDSC_KEYINV,
              SUM_AMT: SUM_AMT,
            },
          };

          console.log('DATA =>> 2 ', JSON.stringify(DATA));
          if (DATA?.ITEMS?.length > 0) {
            dispatch({
              type: types.REPORT_GET_DATA_SUCCESS,
              payload: DATA,
            });
          } else if (DATA.ITEMS.length == 0) {
            dispatch({
              type: types.REPORT_SET_ERROR_MESSAGE,
              payload: 'ไม่พบข้อมูลรายงาน',
            });
          }
          resolve(DATA);
        } else {
          dispatch({
            type: types.REPORT_SET_ERROR_MESSAGE,
            payload: 'ไม่พบข้อมูลรายงาน',
          });
          resolve([]);
        }
      });
    }
    //  console.log(' RESULTRESULTRESULT ', JSON.stringify(FinalRESULT));
    if (pattern === 'A' || pattern === 'A') {
    } else if (pattern === 'B') {
      // if (uri === 'PeformanceByProductCategoryNew') {
      //   listItems = RESULT_DATA;
      // } else {
      //   const {RESULT} = RESULT_DATA.RPT_DATA;
      //   listItems = RESULT;
      // }
    } else if (pattern === 'D') {
      // const {RESULT} = RESULT_DATA;
      // listItems = RESULT;
    }

    // if (
    //   pattern === 'C' ||
    //   FinalRESULT.length > 0 ||
    //   (uri === 'PeformanceByProductCategoryNew' && FinalRESULT.length > 0)
    // ) {
    //   dispatch({
    //     type: types.REPORT_GET_DATA_SUCCESS,
    //     payload: FinalRESULT,
    //   });
    // } else if (
    //   uri === 'PeformanceByProductCategoryNew' &&
    //   FinalRESULT.length == 0
    // ) {
    //   dispatch({
    //     type: types.REPORT_SET_ERROR_MESSAGE,
    //     payload: 'ไม่พบข้อมูลรายงาน',
    //   });
    // } else if (FinalRESULT.length == 0) {
    //   dispatch({
    //     type: types.REPORT_SET_ERROR_MESSAGE,
    //     payload: 'ไม่พบข้อมูลรายงาน',
    //   });
    // }
    
    // Resolve เมื่อจบการทำงาน
    resolve(FinalRESULT);
    } catch (error) {
      console.log('getReportV3 error: ', error);
      reject(error?.message || error);
    }
  });
};

export const getReportName = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.GET_REPORT_NAME });
    GetReportNameApi()
      .then((v) => {
        console.log('getReportName v: ', v);
        const { RECORD_COUNT, GETREPORTNAME } = v;
        if (RECORD_COUNT > 0) {
          dispatch({
            type: types.GET_REPORT_NAME_SUCCESS,
            payload: GETREPORTNAME,
          });
        } else {
          dispatch({
            type: types.GET_REPORT_NAME_FAIL,
          });
          reject('ERROR getReportName');
        }
        resolve(v);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const GetPrintReport = (RPTSVR_GUID, FROMDATE, TODATE) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.GET_PRINT_REPORT });
    const data = { RPTSVR_GUID, FROMDATE, TODATE };

    GetPrintReportApi(data)
      .then((v) => {
        console.log('GetPrintReport v', v);
        const { RECORD_COUNT, RPTQUE_GUID } = v;
        if (RECORD_COUNT > 0) {
          dispatch({
            type: types.GET_PRINT_REPORT_SUCCESS,
            payload: RPTQUE_GUID,
          });
        } else {
          dispatch({
            type: types.GET_PRINT_REPORT_FAIL,
          });
          reject('ERROR GetPrintReport');
        }
        resolve(v);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const getPrintStatus = (RPTQUE_GUID) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.GET_PRINT_STATUS });
    console.log('getPrintStatus RPTQUE_GUID', RPTQUE_GUID);
    GetPrintStatusApi(RPTQUE_GUID)
      .then((v) => {
        const { RECORD_COUNT, GETPRINTSTATUS } = v;
        console.log('getPrintStatus v', v);
        if (RECORD_COUNT > 0) {
          const { RPTQUE_RSLT_STATUS, SYSLKUP_T_DESC } = GETPRINTSTATUS[0];
          if (RPTQUE_RSLT_STATUS == 0) {
            // dispatch({type: types.GET_PRINT_STATUS});
            resolve(GETPRINTSTATUS[0]);
          } else if (RPTQUE_RSLT_STATUS == 1) {
            dispatch({
              type: types.GET_PRINT_STATUS_SUCCESS,
              payload: GETPRINTSTATUS[0],
            });
            resolve(GETPRINTSTATUS[0]);
          } else {
            dispatch({
              type: types.GET_PRINT_STATUS_FAIL,
            });
            resolve(GETPRINTSTATUS[0]);
          }
        } else {
          dispatch({
            type: types.GET_PRINT_STATUS_FAIL,
          });
          resolve(v.ResponseData);
        }
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const downloadReport = (data) => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    let base64 = null;
    let dirs = RNFetchBlob.fs.dirs.DocumentDir;
    const LoginGUID = await getLoginGuID();
    await RNFetchBlob.config({
      path: dirs + `/${data.RPTQUE_GUID}`,
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      mime: 'file/pdf',

      description: `${data.RPTQUE_GUID}.pdf`,
    })
      .fetch('GET', API_ENDPOINT_V3 + '/DownloadFile', {
        'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
        'BPAPUS-GUID': LoginGUID,
        FilePath: '',
        FileName: data.RPTQUE_RSLT_PATH,
      })
      .then((res) => {
        base64 = res.path();
        RNFetchBlob.android.actionViewIntent(base64, 'application/pdf');
        console.log(true);
        dispatch({
          type: types.GET_DOWNLOAD_SUCCESS,
        });
        resolve(true);
      })
      .catch((error) => {
        console.error('fetchActivityImg: ' + error);
        console.log(false);
        resolve(false);
      });
  });
};
