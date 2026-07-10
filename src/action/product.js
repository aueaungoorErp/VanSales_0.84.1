import qs from 'qs';
import moment from 'moment';
import { BPAPUS_BPAPSV } from '../../appConfig';
import { productSearchListApi, productSkuSearchListApi, processOrderItemV3Api, processOrderItemApi, productSearchListV3Api, productSearchShowRepack, getVanArprbCodeApi, productSearchByGoodCodeApi, productSkuAltSearchListApi, processOrderTransferApi, productSearchListByVanV3Api, productSearchListByARPLUAPiByCode, productSearchListByARPLUAPiBykey, productSearchListByARPLUAPiByCodeAndWHIS1 } from '../api/product';
import { processOrderSaleApi } from '../api/order';
import { lookupErpV3Api, showPriceErpV3Api, parseResDataToJson, updateErpV3Api } from '../api/bPlusApi';
import * as types from '../constant/product';
import { BPAPUS_FUNCTION_DC_CODE, BPAPUS_FUNCTION_WH_CODE, GET_OTHER_DOC_INFO, GET_SELL_ORDER_DOC_INFO, BPAPUS_FUNCTION_DM_CODE, BPAPUS_FUNCTION_DP_CODE, BPAPUS_FUNCTION_BK_CODE } from '../constant/bPlusApi';
import { convertProductItemToOrderItem, convertProductItemFromServerProcess, convertProductItemFromServerProcessSCR, convertProductItemFromServerProcessV3 } from '../utils/Order';
import { getUserToken, getLoginGuID, getSettingConfig, getListServiceSetting, getLoginInfo } from '../utils/Token';
import { resolveOrderDueDateForSave } from '../utils/customerDueDate';
import Request from '../utils/Request';
import { getWareLocationStockBalance } from '../api/drop-point';
export const setInitialState = () => dispatch => {
  dispatch({
    type: types.PRODUCT_SET_INITIAL_STATE
  });
};
export const setInitialStateIgnoreModal = () => dispatch => {
  dispatch({
    type: types.PRODUCT_SET_INITIAL_STATE_IGNORE_MODAL
  });
};
export const clearProductList = () => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.PRODUCT_CLEAR_LIST
    });
    resolve();
  });
};
export const setDisabledButton = bool => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.PRODUCT_SET_DISABLED_BUTTON,
      payload: bool
    });
    resolve();
  });
};
export const setCriteria = criteria => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.PRODUCT_SET_CRITERIA,
      payload: criteria
    });
    resolve();
  });
};
export const setKeyword = value => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.PRODUCT_SET_KEYWORD,
      payload: value
    });
    resolve();
  });
};
export const clearItem = () => dispatch => {
  dispatch({
    type: types.PRODUCT_CLEAR_ITEM
  });
};
export const searchProductList = (screen, nextPage) => async (dispatch, getState) => {
  dispatch({
    type: types.PRODUCT_SEARCH_LIST
  });
  try {
    let product = getState().product;
    const productCategory = getState().productCategory;
    const customer = getState().customer;
    const order = getState().order;
    const isTransferOrder = order.header?.AR_ORDER_TYPE === 'โอนย้ายสินค้า';
    const transferSourceWarehouse = isTransferOrder ? order.header?.FROM ?? {} : {};
    const storedSettings = await getListServiceSetting();
    const loginInfo = await getLoginInfo();
    const selectedKey = loginInfo?.service ?? null;
    const selectedItem = Array.isArray(storedSettings) ? storedSettings.find(item => item?.value === selectedKey) || storedSettings.find(item => item?.number === selectedKey) || storedSettings[0] : null;
    const storedWebURL = selectedItem?.webURL ?? null;
    if (!Request.instanceV3.defaults.baseURL && storedWebURL) {
      Request.setBaseV3Url(storedWebURL);
    }
    const userToken = await getUserToken();
    const {
      VANCONFIG
    } = userToken || {};
    if (!VANCONFIG) {
      dispatch({
        type: types.PRODUCT_SEARCH_LIST_FAIL
      });
      return;
    }
    const selectedWarehouseKey = transferSourceWarehouse.WL_KEY ?? VANCONFIG.VANCNF_WL;
    const LoginGUID = await getLoginGuID();
    let WL_CODE = null;
    const dataObj2 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': BPAPUS_FUNCTION_WH_CODE,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': " and WL_KEY = '" + selectedWarehouseKey + "'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0'
    };
    await lookupErpV3Api(dataObj2).then(v => {
      const {
        ResponseData,
        ResponseCode,
        ReasonString
      } = v.data;
      if (ResponseCode == 200) {
        let responseData = JSON.parse(ResponseData);
        WL_CODE = responseData.Wh000220 ? responseData.Wh000220[0].WL_CODE : null;
      } else {}
    }).catch(err => {});
    WL_CODE = transferSourceWarehouse.WL_CODE ?? WL_CODE;
    const criteria = {
      ICDEPT_KEY: productCategory.item.ICDEPT_KEY,
      ICDEPT_THAIDESC: productCategory.item.ICDEPT_THAIDESC === 'ทั้งหมด' ? null : productCategory.item.ICDEPT_THAIDESC,
      KEYWORD: product.criteria.KEYWORD,
      OFFSET: nextPage ? (product.criteria.OFFSET - 1) * product.criteria.LIMIT : (1 - 1) * product.criteria.LIMIT,
      LIMIT: product.criteria.LIMIT,
      // OFFSET: 0,
      // LIMIT: 0,
      ARCODE: order.header.AR_ORDER_TYPE === 'โอนย้ายสินค้า' ? order.header.AR_CODE : customer.item.INFO.AR_CODE,
      isTransfer: order.header.AR_ORDER_TYPE === 'โอนย้ายสินค้า' || screen === 'Stock' ? true : false
    };
    let api2 = null;
    const ARPRB_CODE = await getVanArprbCodeApi(isTransferOrder ? undefined : customer.item.INFO.AR_KEY, VANCONFIG);
    let Response = [];
    if (parseInt(VANCONFIG.VANCNF_SKU_LIMIT) == 3 || parseInt(VANCONFIG.VANCNF_SKU_LIMIT) == 4) {
      //จำกัดรหัสสินค้าตามใบโอนย้ายล่าสุด
      //บันทัด 170 - 485

      var tmep_DocType = '';
      var wsfunction = '';
      var wsGetfunction = '';
      var wsFilter = '';
      var wsFilter2 = '';
      var wsFETCH = '';
      var wsFETCH2 = '';
      if (parseInt(VANCONFIG.VANCNF_SKU_LIMIT) == 4) {
        tmep_DocType = VANCONFIG.VANCNF_TRANSFER_DT; //ใช้ใบโอนสินค้า
        wsfunction = BPAPUS_FUNCTION_DM_CODE; //ใช้ใบโอนสินค้า
        wsGetfunction = GET_OTHER_DOC_INFO;
        wsFilter = '';
        wsFilter2 = '';
        wsFETCH = 0;
        wsFETCH2 = 0;
      } else if (parseInt(VANCONFIG.VANCNF_SKU_LIMIT) == 3) {
        tmep_DocType = VANCONFIG.VANCNF_QUOTE_DT; //ใช้ใบเสนอราคา
        wsfunction = BPAPUS_FUNCTION_BK_CODE; //ใบเสนอราคา     หาใบจองสินค้า (Oe002304)
        wsGetfunction = GET_SELL_ORDER_DOC_INFO;
        wsFilter = " AND AROE_SLMN ='" + VANCONFIG.VANCNF_SLMN + "'";
        wsFilter2 = '';
        wsFETCH = 1;
        wsFETCH2 = 0;
      } else {
        tmep_DocType = ''; //ใช้ค่าเดิมของโปรแกรม,
        wsfunction = BPAPUS_FUNCTION_DM_CODE; //ใช้ค่าเดิมของโปรแกรม,
        wsGetfunction = GET_OTHER_DOC_INFO;
        wsFilter = '';
        wsFilter2 = '';
        wsFETCH = 0;
        wsFETCH2 = 0;
      }
      const RequestBody = {
        'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': wsfunction,
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER': "and DT_KEY = '" + tmep_DocType + "'" + wsFilter,
        'BPAPUS-ORDERBY': 'order by DI_DATE desc , DI_REF desc',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': wsFETCH
      };
      await lookupErpV3Api(RequestBody).then(async v => {
        const {
          ReasonString,
          ResponseCode,
          ResponseData
        } = v.data;
        const {
          [wsfunction]: resultData,
          RECORD_COUNT
        } = parseResDataToJson(v.data);
        if (ResponseCode == 200 && parseInt(RECORD_COUNT) > 0) {
          if (Response.length > 0) {
            return;
          }
          let shouldBreak = false;
          for (let i of resultData) {
            const ReqBody = {
              'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
              'BPAPUS-LOGIN-GUID': LoginGUID,
              'BPAPUS-FUNCTION': wsGetfunction,
              'BPAPUS-PARAM': '{\r\n    "DI_KEY": "' + i.DI_KEY + '"\r\n}',
              'BPAPUS-FILTER': wsFilter2,
              'BPAPUS-ORDERBY': '  Order by DI_DATE Desc , DI_REF ASC ',
              'BPAPUS-OFFSET': '0',
              'BPAPUS-FETCH': wsFETCH2
            };
            try {
              const res = await updateErpV3Api(ReqBody);
              const {
                ReasonString,
                ResponseCode
              } = res.data;
              const {
                SLDETAIL,
                DOCINFO,
                TRANSTKD,
                RECORD_COUNT
              } = parseResDataToJson(res.data);
              if (parseInt(VANCONFIG.VANCNF_SKU_LIMIT) === 4) {
                const toWl = parseInt(TRANSTKD[0]?.TRD_TO_WL);
                const configWl = parseInt(VANCONFIG.VANCNF_WL);
                if (toWl !== configWl) {
                  continue; // ⛔ ข้ามรอบนี้ทันที ไม่ทำงานต่อ
                } else {
                  shouldBreak = true; // ✅ ตั้ง flag เพื่อออก loop หลังจบรอบนี้
                }
              }
              if (ResponseCode == 200 && parseInt(RECORD_COUNT) > 0 && TRANSTKD.length > 0) {
                if (Response.length > 0) {
                  return;
                }
                for (let j of TRANSTKD) {
                  // if ((parseInt(VANCONFIG.VANCNF_SKU_LIMIT) == 4 && j.TRD_TO_WL == VANCONFIG.VANCNF_WL) || (parseInt(VANCONFIG.VANCNF_SKU_LIMIT) == 3 && j.TRD_WL == VANCONFIG.VANCNF_WL))
                  const dataObj2 = {
                    'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
                    'BPAPUS-LOGIN-GUID': LoginGUID,
                    'BPAPUS-FUNCTION': BPAPUS_FUNCTION_WH_CODE,
                    'BPAPUS-PARAM': '',
                    'BPAPUS-FILTER': "and WL_KEY = '" + VANCONFIG.VANCNF_WL + "'",
                    'BPAPUS-ORDERBY': '',
                    'BPAPUS-OFFSET': '0',
                    'BPAPUS-FETCH': '0'
                  };
                  WL_CODE = null;
                  let good_inVan_qty = 0;
                  await lookupErpV3Api(dataObj2).then(v => {
                    const {
                      ResponseData,
                      ResponseCode,
                      ReasonString
                    } = v.data;
                    if (ResponseCode == 200) {
                      let responseData = JSON.parse(ResponseData);
                      WL_CODE = responseData.Wh000220 ? responseData.Wh000220[0].WL_CODE : null;
                    } else {}
                  }).catch(err => {});
                  await getWareLocationStockBalance(j.GOODS_CODE, VANCONFIG).then(v => {
                    const {
                      ReasonString,
                      ResponseCode,
                      ResponseData
                    } = v;
                    let responseData = JSON.parse(ResponseData);
                    if (ResponseCode == 200) {
                      for (let obj of responseData.ShowSkuBalance) {
                        if (obj.WL_CODE == WL_CODE) {
                          good_inVan_qty = obj.QTY;
                        }
                      }
                    }
                  });

                  // แสดงรายการสินค้าตามเอกสารใบเสนอราคาและเอกสารใบโอนย้าย จะแสดงเฉพาะรหัสซื้อขายที่พิมพ์ในเอกสาร
                  // ต้องการให้แสดงทุกรหัสซื้อขาย เช่น เอกสารบันทึกรหัสสินค้าหน่วยนับลัง ที่หน้าแอปต้องแสดงรหัสซื้อขายทุกขนาดบรรจุ ชิ้น แพ็ค ลัง
                  if (parseInt(VANCONFIG.VANCNF_SKU_LIMIT) == 4 || parseInt(VANCONFIG.VANCNF_SKU_LIMIT) == 3) {
                    {
                      await productSearchShowRepack(j.GOODS_CODE, ARPRB_CODE, '').then(async r => {
                        let responseData3 = JSON.parse(r.ResponseData);
                        if (r.ResponseCode == 200) {
                          for (let s = 0; s < responseData3.Repack.length; s++) {
                            let temp3 = responseData3.Repack[s];
                            {
                              await productSearchListV3Api(temp3.GOODS_CODE, ARPRB_CODE, criteria).then(l => {
                                let responseData4 = JSON.parse(l.ResponseData);
                                if (l.ResponseCode == 200) {
                                  if (responseData4 && responseData4.GoodsInfo.length > 0) {
                                    if (responseData4.GoodsInfo[0].ARPLU_U_PRC && responseData4.GoodsInfo[0].ARPLU_U_PRC != '') {
                                      const temp2 = responseData4.GoodsInfo[0];
                                      temp2.ARPLU_U_PRC = parseFloat(responseData4.GoodsInfo[0].ARPLU_U_PRC) || 0;
                                      temp2.ARPRB_CODE = ARPRB_CODE; // ARPRB_CODE; // parseFloat(responseData4.GoodsInfo[0].ARPRB_CODE,);
                                      temp2.SKU_KEY = parseFloat(responseData4.GoodsInfo[0].SKU_KEY);
                                      temp2.UTQ_QTY = parseFloat(responseData4.GoodsInfo[0].UTQ_QTY);
                                      temp2.SKU_SKUALT = parseFloat(responseData4.GoodsInfo[0].SKU_SKUALT);
                                      temp2.SKU_ICCAT = parseFloat(responseData4.GoodsInfo[0].SKU_ICCAT);
                                      temp2.SKU_BRN = parseFloat(responseData4.GoodsInfo[0].SKU_BRN);
                                      temp2.SKU_ICCOLOR = parseFloat(responseData4.GoodsInfo[0].SKU_ICCOLOR);
                                      temp2.SKU_ICSIZE = parseFloat(responseData4.GoodsInfo[0].SKU_ICSIZE);
                                      temp2.SKU_ICDEPT = parseFloat(responseData4.GoodsInfo[0].SKU_ICDEPT);
                                      temp2.UTQ_KEY = parseFloat(responseData4.GoodsInfo[0].UTQ_KEY);
                                      // temp2.ICDEPT_THAIDESC =responseData4.GoodsInfo[0].ICDEPT_THAIDESC;
                                      temp2.good_inVan_qty = parseFloat(good_inVan_qty);
                                      temp2.SKU_BRN = null;
                                      temp2.SKU_ICCAT = null;
                                      temp2.SKU_ICCOLOR = null;
                                      temp2.SKU_ICDEPT = null;
                                      temp2.SKU_ICSIZE = null;
                                      temp2.SKU_KEY = null;
                                      temp2.SKU_SKUALT = null;
                                      temp2.UTQ_KEY = null;
                                      Response.push(temp2);
                                    }
                                  }
                                }
                              });
                            }
                          }
                        }
                      });
                    }
                  }
                  {
                    await productSearchListV3Api(j.GOODS_CODE, ARPRB_CODE, criteria).then(k => {
                      let responseData2 = JSON.parse(k.ResponseData);
                      if (k.ResponseCode == 200) {
                        if (responseData2 && responseData2.GoodsInfo.length > 0) {
                          if (responseData2.GoodsInfo[0].ARPLU_U_PRC && responseData2.GoodsInfo[0].ARPLU_U_PRC != '') {
                            let temp = responseData2.GoodsInfo[0];
                            temp.ARPLU_U_PRC = parseFloat(responseData2.GoodsInfo[0].ARPLU_U_PRC);
                            temp.ARPRB_CODE = ARPRB_CODE; // ARPRB_CODE; // parseFloat(responseData2.GoodsInfo[0].ARPRB_CODE,);
                            temp.SKU_KEY = parseFloat(responseData2.GoodsInfo[0].SKU_KEY);
                            temp.UTQ_QTY = parseFloat(responseData2.GoodsInfo[0].UTQ_QTY);
                            temp.SKU_SKUALT = parseFloat(responseData2.GoodsInfo[0].SKU_SKUALT);
                            temp.SKU_ICCAT = parseFloat(responseData2.GoodsInfo[0].SKU_ICCAT);
                            temp.SKU_BRN = parseFloat(responseData2.GoodsInfo[0].SKU_BRN);
                            temp.SKU_ICCOLOR = parseFloat(responseData2.GoodsInfo[0].SKU_ICCOLOR);
                            temp.SKU_ICSIZE = parseFloat(responseData2.GoodsInfo[0].SKU_ICSIZE);
                            temp.SKU_ICDEPT = parseFloat(responseData2.GoodsInfo[0].SKU_ICDEPT);
                            temp.UTQ_KEY = parseFloat(responseData2.GoodsInfo[0].UTQ_KEY);
                            temp.good_inVan_qty = parseFloat(good_inVan_qty);
                            Response.push(temp);
                          }
                          var clean = Response.filter((Response, index, self) => index === self.findIndex(t => t.GOODS_CODE === Response.GOODS_CODE && t.UTQ_NAME === Response.UTQ_NAME));
                          Response = clean.sort((a, b) => a.SKU_CODE - b.SKU_CODE); //.sort((a, b) => a.GOODS_CODE - b.GOODS_CODE);
                          // dispatch({ type: types.PRODUCT_SEARCH_LIST_SUCCESS, payload: [], });
                        } else {
                          // dispatch({ type: types.PRODUCT_SEARCH_LIST_SUCCESS, payload: [], });
                        }
                      } else {
                        dispatch({
                          type: types.PRODUCT_SEARCH_LIST_FAIL
                        });
                      }
                    });
                  }
                }
              } else {
                dispatch({
                  type: types.PRODUCT_SEARCH_LIST_SUCCESS,
                  payload: []
                });
              }
            } catch (err) {
              dispatch({
                type: types.PRODUCT_SEARCH_LIST_FAIL
              });
            }
            // ✅ หยุด loop ถ้า flag ถูกตั้งไว้
            if (shouldBreak) {
              break;
            }
          }
        } else {
          dispatch({
            type: types.PRODUCT_SEARCH_LIST_SUCCESS,
            payload: []
          });
        }
      }).catch(err => {
        dispatch({
          type: types.PRODUCT_SEARCH_LIST_FAIL
        });
      });
    } else {
      if (screen === 'ProductAddTo') {
        if (parseInt(VANCONFIG.VANCNF_SKU_LIMIT) === 1 && !isTransferOrder) {
          api2 = productSearchListByVanV3Api(criteria);
        } else {
          if (isTransferOrder || VANCONFIG.VANCNF_ARPRB_MODE === 1) {
            api2 = productSearchListByARPLUAPiByCode(ARPRB_CODE, isTransferOrder ? selectedWarehouseKey : VANCONFIG.VANCNF_WL, criteria, isTransferOrder && parseInt(VANCONFIG.VANCNF_NOV_SKU_BAL) === 2);
          } else if (VANCONFIG.VANCNF_ARPRB_MODE === 0) {
            api2 = productSearchListByARPLUAPiBykey(VANCONFIG.VANCNF_ARPRB, criteria);
          } else {
            api2 = productSearchListByVanV3Api(criteria);
          }
        }
      } else if (screen === 'Stock') {
        {
          let _wl_codes = [];
          let dataObj1 = {
            'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
            'BPAPUS-LOGIN-GUID': LoginGUID,
            'BPAPUS-FUNCTION': BPAPUS_FUNCTION_DP_CODE,
            'BPAPUS-PARAM': '',
            'BPAPUS-FILTER': "and VANCNF_KEY = '" + VANCONFIG.VANCNF_KEY + "'",
            'BPAPUS-ORDERBY': '',
            'BPAPUS-OFFSET': '0',
            'BPAPUS-FETCH': '0'
          };
          await lookupErpV3Api(dataObj1).then(v => {
            const {
              ResponseData,
              ResponseCode,
              ReasonString
            } = v.data;
            if (ResponseCode == 200) {
              let responseData = JSON.parse(ResponseData);
              for (let i = 0; i < parseInt(responseData.RECORD_COUNT); i++) {
                _wl_codes.push(responseData.Vans0106[i].WL_KEY);
              }
            }
          });
          if (parseInt(VANCONFIG.VANCNF_SKU_LIMIT) === 1) {
            api2 = productSearchListByVanV3Api(criteria);
            //api2 = productSearchListByARPLUAPiByCodeAndWHIS1(ARPRB_CODE, _wl_codes, criteria);
          } else {
            api2 = productSearchListByARPLUAPiByCodeAndWHIS1(ARPRB_CODE, _wl_codes, criteria);
          }
        }
      }
      //  -----------------------------------------------------------------
      //  -----------------------------------------------------------------
      //  -----------------------------------------------------------------
      await api2.then(async v => {
        const {
          ReasonString,
          ResponseCode,
          ResponseData
        } = v;
        let responseData = JSON.parse(ResponseData);
        if (ResponseCode == 200) {
          let RECORD_COUNT, OFFSET, FETCH, additionalData;
          // 0 ตามตารางราคาขายที่กำหนด  1=ตามตารางราคาขายในข้อตกลงหลักของลูกค้า
          if (parseInt(VANCONFIG.VANCNF_SKU_LIMIT) === 1 && !isTransferOrder) {
            if (VANCONFIG.VANCNF_ARPRB_MODE === 0) {
              if (screen === 'Stock') {
                ({
                  RECORD_COUNT,
                  OFFSET,
                  FETCH,
                  Vans0105: additionalData
                } = responseData);
              } else {
                ({
                  RECORD_COUNT,
                  OFFSET,
                  FETCH,
                  Vans0105: additionalData
                } = responseData);
              }
            } else {
              ({
                RECORD_COUNT,
                OFFSET,
                FETCH,
                Vans0105: additionalData
              } = responseData);
            }
          } else {
            if (VANCONFIG.VANCNF_ARPRB_MODE === 0) {
              ({
                RECORD_COUNT,
                OFFSET,
                FETCH,
                Sp000221: additionalData
              } = responseData);
            } else if (VANCONFIG.VANCNF_ARPRB_MODE === 1) {
              ({
                RECORD_COUNT,
                OFFSET,
                FETCH,
                Sp000221: additionalData
              } = responseData);
            } else {
              if (screen === 'Stock') {
                ({
                  RECORD_COUNT,
                  OFFSET,
                  FETCH,
                  Sp000221: additionalData
                } = responseData);
              } else {
                ({
                  RECORD_COUNT,
                  OFFSET,
                  FETCH,
                  Vans0105: additionalData
                } = responseData);
              }
            }
          }
          if (responseData && additionalData && parseInt(RECORD_COUNT) > 0) {
            let good_inVan_qty = 0;
            for (let i in additionalData) {
              good_inVan_qty = 0;
              await getWareLocationStockBalance(additionalData[i].GOODS_CODE, VANCONFIG, isTransferOrder ? selectedWarehouseKey : undefined).then(v => {
                const {
                  ReasonString,
                  ResponseCode,
                  ResponseData
                } = v;
                let responseData = JSON.parse(ResponseData);
                if (ResponseCode == 200) {
                  for (let obj of responseData.ShowSkuBalance) {
                    if (obj.WL_CODE == WL_CODE || screen === 'Stock' && obj.WL_KEY == '1') {
                      good_inVan_qty = obj.QTY;
                    }
                  }
                }
              });
              await productSearchListV3Api(additionalData[i].GOODS_CODE, ARPRB_CODE, criteria).then(k => {
                let responseData2 = JSON.parse(k.ResponseData);
                if (k.ResponseCode == 200) {
                  if (responseData2 && responseData2.GoodsInfo.length > 0) {
                    if (responseData2.GoodsInfo[0].ARPLU_U_PRC && responseData2.GoodsInfo[0].ARPLU_U_PRC != '') {
                      let temp = responseData2.GoodsInfo[0];

                      //temp.ARPLU_U_PRC = parseFloat(responseData2.GoodsInfo[0].ARPLU_U_PRC, );
                      temp.ARPLU_U_PRC = responseData2.GoodsInfo[0].ARPLU_U_PRC === '' ? 0 : parseFloat(responseData2.GoodsInfo[0].ARPLU_U_PRC);
                      temp.ARPRB_CODE = ARPRB_CODE; //.ARPRB_CODE,// parseFloat(responseData2.GoodsInfo[0].ARPRB_CODE,);
                      temp.SKU_KEY = parseFloat(responseData2.GoodsInfo[0].SKU_KEY);
                      temp.UTQ_QTY = parseFloat(responseData2.GoodsInfo[0].UTQ_QTY);
                      temp.SKU_SKUALT = parseFloat(responseData2.GoodsInfo[0].SKU_SKUALT);
                      temp.SKU_ICCAT = parseFloat(responseData2.GoodsInfo[0].SKU_ICCAT);
                      temp.SKU_BRN = parseFloat(responseData2.GoodsInfo[0].SKU_BRN);
                      temp.SKU_ICCOLOR = parseFloat(responseData2.GoodsInfo[0].SKU_ICCOLOR);
                      temp.SKU_ICSIZE = parseFloat(responseData2.GoodsInfo[0].SKU_ICSIZE);
                      temp.SKU_ICDEPT = parseFloat(responseData2.GoodsInfo[0].SKU_ICDEPT);
                      temp.UTQ_KEY = parseFloat(responseData2.GoodsInfo[0].UTQ_KEY);
                      temp.good_inVan_qty = parseFloat(good_inVan_qty);
                      const allowNegativeTransferQty = parseInt(VANCONFIG.VANCNF_NOV_SKU_BAL) === 2;
                      const shouldIncludeItem = isTransferOrder ? allowNegativeTransferQty || parseFloat(good_inVan_qty) > 0 : parseInt(VANCONFIG.VANCNF_SKU_LIMIT) == 1 || parseInt(VANCONFIG.VANCNF_SKU_LIMIT) == 3 || parseInt(VANCONFIG.VANCNF_SKU_LIMIT) == 4 || parseInt(VANCONFIG.VANCNF_SKU_LIMIT) == 2 && parseFloat(good_inVan_qty) >= 0;
                      if (shouldIncludeItem) {
                        Response.push({
                          ...additionalData[i],
                          ...temp
                        });
                      } else {}
                    }
                  } else {
                    dispatch({
                      type: types.PRODUCT_SEARCH_LIST_SUCCESS,
                      payload: []
                    });
                  }
                } else {
                  dispatch({
                    type: types.PRODUCT_SEARCH_LIST_FAIL
                  });
                }
              }).catch(error => {
                dispatch({
                  type: types.PRODUCT_SEARCH_LIST_FAIL
                });
              });
            }
          } else {
            dispatch({
              type: types.PRODUCT_SEARCH_LIST_SUCCESS,
              payload: []
            });
          }
        }
      }).catch(error => {
        dispatch({
          type: types.PRODUCT_SEARCH_LIST_FAIL,
          payload: error.message
        });
      });
    }

    if (Response && Response.length > 0) {
      dispatch(setCriteria({
        ...product.criteria,
        OFFSET: nextPage ? product.criteria.OFFSET + 1 : 2
      }));
      dispatch({
        type: types.PRODUCT_SEARCH_LIST_SUCCESS,
        payload: Response
      });
    } else {
      dispatch({
        type: types.PRODUCT_SEARCH_LIST_SUCCESS,
        payload: []
      });
    }
  } catch (searchError) {
    console.log('searchProductList CRITICAL ERROR:', searchError && searchError.message ? searchError.message : searchError);
    console.log('searchProductList CRITICAL ERROR stack:', searchError && searchError.stack);
    dispatch({
      type: types.PRODUCT_SEARCH_LIST_FAIL
    });
  }
};
export const searchProductList_bk = (screen, nextPage) => async (dispatch, getState) => {

  dispatch({
    type: types.PRODUCT_SEARCH_LIST
  });
  let product = getState().product;


  const productCategory = getState().productCategory;
  const customer = getState().customer;
  const order = getState().order;
  const {
    VANCONFIG
  } = await getUserToken();
  const LoginGUID = await getLoginGuID();

  let WL_CODE = null;

  const dataObj2 = {
    'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': LoginGUID,
    'BPAPUS-FUNCTION': BPAPUS_FUNCTION_WH_CODE,
    'BPAPUS-PARAM': '',
    'BPAPUS-FILTER': " and WL_KEY = '" + VANCONFIG.VANCNF_WL + "'",
    'BPAPUS-ORDERBY': '',
    'BPAPUS-OFFSET': '0',
    'BPAPUS-FETCH': '0'
  };
  await lookupErpV3Api(dataObj2).then(v => {
    const {
      ResponseData,
      ResponseCode,
      ReasonString
    } = v.data;
    if (ResponseCode == 200) {
      let responseData = JSON.parse(ResponseData);
      WL_CODE = responseData.Wh000220 ? responseData.Wh000220[0].WL_CODE : null;
    } else {}
  }).catch(err => {});

  const criteria = {
    ICDEPT_KEY: productCategory.item.ICDEPT_KEY,
    ICDEPT_THAIDESC: productCategory.item.ICDEPT_THAIDESC === 'ทั้งหมด' ? null : productCategory.item.ICDEPT_THAIDESC,
    KEYWORD: product.criteria.KEYWORD,
    OFFSET: nextPage ? (product.criteria.OFFSET - 1) * product.criteria.LIMIT : (1 - 1) * product.criteria.LIMIT,
    LIMIT: product.criteria.LIMIT,
    ARCODE: order.header.AR_ORDER_TYPE === 'โอนย้ายสินค้า' ? order.header.AR_CODE : customer.item.INFO.AR_CODE,
    isTransfer: order.header.AR_ORDER_TYPE === 'โอนย้ายสินค้า' || screen === 'Stock' ? true : false
  };
  let api2 = null;
  const ARPRB_CODE = await getVanArprbCodeApi(customer.item.INFO.AR_KEY, VANCONFIG);
  let Response = [];
  if (VANCONFIG.VANCNF_SKU_LIMIT == 3 || VANCONFIG.VANCNF_SKU_LIMIT == 4) {
    //จำกัดรหัสสินค้าตามใบโอนย้ายล่าสุด

    const LoginGUID = await getLoginGuID();
    const settingConfig = await getSettingConfig();

    var tmep_DocType = '';
    if (VANCONFIG.VANCNF_SKU_LIMIT == '4') {
      tmep_DocType = VANCONFIG.VANCNF_TRANSFER_DT; //ใช้ใบโอนสินค้า
    } else if (VANCONFIG.VANCNF_SKU_LIMIT == '3') {
      tmep_DocType = VANCONFIG.VANCNF_QUOTE_DT; //ใช้ใบเสนอราคา
    } else {
      tmep_DocType = ''; //ใช้ค่าเดิมของโปรแกรม,
    }
    var wsfunction = '';
    var wsGetfunction = '';
    if (VANCONFIG.VANCNF_SKU_LIMIT == '4') {
      wsfunction = BPAPUS_FUNCTION_DM_CODE; //ใช้ใบโอนสินค้า
      wsGetfunction = GET_OTHER_DOC_INFO;
    } else if (VANCONFIG.VANCNF_SKU_LIMIT == '3') {
      wsfunction = BPAPUS_FUNCTION_BK_CODE; //ใบเสนอราคา     หาใบจองสินค้า (Oe002304)
      wsGetfunction = GET_SELL_ORDER_DOC_INFO;
    } else {
      wsfunction = BPAPUS_FUNCTION_DM_CODE; //ใช้ค่าเดิมของโปรแกรม,
      wsGetfunction = GET_OTHER_DOC_INFO;
    }
    const RequestBody = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': wsfunction,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "and DT_KEY = '" + tmep_DocType + "'",
      'BPAPUS-ORDERBY': 'order by DI_DATE desc , DI_REF desc',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0'
    };

    await lookupErpV3Api(RequestBody).then(async v => {


      const {
        ReasonString,
        ResponseCode,
        ResponseData
      } = v.data;
      const {
        [wsfunction]: resultData,
        RECORD_COUNT
      } = parseResDataToJson(v.data);

      //return;

      if (ResponseCode == 200 && parseInt(RECORD_COUNT) > 0) {
        if (Response.length > 0) {
          return;
        }
        for (let i of resultData) {
          const DI_KEY = resultData[0].DI_KEY;
          const ReqBody = {
            'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
            'BPAPUS-LOGIN-GUID': LoginGUID,
            'BPAPUS-FUNCTION': wsGetfunction,
            'BPAPUS-PARAM': '{\r\n    "DI_KEY": "' + i.DI_KEY + '"\r\n}',
            'BPAPUS-FILTER': '',
            'BPAPUS-ORDERBY': '  Order by DI_DATE Desc , DI_REF ASC ',
            'BPAPUS-OFFSET': '0',
            'BPAPUS-FETCH': '0'
          };
          await updateErpV3Api(ReqBody).then(async res => {
            const {
              ReasonString,
              ResponseCode
            } = res.data;
            const {
              SLDETAIL,
              DOCINFO,
              TRANSTKD,
              RECORD_COUNT
            } = parseResDataToJson(res.data);


            if (VANCONFIG.VANCNF_SKU_LIMIT == '3') {
              if (parseInt(SLDETAIL.SLMN_KEY) !== parseInt(VANCONFIG.VANCNF_SLMN)) {
                return;
              }
            }


            if (VANCONFIG.VANCNF_SKU_LIMIT == '4') {
              if (parseInt(TRANSTKD[0].TRD_TO_WL) !== parseInt(VANCONFIG.VANCNF_WL)) {
                return;
              }
            }

            //return
            if (ResponseCode == 200 && parseInt(RECORD_COUNT) > 0 && TRANSTKD.length > 0) {
              if (Response.length > 0) {
                return;
              }
              for (let j of TRANSTKD) {
                if (VANCONFIG.VANCNF_SKU_LIMIT == 4 && j.TRD_TO_WL == VANCONFIG.VANCNF_WL || VANCONFIG.VANCNF_SKU_LIMIT == 3 && j.TRD_WL == VANCONFIG.VANCNF_WL) {}
                const dataObj2 = {
                  'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
                  'BPAPUS-LOGIN-GUID': LoginGUID,
                  'BPAPUS-FUNCTION': BPAPUS_FUNCTION_WH_CODE,
                  'BPAPUS-PARAM': '',
                  'BPAPUS-FILTER': "and WL_KEY = '" + VANCONFIG.VANCNF_WL + "'",
                  'BPAPUS-ORDERBY': '',
                  'BPAPUS-OFFSET': '0',
                  'BPAPUS-FETCH': '0'
                };
                WL_CODE = null;
                let good_inVan_qty = 0;
                await lookupErpV3Api(dataObj2).then(v => {
                  const {
                    ResponseData,
                    ResponseCode,
                    ReasonString
                  } = v.data;
                  if (ResponseCode == 200) {
                    let responseData = JSON.parse(ResponseData);
                    WL_CODE = responseData.Wh000220 ? responseData.Wh000220[0].WL_CODE : null;
                  } else {}
                }).catch(err => {});
                await getWareLocationStockBalance(j.GOODS_CODE, VANCONFIG).then(v => {
                  const {
                    ReasonString,
                    ResponseCode,
                    ResponseData
                  } = v;
                  let responseData = JSON.parse(ResponseData);
                  if (ResponseCode == 200) {

                    for (let obj of responseData.ShowSkuBalance) {
                      if (obj.WL_CODE == WL_CODE) {
                        good_inVan_qty = obj.QTY;
                      }
                    }
                  }
                });
                // แสดงรายการสินค้าตามเอกสารใบเสนอราคาและเอกสารใบโอนย้าย จะแสดงเฉพาะรหัสซื้อขายที่พิมพ์ในเอกสาร
                // ต้องการให้แสดงทุกรหัสซื้อขาย เช่น เอกสารบันทึกรหัสสินค้าหน่วยนับลัง ที่หน้าแอปต้องแสดงรหัสซื้อขายทุกขนาดบรรจุ ชิ้น แพ็ค ลัง
                if (VANCONFIG.VANCNF_SKU_LIMIT == 4 || VANCONFIG.VANCNF_SKU_LIMIT == 3) {
                  {
                    await productSearchShowRepack(j.GOODS_CODE, ARPRB_CODE, '').then(async r => {
                      let responseData3 = JSON.parse(r.ResponseData);
                      if (r.ResponseCode == 200) {
                        for (let s = 0; s < responseData3.Repack.length; s++) {
                          let temp3 = responseData3.Repack[s];
                          // if (temp3.GOODS_CODE != j.GOODS_CODE)
                          {
                            await productSearchListV3Api(temp3.GOODS_CODE, ARPRB_CODE, criteria).then(l => {
                              let responseData4 = JSON.parse(l.ResponseData);
                              if (l.ResponseCode == 200) {
                                if (responseData4 && responseData4.GoodsInfo.length > 0) {
                                  if (responseData4.GoodsInfo[0].ARPLU_U_PRC && responseData4.GoodsInfo[0].ARPLU_U_PRC != '') {
                                    const temp2 = responseData4.GoodsInfo[0];
                                    temp2.ARPLU_U_PRC = parseFloat(responseData4.GoodsInfo[0].ARPLU_U_PRC) || 0;
                                    temp2.ARPRB_CODE = ARPRB_CODE; // ARPRB_CODE; // parseFloat(responseData4.GoodsInfo[0].ARPRB_CODE,);
                                    temp2.SKU_KEY = parseFloat(responseData4.GoodsInfo[0].SKU_KEY);
                                    temp2.UTQ_QTY = parseFloat(responseData4.GoodsInfo[0].UTQ_QTY);
                                    temp2.SKU_SKUALT = parseFloat(responseData4.GoodsInfo[0].SKU_SKUALT);
                                    temp2.SKU_ICCAT = parseFloat(responseData4.GoodsInfo[0].SKU_ICCAT);
                                    temp2.SKU_BRN = parseFloat(responseData4.GoodsInfo[0].SKU_BRN);
                                    temp2.SKU_ICCOLOR = parseFloat(responseData4.GoodsInfo[0].SKU_ICCOLOR);
                                    temp2.SKU_ICSIZE = parseFloat(responseData4.GoodsInfo[0].SKU_ICSIZE);
                                    temp2.SKU_ICDEPT = parseFloat(responseData4.GoodsInfo[0].SKU_ICDEPT);
                                    temp2.UTQ_KEY = parseFloat(responseData4.GoodsInfo[0].UTQ_KEY);
                                    // temp2.ICDEPT_THAIDESC =responseData4.GoodsInfo[0].ICDEPT_THAIDESC;
                                    temp2.good_inVan_qty = parseFloat(good_inVan_qty);
                                    temp2.SKU_BRN = null;
                                    temp2.SKU_ICCAT = null;
                                    temp2.SKU_ICCOLOR = null;
                                    temp2.SKU_ICDEPT = null;
                                    temp2.SKU_ICSIZE = null;
                                    temp2.SKU_KEY = null;
                                    temp2.SKU_SKUALT = null;
                                    temp2.UTQ_KEY = null;
                                    Response.push(temp2);
                                  }
                                }
                              }
                            });
                          }
                        }
                      }
                    });
                  }
                }
                {
                  await productSearchListV3Api(j.GOODS_CODE, ARPRB_CODE, criteria).then(k => {
                    let responseData2 = JSON.parse(k.ResponseData);
                    if (k.ResponseCode == 200) {
                      if (responseData2 && responseData2.GoodsInfo.length > 0) {
                        if (responseData2.GoodsInfo[0].ARPLU_U_PRC && responseData2.GoodsInfo[0].ARPLU_U_PRC != '') {
                          let temp = responseData2.GoodsInfo[0];
                          temp.ARPLU_U_PRC = parseFloat(responseData2.GoodsInfo[0].ARPLU_U_PRC);
                          temp.ARPRB_CODE = ARPRB_CODE; // ARPRB_CODE; // parseFloat(responseData2.GoodsInfo[0].ARPRB_CODE,);
                          temp.SKU_KEY = parseFloat(responseData2.GoodsInfo[0].SKU_KEY);
                          temp.UTQ_QTY = parseFloat(responseData2.GoodsInfo[0].UTQ_QTY);
                          temp.SKU_SKUALT = parseFloat(responseData2.GoodsInfo[0].SKU_SKUALT);
                          temp.SKU_ICCAT = parseFloat(responseData2.GoodsInfo[0].SKU_ICCAT);
                          temp.SKU_BRN = parseFloat(responseData2.GoodsInfo[0].SKU_BRN);
                          temp.SKU_ICCOLOR = parseFloat(responseData2.GoodsInfo[0].SKU_ICCOLOR);
                          temp.SKU_ICSIZE = parseFloat(responseData2.GoodsInfo[0].SKU_ICSIZE);
                          temp.SKU_ICDEPT = parseFloat(responseData2.GoodsInfo[0].SKU_ICDEPT);
                          temp.UTQ_KEY = parseFloat(responseData2.GoodsInfo[0].UTQ_KEY);
                          temp.good_inVan_qty = parseFloat(good_inVan_qty);

                          Response.push(temp);
                        }
                        //return
                        var clean = Response.filter((Response, index, self) => index === self.findIndex(t => t.GOODS_CODE === Response.GOODS_CODE && t.UTQ_NAME === Response.UTQ_NAME));
                        //Response = clean;
                        Response = clean.sort((a, b) => a.SKU_CODE - b.SKU_CODE); //.sort((a, b) => a.GOODS_CODE - b.GOODS_CODE);
                        //Response = clean.sort((a, b) => a.SKU_CODE - b.SKU_CODE).sort((a, b) => a.GOODS_CODE - b.GOODS_CODE);
                        dispatch({
                          type: types.PRODUCT_SEARCH_LIST_SUCCESS,
                          payload: []
                        });
                      } else {
                        dispatch({
                          type: types.PRODUCT_SEARCH_LIST_SUCCESS,
                          payload: []
                        });
                      }
                    } else {
                      dispatch({
                        type: types.PRODUCT_SEARCH_LIST_FAIL
                      });
                    }
                  });
                }
              }
            } else {
              dispatch({
                type: types.PRODUCT_SEARCH_LIST_SUCCESS,
                payload: []
              });
            }
          }).catch(err => {
            dispatch({
              type: types.PRODUCT_SEARCH_LIST_FAIL
            });
          });
        }
      } else {
        dispatch({
          type: types.PRODUCT_SEARCH_LIST_SUCCESS,
          payload: []
        });
      }
    }).catch(err => {
      dispatch({
        type: types.PRODUCT_SEARCH_LIST_FAIL
      });
    });
  } else {
    if (screen === 'ProductAddTo') {
      if (VANCONFIG.VANCNF_SKU_LIMIT === 1) {
        api2 = productSearchListByVanV3Api(criteria);
        // if (VANCONFIG.VANCNF_ARPRB_MODE === 1) {
        //   // 0 ตามตารางราคาขายที่กำหนด  1=ตามตารางราคาขายในข้อตกลงหลักของลูกค้า
        //   api2 = productSearchListByVanV3Api(criteria);
        //  // api2 = productSearchListByARPLUAPiByCode(ARPRB_CODE, criteria);
        // } else {
        //   api2 = productSearchListByARPLUAPiBykey(VANCONFIG.VANCNF_ARPRB, criteria);
        // }
      } else {
        // VANCONFIG.VANCNF_SKU_LIMIT === 2
        // VANCONFIG.VANCNF_SKU_LIMIT === 3
        // VANCONFIG.VANCNF_SKU_LIMIT ===

        if (VANCONFIG.VANCNF_ARPRB_MODE === 1) {
          api2 = productSearchListByARPLUAPiByCode(ARPRB_CODE, VANCONFIG.VANCNF_WL, criteria);
        } else if (VANCONFIG.VANCNF_ARPRB_MODE === 0) {
          api2 = productSearchListByARPLUAPiBykey(VANCONFIG.VANCNF_ARPRB, criteria);
        } else {
          api2 = productSearchListByVanV3Api(criteria);
        }
      }
    } else if (screen === 'Stock') {
      // if (VANCONFIG.VANCNF_ARPRB_MODE === 1) {
      //   // 0 ตามตารางราคาขายที่กำหนด  1=ตามตารางราคาขายในข้อตกลงหลักของลูกค้า
      //   // api = productSkuSearchListApi(criteria)
      //   api2 = productSearchListByVanV3Api(criteria);
      //  // api2 = productSearchListByARPLUAPiByCode(ARPRB_CODE, criteria);
      // } else
      {
        let _wl_codes = [];
        let dataObj1 = {
          'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
          'BPAPUS-LOGIN-GUID': LoginGUID,
          'BPAPUS-FUNCTION': BPAPUS_FUNCTION_DP_CODE,
          'BPAPUS-PARAM': '',
          'BPAPUS-FILTER': "and VANCNF_KEY = '" + VANCONFIG.VANCNF_KEY + "'",
          'BPAPUS-ORDERBY': '',
          'BPAPUS-OFFSET': '0',
          'BPAPUS-FETCH': '0'
        };
        await lookupErpV3Api(dataObj1).then(v => {
          const {
            ResponseData,
            ResponseCode,
            ReasonString
          } = v.data;
          if (ResponseCode == 200) {
            let responseData = JSON.parse(ResponseData);
            for (let i = 0; i < parseInt(responseData.RECORD_COUNT); i++) {
              //if (VANCONFIG.VANCNF_ENQ_WL == 1) {
              _wl_codes.push(responseData.Vans0106[i].WL_KEY);
              // } else if (VANCONFIG.VANCNF_ENQ_WL == 2) {
              //   if (VANCONFIG.VANCNF_WL == responseData.Vans0106[i].WL_KEY) {
              //     _wl_codes.push(responseData.Vans0106[i].WL_CODE);
              //   }
              // }
            }
          }
        });
        if (VANCONFIG.VANCNF_SKU_LIMIT === 1) {
          api2 = productSearchListByVanV3Api(criteria);
          //api2 = productSearchListByARPLUAPiByCodeAndWHIS1(ARPRB_CODE, _wl_codes, criteria);
        } else {
          api2 = productSearchListByARPLUAPiByCodeAndWHIS1(ARPRB_CODE, _wl_codes, criteria);
        }
      }
    }


    await api2.then(async v => {
      const {
        ReasonString,
        ResponseCode,
        ResponseData
      } = v;
      let responseData = JSON.parse(ResponseData);
      if (ResponseCode == 200) {
        let RECORD_COUNT, OFFSET, FETCH, additionalData;
        // 0 ตามตารางราคาขายที่กำหนด  1=ตามตารางราคาขายในข้อตกลงหลักของลูกค้า

        if (VANCONFIG.VANCNF_SKU_LIMIT === 1) {
          if (VANCONFIG.VANCNF_ARPRB_MODE === 0) {
            if (screen === 'Stock') {
              // ({ RECORD_COUNT, OFFSET, FETCH, Sp000221 : additionalData } = responseData);
              ({
                RECORD_COUNT,
                OFFSET,
                FETCH,
                Vans0105: additionalData
              } = responseData);
            } else {
              ({
                RECORD_COUNT,
                OFFSET,
                FETCH,
                Vans0105: additionalData
              } = responseData);
            }
          } else {
            ({
              RECORD_COUNT,
              OFFSET,
              FETCH,
              Vans0105: additionalData
            } = responseData);
          }
        } else {
          // VANCONFIG.VANCNF_SKU_LIMIT === 2
          // VANCONFIG.VANCNF_SKU_LIMIT === 3
          // VANCONFIG.VANCNF_SKU_LIMIT === 4
          if (VANCONFIG.VANCNF_ARPRB_MODE === 0) {
            ({
              RECORD_COUNT,
              OFFSET,
              FETCH,
              Sp000221: additionalData
            } = responseData);
          } else if (VANCONFIG.VANCNF_ARPRB_MODE === 1) {
            ({
              RECORD_COUNT,
              OFFSET,
              FETCH,
              Sp000221: additionalData
            } = responseData);
          } else {
            if (screen === 'Stock') {
              ({
                RECORD_COUNT,
                OFFSET,
                FETCH,
                Sp000221: additionalData
              } = responseData);
            } else {
              ({
                RECORD_COUNT,
                OFFSET,
                FETCH,
                Vans0105: additionalData
              } = responseData);
            }
          }
        }
        if (responseData && additionalData && parseInt(RECORD_COUNT) > 0) {
          let good_inVan_qty = 0;
          for (let i in additionalData) {
            good_inVan_qty = 0;
            await getWareLocationStockBalance(additionalData[i].GOODS_CODE, VANCONFIG).then(v => {
              const {
                ReasonString,
                ResponseCode,
                ResponseData
              } = v;
              let responseData = JSON.parse(ResponseData);
              if (ResponseCode == 200) {
                for (let obj of responseData.ShowSkuBalance) {
                  if (obj.WL_CODE == WL_CODE || screen === 'Stock' && obj.WL_KEY == '1') {
                    good_inVan_qty = obj.QTY;
                  }
                }
              }
            });
            await productSearchListV3Api(additionalData[i].GOODS_CODE, ARPRB_CODE, criteria).then(k => {
              let responseData2 = JSON.parse(k.ResponseData);

              //   '====================================== responseData2.TAG_PROPERTIES',
              //   responseData2.GoodsInfo[0].TAG_PROPERTIES,
              // );

              //  responseData2.GoodsInfo[0].TAG_PROPERTIES == "" ? responseData2.GoodsInfo[0].TAG_PROPERTIES = "0" : responseData2.GoodsInfo[0].TAG_PROPERTIES = responseData2.GoodsInfo[0].TAG_PROPERTIES

              //   'productSearchListV3Api responseData2 ==== ',
              //   responseData2,
              // );

              if (k.ResponseCode == 200) {
                if (responseData2 && responseData2.GoodsInfo.length > 0) {
                  if (responseData2.GoodsInfo[0].ARPLU_U_PRC && responseData2.GoodsInfo[0].ARPLU_U_PRC != '') {
                    let temp = responseData2.GoodsInfo[0];

                    //temp.ARPLU_U_PRC = parseFloat(responseData2.GoodsInfo[0].ARPLU_U_PRC, );
                    temp.ARPLU_U_PRC = responseData2.GoodsInfo[0].ARPLU_U_PRC === '' ? 0 : parseFloat(responseData2.GoodsInfo[0].ARPLU_U_PRC);
                    temp.ARPRB_CODE = ARPRB_CODE; //.ARPRB_CODE,// parseFloat(responseData2.GoodsInfo[0].ARPRB_CODE,);
                    temp.SKU_KEY = parseFloat(responseData2.GoodsInfo[0].SKU_KEY);
                    temp.UTQ_QTY = parseFloat(responseData2.GoodsInfo[0].UTQ_QTY);
                    temp.SKU_SKUALT = parseFloat(responseData2.GoodsInfo[0].SKU_SKUALT);
                    temp.SKU_ICCAT = parseFloat(responseData2.GoodsInfo[0].SKU_ICCAT);
                    temp.SKU_BRN = parseFloat(responseData2.GoodsInfo[0].SKU_BRN);
                    temp.SKU_ICCOLOR = parseFloat(responseData2.GoodsInfo[0].SKU_ICCOLOR);
                    temp.SKU_ICSIZE = parseFloat(responseData2.GoodsInfo[0].SKU_ICSIZE);
                    temp.SKU_ICDEPT = parseFloat(responseData2.GoodsInfo[0].SKU_ICDEPT);
                    temp.UTQ_KEY = parseFloat(responseData2.GoodsInfo[0].UTQ_KEY);
                    temp.good_inVan_qty = parseFloat(good_inVan_qty);
                    if (VANCONFIG.VANCNF_SKU_LIMIT == 1 || VANCONFIG.VANCNF_SKU_LIMIT == 3 || VANCONFIG.VANCNF_SKU_LIMIT == 4 || VANCONFIG.VANCNF_SKU_LIMIT == 2 && parseFloat(good_inVan_qty) >= 0) {
                      Response.push({
                        ...additionalData[i],
                        ...temp
                      });
                    }
                  }
                  // else {
                  //   Response.push({...additionalData[i]});
                  //  // dispatch({type: types.PRODUCT_SEARCH_LIST_SUCCESS, payload: [],});
                  // }
                } else {
                  dispatch({
                    type: types.PRODUCT_SEARCH_LIST_SUCCESS,
                    payload: []
                  });
                }
              } else {
                dispatch({
                  type: types.PRODUCT_SEARCH_LIST_FAIL
                });
              }
            }).catch(error => {
              dispatch({
                type: types.PRODUCT_SEARCH_LIST_FAIL
              });
            });
          }
        } else {
          dispatch({
            type: types.PRODUCT_SEARCH_LIST_SUCCESS,
            payload: []
          });
        }
      }
    }).catch(error => {
      dispatch({
        type: types.PRODUCT_SEARCH_LIST_FAIL,
        payload: error.message
      });
    });
  }

  if (Response && Response.length > 0) {
    dispatch(setCriteria({
      ...product.criteria,
      OFFSET: nextPage ? product.criteria.OFFSET + 1 : 2
    }));
    dispatch({
      type: types.PRODUCT_SEARCH_LIST_SUCCESS,
      payload: Response
    });
  } else {
    dispatch({
      type: types.PRODUCT_SEARCH_LIST_SUCCESS,
      payload: []
    });
  }
};
export const searchProductByGoodsCode = () => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    const product = getState().product;
    const customer = getState().customer;
    const order = getState().order;
    const userToken = await getUserToken();
    const {
      VANCONFIG
    } = userToken || {};
    const LoginGUID = await getLoginGuID();
    const isTransferOrder = order.header?.AR_ORDER_TYPE === 'โอนย้ายสินค้า';
    const transferSourceWarehouse = isTransferOrder ? order.header?.FROM ?? {} : {};
    const selectedWarehouseKey = transferSourceWarehouse.WL_KEY ?? VANCONFIG?.VANCNF_WL;
    let selectedWarehouseCode = transferSourceWarehouse.WL_CODE ?? null;
    if (VANCONFIG && (parseInt(VANCONFIG.VANCNF_SKU_LIMIT) === 3 || parseInt(VANCONFIG.VANCNF_SKU_LIMIT) === 4)) {
      const previousKeyword = product.criteria.KEYWORD;
      const previousListItems = Array.isArray(product.listItems) ? product.listItems : [];
      try {
        dispatch({
          type: types.PRODUCT_SET_KEYWORD,
          payload: product.criteria.GOODS_CODE
        });
        dispatch({
          type: types.PRODUCT_SET_LIST_ITEMS,
          payload: []
        });
        await dispatch(searchProductList('ProductAddTo', false));
        const filteredProduct = getState().product;
        const matchedItem = Array.isArray(filteredProduct.listItems) ? filteredProduct.listItems.find(item => item.GOODS_CODE === product.criteria.GOODS_CODE) : null;
        if (matchedItem) {
          dispatch({
            type: types.PRODUCT_SET_ITEM,
            payload: {
              type: 'add',
              item: matchedItem
            }
          });
          resolve(matchedItem);
        } else {
          reject('ไม่พบข้อมูลสินค้า');
        }
      } catch (error) {
        reject(error);
      } finally {
        dispatch({
          type: types.PRODUCT_SET_KEYWORD,
          payload: previousKeyword
        });
        dispatch({
          type: types.PRODUCT_SET_LIST_ITEMS,
          payload: previousListItems
        });
      }
      return;
    }
    const AR_CODE = order.header.AR_ORDER_TYPE === 'โอนย้ายสินค้า' ? order.header.AR_CODE : customer.item.INFO.AR_CODE;
    const IS_TRANSFER = order.header.AR_ORDER_TYPE === 'โอนย้ายสินค้า' ? true : false;
    if (isTransferOrder && !selectedWarehouseCode) {
      const warehouseRequest = {
        'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': BPAPUS_FUNCTION_WH_CODE,
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER': " and WL_KEY = '" + selectedWarehouseKey + "'",
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0'
      };
      await lookupErpV3Api(warehouseRequest).then(v => {
        const {
          ResponseData,
          ResponseCode,
          ReasonString
        } = v.data;
        if (ResponseCode == 200) {
          let responseData = JSON.parse(ResponseData);
          selectedWarehouseCode = responseData.Wh000220 ? responseData.Wh000220[0].WL_CODE : null;
        } else {}
      }).catch(err => {});
    }
    const data = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': 'ShowGoodsInfo',
      'BPAPUS-PARAM': '{\r\n    "GOODS_CODE": "' + product.criteria.GOODS_CODE + '",\r\n    "ARPRB_CODE": "' + customer.item.ARPRB.ARPRB_CODE + '"\r\n}',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '1'
    };
    showPriceErpV3Api(data).then(async v => {
      const {
        ReasonString,
        ResponseCode,
        ResponseData
      } = v;
      let responseData = JSON.parse(ResponseData);
      if (ResponseCode == 200) {
        if (parseInt(responseData.RECORD_COUNT) > 0) {
          let goodInSourceQty = 0;
          if (isTransferOrder && selectedWarehouseCode) {
            await getWareLocationStockBalance(product.criteria.GOODS_CODE, VANCONFIG, selectedWarehouseKey).then(stockResponse => {
              const {
                ResponseCode: stockCode,
                ResponseData: stockData
              } = stockResponse;
              if (stockCode == 200) {
                let parsedStockData = JSON.parse(stockData);
                for (let item of parsedStockData.ShowSkuBalance ?? []) {
                  if (item.WL_CODE == selectedWarehouseCode) {
                    goodInSourceQty = parseFloat(item.QTY);
                    break;
                  }
                }
              }
            }).catch(error => {});
          }
          const allowNegativeTransferQty = parseInt(VANCONFIG?.VANCNF_NOV_SKU_BAL) === 2;
          if (isTransferOrder && !allowNegativeTransferQty && goodInSourceQty <= 0) {
            reject('ไม่พบข้อมูลสินค้าในคลังต้นทาง');
            return;
          }
          dispatch({
            type: types.PRODUCT_SET_ITEM,
            payload: {
              type: 'add',
              item: {
                ...responseData.GoodsInfo[0],
                good_inVan_qty: isTransferOrder ? goodInSourceQty : responseData.GoodsInfo[0].good_inVan_qty
              }
            }
          });
          resolve(v);
        } else {
          reject('ไม่พบข้อมูลสินค้า');
        }
      }
    });

    // productSearchByGoodCodeApi(
    //   product.criteria.GOODS_CODE,
    //   AR_CODE,
    //   IS_TRANSFER,
    // )
    //   .then((v) => {
    //     const {RESULT_DATA, STATUS, ERROR_MESSAGES} = v;

    //     if (STATUS === '00') {
    //       const {RESULT} = RESULT_DATA;

    //       if (RESULT_DATA && RESULT && RESULT.length > 0) {
    //         dispatch({
    //           type: types.PRODUCT_SET_ITEM,
    //           payload: {type: 'add', item: RESULT[0]},
    //         });
    //         resolve(v);
    //       } else {
    //         reject('ไม่พบข้อมูลสินค้า');
    //       }
    //     } else if (STATUS === '10' && ERROR_MESSAGES[0]) {
    //       reject(ERROR_MESSAGES[0]);
    //     }
    //   })
    //   .catch((error) => {
    //     reject(error.message);
    //   });
  });
};
export const setProduct = (type, item) => dispatch => {
  if (item.good_inVan_qty && item.good_inVan_qty._W !== undefined) {
    item.good_inVan_qty = item.good_inVan_qty._W;
  }
  if (item.TMP_GOOD_QTY) {
    item.TMP_GOOD_QTY = null;
  }
  dispatch({
    type: types.PRODUCT_SET_ITEM,
    payload: {
      type: type,
      item: item
    }
  });
};
export const setProductListItems = items => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.PRODUCT_SET_LIST_ITEMS,
      payload: items
    });
    resolve();
  });
};
export const setItemQty = value => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.PRODUCT_SET_ITEM_QTY,
      payload: value
    });
    resolve();
  });
};
export const setItemLot = value => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.PRODUCT_SET_ITEM_LOT,
      payload: value
    });
    resolve();
  });
};
export const setItemSerial = value => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.PRODUCT_SET_ITEM_SERIAL,
      payload: value
    });
    resolve();
  });
};
export const setItemTotalPrice = value => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.PRODUCT_SET_ITEM_TOTAL_PRICE,
      payload: value
    });
    resolve();
  });
};
export const setItemNetPrice = value => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.PRODUCT_SET_ITEM_NET_PRICE,
      payload: value
    });
    resolve();
  });
};
export const setItemDiscount = value => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.PRODUCT_SET_ITEM_DISCOUNT,
      payload: value
    });
    resolve();
  });
};
export const setItemTotalDiscount = value => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.PRODUCT_SET_ITEM_TOTAL_DISCOUNT,
      payload: value
    });
    resolve();
  });
};
export const setItemFree = value => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.PRODUCT_SET_ITEM_FREE,
      payload: value
    });
    resolve();
  });
};
export const setModal = bool => dispatch => {
  dispatch({
    type: types.PRODUCT_SET_MODAL,
    payload: bool
  });
};
export const setError = bool => dispatch => {
  dispatch({
    type: types.PRODUCT_SET_ERROR,
    payload: bool
  });
};
export const processOrderItem = vanConfig => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    const customer = getState().customer;
    const product = getState().product;
    const order = getState().order;


    //   'processOrderSale  order.header.AR_ORDER_TYPE ',
    //   order.header.AR_ORDER_TYPE,
    // );
    const ignoreCpgn = order.header.AR_ORDER_TYPE === 'รับคืนสินค้า' || order.header.AR_ORDER_TYPE === 'โอนย้ายสินค้า' ? true : false;
    let api = null;

    //if (order.header.AR_ORDER_TYPE !== 'โอนย้ายสินค้า') {
    // api = processOrderItemApi(
    //   customer.item.INFO.AR_KEY,
    //   convertProductItemToOrderItem(product.item, ignoreCpgn),
    // );

    let data = [];
    const LoginGUID = await getLoginGuID();
    data = convertProductItemFromServerProcessV3(product.item);
    let ImpTrhDetail = [];
    // แก้ตรงนี้ Bazz
    ImpTrhDetail.push(data);
    // แก้ตรงนี้ Bazz
    let DT_KEY;
    if (order.header.AR_ORDER_TYPE == 'ใบเสนอราคา') {
      DT_KEY = vanConfig.VANCNF_QUOTE_DT;
    } else if (order.header.AR_ORDER_TYPE == 'เสนอราคา') {
      DT_KEY = vanConfig.VANCNF_QUOTE_DT;
    } else if (order.header.AR_ORDER_TYPE == 'รับคืนสินค้า') {
      DT_KEY = vanConfig.VANCNF_CASHRTN_DT;
    } else if (order.header.AR_ORDER_TYPE == 'ขายสินค้า') {
      DT_KEY = vanConfig.VANCNF_CASHSALES_DT;
    } else if (order.header.AR_ORDER_TYPE == 'จองสินค้า') {
      DT_KEY = vanConfig.VANCNF_BOOK_DT;
    } else if (order.header.AR_ORDER_TYPE == 'โอนย้ายสินค้า') {
      DT_KEY = vanConfig.VANCNF_TRANSFER_DT;
    }
    let dataObj1 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': BPAPUS_FUNCTION_DC_CODE,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "and DT_KEY = '" + DT_KEY + "'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0'
    };
    let VANCNF_DT = null;
    let DT_PROPERTIES = null;
    await lookupErpV3Api(dataObj1).then(v => {
      const {
        ResponseData,
        ResponseCode,
        ReasonString
      } = v.data;
      if (ResponseCode == 200) {
        let responseData = JSON.parse(ResponseData);
        VANCNF_DT = responseData.Dc000110 ? responseData.Dc000110[0].DT_DOCCODE : null;
        DT_PROPERTIES = responseData.Dc000110 ? responseData.Dc000110[0].DT_PROPERTIES : null;
      } else {}
    }).catch(err => {});
    let dataObj2 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': BPAPUS_FUNCTION_WH_CODE,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "and WL_KEY = '" + vanConfig.VANCNF_WL + "'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0'
    };
    let WL_CODE = null;
    await lookupErpV3Api(dataObj2).then(v => {
      const {
        ResponseData,
        ResponseCode,
        ReasonString
      } = v.data;
      if (ResponseCode == 200) {
        let responseData = JSON.parse(ResponseData);
        WL_CODE = responseData.Wh000220 ? responseData.Wh000220[0].WL_CODE : null;
      } else {}
    }).catch(err => {});
    if (order.header.AR_ORDER_TYPE == 'ขายสินค้า') {
      for (let i in data.ITEMS) {
        let newObj = {
          KEY: '',
          TRD_DSC_KEYIN: data.ITEMS[i].TRD_DSC_KEYIN + '*' + data.ITEMS[i].TRD_QTY + 'B',
          TRD_DSC_KEYINV: parseFloat(data.ITEMS[i].TRD_DSC_KEYINV).toFixed(2),
          TRD_Q_FREE: parseFloat(data.ITEMS[i].TRD_Q_FREE).toFixed(2),
          TRD_OPTION: data.ITEMS[i].TRD_OPTION,
          TRD_KEYIN: data.ITEMS[i].TRD_KEYIN,
          SKU_NAME: data.ITEMS[i].TRD_NAMES ? data.ITEMS[i].TRD_NAMES : null,
          UTQ_NAME: data.ITEMS[i].TRD_UTQNAME,
          TRD_QTY: parseFloat(data.ITEMS[i].TRD_QTY).toFixed(2),
          X_MODEL: 10,
          // แก้ตรงนี้ Bazz
          TRD_WL: WL_CODE,
          TRD_TO_WL: WL_CODE,
          TRD_K_U_PRC: parseFloat(data.ITEMS[i].TRD_U_PRC).toFixed(2),
          AMOUNT: parseFloat(data.ITEMS[i].TRD_G_AMT).toFixed(2),
          TRD_U_VATIO: data.ITEMS[i].TRD_U_VATIO
        };
        ImpTrhDetail.push(newObj);
      }
      let param = {
        ErpUpdFunc: [{
          ImpTrhHeader: {
            TRH_ARPRB: 1,
            DI_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            DI_REF: '<เลขถัดไป>',
            DT_DOCCODE: VANCNF_DT,
            DT_PROPERTIES: DT_PROPERTIES,
            VAT_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            VAT_REF: '<เลขเดียวกัน>',
            VAT_RATE: vanConfig.VANCNF_VAT_RATE,
            VAT_RFR_REF: '<เลขเดียวกัน>',
            TRH_SHIP_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            SLMN_CODE: '0',
            AR_CODE: order.header.AR_CODE,
            ARPRB_CODE: customer.item.ARPRB.ARPRB_CODE,
            ARD_TDSC_KEYIN: '0',
            ARD_DUE_DA: resolveOrderDueDateForSave(order.header, getState().customerSelect)
          },
          ImpTrhDetail: ImpTrhDetail,
          ImpTranPayd: [
            // {
            //   "CASHAC_CODE": "",
            //   "CASHAC_NAME": "",
            //   "CASHAC_AMT": "0",
            //   "BNKAC_CODE": "",
            //   "BNKAC_NAME": "",
            //   "BNKAC_AMT": "0",
            //   "QRCT_CODE": "",
            //   "QRCT_NAME": "",
            //   "QRCT_AMT": "0",
            //   "CQIN_1_OWNER": "",
            //   "CQIN_1_BANK_INTL": "",
            //   "CQIN_1_BRANCH": "",
            //   "CQIN_1_CHEQUE_NO": "",
            //   "CQIN_1_CHEQUE_DD": "18991230_8",
            //   "CQIN_1_AMT": "0",
            //   "CQIN_2_OWNER": "",
            //   "CQIN_2_BANK_INTL": "",
            //   "CQIN_2_BRANCH": "",
            //   "CQIN_2_CHEQUE_NO": "",
            //   "CQIN_2_CHEQUE_DD": "18991230",
            //   "CQIN_2_AMT": "0",
            //   "CQIN_3_OWNER": "",
            //   "CQIN_3_BANK_INTL": "",
            //   "CQIN_3_BRANCH": "",
            //   "CQIN_3_CHEQUE_NO": "",
            //   "CQIN_3_CHEQUE_DD": "18991230",
            //   "CQIN_3_AMT": "0",
            //   "PMT_1_CODE": "",
            //   "PMT_1_NAME": "",
            //   "PMT_1_AMT": "0",
            //   "PMT_2_CODE": "",
            //   "PMT_2_NAME": "",
            //   "PMT_2_AMT": "0",
            //   "REMAIN_OPTION": ""
            // }
          ]
        }]
      };
      let dataObj = {
        'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': 'CalcInvoiceDocinfo',
        'BPAPUS-PARAM': JSON.stringify(param),
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0'
      };
      processOrderItemV3Api(dataObj).then(v => {
        const {
          ResponseData,
          ResponseCode,
          ReasonString
        } = v;
        if (ResponseCode == 200) {
          let responseData = JSON.parse(ResponseData);
          dispatch({
            type: types.PRODUCT_SET_ITEM,
            payload: {
              type: 'edit',
              item: convertProductItemFromServerProcess(product.item, responseData, vanConfig.VANCNF_ROUND //Bazz ปัดเศษสะดวกทอน
              )
            }
          });
        } else {
          //dispatch({type: types.ORDER_CREATE_FAIL, payload: ReasonString});

          reject(ReasonString);
        }
        resolve(v);
      }).catch(err => {
        reject(err.message);
      });
    } else if (order.header.AR_ORDER_TYPE == 'จองสินค้า' || order.header.AR_ORDER_TYPE == 'ใบเสนอราคา') {
      let param = {
        ErpUpdFunc: [{
          ImpTrhHeader: {
            TRH_ARPRB: 1,
            DI_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            DI_REF: '<เลขถัดไป>',
            DT_DOCCODE: VANCNF_DT,
            DT_PROPERTIES: DT_PROPERTIES,
            VAT_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            VAT_REF: '<เลขเดียวกัน>',
            VAT_RATE: vanConfig.VANCNF_VAT_RATE,
            VAT_RFR_REF: '<เลขเดียวกัน>',
            // TRH_SHIP_DATE: moment('23/12/2023').format('YYYYMMDDhhmm'),

            TRH_SHIP_DATE: moment(order.header.VDI_SHIP_DATE).format('YYYYMMDDhhmm'),
            SLMN_CODE: '0',
            AR_CODE: order.header.AR_CODE,
            ARPRB_CODE: customer.item.ARPRB.ARPRB_CODE,
            ARD_TDSC_KEYIN: '0',
            ARD_DUE_DA: resolveOrderDueDateForSave(order.header, getState().customerSelect)
          },
          ImpTrhDetail: ImpTrhDetail
        }]
      };
      let dataObj = {
        'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': 'CalcSellOrderDocinfo',
        'BPAPUS-PARAM': JSON.stringify(param),
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0'
      };
      processOrderItemV3Api(dataObj).then(v => {
        const {
          ResponseData,
          ResponseCode,
          ReasonString
        } = v;
        if (ResponseCode == 200) {
          let responseData = JSON.parse(ResponseData);
          dispatch({
            type: types.PRODUCT_SET_ITEM,
            payload: {
              type: 'edit',
              item: convertProductItemFromServerProcess(product.item, responseData, vanConfig.VANCNF_ROUND //Bazz ปัดเศษสะดวกทอน
              )
            }
          });
        } else {
          //dispatch({type: types.ORDER_CREATE_FAIL, payload: ReasonString});

          reject(ReasonString + ' : ' + ResponseData);
        }
        resolve(v);
      }).catch(err => {
        reject(err.message);
      });
    } else if (order.header.AR_ORDER_TYPE == 'ใบเสนอราคา') {
      let param = {
        ErpUpdFunc: [{
          ImpTrhHeader: {
            TRH_ARPRB: 1,
            DI_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            DI_REF: '<เลขถัดไป>',
            DT_DOCCODE: VANCNF_DT,
            DT_PROPERTIES: DT_PROPERTIES,
            VAT_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            VAT_REF: '<เลขเดียวกัน>',
            VAT_RATE: vanConfig.VANCNF_VAT_RATE,
            VAT_RFR_REF: '<เลขเดียวกัน>',
            TRH_SHIP_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            SLMN_CODE: '0',
            AR_CODE: order.header.AR_CODE,
            ARPRB_CODE: customer.item.ARPRB.ARPRB_CODE,
            ARD_TDSC_KEYIN: '0',
            ARD_DUE_DA: resolveOrderDueDateForSave(order.header, getState().customerSelect)
          },
          ImpTrhDetail: ImpTrhDetail
        }]
      };
      let dataObj = {
        'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': 'CalcOtherIcDocinfo',
        'BPAPUS-PARAM': JSON.stringify(param),
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0'
      };
      processOrderItemV3Api(dataObj).then(v => {
        const {
          ResponseData,
          ResponseCode,
          ReasonString
        } = v;
        if (ResponseCode == 200) {
          let responseData = JSON.parse(ResponseData);
          dispatch({
            type: types.PRODUCT_SET_ITEM,
            payload: {
              type: 'edit',
              item: convertProductItemFromServerProcess(product.item, responseData, vanConfig.VANCNF_ROUND //Bazz ปัดเศษสะดวกทอน
              )
            }
          });
        } else {
          //dispatch({type: types.ORDER_CREATE_FAIL, payload: ReasonString});

          reject(ReasonString);
        }
        resolve(v);
      }).catch(err => {
        reject(err.message);
      });
    } else {
      let param = {
        ErpUpdFunc: [{
          ImpTrhHeader: {
            TRH_ARPRB: 1,
            DI_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            DI_REF: '<เลขถัดไป>',
            DT_DOCCODE: VANCNF_DT,
            DT_PROPERTIES: DT_PROPERTIES,
            VAT_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            VAT_REF: '<เลขเดียวกัน>',
            VAT_RATE: vanConfig.VANCNF_VAT_RATE,
            VAT_RFR_REF: '<เลขเดียวกัน>',
            TRH_SHIP_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            SLMN_CODE: '0',
            AR_CODE: order.header.AR_CODE,
            ARPRB_CODE: customer.item.ARPRB.ARPRB_CODE,
            ARD_TDSC_KEYIN: '0',
            ARD_DUE_DA: resolveOrderDueDateForSave(order.header, getState().customerSelect)
          },
          ImpTrhDetail: ImpTrhDetail,
          ImpTranPayd: [
            // {
            //   "CASHAC_CODE": "",
            //   "CASHAC_NAME": "",
            //   "CASHAC_AMT": "0",
            //   "BNKAC_CODE": "",
            //   "BNKAC_NAME": "",
            //   "BNKAC_AMT": "0",
            //   "QRCT_CODE": "",
            //   "QRCT_NAME": "",
            //   "QRCT_AMT": "0",
            //   "CQIN_1_OWNER": "",
            //   "CQIN_1_BANK_INTL": "",
            //   "CQIN_1_BRANCH": "",
            //   "CQIN_1_CHEQUE_NO": "",
            //   "CQIN_1_CHEQUE_DD": "18991230_9",
            //   "CQIN_1_AMT": "0",
            //   "CQIN_2_OWNER": "",
            //   "CQIN_2_BANK_INTL": "",
            //   "CQIN_2_BRANCH": "",
            //   "CQIN_2_CHEQUE_NO": "",
            //   "CQIN_2_CHEQUE_DD": "18991230",
            //   "CQIN_2_AMT": "0",
            //   "CQIN_3_OWNER": "",
            //   "CQIN_3_BANK_INTL": "",
            //   "CQIN_3_BRANCH": "",
            //   "CQIN_3_CHEQUE_NO": "",
            //   "CQIN_3_CHEQUE_DD": "18991230",
            //   "CQIN_3_AMT": "0",
            //   "PMT_1_CODE": "",
            //   "PMT_1_NAME": "",
            //   "PMT_1_AMT": "0",
            //   "PMT_2_CODE": "",
            //   "PMT_2_NAME": "",
            //   "PMT_2_AMT": "0",
            //   "REMAIN_OPTION": ""
            // }
          ]
        }]
      };
      let dataObj = {
        'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': 'CalcInvoiceDocinfo',
        'BPAPUS-PARAM': JSON.stringify(param),
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0'
      };
      processOrderItemV3Api(dataObj).then(v => {
        const {
          ResponseData,
          ResponseCode,
          ReasonString
        } = v;
        if (ResponseCode == 200) {
          let responseData = JSON.parse(ResponseData);
          dispatch({
            type: types.PRODUCT_SET_ITEM,
            payload: {
              type: 'edit',
              item: convertProductItemFromServerProcess(product.item, responseData, vanConfig.VANCNF_ROUND //Bazz ปัดเศษสะดวกทอน
              )
            }
          });
        } else {
          //dispatch({type: types.ORDER_CREATE_FAIL, payload: ReasonString});

          reject(ReasonString);
        }
        resolve(v);
      }).catch(err => {
        reject(err.message);
      });
    }
    // } else {
    //   api = processOrderTransferApi(
    //     order.header.VDI_KEY,
    //     convertProductItemToOrderItem(product.item, ignoreCpgn),
    //   );
    // }
  });
};
export const processOrderItemSCR = data => dispatch => {
  return new Promise((resolve, reject) => {
    processOrderSaleApi(data).then(v => {
      const {
        RESULT_DATA,
        STATUS,
        ERROR_MESSAGES
      } = v;
      if (STATUS === '00') {
        dispatch({
          type: types.PRODUCT_SET_SCR_LIST_ITEMS,
          payload: convertProductItemFromServerProcessSCR(RESULT_DATA.RESULT.ITEMS)
        });
      } else if (STATUS === '10') {
        // dispatch({ type: types.ORDER_CREATE_FAIL, payload: ERROR_MESSAGES })
        reject(ERROR_MESSAGES[0]);
      }
      resolve(v);
    }).catch(err => {
      reject(err.message);
    });
  });
};
export const setGoodsCodeCriteria = value => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.PRODUCT_SET_CRITERIA_GOODS_CODE,
      payload: value
    });
    resolve();
  });
};
export const searchProductSkuAltList = () => (dispatch, getState) => {
  dispatch({
    type: types.PRODUCT_SKU_ALT_SEARCH_LIST
  });
  let product = getState().product;
  const productCategory = getState().productCategory;
  const criteria = qs.stringify({
    KEYWORD: product.criteria.KEYWORD,
    ICDEPT_KEY: productCategory.item.ICDEPT_KEY
  });
  productSkuAltSearchListApi(criteria).then(v => {
    const {
      RESULT_DATA,
      STATUS,
      ERROR_MESSAGES
    } = v;
    if (STATUS === '00') {
      const {
        RESULT
      } = RESULT_DATA;
      if (RESULT_DATA && RESULT && RESULT.length > 0) {
        dispatch({
          type: types.PRODUCT_SKU_ALT_SEARCH_LIST_SUCCESS,
          payload: RESULT
        });
      } else {
        dispatch({
          type: types.PRODUCT_SKU_ALT_SEARCH_LIST_SUCCESS,
          payload: []
        });
      }
    } else if (STATUS === '10') {
      dispatch({
        type: types.PRODUCT_SKU_ALT_SEARCH_LIST_FAIL,
        payload: ERROR_MESSAGES
      });
    }
  });
};
export const searchProductBySkuAlt = key => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.PRODUCT_SEARCH_LIST
    });
    const customer = getState().customer;
    const criteria = qs.stringify({
      SKU_SKUALT: key,
      ARCODE: customer.item.INFO.AR_CODE
    });
    productSearchListApi(criteria).then(v => {
      const {
        RESULT_DATA,
        STATUS,
        ERROR_MESSAGES
      } = v;
      if (STATUS === '00') {
        const {
          RESULT
        } = RESULT_DATA;
        if (RESULT_DATA && RESULT && RESULT.length > 0) {
          dispatch({
            type: types.PRODUCT_SEARCH_BY_SKU_ALT_LIST_SUCCESS,
            payload: RESULT
          });
          let arr = [];
          for (var i = 0; i < RESULT.length; i++) {
            arr.push(null);
          }
          dispatch({
            type: types.PRODUCT_ADD_OR_EDIT_SCR_CHOOSE_ITEMS,
            payload: arr
          });
        } else {
          dispatch({
            type: types.PRODUCT_SEARCH_BY_SKU_ALT_LIST_SUCCESS,
            payload: []
          });
          dispatch({
            type: types.PRODUCT_SEARCH_LIST_FAIL
          });
          reject('Data not found');
        }
      } else if (STATUS === '10') {
        dispatch({
          type: types.PRODUCT_SEARCH_LIST_FAIL
        });
        reject(ERROR_MESSAGES);
      }
      resolve(v);
    }).catch(error => {
      dispatch({
        type: types.PRODUCT_SEARCH_LIST_FAIL
      });
      reject(error.message);
    });
  });
};
export const addOrEditSCRChooseItems = items => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.PRODUCT_ADD_OR_EDIT_SCR_CHOOSE_ITEMS,
      payload: items
    });
    resolve();
  });
};
export const setScrListItems = item => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.PRODUCT_SET_SCR_LIST_ITEMS,
      payload: item
    });
    resolve();
  });
};
export const LookupErpCashSaleAPi = async _DT => {
  const LoginGUID = await getLoginGuID();
  // const settingConfig = await getSettingConfig();
  const bodyRequest = {
    'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': LoginGUID,
    'BPAPUS-FUNCTION': 'Oe001304',
    'BPAPUS-PARAM': '',
    'BPAPUS-FILTER': "and (DT_KEY = '" + _DT + "')",
    'BPAPUS-ORDERBY': 'order by DI_DATE DESC  , DI_REF DESC',
    'BPAPUS-OFFSET': '0',
    'BPAPUS-FETCH': '0'
  };
  return new Promise((resolve, reject) => {
    Request.instanceV3.post('/LookupErp', bodyRequest).then(v => {
      resolve(v.data);
    }).catch(err => {
      reject(err);
    });
  });
};