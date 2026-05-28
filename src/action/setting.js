import * as appConfig from '../../appConfig';
import {
  getVanConfigV3Api,
  lookupErpV3Api,
  readErpV3Api,
  systemCheckApi2,
  unRegisterApi,
} from '../api/setting';

import { getLoginInfo, getSettingConfig } from '../utils/Token';

import {
  getCredentials,
  getSavedUsername,
} from '../services/SecureCredentials';

export const systemCheck = data => async dispatch => {
  const savedSetting = await getSettingConfig();
  const savedUsername = await getSavedUsername();
  const credentials = await getCredentials();
  const { baseUrl, vanCNFMachine, USER_CODE, USER_PASSWORD } = data;

  const finalUserCode =
    USER_CODE ?? savedUsername ?? credentials?.username ?? '';
  const finalPassword = USER_PASSWORD ?? credentials?.password ?? '';

  return await systemCheckApi2(
    baseUrl,
    vanCNFMachine,
    finalUserCode,
    finalPassword,
  );
};
export const systemCheck2 = data => async dispatch => {
  const { baseUrl, vanCNFMachine, USER_CODE, USER_PASSWORD } = data;
  console.log('[systemCheck2] start', {
    baseUrl,
    vanCNFMachine,
    userCode: USER_CODE,
    hasPassword: !!USER_PASSWORD,
  });
  return await systemCheckApi2(
    baseUrl,
    vanCNFMachine,
    USER_CODE,
    USER_PASSWORD,
  );
};

export const unRegister = () => async dispatch => {
  return await unRegisterApi();
};

export const getOneTimeGUID = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    const savedUsername = await getSavedUsername();
    const credentials = await getCredentials();
    const user = credentials?.username ?? savedUsername;
    const pass = credentials?.password ?? '';

    console.log('unRegisterApi >>>');
    await unRegisterApi();
    const uniqueId = await getDeviceUniqeId();
    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': '',
      'BPAPUS-FUNCTION': 'Register',
      'BPAPUS-PARAM':
        '{\r\n    "BPAPUS-MACHINE": ' +
        JSON.stringify(uniqueId) +
        ',\r\n    "BPAPUS-CNTRY-CODE": "66",\r\n    "BPAPUS-MOBILE": "' +
        appConfig.BPAPUS_MOBILE +
        '"\r\n}',
    };
    console.log('bodyRequest >>>', bodyRequest);

    Request.instanceV3
      .post('/DevUsers', bodyRequest)
      .then(async v => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        console.log('getOneTimeGUID v.data ', v.data);
        console.log('getOneTimeGUID ASDASDASD', ResponseData, ReasonString);
        if (ResponseCode == 200) {
          const bodyRequest = {
            'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
            'BPAPUS-LOGIN-GUID': '',
            'BPAPUS-FUNCTION': 'Login',
            'BPAPUS-PARAM':
              '{\r\n    "BPAPUS-MACHINE": ' +
              JSON.stringify(uniqueId) +
              ',\r\n    "BPAPUS-USERID": "' +
              user +
              //appConfig.fake_USERNAME +
              '",\r\n    "BPAPUS-PASSWORD": "' +
              pass +
              //appConfig.fake_Password +
              '"\r\n}',
          };
          console.log('bodyRequest2 getOneTimeGUID', bodyRequest);
          await Request.instanceV3
            .post('/DevUsers', bodyRequest)
            .then(v => {
              const { ResponseData, ResponseCode, ReasonString } = v.data;
              //console.log('getOneTimeGUID responseData v.data', v.data);
              if (ResponseCode == 200) {
                let responseData = JSON.parse(ResponseData);
                //console.log('getOneTimeGUID responseData ', responseData);
                Request.setHeadersV3({ userToken: responseData.BPAPUS_GUID });
                resolve(v.data);
              } else {
                reject(ReasonString);
              }
            })
            .catch(err => {
              reject(err.message);
            });
        } else {
          reject(ResponseCode + ' ' + ReasonString);
        }
      })
      .catch(err => {
        reject(err.message);
      });
  });
};

export const getVanConfigV3 = data => dispatch => {
  return new Promise((resolve, reject) => {
    getVanConfigV3Api(data)
      .then(v => {
        resolve(v);
      })
      .catch(err => {
        reject(err.message);
      });
  });
};

export const getSaleManV3 = (GUID, SLMN_KEY) => dispatch => {
  return new Promise(async (resolve, reject) => {
    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': GUID,
      'BPAPUS-FUNCTION': 'SL000130',
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "and SLMN_KEY = '" + SLMN_KEY + "'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    await lookupErpV3Api(bodyRequest)
      .then(v => {
        resolve(v);
      })
      .catch(err => {
        reject(err.message);
      });
  });
};

export const readSlCatBySlKeyV3 = () => dispatch => {
  return new Promise(async (resolve, reject) => {
    await readErpV3Api(data)
      .then(v => {
        resolve(v);
      })
      .catch(err => {
        reject(err.message);
      });
  });
};

export const readCompanyInfoV3 = (GUID, CMPNY_CODE) => dispatch => {
  return new Promise(async (resolve, reject) => {
    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': GUID,
      'BPAPUS-FUNCTION': 'READCOMPANYINFO',
      'BPAPUS-PARAM': '{"CMPNY_CODE": "' + CMPNY_CODE + '"}',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    await readErpV3Api(bodyRequest)
      .then(v => {
        resolve(v);
      })
      .catch(err => {
        reject(err.message);
      });
  });
};
