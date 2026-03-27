import Request from '../utils/Request';
import { getUserToken, getLoginGuID } from '../utils/Token';
import * as appConfig from '../../appConfig';
import moment from 'moment';

import getVanArprbCodeApi from '../api/product';

export const customerSearchListApi = (criteria) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .get(`/Customer?${criteria}`)
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const customerSearchListV3Api = async (arCode, arKey) => {

  // console.log('arKey ==>', arKey.ARCAT_NAME);
  const LoginGUID = await getLoginGuID();

  // const KEYWORD = "and AR_CODE like '%" + arCode + "%'";
  const KEYWORD = "and AR_CODE = '" + arCode + "'"; // Joker แก้ไขเรื่องค้นหาในสายลูกค้าไม่เจอ

  const arCat = (arKey === undefined) ? '' :
    arKey?.ARCAT_NAME == 'ทั้งหมด' || arKey?.ARCAT_NAME == null
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
  //  console.log(bodyRequest);
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/LookupErp', bodyRequest)
      .then((v) => {
        //console.log("v.data" , v);
        resolve((v.data));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const customerSearchArLineListV3Api = async (criteria) => {
  //console.log('criteria ==>', criteria);
  const LoginGUID = await getLoginGuID();
  const { VANCONFIG } = await getUserToken();
  // console.log('settingConfig.vanCNFMachine ', VANCONFIG.VANCNF_MACHINE);
  // console.log('criteria.ARCAT_NAME >>> ', criteria.ARCAT_KEY.ARCAT_NAME);



  // const KEYWORD = criteria.KEYWORD
  //   ?
  //     "and (AR_CODE like '%" +
  //     criteria.KEYWORD.trim() + 
  //     "%' OR AR_NAME like '%" +
  //     criteria.KEYWORD.trim() +
  //     "%') and VANCNF_MACHINE = '" +
  //     VANCONFIG.VANCNF_MACHINE +
  //     "'"
  //   : "and VANCNF_MACHINE = '" + VANCONFIG.VANCNF_MACHINE + "'";

  //  const KEYWORD = criteria.KEYWORD
  //   ? ' and (' + criteria.KEYWORD.trim().split(/\s+/).map(word => 
  //       ` (AR_CODE like '%${word}%' OR AR_NAME like '%${word}%')`
  //     ).join(' AND ') + ')' + " and VANCNF_MACHINE = '" + VANCONFIG.VANCNF_MACHINE + "'" 
  //   : "and VANCNF_MACHINE = '" + VANCONFIG.VANCNF_MACHINE + "'";
  console.log('bodyRequest keywords', criteria.KEYWORD);

  const keywordRaw = criteria.KEYWORD || '';  // ถ้า null/undefined ให้เป็น string ว่างแทน

  const keywords = keywordRaw.trim() === '' ? [] : keywordRaw.trim().split(/\s+/);

  console.log('bodyRequest keywords', keywords);

  let pattern = '';
  if (keywords.length === 1) {
    // คำเดียว ค้นหาตรงไหนก็ได้
    pattern = `%${keywords[0]}%`;
  } else if (keywords.length >= 2) {
    // สองคำขึ้นไป ค้นหาคำแรก + อะไรก็ได้ + คำสุดท้าย
    pattern = `${keywords[0]}%${keywords[keywords.length - 1]}`;
  } else {
    pattern = '%'; // กรณีไม่มี keyword
  }

  const KEYWORD = keywords.length > 0
    ? `AND (AR_CODE LIKE '%${pattern}%' OR AR_NAME LIKE '%${pattern}%') AND VANCNF_MACHINE = '${VANCONFIG.VANCNF_MACHINE}'`
    : `AND VANCNF_MACHINE = '${VANCONFIG.VANCNF_MACHINE}'`;

  console.log(KEYWORD);
  console.log('bodyRequest KEYWORD', KEYWORD);


  const ARCAT_KEY =
    typeof criteria.ARCAT_KEY == 'object'
      ? ''
      : criteria.ARCAT_KEY
        ? "and AR_ARCAT = '" + criteria.ARCAT_KEY + "'"
        : '';
  const LIMIT = (criteria.ARCAT_KEY.ARCAT_NAME == 'เหนือ') ? '80' : JSON.stringify(criteria.LIMIT);
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
  console.log('bodyRequest bbbb', bodyRequest);
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/LookupErp', bodyRequest)
      .then((v) => {
        // console.log("v.data" , v.data);
        resolve(v.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const findCustomerByIdApi = (id) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .get(`/Customer/${id}`)
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createTempCusApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Customer/Create/TempCustomer`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const executiveV3Api = (data) => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post(`/Executive`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const readErpV3Api = (data) => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post(`/ReadErp`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateErpV3Api = (data) => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post(`/UpdateErp`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const searchCustomerNearByApi = (criteria) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .get(
        `/Customer/nearby/${criteria.C_LAT}/${criteria.C_LNT}/${criteria.radius}`,
      )
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const closeCustomerAccountApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Customer/State/Close`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const customerSkipApi = (id) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .get(`/Customer/Skip/${id}`)
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getArPricetabApi = (bodyRequest) => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/LookupErp', bodyRequest)
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const NewArFileV3Api = (bodyRequest) => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/CreateUpdateMaster', bodyRequest)
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getARL_KEY99 = (bodyRequest) => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/LookupErp', bodyRequest)
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getARLV3Api = (bodyRequest) => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/LookupErp', bodyRequest)
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
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
    await readErpV3Api(bodyRequest2).then(async (y) => {
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
        await updateErpV3Api(bodyRequest3).then((z) => {
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
