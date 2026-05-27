import Request from '../utils/Request';
import { getSettingConfig, getUserToken, getLoginGuID } from '../utils/Token';
import { registerV3Api } from '../api/user';
import { readErpV3Api, updateErpV3Api } from '../api/customer';
import * as appConfig from '../../appConfig';
import moment from 'moment';
import { BPAPUS_FUNCTION_DP_CODE } from '../constant/bPlusApi';

import { lookupErpV3Api } from '../api/bPlusApi';

const logLookupRequestSummary = (label, bodyRequest, extra = {}) => {
  console.log(label, {
    functionName: bodyRequest['BPAPUS-FUNCTION'],
    offset: bodyRequest['BPAPUS-OFFSET'],
    fetch: bodyRequest['BPAPUS-FETCH'],
    filter: bodyRequest['BPAPUS-FILTER'],
    ...extra,
  });
};

const logLookupResponseSummary = (label, response) => {
  try {
    const payload = response?.data ?? response;
    const parsedResponseData = payload?.ResponseData
      ? JSON.parse(payload.ResponseData)
      : null;
    const dataKey = parsedResponseData
      ? Object.keys(parsedResponseData).find(
          key =>
            Array.isArray(parsedResponseData[key]) &&
            !['RECORD_COUNT', 'OFFSET', 'FETCH'].includes(key),
        )
      : null;
    const items = dataKey ? parsedResponseData[dataKey] : [];

    console.log(label, {
      responseCode: payload?.ResponseCode,
      reason: payload?.ReasonString,
      recordCount: parsedResponseData?.RECORD_COUNT,
      offset: parsedResponseData?.OFFSET,
      fetch: parsedResponseData?.FETCH,
      dataKey,
      sampleItems: Array.isArray(items)
        ? items.slice(0, 3).map(item => ({
            GOODS_CODE: item.GOODS_CODE,
            SKU_CODE: item.SKU_CODE,
            SKU_NAME: item.SKU_NAME,
            UTQ_NAME: item.UTQ_NAME,
          }))
        : [],
    });
  } catch (error) {
    console.log(label, {
      error: 'FAILED_TO_PARSE_RESPONSE',
      message: error?.message,
    });
  }
};

export const productSearchListApi = criteria => {
  return new Promise((resolve, reject) => {
    Request.instance
      .get(`/Goods?${criteria}`)
      .then(v => {
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const productSkuSearchListApi = criteria => {
  return new Promise((resolve, reject) => {
    Request.instance
      .get(`/Sku?${criteria}`)
      .then(v => {
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const processOrderItemApi = (id, data) => {
  console.log('processOrderItemApi ', data);
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/Process/Item/${id}`, data)
      .then(v => {
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const processOrderItemV3Api = async data => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/UpdateErp', data)
      .then(v => {
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const processOrderTransferApi = (id, data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/Process/Item/Transfer/${id}`, data)
      .then(v => {
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const productSearchByGoodCodeApi = (code, ARCODE, isTransfer) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .get(`/Goods/${code}?ARCODE=${ARCODE}&isTransfer=${isTransfer}`)
      .then(v => {
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const productSkuAltSearchListApi = criteria => {
  return new Promise((resolve, reject) => {
    Request.instance
      .get(`/Goods/GetGoodSkuAltItems/?${criteria}`)
      .then(v => {
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const getVanArprbCodeApi = async (AR_KEY, VANCONFIG) => {
  console.log('getVanArprbCodeApi AR_KEY ', AR_KEY);
  const LoginGUID = await getLoginGuID();
  let wl_code = [];
  let ARPRB_CODE = 0;

  console.log('VANCONFIG.VANCNF_ARPRB_MODE >>> ', VANCONFIG.VANCNF_ARPRB_MODE);
  console.log('VANCONFIG.VANCNF_ARPRB >>> ', VANCONFIG.VANCNF_ARPRB);
  console.log('VANCONFIG.VANCNF_SKU_LIMIT >>> ', VANCONFIG.VANCNF_SKU_LIMIT);

  if (
    VANCONFIG.VANCNF_ARPRB_MODE == 0 ||
    (VANCONFIG.VANCNF_ARPRB_MODE == 1 && AR_KEY === undefined)
  ) {
    //VANCONFIG.ANCNF_ARPRB_MODE == 0 ตามตารางราคาขายที่กำหนด
    const bodyRequest2 = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': 'READARPRBCODEBYARPRBKEY',
      'BPAPUS-PARAM':
        '{\r\n    "ARPRB_KEY": "' + VANCONFIG.VANCNF_ARPRB + '"\r\n}',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    // console.log('productSearchListV3Api bodyRequest2 ', bodyRequest2);
    await readErpV3Api(bodyRequest2).then(async z => {
      // console.log('productSearchListV3Api bodyRequest2 ', z);

      let responseData2 = JSON.parse(z.ResponseData);
      if (z.ResponseCode == 200 && parseInt(responseData2.RECORD_COUNT) > 0) {
        ARPRB_CODE =
          responseData2.READARPRBCODEBYARPRBKEY[0].ARPRB_CODE == ''
            ? 0
            : responseData2.READARPRBCODEBYARPRBKEY[0].ARPRB_CODE;
      }
    });
    //ARPRB_CODE = VANCONFIG.VANCNF_ARPRB;
  } else if (VANCONFIG.VANCNF_ARPRB_MODE == 1) {
    //VANCONFIG.ANCNF_ARPRB_MODE == 1 ตามตารางราคาขายในข้อตกลงหลักของลูกค้า
    // param = '{\r\n    "ARPRB_KEY": "' + VANCONFIG.VANCNF_ARPRB + '"\r\n}';

    // if (AR_KEY === undefined)
    //   {
    //     let dataObj2 = {
    //       'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
    //       'BPAPUS-LOGIN-GUID': LoginGUID,
    //       'BPAPUS-FUNCTION': BPAPUS_FUNCTION_DP_CODE,
    //       'BPAPUS-PARAM': '',
    //       'BPAPUS-FILTER': "and VANCNF_KEY = '" + VANCONFIG.VANCNF_KEY + "'",
    //       'BPAPUS-ORDERBY': '',
    //       'BPAPUS-OFFSET': '0',
    //       'BPAPUS-FETCH': '0',
    //     };

    //     console.log(' await lookupErpV3Api(dataObj2)', dataObj2);

    //     await lookupErpV3Api(dataObj2).then((v) => {
    //       const { ResponseData, ResponseCode, ReasonString } = v.data;
    //       console.log(' lookupErpV3Api ResponseCode', ResponseCode);

    //       if (ResponseCode == 200) {
    //          console.log(JSON.parse(ResponseData));
    //         let responseData = JSON.parse(ResponseData);

    //         for (let i = 0; i < (parseInt(responseData.RECORD_COUNT)); i++) {
    //           if (VANCONFIG.VANCNF_ENQ_WL == 1) {
    //             wl_code.push(responseData.Vans0106[i].WL_CODE);
    //           } else if (VANCONFIG.VANCNF_ENQ_WL == 2) {
    //             if (VANCONFIG.VANCNF_WL == responseData.Vans0106[i].WL_KEY) {
    //               wl_code.push(responseData.Vans0106[i].WL_CODE);
    //             }
    //           }
    //         };

    //       } else {
    //         console.log('ERROR lookupErpV3Api Vans0106', ReasonString);
    //       }
    //     }).catch((err) => {
    //       console.log('ERROR lookupErpV3Api', err);
    //     });
    //   }

    //     ARPRB_CODE = wl_code;

    console.log('VANCONFIG.VANCNF_ARPRB_MODE == 1');
    const date = moment().format('YYYYMMDD');
    const bodyRequest2 = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': 'READARCDBYARKEY',
      'BPAPUS-PARAM':
        '{\r\n    "AR_KEY": "' +
        AR_KEY +
        '",\r\n    "ARCD_DATE": "' +
        date +
        '",\r\n    "ARCD_DEFAULT": "Y"\r\n}',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    console.log('productSearchListV3Api bodyRequest2 ', bodyRequest2);
    await readErpV3Api(bodyRequest2).then(async y => {
      console.log('productSearchListV3Api bodyRequest2 ', y);
      let responseData2 = JSON.parse(y.ResponseData);
      if (y.ResponseCode == 200 && parseInt(responseData2.RECORD_COUNT) > 0) {
        // console.log(
        //   'productSearchListV3Api responseData2.READARCDBYARKEY[0] ',
        //   responseData2.READARCDBYARKEY[0],
        // );
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
            console.log('productSearchListV3Api responseData3 ', responseData3);
            ARPRB_CODE =
              responseData3.ARPRB_CODE == '' ? 0 : responseData3.ARPRB_CODE;
          }
        });
      }
    });
  }
  return ARPRB_CODE;
};

export const productSearchListV3Api = async (
  GOODS_CODE,
  ARPRB_CODE,
  criteria,
) => {
  console.log('productSearchListV3Api');
  const LoginGUID = await getLoginGuID();
  //const KEYWORD = "and SKU_CODE = '" + skuCode + "' ";
  const LIMIT = JSON.stringify(criteria.LIMIT);
  const OFFSET = 0; //JSON.stringify(criteria.OFFSET);

  const ICDEPT_THAIDESC = criteria.ICDEPT_THAIDESC
    ? "and ICCAT_NAME = '" + criteria.ICDEPT_THAIDESC + "'"
    : '';

  // const KEYWORD = criteria.KEYWORD
  //   ? "and (SKU_NAME like '%" +
  //     criteria.KEYWORD +
  //      "%' or GOODS_CODE like '%" +
  //     criteria.KEYWORD +
  //     "%')"
  //   : '';

  const KEYWORD = criteria.KEYWORD
    ? ' and (' +
      criteria.KEYWORD.trim()
        .split(/\s+/)
        .map(
          word => ` (SKU_NAME like '%${word}%' OR GOODS_CODE like '%${word}%')`,
        )
        .join(' AND ') +
      ')'
    : '';

  const bodyRequest = {
    'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': LoginGUID,
    'BPAPUS-FUNCTION': 'ShowGoodsInfo',
    'BPAPUS-PARAM':
      '{\r\n    "GOODS_CODE": "' +
      GOODS_CODE +
      '",\r\n    "ARPRB_CODE": "' +
      ARPRB_CODE +
      '"\r\n}',
    'BPAPUS-FILTER': KEYWORD + ICDEPT_THAIDESC,
    'BPAPUS-ORDERBY': '',
    'BPAPUS-OFFSET': OFFSET.toString(),
    //'BPAPUS-OFFSET': "0",
    'BPAPUS-FETCH': LIMIT.toString(),
  };
  // console.log(
  //   'productSearchListV3Api last bodyRequest',
  //   JSON.stringify(bodyRequest),
  // );
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/ShowPrice', bodyRequest)
      .then(v => {
        console.log('productSearchListV3Api last v.data', v.data);
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const productSearchListV3Api_bk = async (
  GOODS_CODE,
  ARPRB_CODE,
  criteria,
) => {
  console.log('productSearchListV3Api_bk');
  const LoginGUID = await getLoginGuID();
  //const KEYWORD = "and SKU_CODE = '" + skuCode + "' ";
  const LIMIT = JSON.stringify(criteria.LIMIT);
  const OFFSET = 0; //JSON.stringify(criteria.OFFSET);

  const ICDEPT_THAIDESC = criteria.ICDEPT_THAIDESC
    ? "and ICCAT_NAME = '" + criteria.ICDEPT_THAIDESC + "'"
    : '';

  // const KEYWORD = criteria.KEYWORD
  //   ? "and (SKU_NAME like '%" +
  //     criteria.KEYWORD +
  //      "%' or GOODS_CODE like '%" +
  //     criteria.KEYWORD +
  //     "%')"
  //   : '';

  const KEYWORD = criteria.KEYWORD
    ? ' and (' +
      criteria.KEYWORD.trim()
        .split(/\s+/)
        .map(
          word => ` (SKU_NAME like '%${word}%' OR GOODS_CODE like '%${word}%')`,
        )
        .join(' AND ') +
      ')'
    : '';

  const bodyRequest = {
    'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': LoginGUID,
    'BPAPUS-FUNCTION': 'ShowGoodsInfo',
    'BPAPUS-PARAM':
      '{\r\n    "GOODS_CODE": "' +
      GOODS_CODE +
      '",\r\n    "ARPRB_CODE": "' +
      ARPRB_CODE +
      '"\r\n}',
    'BPAPUS-FILTER': KEYWORD + ICDEPT_THAIDESC,
    'BPAPUS-ORDERBY': '',
    'BPAPUS-OFFSET': OFFSET.toString(),
    //'BPAPUS-OFFSET': "0",
    'BPAPUS-FETCH': LIMIT.toString(),
  };
  // console.log(
  //   'productSearchListV3Api last bodyRequest',
  //   JSON.stringify(bodyRequest),
  // );
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/ShowPrice', bodyRequest)
      .then(v => {
        //       console.log(
        //   'productSearchListV3Api last v.data',
        //   v.data
        // );
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const productSearchShowRepack = async (
  GOODS_CODE,
  ARPRB_CODE,
  criteria,
) => {
  const LoginGUID = await getLoginGuID();
  //const KEYWORD = "and SKU_CODE = '" + skuCode + "' ";
  const LIMIT = JSON.stringify(criteria.LIMIT);
  const OFFSET = JSON.stringify(criteria.OFFSET);

  const ICDEPT_THAIDESC = criteria.ICDEPT_THAIDESC
    ? "and ICCAT_NAME = '" + criteria.ICDEPT_THAIDESC + "'"
    : '';

  // const KEYWORD = criteria.KEYWORD
  //   ? "and (SKU_NAME like '%" +
  //     criteria.KEYWORD +
  //      "%' or GOODS_CODE like '%" +
  //     criteria.KEYWORD +
  //     "%')"
  //   : '';

  const KEYWORD = criteria.KEYWORD
    ? ' and (' +
      criteria.KEYWORD.trim()
        .split(/\s+/)
        .map(
          word => ` (SKU_NAME like '%${word}%' OR GOODS_CODE like '%${word}%')`,
        )
        .join(' AND ') +
      ')'
    : '';

  console.log(
    'GOODS_CODE ARPRB_CODE,OFFSET,FETCH ',
    GOODS_CODE,
    ARPRB_CODE,
    OFFSET,
    LIMIT,
  );

  const bodyRequest = {
    'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': LoginGUID,
    'BPAPUS-FUNCTION': 'ShowRepack',
    'BPAPUS-PARAM':
      '{\r\n    "GOODS_CODE": "' +
      GOODS_CODE +
      '",\r\n    "ARPRB_CODE": "' +
      ARPRB_CODE +
      '"\r\n}',
    'BPAPUS-FILTER': KEYWORD + ICDEPT_THAIDESC,
    'BPAPUS-ORDERBY': '',
    'BPAPUS-OFFSET': '0', //OFFSET.toString(),
    'BPAPUS-FETCH': '0', // LIMIT.toString(),
  };
  console.log(
    'productSearchShowRepack last bodyRequest',
    JSON.stringify(bodyRequest),
  );
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/ShowPrice', bodyRequest)
      .then(v => {
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const productSearchListByVanV3Api = async criteria => {
  const LoginGUID = await getLoginGuID();
  const { VANCONFIG } = await getUserToken();
  //console.log('productSearchListByVanV3Api VANCONFIG ', VANCONFIG);
  const ICDEPT_KEY = criteria.ICDEPT_KEY
    ? "and SKU_ICCAT = '" + criteria.ICDEPT_KEY + "'"
    : '';
  // const KEYWORD = criteria.KEYWORD
  //   ? "and (SKU_CODE like '%" +
  //     criteria.KEYWORD.trim() +
  //     "%' or  SKU_NAME like '%" +
  //     criteria.KEYWORD.trim() +
  //     "%' or  GOODS_CODE like '%" +
  //     criteria.KEYWORD.trim() +
  //     "%') and VANCNF_MACHINE = '" +
  //     VANCONFIG.VANCNF_MACHINE +
  //     "'"
  //   : "and VANCNF_MACHINE = '" + VANCONFIG.VANCNF_MACHINE + "'";

  const KEYWORD = criteria.KEYWORD
    ? ' and (' +
      criteria.KEYWORD.trim()
        .split(/\s+/)
        .map(
          word =>
            ` (SKU_CODE like '%${word}%' OR SKU_NAME like '%${word}%' OR GOODS_CODE like '%${word}%')`,
        )
        .join(' AND ') +
      ')' +
      " and VANCNF_MACHINE = '" +
      VANCONFIG.VANCNF_MACHINE +
      "'"
    : "and VANCNF_MACHINE = '" + VANCONFIG.VANCNF_MACHINE + "'";

  let LIMIT = JSON.stringify(criteria.LIMIT);
  let OFFSET = JSON.stringify(criteria.OFFSET);

  //if (parseFloat(OFFSET) >= parseFloat(LIMIT)) { OFFSET = 0};

  const bodyRequest = {
    'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': LoginGUID,
    'BPAPUS-FUNCTION': 'Vans0105',
    'BPAPUS-PARAM': '',
    'BPAPUS-FILTER':
      KEYWORD + ICDEPT_KEY + " and ( SKU_ENABLE='Y') --and SKU_P_ENABLE='Y') ",
    'BPAPUS-ORDERBY': '',
    'BPAPUS-OFFSET': OFFSET,
    'BPAPUS-FETCH': LIMIT,
  };
  logLookupRequestSummary('productSearchListByVanV3Api REQUEST', bodyRequest, {
    keyword: criteria.KEYWORD,
    category: criteria.ICDEPT_KEY,
  });
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/LookupErp', bodyRequest)
      .then(v => {
        logLookupResponseSummary('productSearchListByVanV3Api RESPONSE', v);
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

// 89.หาราคาขายสินค้าในตารางราคา (Sp000221)
export const productSearchListByARPLUAPiBykey = async (
  ARPLU_ARPRB,
  criteria,
) => {
  const LoginGUID = await getLoginGuID();
  const { VANCONFIG } = await getUserToken();
  console.log('productSearchListByARPLUAPiBykey VANCONFIG ', VANCONFIG);
  const ICDEPT_KEY = criteria.ICDEPT_KEY
    ? "and SKU_ICCAT = '" + criteria.ICDEPT_KEY + "'"
    : '';
  // const KEYWORD = criteria.KEYWORD
  //   ? "and (SKU_CODE like '%" +
  //     criteria.KEYWORD.trim() +
  //     "%' or  SKU_NAME like '%" +
  //     criteria.KEYWORD.trim() +
  //     "%' or  GOODS_CODE like '%" +
  //     criteria.KEYWORD.trim() +
  //     "%') "
  //   : "";

  const KEYWORD = criteria.KEYWORD
    ? ' and (' +
      criteria.KEYWORD.trim()
        .split(/\s+/)
        .map(
          word =>
            ` (SKU_CODE like '%${word}%' OR SKU_NAME like '%${word}%' OR GOODS_CODE like '%${word}%')`,
        )
        .join(' AND ') +
      ')'
    : '';

  let LIMIT = JSON.stringify(criteria.LIMIT);
  let OFFSET = JSON.stringify(criteria.OFFSET);

  const bodyRequest = {
    'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': LoginGUID,
    'BPAPUS-FUNCTION': 'Sp000221',
    'BPAPUS-PARAM': '',
    'BPAPUS-FILTER':
      "and (ARPLU_ARPRB  = '" + ARPLU_ARPRB + "') " + KEYWORD + ICDEPT_KEY,
    'BPAPUS-ORDERBY': '',
    'BPAPUS-OFFSET': OFFSET,
    'BPAPUS-FETCH': LIMIT,
  };

  logLookupRequestSummary(
    'productSearchListByARPLUAPiBykey REQUEST',
    bodyRequest,
    {
      arpluArprb: ARPLU_ARPRB,
      keyword: criteria.KEYWORD,
      category: criteria.ICDEPT_KEY,
    },
  );
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/LookupErp', bodyRequest)
      .then(v => {
        logLookupResponseSummary(
          'productSearchListByARPLUAPiBykey RESPONSE',
          v,
        );
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

// 89.หาราคาขายสินค้าในตารางราคา (Sp000221)
export const productSearchListByARPLUAPiByCode = async (
  ARPRB_CODE,
  WL_CODE,
  criteria,
  allowNegativeStock = false,
) => {
  const LoginGUID = await getLoginGuID();
  const { VANCONFIG } = await getUserToken();
  console.log('productSearchListByARPLUAPiByCode VANCONFIG ', VANCONFIG);
  console.log(
    'productSearchListByARPLUAPiByCode allowNegativeStock=',
    allowNegativeStock,
  );
  const ICDEPT_KEY = criteria.ICDEPT_KEY
    ? "and SKU_ICCAT = '" + criteria.ICDEPT_KEY + "'"
    : '';

  const KEYWORD = criteria.KEYWORD
    ? ' and (' +
      criteria.KEYWORD.trim()
        .split(/\s+/)
        .map(
          word =>
            ` (SKU_CODE like '%${word}%' OR SKU_NAME like '%${word}%' OR GOODS_CODE like '%${word}%')`,
        )
        .join(' AND ') +
      ')'
    : '';

  let LIMIT = JSON.stringify(criteria.LIMIT);
  let OFFSET = JSON.stringify(criteria.OFFSET);

  const bodyRequest = {
    'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': LoginGUID,
    'BPAPUS-FUNCTION': 'Sp000221',
    'BPAPUS-PARAM': '',
    'BPAPUS-FILTER':
      "AND (ARPRB_CODE  = '" +
      ARPRB_CODE +
      "') AND SKU_KEY IN (SELECT SKM_SKU FROM SKUMOVE WHERE SKM_WL= '" +
      WL_CODE +
      "'  GROUP BY SKM_SKU" +
      (allowNegativeStock ? '' : ' HAVING SUM(SKM_QTY)>0') +
      ') ' +
      KEYWORD +
      ICDEPT_KEY,
    'BPAPUS-ORDERBY': '',
    'BPAPUS-OFFSET': OFFSET,
    'BPAPUS-FETCH': LIMIT,
  };

  logLookupRequestSummary(
    'productSearchListByARPLUAPiByCode REQUEST',
    bodyRequest,
    {
      arprbCode: ARPRB_CODE,
      warehouseCode: WL_CODE,
      keyword: criteria.KEYWORD,
      category: criteria.ICDEPT_KEY,
    },
  );
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/LookupErp', bodyRequest)
      .then(v => {
        logLookupResponseSummary(
          'productSearchListByARPLUAPiByCode RESPONSE',
          v,
        );
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

// 89.หาราคาขายสินค้าในตารางราคา (Sp000221)
export const productSearchListByARPLUAPiByCodeAndWHIS1 = async (
  ARPRB_CODE,
  WL_CODE,
  criteria,
) => {
  const LoginGUID = await getLoginGuID();
  const { VANCONFIG } = await getUserToken();
  //console.log('productSearchListByARPLUAPiByCode VANCONFIG ', VANCONFIG);
  const ICDEPT_KEY = criteria.ICDEPT_KEY
    ? "and SKU_ICCAT = '" + criteria.ICDEPT_KEY + "'"
    : '';

  const KEYWORD = criteria.KEYWORD
    ? ' and (' +
      criteria.KEYWORD.trim()
        .split(/\s+/)
        .map(
          word =>
            ` (SKU_CODE like '%${word}%' OR SKU_NAME like '%${word}%' OR GOODS_CODE like '%${word}%')`,
        )
        .join(' AND ') +
      ')'
    : '';

  let LIMIT = JSON.stringify(criteria.LIMIT);
  let OFFSET = JSON.stringify(criteria.OFFSET);
  let filter =
    ' AND ( ' +
    " (ARPRB_CODE  = '" +
    ARPRB_CODE +
    "') AND " +
    ' SKU_KEY IN (SELECT SKM_SKU FROM SKUMOVE WHERE SKM_WL IN (' +
    WL_CODE.map(code => `'${code}'`).join(', ') +
    ')  GROUP BY SKM_SKU HAVING SUM(SKM_QTY)>0)) ' +
    KEYWORD +
    ICDEPT_KEY;
  const bodyRequest = {
    'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': LoginGUID,
    'BPAPUS-FUNCTION': 'Sp000221',
    'BPAPUS-PARAM': '',
    'BPAPUS-FILTER': filter,
    'BPAPUS-ORDERBY': ' ORDER BY SKU_CODE ASC ',
    'BPAPUS-OFFSET': OFFSET,
    'BPAPUS-FETCH': LIMIT,
  };

  logLookupRequestSummary(
    'productSearchListByARPLUAPiByCodeAndWHIS1 REQUEST',
    bodyRequest,
    {
      arprbCode: ARPRB_CODE,
      warehouseKeys: WL_CODE,
      keyword: criteria.KEYWORD,
      category: criteria.ICDEPT_KEY,
    },
  );
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/LookupErp', bodyRequest)
      .then(v => {
        logLookupResponseSummary(
          'productSearchListByARPLUAPiByCodeAndWHIS1 RESPONSE',
          v,
        );
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

// Bazzz 20230330
// ใบโอนย้าย + ใบเสนอราคา
export const productSearchOtherListByVanV3Api = async criteria => {
  //จำกัดรหัสสินค้าตามใบโอนย้ายล่าสุด

  const RequestBody = {
    'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': LoginGUID,
    'BPAPUS-FUNCTION': BPAPUS_FUNCTION_DM_CODE,
    'BPAPUS-PARAM': '',
    'BPAPUS-FILTER': "and DT_KEY = '" + VANCONFIG.VANCNF_TRANSFER_DT + "'",
    'BPAPUS-ORDERBY': 'order by DI_DATE desc',
    'BPAPUS-OFFSET': '0',
    'BPAPUS-FETCH': '0',
  };
  await lookupErpV3Api(RequestBody)
    .then(async v => {
      const { ReasonString, ResponseCode, ResponseData } = v.data;
      const { Oe001304, RECORD_COUNT } = parseResDataToJson(v.data);
      if (ResponseCode == 200 && parseInt(RECORD_COUNT) > 0) {
        for (let i of Oe001304) {
          const ReqBody = {
            'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
            'BPAPUS-LOGIN-GUID': LoginGUID,
            'BPAPUS-FUNCTION': GET_OTHER_DOC_INFO,
            'BPAPUS-PARAM': '{\r\n    "DI_KEY": "' + i.DI_KEY + '"\r\n}',
            'BPAPUS-FILTER': '',
            'BPAPUS-ORDERBY': '',
            'BPAPUS-OFFSET': '0',
            'BPAPUS-FETCH': '0',
          };

          await updateErpV3Api(ReqBody)
            .then(async res => {
              const { ReasonString, ResponseCode } = res.data;
              const { DOCINFO, TRANSTKD, RECORD_COUNT } = parseResDataToJson(
                res.data,
              );

              if (
                ResponseCode == 200 &&
                parseInt(RECORD_COUNT) > 0 &&
                TRANSTKD.length > 0
              ) {
                for (let j of TRANSTKD) {
                  if (j.TRD_TO_WL == VANCONFIG.VANCNF_WL)
                    console.log('dataObj2', 2);

                  const dataObj2 = {
                    'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
                    'BPAPUS-LOGIN-GUID': LoginGUID,
                    'BPAPUS-FUNCTION': BPAPUS_FUNCTION_WH_CODE,
                    'BPAPUS-PARAM': '',
                    'BPAPUS-FILTER':
                      "and WL_KEY = '" + VANCONFIG.VANCNF_WL + "'",
                    'BPAPUS-ORDERBY': '',
                    'BPAPUS-OFFSET': '0',
                    'BPAPUS-FETCH': '0',
                  };

                  let WL_CODE = null;
                  let good_inVan_qty = 0;

                  await lookupErpV3Api(dataObj2)
                    .then(v => {
                      const { ResponseData, ResponseCode, ReasonString } =
                        v.data;
                      if (ResponseCode == 200) {
                        // console.log(JSON.parse(ResponseData));
                        // console.log('dataObj4', ResponseData);
                        let responseData = JSON.parse(ResponseData);
                        WL_CODE = responseData.Wh000220
                          ? responseData.Wh000220[0].WL_CODE
                          : null;
                      } else {
                        console.log('ERROR lookupErpV3Api', ReasonString);
                      }
                    })
                    .catch(err => {
                      console.log('ERROR lookupErpV3Api', err);
                    });
                  console.log('WL_CODE ===> ', WL_CODE);
                  await getWareLocationStockBalance(
                    j.GOODS_CODE,
                    VANCONFIG,
                  ).then(v => {
                    const { ReasonString, ResponseCode, ResponseData } = v;
                    //console.log('getDropPointListItems ', v);
                    let responseData = JSON.parse(ResponseData);
                    if (ResponseCode == 200) {
                      console.log(
                        'jkdfjsdjfkdkf 4==== ',
                        JSON.stringify(responseData),
                      );

                      for (let obj of responseData.ShowSkuBalance) {
                        if (obj.WL_CODE == WL_CODE) {
                          good_inVan_qty = obj.QTY;
                        }
                      }
                    }
                  });

                  console.log('good_inVan_qty ==== 3 ', good_inVan_qty);

                  {
                    await productSearchListV3Api(
                      j.GOODS_CODE,
                      ARPRB_CODE,
                      criteria,
                    ).then(k => {
                      console.log('kkkkkkkkkk1 ', JSON.stringify(k));
                      let responseData2 = JSON.parse(k.ResponseData);
                      if (k.ResponseCode == 200) {
                        if (
                          responseData2 &&
                          responseData2.GoodsInfo.length > 0
                        ) {
                          if (
                            responseData2.GoodsInfo[0].ARPLU_U_PRC &&
                            responseData2.GoodsInfo[0].ARPLU_U_PRC != ''
                          ) {
                            let temp = responseData2.GoodsInfo[0];
                            temp.ARPLU_U_PRC = parseFloat(
                              responseData2.GoodsInfo[0].ARPLU_U_PRC,
                            );
                            temp.ARPRB_CODE = parseFloat(
                              responseData2.GoodsInfo[0].ARPRB_CODE,
                            );
                            temp.SKU_KEY = parseFloat(
                              responseData2.GoodsInfo[0].SKU_KEY,
                            );
                            temp.UTQ_QTY = parseFloat(
                              responseData2.GoodsInfo[0].UTQ_QTY,
                            );
                            temp.SKU_SKUALT = parseFloat(
                              responseData2.GoodsInfo[0].SKU_SKUALT,
                            );
                            temp.SKU_ICCAT = parseFloat(
                              responseData2.GoodsInfo[0].SKU_ICCAT,
                            );
                            temp.SKU_BRN = parseFloat(
                              responseData2.GoodsInfo[0].SKU_BRN,
                            );
                            temp.SKU_ICCOLOR = parseFloat(
                              responseData2.GoodsInfo[0].SKU_ICCOLOR,
                            );
                            temp.SKU_ICSIZE = parseFloat(
                              responseData2.GoodsInfo[0].SKU_ICSIZE,
                            );
                            temp.SKU_ICDEPT = parseFloat(
                              responseData2.GoodsInfo[0].SKU_ICDEPT,
                            );
                            temp.UTQ_KEY = parseFloat(
                              responseData2.GoodsInfo[0].UTQ_KEY,
                            );
                            temp.good_inVan_qty = parseFloat(good_inVan_qty);

                            console.log('temp1 ', JSON.stringify(temp));
                            Response.push(temp);
                          }
                        } else {
                          dispatch({
                            type: types.PRODUCT_SEARCH_LIST_SUCCESS,
                            payload: [],
                          });
                        }
                      } else {
                        dispatch({ type: types.PRODUCT_SEARCH_LIST_FAIL });
                      }
                    });
                  }
                }
              } else {
                dispatch({
                  type: types.PRODUCT_SEARCH_LIST_SUCCESS,
                  payload: [],
                });
              }
            })
            .catch(err => {
              dispatch({ type: types.PRODUCT_SEARCH_LIST_FAIL });
            });
        }
      } else {
        dispatch({
          type: types.PRODUCT_SEARCH_LIST_SUCCESS,
          payload: [],
        });
      }
    })
    .catch(err => {
      dispatch({ type: types.PRODUCT_SEARCH_LIST_FAIL });
    });
};

// Bazzz 20230330
// ใบโอนย้าย + ใบเสนอราคา
export const productSearchOtherListByVanV3Api_BK2 = async criteria => {
  //จำกัดรหัสสินค้าตามใบโอนย้ายล่าสุด

  const RequestBody = {
    'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': LoginGUID,
    'BPAPUS-FUNCTION': BPAPUS_FUNCTION_DM_CODE,
    'BPAPUS-PARAM': '',
    'BPAPUS-FILTER': "and DT_KEY = '" + VANCONFIG.VANCNF_TRANSFER_DT + "'",
    'BPAPUS-ORDERBY': 'order by DI_DATE desc',
    'BPAPUS-OFFSET': '0',
    'BPAPUS-FETCH': '0',
  };
  await lookupErpV3Api(RequestBody)
    .then(async v => {
      const { ReasonString, ResponseCode, ResponseData } = v.data;
      const { Oe001304, RECORD_COUNT } = parseResDataToJson(v.data);
      if (ResponseCode == 200 && parseInt(RECORD_COUNT) > 0) {
        for (let i of Oe001304) {
          const ReqBody = {
            'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
            'BPAPUS-LOGIN-GUID': LoginGUID,
            'BPAPUS-FUNCTION': GET_OTHER_DOC_INFO,
            'BPAPUS-PARAM': '{\r\n    "DI_KEY": "' + i.DI_KEY + '"\r\n}',
            'BPAPUS-FILTER': '',
            'BPAPUS-ORDERBY': '',
            'BPAPUS-OFFSET': '0',
            'BPAPUS-FETCH': '0',
          };
          console.log('ReqBody', JSON.stringify(ReqBody));
          await updateErpV3Api(ReqBody)
            .then(async res => {
              const { ReasonString, ResponseCode } = res.data;
              const { DOCINFO, TRANSTKD, RECORD_COUNT } = parseResDataToJson(
                res.data,
              );
              console.log(
                'UpdateErpGetOtherDocInfoAPi',
                JSON.stringify(TRANSTKD),
              );
              console.log(
                ResponseCode == 200,
                parseInt(RECORD_COUNT) > 0,
                TRANSTKD.length > 0,
              );
              if (
                ResponseCode == 200 &&
                parseInt(RECORD_COUNT) > 0 &&
                TRANSTKD.length > 0
              ) {
                for (let j of TRANSTKD) {
                  if (j.TRD_TO_WL == VANCONFIG.VANCNF_WL)
                    console.log('dataObj2', 2);

                  const dataObj2 = {
                    'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
                    'BPAPUS-LOGIN-GUID': LoginGUID,
                    'BPAPUS-FUNCTION': BPAPUS_FUNCTION_WH_CODE,
                    'BPAPUS-PARAM': '',
                    'BPAPUS-FILTER':
                      "and WL_KEY = '" + VANCONFIG.VANCNF_WL + "'",
                    'BPAPUS-ORDERBY': '',
                    'BPAPUS-OFFSET': '0',
                    'BPAPUS-FETCH': '0',
                  };

                  console.log('dataObj3', 3);
                  let WL_CODE = null;
                  let good_inVan_qty = 0;

                  await lookupErpV3Api(dataObj2)
                    .then(v => {
                      const { ResponseData, ResponseCode, ReasonString } =
                        v.data;
                      if (ResponseCode == 200) {
                        // console.log(JSON.parse(ResponseData));
                        // console.log('dataObj4', ResponseData);
                        let responseData = JSON.parse(ResponseData);
                        WL_CODE = responseData.Wh000220
                          ? responseData.Wh000220[0].WL_CODE
                          : null;
                      } else {
                        console.log('ERROR lookupErpV3Api', ReasonString);
                      }
                    })
                    .catch(err => {
                      console.log('ERROR lookupErpV3Api', err);
                    });
                  console.log('WL_CODE ===> ', WL_CODE);
                  await getWareLocationStockBalance(
                    j.GOODS_CODE,
                    VANCONFIG,
                  ).then(v => {
                    const { ReasonString, ResponseCode, ResponseData } = v;
                    //console.log('getDropPointListItems ', v);
                    let responseData = JSON.parse(ResponseData);
                    if (ResponseCode == 200) {
                      console.log(
                        'jkdfjsdjfkdkf 4==== ',
                        JSON.stringify(responseData),
                      );

                      for (let obj of responseData.ShowSkuBalance) {
                        if (obj.WL_CODE == WL_CODE) {
                          good_inVan_qty = obj.QTY;
                        }
                      }
                    }
                  });

                  console.log('good_inVan_qty ==== 3 ', good_inVan_qty);

                  {
                    await productSearchListV3Api(
                      j.GOODS_CODE,
                      ARPRB_CODE,
                      criteria,
                    ).then(k => {
                      console.log('kkkkkkkkkk1 ', JSON.stringify(k));
                      let responseData2 = JSON.parse(k.ResponseData);
                      if (k.ResponseCode == 200) {
                        if (
                          responseData2 &&
                          responseData2.GoodsInfo.length > 0
                        ) {
                          if (
                            responseData2.GoodsInfo[0].ARPLU_U_PRC &&
                            responseData2.GoodsInfo[0].ARPLU_U_PRC != ''
                          ) {
                            let temp = responseData2.GoodsInfo[0];
                            temp.ARPLU_U_PRC = parseFloat(
                              responseData2.GoodsInfo[0].ARPLU_U_PRC,
                            );
                            temp.ARPRB_CODE = parseFloat(
                              responseData2.GoodsInfo[0].ARPRB_CODE,
                            );
                            temp.SKU_KEY = parseFloat(
                              responseData2.GoodsInfo[0].SKU_KEY,
                            );
                            temp.UTQ_QTY = parseFloat(
                              responseData2.GoodsInfo[0].UTQ_QTY,
                            );
                            temp.SKU_SKUALT = parseFloat(
                              responseData2.GoodsInfo[0].SKU_SKUALT,
                            );
                            temp.SKU_ICCAT = parseFloat(
                              responseData2.GoodsInfo[0].SKU_ICCAT,
                            );
                            temp.SKU_BRN = parseFloat(
                              responseData2.GoodsInfo[0].SKU_BRN,
                            );
                            temp.SKU_ICCOLOR = parseFloat(
                              responseData2.GoodsInfo[0].SKU_ICCOLOR,
                            );
                            temp.SKU_ICSIZE = parseFloat(
                              responseData2.GoodsInfo[0].SKU_ICSIZE,
                            );
                            temp.SKU_ICDEPT = parseFloat(
                              responseData2.GoodsInfo[0].SKU_ICDEPT,
                            );
                            temp.UTQ_KEY = parseFloat(
                              responseData2.GoodsInfo[0].UTQ_KEY,
                            );
                            temp.good_inVan_qty = parseFloat(good_inVan_qty);

                            console.log('temp1 ', JSON.stringify(temp));
                            Response.push(temp);
                          }
                        } else {
                          dispatch({
                            type: types.PRODUCT_SEARCH_LIST_SUCCESS,
                            payload: [],
                          });
                        }
                      } else {
                        dispatch({ type: types.PRODUCT_SEARCH_LIST_FAIL });
                      }
                    });
                  }
                }
              } else {
                dispatch({
                  type: types.PRODUCT_SEARCH_LIST_SUCCESS,
                  payload: [],
                });
              }
            })
            .catch(err => {
              dispatch({ type: types.PRODUCT_SEARCH_LIST_FAIL });
            });
        }
      } else {
        dispatch({
          type: types.PRODUCT_SEARCH_LIST_SUCCESS,
          payload: [],
        });
      }
    })
    .catch(err => {
      dispatch({ type: types.PRODUCT_SEARCH_LIST_FAIL });
    });
};

export const productSearchOtherListByVanV3Api_BK1 = async criteria => {
  const LoginGUID = await getLoginGuID();
  const settingConfig = await getSettingConfig();
  //console.log('Bazzz settingConfig 1 ==>', settingConfig);

  var tmep_DocType = '';
  if (settingConfig.VANCONFIG.VANCNF_SKU_LIMIT == '4') {
    tmep_DocType = settingConfig.VANCONFIG.VANCNF_TRANSFER_DT; //ใช้ใบโอนสินค้า
  } else if (settingConfig.VANCONFIG.VANCNF_SKU_LIMIT == '3') {
    tmep_DocType = settingConfig.VANCONFIG.VANCNF_QUOTE_DT; //ใช้ใบเสนอราคา
  } else {
    tmep_DocType = ''; //ใช้ค่าเดิมของโปรแกรม,
  }
  //console.log('Bazzz tmep_DocType 1 ==>', tmep_DocType);\\\\

  const lookupLastMove = await LookupErpCashSaleAPi(tmep_DocType);
  const jsonData = JSON.parse(lookupLastMove.ResponseData);

  const ICDEPT_KEY = criteria.ICDEPT_KEY
    ? "and SKU_ICCAT = '" + criteria.ICDEPT_KEY + "'"
    : '';
  // const KEYWORD = criteria.KEYWORD
  //   ? "and (SKU_CODE like '%" +
  //     criteria.KEYWORD.trim() +
  //     "%' or  SKU_NAME like '%" +
  //     criteria.KEYWORD.trim() +
  //     "%' or  GOODS_CODE like '%" +
  //     criteria.KEYWORD.trim() +
  //     "%') and VANCNF_MACHINE = '" +
  //     settingConfig.vanCNFMachine +
  //     "'" :
  //     "and VANCNF_MACHINE = '" + settingConfig.vanCNFMachine + "'";

  const KEYWORD = criteria.KEYWORD
    ? ' and (' +
      criteria.KEYWORD.trim()
        .split(/\s+/)
        .map(
          word =>
            ` (SKU_CODE like '%${word}%' OR SKU_NAME like '%${word}%' OR GOODS_CODE like '%${word}%')`,
        )
        .join(' AND ') +
      ')' +
      " and VANCNF_MACHINE = '" +
      settingConfig.vanCNFMachine +
      "'"
    : "and VANCNF_MACHINE = '" + settingConfig.vanCNFMachine + "'";

  const LIMIT = JSON.stringify(criteria.LIMIT);
  const OFFSET = JSON.stringify(criteria.OFFSET);

  DI_KEY = jsonData.Oe001304[0].DI_KEY;

  const bodyRequest = {
    'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': LoginGUID,
    'BPAPUS-FUNCTION': 'GetOtherIcDocinfo',
    'BPAPUS-PARAM': '{\r\n    "DI_KEY": "' + DI_KEY + '"\r\n}',
    'BPAPUS-FILTER': KEYWORD + ICDEPT_KEY,
    'BPAPUS-ORDERBY': '  Order by DI_DATE Desc , DI_REF ASC ',
    'BPAPUS-OFFSET': OFFSET,
    'BPAPUS-FETCH': LIMIT,
  };
  console.log('productSearchOtherListByVanV3Api bodyRequest ', bodyRequest);
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/UpdateErp', bodyRequest)
      .then(v => {
        const { ReasonString, ResponseCode, ResponseData } = v.data;
        let responseData = JSON.parse(ResponseData);

        if (ResponseCode == 200) {
          const { RECORD_COUNT, OFFSET, FETCH, DOCINFO, TRANSTKD } =
            responseData;
          var jsonArray = [];

          // console.log('criteria.KEYWORD ===. ', (criteria.KEYWORD));
          let ImpTrhDetail = [];

          for (let i in TRANSTKD) {
            if (
              (settingConfig.VANCONFIG.VANCNF_SKU_LIMIT == '4' &&
                TRANSTKD[i].TRD_TO_WL == settingConfig.VANCONFIG.VANCNF_WL) ||
              (settingConfig.VANCONFIG.VANCNF_SKU_LIMIT == '3' &&
                TRANSTKD[i].TRD_WL == settingConfig.VANCONFIG.VANCNF_WL)
            ) {
              let newObj = {
                VANCNF_KEY: settingConfig.VANCONFIG.VANCNF_KEY,
                VANCNF_MACHINE: settingConfig.VANCONFIG.VANCNF_MACHINE,
                VANBRN_KEY: '',
                BRN_KEY: '', //parseFloat(TRANSTKD[i].TRD_Q_FREE).toFixed(2),
                BRN_CODE: '', //TRANSTKD[i].TRD_OPTION,
                BRN_NAME: '', //TRANSTKD[i].TRD_KEYIN,
                SKU_KEY: '', //TRANSTKD[i].TRD_NAMES ? TRANSTKD[i].TRD_NAMES : null,
                SKU_CODE: TRANSTKD[i].SKU_BARCODE,
                SKU_NAME: TRANSTKD[i].SKU_NAME, //    parseFloat(TRANSTKD[i].TRD_QTY).toFixed(2),
                GOODS_KEY: '', //TRANSTKD[i].GOODS_CODE,
                GOODS_CODE: TRANSTKD[i].GOODS_CODE,
                UTQ_KEY: TRANSTKD[i].TRD_U_PRC,
                UTQ_NAME: TRANSTKD[i].TRD_UTQNAME,
                UTQ_QTY: TRANSTKD[i].TRD_UTQQTY,
              };
              console.log('newObj ===. ', newObj);
              if (criteria.KEYWORD == null) {
                ImpTrhDetail.push(newObj);
              } else {
                if (
                  TRANSTKD[i].SKU_NAME.includes(criteria.KEYWORD.trim()) ||
                  TRANSTKD[i].SKU_CODE.includes(criteria.KEYWORD.trim()) ||
                  TRANSTKD[i].SKU_BARCODE.includes(criteria.KEYWORD.trim())
                ) {
                  ImpTrhDetail.push(newObj);
                }
              }
            }
          }
          var jsonObject = {
            RECORD_COUNT: ImpTrhDetail.length,
            OFFSET: OFFSET,
            FETCH: FETCH,
            Vans0105: ImpTrhDetail,
          };
          // jsonArray.push(jsonObject);
          // console.log('jsonArray ===. ', (jsonArray) );
        }
        var retjsonObject = {
          ReasonString: 'Completed',
          ResponseCode: 200,
          ResponseData: JSON.stringify(jsonObject),
        };
        console.log('retjsonObject ===. ', retjsonObject);

        resolve(retjsonObject);
        // resolve(v.data);
      })
      .catch(err => {
        console.log(' err ==> ', err);
        reject(err);
      });
  });
};

export const LookupErpCashSaleAPi = async _DT => {
  const LoginGUID = await getLoginGuID();
  //console.log('Bazzz settingConfig 4 ==>', '4');
  const bodyRequest = {
    'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': LoginGUID,
    'BPAPUS-FUNCTION': 'Oe001304',
    'BPAPUS-PARAM': '',
    'BPAPUS-FILTER': "and (DT_KEY = '" + _DT + "')",
    'BPAPUS-ORDERBY': 'order by DI_DATE DESC  , DI_REF DESC',
    'BPAPUS-OFFSET': '0',
    'BPAPUS-FETCH': '0',
  };
  console.log('LookupErpCashSaleAPi RequestBody 2', bodyRequest);
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/LookupErp', bodyRequest)
      .then(v => {
        // console.log(' v.data ==> ', v.data);
        resolve(v.data);
      })
      .catch(err => {
        // console.log(' v.data ==> ', err);
        reject(err);
      });
  });
};
