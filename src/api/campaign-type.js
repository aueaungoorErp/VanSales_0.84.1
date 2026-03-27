import Request from '../utils/Request';
import {lookupErpV3Api, parseResDataToJson, updateErpV3Api} from './bPlusApi';
import {BPAPUS_BPAPSV} from '../../appConfig';
import {getLoginGuID} from '../utils/Token';
export const campaignTypeSearchListApi = () => {
  return new Promise(async (resolve, reject) => {
    const LoginGUID = await getLoginGuID();
    const RequestBody = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': 'Sp005111',
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER':
        "and ARCPGN_TYPE = '169' OR ARCPGN_TYPE = '170' OR ARCPGN_TYPE = '172'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    lookupErpV3Api(RequestBody)
      .then((v) => {
        const {ReasonString, ResponseCode, ResponseData} = v.data;
        if (ResponseCode == 200) {
          const response = parseResDataToJson(v.data);

          resolve(v.data);
        } else {
          reject(ResponseCode + ReasonString);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
