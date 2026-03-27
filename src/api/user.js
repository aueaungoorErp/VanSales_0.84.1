import Request from '../utils/Request';
import {
  getUserToken,
  getLoginGuID,
  getWSv3SettingConfig,
  getDeviceUniqeId,
  unRegisterApi,
} from '../utils/Token';
import * as appConfig from '../../appConfig';
import { return_Errmessage } from '../api/setting';
import { strings } from '../locales/i18n';


export const loginApi = async (userLogin) => {
  const { VANCONFIG } = await getUserToken();

  console.log('VANCONFIG', VANCONFIG);
  return new Promise((resolve, reject) => {
    if (VANCONFIG && VANCONFIG.VANCNF_MACHINE) {
      Request.setHeaders({ vanCNFMachine: VANCONFIG.VANCNF_MACHINE });
      console.log('userLogin ', userLogin);
      Request.instance
        .post('/Login', userLogin)
        .then((v) => {
          const { RESULT_DATA, STATUS } = v.data;

          if (STATUS === '00') {
            Request.setHeaders({ userToken: RESULT_DATA.USER_TOKEN });
          }

          resolve(v.data);
        })
        .catch((err) => {
          reject(err.message);
        });
    } else {
      reject('กรุณาทำการตั้งค่าการเชื่อมต่อก่อนเข้าสู่ระบบ');
    }
  });
};

export const registerV3Api = async (username, password) => {
  const uniqueId = await getDeviceUniqeId();
  console.log('registerV3Api');
  return new Promise(async (resolve, reject) => {
    // if (config && config.vanCNFMachine && uniqueId) {
    if (uniqueId) {


      const bodyRequest1 = {
        'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'UnRegister',
        'BPAPUS-PARAM': '{\r\n    "BPAPUS-MACHINE": ' + JSON.stringify(uniqueId) + '\r\n}',
      };
      await Request.instanceV3
        .post('/DevUsers', bodyRequest1)
        .then(async (m) => {
          const { ResponseCode1 } = m.data;

          if (ResponseCode1 != 200) {
            return
          };
        });
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
      await Request.instanceV3
        .post('/DevUsers', bodyRequest)
        .then(async (v) => {

          const { ResponseData, ResponseCode, ReasonString } = v.data;
          // console.log('bodyRequest ASDASDASD', bodyRequest);

          // console.log('ASDASDASD', ResponseData + '..' +  ReasonString);
          if (ResponseCode == 200) {
            const bodyRequest = {
              'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
              'BPAPUS-LOGIN-GUID': '',
              'BPAPUS-FUNCTION': 'Login',
              'BPAPUS-PARAM':
                '{   "BPAPUS-MACHINE": ' +
                JSON.stringify(uniqueId) +
                ',   "BPAPUS-USERID": "' +
                username +
                '",   "BPAPUS-PASSWORD": "' +
                password +
                '"}',
            };
            await Request.instanceV3
              .post('/DevUsers', bodyRequest)
              .then((v) => {
                const { ResponseData, ResponseCode, ReasonString } = v.data;
                if (ResponseCode == 200) {
                  let responseData = JSON.parse(ResponseData);
                  Request.setHeadersV3({ userToken: responseData.BPAPUS_GUID });
                  resolve(v.data);
                } else {
                  reject(ReasonString);
                }
              })
              .catch((err) => {
                reject(err.message);
              });
          } else {
            //  console.log('ASDASDASD 2', ResponseCode);

            reject(await return_Errmessage(ResponseCode));//.then(val => console.log('oooo>',val)));

            // reject(ResponseCode);
          }
        })
        .catch((err) => {
          if (err.message == "Network Error") {
            reject(strings('error_ser.' + 404));
          } else {
            reject(err.message);
          }

        });
    } else {
      reject('กรุณาทำการตั้งค่าการเชื่อมต่อก่อนเข้าสู่ระบบ');
    }
  });
};
