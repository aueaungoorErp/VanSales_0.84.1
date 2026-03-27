import moment from 'moment';
import { Alert } from 'react-native';
import * as appConfig from '../../appConfig';
import { strings } from '../locales/i18n';
import Request from '../utils/Request';
import {
  getDeviceUniqeId,
  getLoginGuID,
  setLoginGuID,
} from '../utils/Token';

const normalizeSettingErrorCode = (error) => {
  const errText = String(error?.message ?? error ?? '').trim();

  if (!errText) {
    return '';
  }

  if (
    /timeout of \d+ms exceeded/i.test(errText) ||
    error?.code === 'ECONNABORTED'
  ) {
    return 'timeout';
  }

  if (/network error/i.test(errText)) {
    return '404';
  }

  const statusCodeMatch = errText.match(/status code\s+(\d+)/i);
  if (statusCodeMatch?.[1]) {
    return statusCodeMatch[1] === '404' ? '404-1' : statusCodeMatch[1];
  }

  return errText;
};


export const unRegisterApi = async () => {
  const uniqueId = await getDeviceUniqeId();
  return new Promise(async (resolve, reject) => {
    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': '',
      'BPAPUS-FUNCTION': 'UnRegister',
      'BPAPUS-PARAM': '{\r\n    "BPAPUS-MACHINE": ' + JSON.stringify(uniqueId) + ',\r\n}',
    };
    await Request.instanceV3
      .post('/DevUsers', bodyRequest)
      .then(async (v) => {
        const {
          ResponseData,
          ResponseCode,
          ReasonString
        } = v.data;
        if (ResponseCode == 200 && ReasonString == 'Completed') {
          resolve(true);
        } else {
          reject(ReasonString);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const systemCheckApi2 = async (baseUrl, queryString, user, pass) => {
  const uniqueId = await getDeviceUniqeId();
  return new Promise(async (resolve, reject) => {
    Request.setBaseV3Url(baseUrl);

    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': '',
      'BPAPUS-FUNCTION': 'UnRegister',
      'BPAPUS-PARAM': '{\r\n    "BPAPUS-MACHINE": ' + JSON.stringify(uniqueId) + '\r\n}',
    };

    let errret = ''
    await Request.instanceV3
      .post('/DevUsers', bodyRequest)
      .then(async (v) => {
        const {
          ResponseData,
          ResponseCode,
          ReasonString
        } = v.data;
        if (ResponseCode == 200) {
          const bodyRequest = {
            'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
            'BPAPUS-LOGIN-GUID': '',
            'BPAPUS-FUNCTION': 'Register',
            'BPAPUS-PARAM': '{\r\n    "BPAPUS-MACHINE": ' +
              JSON.stringify(uniqueId) +
              ',\r\n    "BPAPUS-CNTRY-CODE": "66",\r\n    "BPAPUS-MOBILE": "' +
              appConfig.BPAPUS_MOBILE +
              '"\r\n}',
          };
          await Request.instanceV3
            .post('/DevUsers', bodyRequest)
            .then(async (j) => {
              const {
                ResponseData,
                ResponseCode,
                ReasonString
              } = j.data;
              if (ResponseCode == 200 && ReasonString == 'Completed') {
                let x = moment(j.headers.date); //.add(7, 'hours');
                const responseData = JSON.parse(ResponseData);
                if (ResponseCode == 200 && ReasonString == 'Completed') {
                  //await setLoginGuID(BPAPUS_GUID);

                  const bodyRequest = {
                    'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
                    'BPAPUS-LOGIN-GUID': '',
                    'BPAPUS-FUNCTION': 'Login',
                    'BPAPUS-PARAM': '{\r\n    "BPAPUS-MACHINE": ' +
                      JSON.stringify(uniqueId) +
                      ',\r\n    "BPAPUS-USERID": "' +
                      user +
                      //appConfig.fake_USERNAME +
                      '",\r\n    "BPAPUS-PASSWORD": "' +
                      pass +
                      //appConfig.fake_Password +
                      '"\r\n}',
                  };
                  await Request.instanceV3
                    .post('/DevUsers', bodyRequest)
                    .then(async (k) => {
                      const {
                        ResponseData,
                        ResponseCode,
                        ReasonString
                      } = k.data;

                      if (ResponseCode == 200) {
                        let responseData = JSON.parse(ResponseData);
                        Request.setHeadersV3({
                          userToken: responseData.BPAPUS_GUID,
                        });
                        await setLoginGuID(responseData.BPAPUS_GUID);

                        let x = moment(k.headers.date); //.add(7, 'hours');
                        resolve({
                          ...k.data,
                          RESPONSE_DATETIME: x.format('LT'),
                        });
                      } else {
                        reject(await return_Errmessage(ResponseCode));
                      }
                    })
                    .catch((err) => {
                      reject(err);
                    });
                } else {
                  resolve(v.data);
                }
              } else {
                reject(ResponseCode);
              }
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          //console.log('unRegister ELSE v.data', v.data);
          reject(ResponseCode);
        }
      })
      .catch((err) => {
        errret = normalizeSettingErrorCode(err);
      })
    if (errret != '') {
      reject(await return_Errmessage(errret));
    }
    ;
  });
};



export const return_Errmessage = async (reecode) => {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      const normalizedCode = normalizeSettingErrorCode(reecode);

      let errmessage = "";

      switch (normalizedCode) {
        case '404':
        case '404-1':

          var filename = appConfig.API_ENDPOINT_V3.replace(/^.*[\\\/]/, '')
          let tempurl = filename.split('.dll');
          errmessage = strings('error_ser.' + 404) + '\n' + strings('login_setting.UnableConnec1') + ' ' + tempurl[0] + ' ' + strings('login_setting.UnableConnec2');

          Alert.alert(
            'พบข้อผิดพลาด', errmessage,
            [{
              text: 'ตกลง',
              onPress: () => null
            }], {
            cancelable: false
          },
          );
          errmessage = '';
          break;
        case '609':
          errmessage = strings('error_ser.' + normalizedCode);
          break;
        default:
          if (strings(`error_ser.${normalizedCode}`) !== `missing ${'"'}th.error_ser.${normalizedCode}${'"'} translation`) {
            errmessage = strings('error_ser.' + normalizedCode);
          } else {
            errmessage = normalizedCode;
          }
          break;
      }

      resolve(errmessage)
    }, 1000)
  })
}




export const systemCheckApi = async (baseUrl, queryString) => {
  const uniqueId = await getDeviceUniqeId();
  let errret = ''

  return new Promise(async (resolve, reject) => {

    Request.setBaseV3Url(baseUrl);
    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': '',
      'BPAPUS-FUNCTION': 'Register',
      'BPAPUS-PARAM': '{\r\n    "BPAPUS-MACHINE": ' +
        JSON.stringify(uniqueId) +
        ',\r\n    "BPAPUS-CNTRY-CODE": "66",\r\n    "BPAPUS-MOBILE": "' +
        appConfig.BPAPUS_MOBILE +
        '"\r\n}',
    };

    await Request.instanceV3
      .post('/DevUsers', bodyRequest)
      .then(async (v) => {
        const {
          ResponseData,
          ResponseCode,
          ReasonString
        } = v.data;
        if (ResponseCode == 200 && ReasonString == 'Completed') {
          let x = moment(v.headers.date); //.add(7, 'hours');

          if (ResponseCode == 200 && ReasonString == 'Completed') {
            //await setLoginGuID(BPAPUS_GUID);
            resolve({
              ...v.data,
              RESPONSE_DATETIME: x.format('LT'),
            });
          } else {
            resolve(v.data);
          }
        } else {
          resolve(v.data);
        }
      })
      .catch((err) => {
        errret = normalizeSettingErrorCode(err);
      });
    if (errret != '') {
      //reject(await return_Errmessage(errret));//.then(val => console.log('oooo>',val)));
    }
    ;
  });
};

export const getVanConfigApi = () => {
  return new Promise((resolve, reject) => {
    Request.instance
      .get(`/MasterData/VanConfig`)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getVanConfigV3Api = async (data, requestConfig = undefined) => {
  const LoginGUID = await getLoginGuID();
  let VANCNF_MACHINE = data ? "and VANCNF_MACHINE = '" + data + "'" : '';
  const bodyRequest = {
    'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': LoginGUID,
    'BPAPUS-FUNCTION': 'Vans0103',
    'BPAPUS-PARAM': '',
    'BPAPUS-FILTER': VANCNF_MACHINE,
    'BPAPUS-ORDERBY': '',
    'BPAPUS-OFFSET': '0',
    'BPAPUS-FETCH': '0',
  };
  return new Promise(async (resolve, reject) => {
    await Request.instanceV3
      .post('/LookupErp', bodyRequest, requestConfig)
      .then((v) => {
        const {
          ResponseData,
          ResponseCode,
          ReasonString
        } = v.data;
        const responseData = JSON.parse(ResponseData);
        const VANCONFIG = responseData.Vans0103.find(item => item.VANCNF_MACHINE === data);
        let newVanCNF = {
          ...VANCONFIG,
          VANCNF_FRM_WIDTH: parseInt(VANCONFIG.VANCNF_FRM_WIDTH),
          VANCNF_VAT_RATE: parseInt(VANCONFIG.VANCNF_VAT_RATE),
          VANCNF_FORCAST: parseInt(VANCONFIG.VANCNF_FORCAST),
          VANCNF_ARPRB_MODE: parseInt(VANCONFIG.VANCNF_ARPRB_MODE),
          VANCNF_ARPRB: parseInt(VANCONFIG.VANCNF_ARPRB),
          VANCNF_SKU_LIMIT: parseInt(VANCONFIG.VANCNF_SKU_LIMIT),
          VANCNF_NEED_BAL: parseInt(VANCONFIG.VANCNF_NEED_BAL),
          VANCNF_AR_LIMIT: parseInt(VANCONFIG.VANCNF_AR_LIMIT),
          VANCNF_LAST_BILL: parseInt(VANCONFIG.VANCNF_LAST_BILL),
          VANCNF_ENQ_WL: parseInt(VANCONFIG.VANCNF_ENQ_WL),
          VANCNF_FORCE_MILE: parseInt(VANCONFIG.VANCNF_FORCE_MILE),
          VANCNF_FORCE_GPS: parseInt(VANCONFIG.VANCNF_FORCE_GPS),
          VANCNF_ENABLE_ALLAR: parseInt(VANCONFIG.VANCNF_ENABLE_ALLAR),
          VANCNF_ENABLE_ALLIC: parseInt(VANCONFIG.VANCNF_ENABLE_ALLIC),
          VANCNF_NOV_CRE_LIM: parseInt(VANCONFIG.VANCNF_NOV_CRE_LIM),
          VANCNF_NOV_SKU_BAL: parseInt(VANCONFIG.VANCNF_NOV_SKU_BAL),
          VANCNF_AS_PREVIOUS: parseInt(VANCONFIG.VANCNF_AS_PREVIOUS),
          VANCNF_KEYIN_SCR: parseInt(VANCONFIG.VANCNF_KEYIN_SCR),
          VANCNF_FRM_WIDTH: parseInt(VANCONFIG.VANCNF_FRM_WIDTH),
          VANCNF_FRM_LENGTH: parseInt(VANCONFIG.VANCNF_FRM_LENGTH),
          VANCNF_WARN_NOGPS: parseInt(VANCONFIG.VANCNF_WARN_NOGPS),
          VANCNF_RANGECHECKIN: parseInt(VANCONFIG.VANCNF_RANGECHECKIN),
          VANCNF_ENABLE_UPRC: parseInt(VANCONFIG.VANCNF_ENABLE_UPRC),
          VANCNF_ENABLE_UPRC: parseInt(VANCONFIG.VANCNF_ENABLE_UPRC),
          VANCNF_ENABLE_UDSC: parseInt(VANCONFIG.VANCNF_ENABLE_UDSC),
          VANCNF_ENABLE_QFREE: parseInt(VANCONFIG.VANCNF_ENABLE_QFREE),
          VANCNF_ENABLE_TDSC: parseInt(VANCONFIG.VANCNF_ENABLE_TDSC),
          VANCNF_ENABLE_KTDSC: parseInt(VANCONFIG.VANCNF_ENABLE_KTDSC),
          VANCNF_ROUND: parseInt(VANCONFIG.VANCNF_ROUND),
          VANCNF_ENABLE_CPSKU: parseInt(VANCONFIG.VANCNF_ENABLE_CPSKU),
          VANCNF_ENABLE_CPALT: parseInt(VANCONFIG.VANCNF_ENABLE_CPALT),
          VANCNF_ENABLE_CPAKU: parseInt(VANCONFIG.VANCNF_ENABLE_CPAKU),
          VANCNF_ENABLE_CASH: parseInt(VANCONFIG.VANCNF_ENABLE_CASH),
          VANCNF_CHEQUE: parseInt(VANCONFIG.VANCNF_CHEQUE),
          VANCNF_ENABLE_AR: parseInt(VANCONFIG.VANCNF_ENABLE_AR),
          VANCNF_CASHSALES_ADDB: parseInt(VANCONFIG.VANCNF_CASHSALES_ADDB),
          VANCNF_CASHSALES_SHOWVAT: parseInt(VANCONFIG.VANCNF_CASHSALES_SHOWVAT),
          VANCNF_REPRT_CASHSALES: parseInt(VANCONFIG.VANCNF_REPRT_CASHSALES),
          VANCNF_INV_ADDB: parseInt(VANCONFIG.VANCNF_INV_ADDB),
          VANCNF_INV_SHOWVAT: parseInt(VANCONFIG.VANCNF_INV_SHOWVAT),
          VANCNF_REPRT_INV: parseInt(VANCONFIG.VANCNF_REPRT_INV),
          VANCNF_INV_COPY: parseInt(VANCONFIG.VANCNF_INV_COPY),
          VANCNF_PREPRCPT_ADDB: parseInt(VANCONFIG.VANCNF_PREPRCPT_ADDB),
          VANCNF_REPRT_PREPRCPT: parseInt(VANCONFIG.VANCNF_REPRT_PREPRCPT),
        };
        resolve(newVanCNF);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const lookupErpV3Api = (data) => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post(`/LookupErp`, data)
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


export const serverReady = (baseUrl) => async (dispatch) => {
  return new Promise((resolve, reject) => {
    Request.setBaseV3Url(baseUrl);

    Request.instance
      .get(baseUrl + `/ServerReady`)
      .then((v) => {
        if (v.data) {
          let x = moment(v.headers.date);
          resolve({
            ...v.data,
            RESPONSE_DATETIME: x.format('LT'),
          });
        }
        // else{
        //     dispatch({RESULT_DATA: [], RESPONSE_DATETIME: '00:00'});
        //    // reject(ERROR_MESSAGES[0]);
        // }        

      })
      .catch((error) => {
        // dispatch({  RESULT_DATA: [], RESPONSE_DATETIME: '00:00'});
        dispatch({
          type: 'RESPONSE_DATETIME',
          payload: '00:00'
        });
        reject(error);
      });
  });
};