import Request from '../utils/Request';
import { getUserToken, getLoginGuID } from '../utils/Token';
import * as appConfig from '../../appConfig';
import moment from 'moment';

import getVanArprbCodeApi from '../api/product';

const formatResponseForLog = payload => {
  if (!payload?.ResponseData || typeof payload.ResponseData !== 'string') {
    return payload;
  }

  try {
    return {
      ...payload,
      ResponseData: JSON.parse(payload.ResponseData),
    };
  } catch (error) {
    return payload;
  }
};

const formatElapsedMs = startedAt => `${Date.now() - startedAt} ms`;

const formatArrayResponseForLog = payload => {
  const formattedPayload = formatResponseForLog(payload);
  const responseData = formattedPayload?.ResponseData;

  if (!responseData || typeof responseData !== 'object') {
    return formattedPayload;
  }

  const arrayKey = Object.keys(responseData).find(key =>
    Array.isArray(responseData[key]),
  );

  if (!arrayKey) {
    return formattedPayload;
  }

  return {
    ...formattedPayload,
    ResponseData: {
      ...responseData,
      totalCount: Number(responseData.RECORD_COUNT || 0),
      currentRowCount: responseData[arrayKey].length,
      arrayKey,
      rows: responseData[arrayKey],
    },
  };
};

const formatErrorForLog = error => ({
  message: error?.message,
  status: error?.response?.status,
  data: error?.response?.data,
});

export const customerSearchListApi = criteria => {
  return new Promise((resolve, reject) => {
    Request.instance
      .get(`/Customer?${criteria}`)
      .then(v => {
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const customerSearchListV3Api = async (arCode, arKey) => {
  const apiStartedAt = Date.now();
  // console.log('arKey ==>', arKey.ARCAT_NAME);
  const LoginGUID = await getLoginGuID();

  // const KEYWORD = "and AR_CODE like '%" + arCode + "%'";
  const KEYWORD = "and AR_CODE = '" + arCode + "'"; // Joker แก้ไขเรื่องค้นหาในสายลูกค้าไม่เจอ

  const arCat =
    arKey === undefined
      ? ''
      : arKey?.ARCAT_NAME == 'ทั้งหมด' || arKey?.ARCAT_NAME == null
      ? ''
      : arKey?.ARCAT_NAME;

  // console.log("arCat >>>", arCat);

  const ARCAT_KEY = arCat != '' ? "and ARCAT_NAME = '" + arCat + "'" : '';

  // console.log("ARCAT_KEY", ARCAT_KEY);

  const bodyRequest = {
    'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': LoginGUID,
    'BPAPUS-FUNCTION': 'Ar000131',
    'BPAPUS-PARAM': '',
    'BPAPUS-FILTER': KEYWORD + ARCAT_KEY,
    'BPAPUS-ORDERBY': '',
    'BPAPUS-OFFSET': '',
    'BPAPUS-FETCH': '',
  };
        console.log('[customer-route detail] request body', bodyRequest);
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/LookupErp', bodyRequest)
      .then(v => {
        console.log('[customer-route detail] api timing', {
          arCode,
          function: bodyRequest['BPAPUS-FUNCTION'],
          elapsedMs: Date.now() - apiStartedAt,
          elapsedText: formatElapsedMs(apiStartedAt),
          responseCode: v?.data?.ResponseCode,
        });
        console.log(
          '[customer-route detail] response json',
          formatArrayResponseForLog(v?.data),
        );
        resolve(v.data);
      })
      .catch(err => {
        console.log('[customer-route detail] api timing error', {
          arCode,
          function: bodyRequest['BPAPUS-FUNCTION'],
          elapsedMs: Date.now() - apiStartedAt,
          elapsedText: formatElapsedMs(apiStartedAt),
          error: formatErrorForLog(err),
        });
        reject(err);
      });
  });
};

export const customerSearchArLineListV3Api = async criteria => {
  const apiStartedAt = Date.now();
  const LoginGUID = await getLoginGuID();
  const { VANCONFIG } = await getUserToken();

  const keywordRaw = criteria.KEYWORD || ''; // ถ้า null/undefined ให้เป็น string ว่างแทน

  const keywords =
    keywordRaw.trim() === '' ? [] : keywordRaw.trim().split(/\s+/);
  let pattern = '';
  if (keywords.length === 1) {
    pattern = `%${keywords[0]}%`;
  } else if (keywords.length >= 2) {
    pattern = `${keywords[0]}%${keywords[keywords.length - 1]}`;
  } else {
    pattern = '%'; // กรณีไม่มี keyword
  }

  const KEYWORD =
    keywords.length > 0
      ? `AND (AR_CODE LIKE '%${pattern}%' OR AR_NAME LIKE '%${pattern}%') AND VANCNF_MACHINE = '${VANCONFIG.VANCNF_MACHINE}'`
      : `AND VANCNF_MACHINE = '${VANCONFIG.VANCNF_MACHINE}'`;

  const ARCAT_KEY =
    typeof criteria.ARCAT_KEY == 'object'
      ? ''
      : criteria.ARCAT_KEY
      ? "and AR_ARCAT = '" + criteria.ARCAT_KEY + "'"
      : '';
  const LIMIT =
    criteria.ARCAT_KEY.ARCAT_NAME == 'เหนือ'
      ? '80'
      : JSON.stringify(criteria.LIMIT);
  const OFFSET = JSON.stringify(criteria.OFFSET);
  const bodyRequest = {
    'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': LoginGUID,
    'BPAPUS-FUNCTION': 'Vans0104',
    'BPAPUS-PARAM': '',
    'BPAPUS-FILTER': KEYWORD, //+ ARCAT_KEY,
    'BPAPUS-ORDERBY': ' ORDER BY ARL_KEY,AR_CODE  ',
    'BPAPUS-OFFSET': OFFSET,
    'BPAPUS-FETCH': LIMIT,
  };
  console.log('[customer-route fetch] request body', {
    criteria,
    keywords,
    keywordPattern: pattern,
    arcatKeyFilter: ARCAT_KEY,
    bodyRequest,
  });
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/LookupErp', bodyRequest)
      .then(v => {
        console.log('[customer-route fetch] api timing', {
          function: bodyRequest['BPAPUS-FUNCTION'],
          offset: bodyRequest['BPAPUS-OFFSET'],
          fetch: bodyRequest['BPAPUS-FETCH'],
          elapsedMs: Date.now() - apiStartedAt,
          elapsedText: formatElapsedMs(apiStartedAt),
          responseCode: v?.data?.ResponseCode,
        });
        console.log(
          '[customer-route fetch] response json',
          formatArrayResponseForLog(v?.data),
        );

        resolve(v.data);
      })
      .catch(err => {
        console.log('[customer-route fetch] api timing error', {
          function: bodyRequest['BPAPUS-FUNCTION'],
          offset: bodyRequest['BPAPUS-OFFSET'],
          fetch: bodyRequest['BPAPUS-FETCH'],
          elapsedMs: Date.now() - apiStartedAt,
          elapsedText: formatElapsedMs(apiStartedAt),
          error: formatErrorForLog(err),
        });
        reject(err);
      });
  });
};

export const findCustomerByIdApi = id => {
  return new Promise((resolve, reject) => {
    Request.instance
      .get(`/Customer/${id}`)
      .then(v => {
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const createTempCusApi = data => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Customer/Create/TempCustomer`, data)
      .then(v => {
        resolve(v.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const executiveV3Api = data => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post(`/Executive`, data)
      .then(v => {
        resolve(v.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const readErpV3Api = data => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post(`/ReadErp`, data)
      .then(v => {
        resolve(v.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const updateErpV3Api = data => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post(`/UpdateErp`, data)
      .then(v => {
        resolve(v.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const searchCustomerNearByApi = criteria => {
  return new Promise((resolve, reject) => {
    Request.instance
      .get(
        `/Customer/nearby/${criteria.C_LAT}/${criteria.C_LNT}/${criteria.radius}`,
      )
      .then(v => {
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const closeCustomerAccountApi = data => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Customer/State/Close`, data)
      .then(v => {
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const customerSkipApi = id => {
  return new Promise((resolve, reject) => {
    Request.instance
      .get(`/Customer/Skip/${id}`)
      .then(v => {
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const getArPricetabApi = bodyRequest => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/LookupErp', bodyRequest)
      .then(v => {
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const NewArFileV3Api = bodyRequest => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/CreateUpdateMaster', bodyRequest)
      .then(v => {
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const getARL_KEY99 = bodyRequest => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/LookupErp', bodyRequest)
      .then(v => {
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const getARLV3Api = bodyRequest => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/LookupErp', bodyRequest)
      .then(v => {
        resolve(v.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

// export const customerSkipApi = (id) => {
//   return new Promise((resolve, reject) => {
//     Request.instance
//       .get(`/Customer/Skip/${id}`)
//       .then((v) => {
//         resolve(v.data);
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// };

export const getCustArprbKEYApi = async (AR_KEY, VANCONFIG) => {
  console.log('getCustArprbKEYApi ');
  const LoginGUID = await getLoginGuID();
  let ARPRB_KEY = 0;

  //console.log("VANCONFIG.VANCNF_ARPRB_MODE >>> " , VANCONFIG.VANCNF_ARPRB_MODE);

  {
    //VANCONFIG.ANCNF_ARPRB_MODE == 1 ตามตารางราคาขายในข้อตกลงหลักของลูกค้า
    // param = '{\r\n    "ARPRB_KEY": "' + VANCONFIG.VANCNF_ARPRB + '"\r\n}';
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
    //  console.log('productSearchListV3Api bodyRequest2 ', bodyRequest2);
    await readErpV3Api(bodyRequest2).then(async y => {
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
            console.log('productSearchListV3Api responseData3 ');
            ARPRB_KEY =
              responseData3.ARPRB_KEY == '' ? 0 : responseData3.ARPRB_KEY;
          }
        });
      }
    });
  }
  return ARPRB_KEY;
};
