import * as appConfig from '../../appConfig';

import Request from '../utils/Request';
import { getLoginGuID, getUserToken } from '../utils/Token';
import {
  FIND_MEMBER_NAME,
  GET_UPDATE_MEMBER,
  CREATE_NEWMEMBER
} from '../constant/bPlusApi';
export const updateMemberV3Api = async (criteria) => {
  const LoginGUID = await getLoginGuID();
  const { VANCONFIG } = await getUserToken();

  const MB_KEY =
    typeof criteria.MB_KEY == 'object'
      ? ''
      : criteria.MB_KEY
        ? "and MB_KEY = '" + criteria.MB_KEY + "'"
        : '';

  const MB_NAME =
    typeof criteria.MB_NAME == 'object'
      ? ''
      : criteria.MB_NAME
        ? "and MB_NAME = '" + criteria.MB_NAME + "'"
        : '';

  const bodyRequest = {
    'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': LoginGUID,
    'BPAPUS-FUNCTION': GET_UPDATE_MEMBER,
    'BPAPUS-PARAM': '{"MB_KEY": "' + MB_KEY + '", "MB_NAME": "' + MB_NAME + '"}',
    'BPAPUS-FILTER': '',
    'BPAPUS-ORDERBY': '',
    'BPAPUS-OFFSET': 0,
    'BPAPUS-FETCH': 0,
  };
  // console.log(bodyRequest);
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/CreateUpdateMaster', bodyRequest)
      .then((v) => {
        resolve((v.data));
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export const newMemberV3Api = async (VanMachine, GUID, uniqueId) => {
  const LoginGUID = await getLoginGuID();
  // const { VANCONFIG } = await getUserToken();

  // const MB_KEY =
  //   typeof criteria.MB_KEY == 'object'
  //     ? ''
  //     : criteria.MB_KEY
  //       ? "and MB_KEY = '" + criteria.MB_KEY + "'"
  //       : '';

  // const MB_NAME =
  //   typeof criteria.MB_NAME == 'object'
  //     ? ''
  //     : criteria.MB_NAME
  //       ? "and MB_NAME = '" + criteria.MB_NAME + "'"
  //       : '';

  // console.log('ouutttttt MB ', VanMachine);
  let MB =
  {
    'MB_CODE': '\/MB',
    'MB_INTL': 'นาย',
    'MB_NAME': 'VANSALE_' + VanMachine,
    'MB_SURNME': 'นามสกุล',
    'MB_PHONE': appConfig.BPAPUS_MOBILE,
    'MB_EMAIL': 'myname@myemail.com',
    'ADDB_COMPANY': 'สมาชิก Vansales',
    'ADDB_PHONE': appConfig.BPAPUS_MOBILE,
    'ADDB_EMAIL': 'myname@myemail.com',
    'MB_ENABLED': 'N',
  }

  MB = '{\r\n    ' +
    '\"MB_CODE\": \"\/MB\",\r\n    ' +
    '\"MB_INTL\": \"นาย\",\r\n    ' +
    '\"MB_NAME\": \"VANSALE_' + VanMachine + '\",\r\n    ' +
    '\"MB_SURNME\": \"นามสกุล\",\r\n    ' +
    '\"MB_PHONE\": \"' + appConfig.BPAPUS_MOBILE + '\",\r\n    ' +
    '\"MB_EMAIL\": \"myname@myemail.com\",\r\n    ' +
    '\"ADDB_COMPANY\": \"สมาชิก Vansales\",\r\n    ' +
    '\"ADDB_PHONE\": \"' + appConfig.BPAPUS_MOBILE + '\",\r\n    ' +
    '\"MB_ENABLED\": \"N\",\r\n    ' +
    '\"MB_E_NAME\": \"' + uniqueId + '\",\r\n    ' +
    '\"ADDB_EMAIL\": \"myname@myemail.com\"\r\n}';





  // console.log('ouutttttt MB ', JSON.stringify(MB));
  const bodyRequest = {
    'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': GUID,
    'BPAPUS-FUNCTION': CREATE_NEWMEMBER,
    "BPAPUS-PARAM": MB,
    'BPAPUS-FILTER': '',
    'BPAPUS-ORDERBY': '',
    'BPAPUS-OFFSET': 0,
    'BPAPUS-FETCH': 0,
  };
  // console.log(bodyRequest);
  // console.log('BaseURL V3:', Request.instanceV3.defaults.baseURL);
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/CreateUpdateMaster', bodyRequest)
      .then((v) => {
        console.log('Create New Member success')
        resolve((v.data));
      })
      .catch((err) => {
        console.log('Error to Create New Member')
        reject(err);
      });
  });
}


//50.หาชื่อสมาชิก (Mb000130)
export const findMemberNameV3Api = async (MB_NAME, GUID) => {
  console.log('findMemberNameV3Api')

  MB_NAME = 'VANSALE_' + MB_NAME;
  const bodyRequest = {
    'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': GUID, //GUID,
    'BPAPUS-FUNCTION': FIND_MEMBER_NAME,
    'BPAPUS-PARAM': '',
    'BPAPUS-FILTER': " AND MB_NAME='" + MB_NAME + "' AND MB_ENABLED='N' ",
    'BPAPUS-ORDERBY': ' ',
    'BPAPUS-OFFSET': 0,
    'BPAPUS-FETCH': 0,
  };
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/LookupErp', bodyRequest)
      .then((v) => {

        console.log('findMemberNameV3Api  ', v.data)
        resolve((v.data));
      })
      .catch((err) => {
        reject(err);
      });
  });
}