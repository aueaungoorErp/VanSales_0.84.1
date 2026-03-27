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
import {BPAPUS_FUNCTION_DP_CODE} from '../constant/bPlusApi';

export const getDPWareLocationByVANCNF_KEY = (id, vanConfig) => {
  return new Promise(async (resolve, reject) => {
    const LoginGUID = await getLoginGuID();
    console.log("getDPWareLocationByVANCNF_KEY ");
    console.log("vanConfig.VANCNF_ENQ_WL == 2 ", vanConfig.VANCNF_ENQ_WL == 2);

    let wl_code = [];
    //if (vanConfig.VANCNF_ENQ_WL == 2) 
   
    {
      let dataObj2 = {
        'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': BPAPUS_FUNCTION_DP_CODE,
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER': "and VANCNF_KEY = '" + vanConfig.VANCNF_KEY + "'",
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      };

            console.log(' await lookupErpV3Api(dataObj2)', dataObj2);

            await lookupErpV3Api(dataObj2)
              .then((v) => {
          const {ResponseData,ResponseCode, ReasonString } = v.data;
          console.log(' lookupErpV3Api ResponseCode', ResponseCode);

          if (ResponseCode == 200) {
            // console.log(JSON.parse(ResponseData));
            let responseData = JSON.parse(ResponseData);

            for (let i = 0; i < (parseInt(responseData.RECORD_COUNT)); i++) {
              if (vanConfig.VANCNF_ENQ_WL == 1) {
                wl_code.push(responseData.Vans0106[i].WL_CODE);
              } else if (vanConfig.VANCNF_ENQ_WL == 2) {
                if (vanConfig.VANCNF_WL == responseData.Vans0106[i].WL_KEY) {
                  wl_code.push(responseData.Vans0106[i].WL_CODE);
                }
              }
            };

          } else {
            console.log('ERROR lookupErpV3Api Vans0106', ReasonString);
          }
        })
        .catch((err) => {
          console.log('ERROR lookupErpV3Api', err);
        });
    }
     console.log(' lookupErpV3Api filter', wl_code);

    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': 'ShowSkuBalance',
      'BPAPUS-PARAM': '{\r\n    "GOODS_CODE": "' + id + '"\r\n}',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    Request.instanceV3
      .post(`/ShowPrice`, bodyRequest)
      .then((v) => {
        var _ShowSkuBalance = [] ;
        var tmp = [] ;
           const {
             ResponseData,
             ResponseCode,
             ReasonString
           } = v.data;
           var responseData = JSON.parse(ResponseData);
           var _ResponseData = JSON.parse(ResponseData);

           console.log('WL_CODE _ResponseData = ', _ResponseData);

           _ResponseData.ShowSkuBalance = [];
        for (let obj of responseData.ShowSkuBalance) {
          for (let WL_CODE of wl_code) {
            console.log('WL_CODE = ', WL_CODE);
            console.log('obj.WL_CODE = ', obj.WL_CODE);
            if (WL_CODE == obj.WL_CODE) {
              _ShowSkuBalance.push(obj)
            }
          }
           };
           _ResponseData.ShowSkuBalance = _ShowSkuBalance;

           console.log('_ResponseData.ShowSkuBalance', _ResponseData.ShowSkuBalance);

           tmp.push({
             "ReasonString": ReasonString,
             "ResponseCode": ResponseCode,
             "ResponseData": '' + JSON.stringify(_ResponseData) + '',
           });
           console.log("tmp===== > ", tmp[0]);
           //resolve(v.data);
           resolve(tmp[0]);
      })
      .catch((err) => {
        reject(err);
      });
  });
};



export const getDPWareLocationANDHoByVANCNF_KEY = (id, vanConfig) => {
  return new Promise(async (resolve, reject) => {
    const LoginGUID = await getLoginGuID();
    console.log("getDPWareLocationByVANCNF_KEY ");
    console.log("vanConfig.VANCNF_ENQ_WL == 2 ", vanConfig.VANCNF_ENQ_WL == 2);

    let wl_code = [];
    //if (vanConfig.VANCNF_ENQ_WL == 2) 
   
    {
      let dataObj2 = {
        'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': BPAPUS_FUNCTION_DP_CODE,
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER': "and VANCNF_KEY = '" + vanConfig.VANCNF_KEY + "'",
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      };

            console.log(' await lookupErpV3Api(dataObj2)', dataObj2);

            await lookupErpV3Api(dataObj2)
              .then((v) => {
          const {ResponseData,ResponseCode, ReasonString } = v.data;
          console.log(' lookupErpV3Api ResponseCode', ResponseCode);

          if (ResponseCode == 200) {
            // console.log(JSON.parse(ResponseData));
            let responseData = JSON.parse(ResponseData);

            for (let i = 0; i < (parseInt(responseData.RECORD_COUNT)); i++) {
              if (vanConfig.VANCNF_ENQ_WL == 1) {
                wl_code.push(responseData.Vans0106[i].WL_CODE);
              } else if (vanConfig.VANCNF_ENQ_WL == 2) {
                if (vanConfig.VANCNF_WL == responseData.Vans0106[i].WL_KEY) {
                  wl_code.push(responseData.Vans0106[i].WL_CODE);
                }
              }
            };


           // if (vanConfig.VANCNF_ENQ_WL == 2) { wl_code.push('01');}


          } else {
            console.log('ERROR lookupErpV3Api Vans0106', ReasonString);
          }
        })
        .catch((err) => {
          console.log('ERROR lookupErpV3Api', err);
        });
    }
     console.log(' lookupErpV3Api filter', wl_code);


    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': 'ShowSkuBalance',
      'BPAPUS-PARAM': '{\r\n    "GOODS_CODE": "' + id + '"\r\n}',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    Request.instanceV3
      .post(`/ShowPrice`, bodyRequest)
      .then((v) => {
        var _ShowSkuBalance = [] ;
        var tmp = [] ;
           const {
             ResponseData,
             ResponseCode,
             ReasonString
           } = v.data;
           var responseData = JSON.parse(ResponseData);
           var _ResponseData = JSON.parse(ResponseData);

           console.log('WL_CODE _ResponseData = ', responseData.ShowSkuBalance);

           _ResponseData.ShowSkuBalance = [];
        for (let obj of responseData.ShowSkuBalance) {
          for (let WL_CODE of wl_code) {
            console.log('WL_CODE = ', WL_CODE);
            console.log('obj.WL_CODE = ', obj.WL_CODE);
            if (WL_CODE == obj.WL_CODE) {
              _ShowSkuBalance.push(obj)
            }
          }
           };
           _ResponseData.ShowSkuBalance = _ShowSkuBalance;

           console.log('_ResponseData.ShowSkuBalance', _ResponseData.ShowSkuBalance);

           tmp.push({
             "ReasonString": ReasonString,
             "ResponseCode": ResponseCode,
             "ResponseData": '' + JSON.stringify(_ResponseData) + '',
           });
           console.log("tmp===== > ", tmp[0]);
           //resolve(v.data);
           resolve(tmp[0]);
      })
      .catch((err) => {
        reject(err);
      });
  });
};