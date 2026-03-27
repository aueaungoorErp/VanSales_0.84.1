import Request from '../utils/Request';
import * as appConfig from '../../appConfig';
import {
    lookupErpV3Api,
    parseResDataToJson,
    updateErpV3Api,
    RptServerErpV3Api,
    executiveErpV3Api,
  } from './bPlusApi';
import {getLoginGuID} from '../utils/Token';
import {BPAPUS_FUNCTION_WH_CODE} from '../constant/bPlusApi';

export const getWareLocationStockBalance = (id, vanConfig) => {
  return new Promise(async (resolve, reject) => {
    const LoginGUID = await getLoginGuID();
    let filter = '';
    console.log("getWareLocationStockBalance ");
    //if (vanConfig.VANCNF_ENQ_WL == 2) 
    {
      let dataObj2 = {
        'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': BPAPUS_FUNCTION_WH_CODE,
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER': "and WL_KEY = '" + vanConfig.VANCNF_WL + "'" , //  OR WL_CODE = '01' '  OR WL_CODE = '1001'",
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      };
      await lookupErpV3Api(dataObj2)
        .then((v) => {
          const {ResponseData, ResponseCode, ReasonString} = v.data;
          if (ResponseCode == 200) {
            // console.log(JSON.parse(ResponseData));

            let responseData = JSON.parse(ResponseData);

            // let WL_CODE = responseData.Wh000220
            //   ? responseData.Wh000220[0].WL_CODE
            //   : null;
            // filter = "and WL_CODE = '" + WL_CODE + "'";

            let WL_CODES = responseData.Wh000220 ? responseData.Wh000220.map(item => item.WL_CODE) : [];
            filter = WL_CODES.length > 0 ? "and WL_CODE IN ('" + WL_CODES.join("','") + "')" : null;



          } else {
            console.log('ERROR lookupErpV3Api Wh000220', ReasonString);
          }
        })
        .catch((err) => {
          console.log('ERROR lookupErpV3Api', err);
        });
    }

    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': 'ShowSkuBalance',
      'BPAPUS-PARAM': '{\r\n    "GOODS_CODE": "' + id + '"\r\n}',
      'BPAPUS-FILTER': filter,
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };


    Request.instanceV3
      .post(`/ShowPrice`, bodyRequest)
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
