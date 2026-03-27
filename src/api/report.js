import Request from '../utils/Request';
import {
  lookupErpV3Api,
  parseResDataToJson,
  updateErpV3Api,
  RptServerErpV3Api,
  executiveErpV3Api,
} from './bPlusApi';
import {getLoginGuID, getUserToken , getSettingConfig} from '../utils/Token';
import moment from 'moment';
import {
  BPAPUS_FUNCTION_BK_CODE,
  GET_SELL_ORDER_DOC_INFO,
  GET_INVOICE_DOC_INFO,
  BPAPUS_FUNCTION_DM_CODE,
  GET_PRINT_REPORT,
  GET_REPORT_NAME,
  GET_PRINT_STATUS,
  GET_RECEIVE_DOC_INFO,
  GET_OTHER_DOC_INFO,
  BPAPUS_FUNCTION_V_CODE,
} from '../constant/bPlusApi';
import {BPAPUS_BPAPSV, RPTSVR_GRANT, REPORT_REQUEST_TIMEOUT_MS} from '../../appConfig';


export const LookupErpBookAPi = (vanCNF, fromDate, toDate) => {
  return new Promise(async (resolve, reject) => {
    const LoginGUID = await getLoginGuID();
    const userToken = await getUserToken();
    const RequestBody = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': BPAPUS_FUNCTION_BK_CODE,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER':
        "and CONVERT(DATETIME, DI_DATE)  BETWEEN  CONVERT(DATETIME,'" +
        fromDate +
        "') and (CONVERT(DATETIME,'" +
        toDate +
        "' ))" +
        "and (DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_CASHSALES_DT +
        "' or DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_INV_DT +
        "' or DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_CASHRTN_DT +
        "' or DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_RTN_DT +
        "' or DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_BOOK_DT +
        "' or DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_TRANSFER_DT +
        "' or DT_KEY = '" +
        // userToken.VANCONFIG?.VANCNF_SKUCOUNT_DT +
        // "' or DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_QUOTE_DT +
        "')",
      'BPAPUS-ORDERBY': 'order by DI_DATE desc',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    console.log('[LookupErpBookAPi]');
    lookupErpV3Api(RequestBody)
      .then((v) => {
        const {ReasonString, ResponseCode, ResponseData} = v.data;
        if (ResponseCode == 200) {
          const response = parseResDataToJson(v.data);

          resolve(response.Oe002304);
        } else {
          reject(ResponseCode + ReasonString);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const LookupErpCashSaleAPi = (vanCNF, fromDate, toDate,uri) => {
  return new Promise(async (resolve, reject) => {
    try {
      const LoginGUID = await getLoginGuID();
      const userToken = await getUserToken();

      // ตรวจสอบว่า userToken และ VANCONFIG มีค่าหรือไม่
      if (!userToken || !userToken.VANCONFIG) {
        console.log('LookupErpCashSaleAPi: userToken or VANCONFIG is not available');
        resolve([]);
        return;
      }

      let retDT = ''

      console.log('[LookupErpCashSaleAPi]');


 switch (uri) {
   case "SalesOrderByCategory":
   case "SalesOrderByProduct":
   case "SalesOrderByArline":
      retDT =  " and (DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_CASHSALES_DT +
        "' or DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_INV_DT +
        "' or DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_CASHRTN_DT +
        "' or DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_RTN_DT +
       
        "')";
     break;

   case "SalesOrderByDocType":
   case "DocumentItemsDetails":
   case "DocumentItems":
      retDT =  " and (DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_CASHSALES_DT +
        "' or DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_INV_DT +
        "' or DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_CASHRTN_DT +
        "' or DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_RTN_DT +
        "' or DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_BOOK_DT +
        "' or DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_QUOTE_DT +
        "')";
     break;  
   default:
     retDT =  " and (DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_CASHSALES_DT +
        "' or DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_INV_DT +
        "' or DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_CASHRTN_DT +
        "' or DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_RTN_DT +
        "' or DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_BOOK_DT +
        "' or DT_KEY = '" +
        userToken.VANCONFIG?.VANCNF_QUOTE_DT +
        "')";
     break;

 };


    const RequestBody = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': BPAPUS_FUNCTION_DM_CODE,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER':
        "and CONVERT(DATETIME, DI_DATE)  BETWEEN  CONVERT(DATETIME,'" +
        fromDate +
        "') and (CONVERT(DATETIME,'" +
        toDate +
        "' ))" +
        retDT,
      'BPAPUS-ORDERBY': 'order by DI_DATE desc',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    lookupErpV3Api(RequestBody)
      .then((v) => {
        const {ReasonString, ResponseCode, ResponseData} = v.data;
        if (ResponseCode == 200) {
          const response = parseResDataToJson(v.data);

  // for (let obj2 of response.Oe001304) {
  //   obj2.DI_AMOUNT = -1 * obj2.DI_AMOUNT
  // }

  //       console.log('response.Oe001304' , response.Oe001304);


          resolve(response.Oe001304);
        } else {
          reject(ResponseCode + ReasonString);
        }
      })
      .catch((err) => {
        reject(err);
      });
    } catch (err) {
      console.log('LookupErpCashSaleAPi unexpected error: ', err);
      reject(err);
    }
  });
};

export const UpdateErpGetSellOrderDocInfoAPi = (DI_KEY) => {
  return new Promise(async (resolve, reject) => {
    const LoginGUID = await getLoginGuID();
    const RequestBody = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': GET_SELL_ORDER_DOC_INFO,
      'BPAPUS-PARAM': '{\r\n    "DI_KEY": "' + DI_KEY + '"\r\n}',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    //console.log('UpdateErpGetSellOrderDocInfoAPi RequestBody', RequestBody);
    updateErpV3Api(RequestBody)
      .then((v) => {
        
        const {ReasonString, ResponseCode, ResponseData} = v.data;
        if (ResponseCode == 200) {
          const response = parseResDataToJson(v.data);
          if (response && parseInt(response.RECORD_COUNT) > 0) {
            resolve(response);
          } else {
            resolve([]);
          }
        } else {
          reject(ResponseCode + ReasonString);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const UpdateErpGetOtherDocInfoAPi = (DI_KEY) => {
  return new Promise(async (resolve, reject) => {
    const LoginGUID = await getLoginGuID();
    const RequestBody = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': GET_OTHER_DOC_INFO,
      'BPAPUS-PARAM': '{\r\n    "DI_KEY": "' + DI_KEY + '"\r\n}',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    //console.log('UpdateErpGetSellOrderDocInfoAPi RequestBody', RequestBody);
    updateErpV3Api(RequestBody)
      .then((v) => {
        const {ReasonString, ResponseCode, ResponseData} = v.data;
        if (ResponseCode == 200) {
          const response = parseResDataToJson(v.data);
          if (response && parseInt(response.RECORD_COUNT) > 0) {
            resolve(response);
          } else {
            resolve([]);
          }
        } else {
          reject(ResponseCode + ReasonString);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const UpdateErpGetInvoiceOrderDocInfoAPi = (DI_KEY) => {
  return new Promise(async (resolve, reject) => {
    const LoginGUID = await getLoginGuID();
    const RequestBody = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': GET_INVOICE_DOC_INFO,
      'BPAPUS-PARAM': '{\r\n    "DI_KEY": "' + DI_KEY + '"\r\n}',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    console.log('[UpdateErpGetInvoiceOrderDocInfoAPi]');
    updateErpV3Api(RequestBody)
      .then((v) => {
       // console.log(v.data);
        const {ReasonString, ResponseCode, ResponseData} = v.data;
        if (ResponseCode == 200) {
          const response = parseResDataToJson(v.data);

          if (response && parseInt(response.RECORD_COUNT) > 0) {
            resolve(response);
          } else {

            resolve([]);
          }
        } else {
          reject(ResponseCode + ReasonString);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const UpdateErpGetReceiveOrderDocInfoAPi = (DI_KEY) => {
  return new Promise(async (resolve, reject) => {
    const LoginGUID = await getLoginGuID();
    const RequestBody = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': GET_RECEIVE_DOC_INFO,
      'BPAPUS-PARAM': '{\r\n    "DI_KEY": "' + DI_KEY + '"\r\n}',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    //console.log('UpdateErpGetInvoiceOrderDocInfoAPi RequestBody', RequestBody);
    updateErpV3Api(RequestBody)
      .then((v) => {
        // console.log(v.data);
        const {ReasonString, ResponseCode, ResponseData} = v.data;
        if (ResponseCode == 200) {
          const response = parseResDataToJson(v.data);
          if (response && parseInt(response.RECORD_COUNT) > 0) {
            resolve(response);
          } else {
            resolve([]);
          }
        } else {
          reject(ResponseCode + ReasonString);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const GetReportNameApi = () => {
  return new Promise(async (resolve, reject) => {
    const LoginGUID = await getLoginGuID();
    const RequestBody = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': GET_REPORT_NAME,
      'BPAPUS-PARAM': '{\r\n    "RPTSVR_GRANT": "' + RPTSVR_GRANT + '"\r\n}',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    RptServerErpV3Api(RequestBody)
      .then((v) => {
        // console.log(v.data);
        const {ReasonString, ResponseCode, ResponseData} = v.data;
        if (ResponseCode == 200) {
          const response = parseResDataToJson(v.data);
          if (response && parseInt(response.RECORD_COUNT) > 0) {
            resolve(response);
          } else {
            resolve(ResponseCode + ReasonString);
          }
        } else {
          reject(ResponseCode + ReasonString);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const GetPrintReportApi = (data) => {
  return new Promise(async (resolve, reject) => {
    const LoginGUID = await getLoginGuID();
    const RequestBody = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': GET_PRINT_REPORT,
      'BPAPUS-PARAM':
        '{\r\n    "RPTSVR_GRANT": "' +
        RPTSVR_GRANT +
        '",\r\n    "RPTSVR_GUID": "' +
        data.RPTSVR_GUID +
        '",\r\n    "RPTQUE_RQST_FROMDATE": "' +
        data.FROMDATE +
        '",\r\n    "RPTQUE_RQST_TODATE": "' +
        data.TODATE +
        '",\r\n    "RPTQUE_RQST_OPTN": "",\r\n    "RPTQUE_RQST_PARAM": ""\r\n}',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    console.log('[GetPrintReportApi]');
    RptServerErpV3Api(RequestBody)
      .then((v) => {
        // console.log(v.data);
        const {ReasonString, ResponseCode, ResponseData} = v.data;
        if (ResponseCode == 200) {
          const response = parseResDataToJson(v.data);
          if (response && parseInt(response.RECORD_COUNT) > 0) {
            resolve(response);
          } else {
            resolve(ResponseCode + ReasonString);
          }
        } else {
          reject(ResponseCode + ReasonString);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const GetPrintStatusApi = (RPTQUE_GUID) => {
  return new Promise(async (resolve, reject) => {
    const LoginGUID = await getLoginGuID();
    const RequestBody = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': GET_PRINT_STATUS,
      'BPAPUS-PARAM': '{\r\n    "RPTQUE_GUID": "' + RPTQUE_GUID + '"\r\n}',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    console.log('[GetPrintStatusApi]');
    RptServerErpV3Api(RequestBody)
      .then((v) => {
        const {ReasonString, ResponseCode, ResponseData} = v.data;
        if (ResponseCode == 200) {
          const response = parseResDataToJson(v.data);
          if (response && parseInt(response.RECORD_COUNT) > 0) {
            resolve(response);
          } else {
            resolve(ResponseCode + ReasonString);
          }
        } else {
          reject(ResponseCode + ReasonString);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getSalesTargetApi = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const LoginGUID = await getLoginGuID();
      const config = await getSettingConfig();

      console.log('[getSalesTargetApi]');

      // ตรวจสอบว่า config มีค่าหรือไม่
      if (!config || !config.VANCONFIG) {
        console.log('getSalesTargetApi: config or VANCONFIG is not available');
        // Return empty result เมื่อไม่มี config
        resolve({
          RECORD_COUNT: '0',
          SHOWINCOMEBYVAN: []
        });
        return;
      }

      const RequestBody = {
        'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': 'SHOWINCOMEBYVAN',
        'BPAPUS-PARAM':
          '{\r\n    "FROM_DATE": "' +
          data.FROM +
          '",\r\n    "TO_DATE": "' +
          data.TO +
          '"\r\n}',
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      };
      executiveErpV3Api(RequestBody)
        .then((v) => {
          const {ReasonString, ResponseCode, ResponseData} = v.data;
          if (ResponseCode == 200) {
            const response = parseResDataToJson(v.data);
            if (response) {

            let api = null;
            let returnAmount = 0;

            console.log('รับคืนสินค้า');
                let dataObj1 = {
                  'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
                  'BPAPUS-LOGIN-GUID': LoginGUID,
                  'BPAPUS-FUNCTION': BPAPUS_FUNCTION_V_CODE,
                  'BPAPUS-PARAM': '',
                  'BPAPUS-FILTER':
                  " and CONVERT(DATETIME, DI_DATE)  BETWEEN  CONVERT(DATETIME,'" +
                  data.FROM.substring(0, 8) +
                  "') and (CONVERT(DATETIME,'" +
                  data.TO.substring(0, 8) +
                  "' ))" +
                  " and  DT_KEY = '" +
                  config.VANCONFIG.VANCNF_RTN_DT + 
                    "'",
                  'BPAPUS-ORDERBY': 'order by DI_REF desc',
                  'BPAPUS-OFFSET': '0',
                  'BPAPUS-FETCH': '',
                };

         console.log('[getSalesTargetApi] - รับคืนสินค้า');
         api = lookupErpV3Api(dataObj1);
         api.then(async (v) => {
           const {ResponseData,ResponseCode, ReasonString
           } = v.data;
           if (ResponseCode == 200) {
             let responseData = JSON.parse(ResponseData);
             for (let i = 0; i < (parseInt(responseData.RECORD_COUNT)); i++) {
               returnAmount += parseFloat(responseData.Oe000304[i].ARD_B_AMT);
             }


             //for (let j = 0; j < (response.SHOWINCOMEBYVAN); j++) 
             {
               for (const j in response.SHOWINCOMEBYVAN) {

            //  console.log('(response.SHOWINCOMEBYVAN[j].VANCNF_MACHINEqqq  ', response.SHOWINCOMEBYVAN[j].VANCNF_MACHINE );
            //  console.log('(response.SHOWINCOMEBYVAN[j].VANCNF_MACHINEqqq  ', config.VANCONFIG.VANCNF_MACHINE );




              if (response.SHOWINCOMEBYVAN[j].VANCNF_MACHINE == config.VANCONFIG.VANCNF_MACHINE ){

               response.SHOWINCOMEBYVAN[j].SHOWAMOUNT = (parseFloat(response.SHOWINCOMEBYVAN[j].SHOWAMOUNT) - ( 2 * parseFloat(returnAmount)));
               //response.SHOWINCOMEBYVAN[j].SHOWAMOUNT = (parseFloat(response.SHOWINCOMEBYVAN[j].SHOWAMOUNT) - 0);

               //console.log('response  SHOWINCOMEBYVAN 1 >> ', response);
               //Bazz
               //console.log('response  response>> ', response);
               }
               }
             }
           }

           // resolve ไม่ว่า ResponseCode จะเป็นอะไรก็ตาม
           resolve(response);       
         }).catch((err) => {
           // handle error จาก lookupErpV3Api
           // resolve แทน reject เพื่อไม่ให้ modal ค้าง - ใช้ข้อมูลเดิมโดยไม่หักรับคืน
           resolve(response);
         });

            } else {
              // response เป็น null/undefined
              resolve({
                RECORD_COUNT: '0',
                SHOWINCOMEBYVAN: []
              });
            }
          } else {
            reject(ResponseCode + ReasonString);
          }
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      console.log('getSalesTargetApi unexpected error: ', err);
      reject(err);
    }
  });
};

export const getReportDataApi = (uri, data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Report/${uri}`, data, {timeout: REPORT_REQUEST_TIMEOUT_MS})
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getReportDataNoGroupApi = (uri, data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Report/${uri}/nogroup`, data, {timeout: REPORT_REQUEST_TIMEOUT_MS})
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
