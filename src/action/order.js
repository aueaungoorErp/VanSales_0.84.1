import moment from 'moment';
import {
  orderCreateCashApi,
  orderUpdateCashApi,
  createDocVisitApi,
  createDocSurveyApi,
  orderFileApi,
  orderCancelApi,
  orderUpdateApi,
  updateOrderSaleApi,
  createQuotationApi,
  orderUpdateQuotationApi,
  orderAttachImageApi,
  orderAttachMultipleImagesApi,
} from '../api/order';
import { getWareLocationStockBalance } from '../api/drop-point';
import {
  BPAPUS_FUNCTION_DC_CODE,
  BPAPUS_FUNCTION_V_CODE,
  BPAPUS_FUNCTION_BK_CODE,
  BPAPUS_FUNCTION_WH_CODE,
} from '../constant/bPlusApi';
import { lookupErpV3Api, readErpV3Api, updateErpV3Api } from '../api/bPlusApi';
import { processOrderItemV3Api } from '../api/product';
import { getUserToken, getLoginGuID, getSettingConfig } from '../utils/Token';
import * as types from '../constant/order';
import {
  convertProductItemLastBillToOrderItem,
  convertProductItemFromServerProcess2V3,
  generateItemsProcessedFromServer,
} from '../utils/Order';
import { BPAPUS_BPAPSV } from '../../appConfig';
export const setInitialState = () => (dispatch) => {
  dispatch({ type: types.ORDER_SET_INITIAL_STATE });
};

export const setIsNotFound = (bool) => (dispatch) => {
  dispatch({ type: types.ORDER_SET_IS_NOT_FOUND, payload: bool });
};

export const setIsLoading = (bool) => (dispatch) => {
  dispatch({ type: types.ORDER_SET_IS_LOADING, payload: bool });
};

export const setErrorMessage = (value) => (dispatch) => {
  dispatch({ type: types.ORDER_SET_IS_ERROR_MESSAGE, payload: value });
};

export const setHeader = (data) => (dispatch) => {
  dispatch({ type: types.ORDER_SET_HEADER, payload: data });
};

export const addProduct = (item) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_ADD_PRODUCT_ITEM, payload: item });
    resolve();
  });
};

export const addProducts = (items) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_ADD_PRODUCT_ITEMS, payload: items });
    resolve();
  });
};

export const editProduct = (item, index) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.ORDER_EDIT_PRODUCT_ITEM,
      payload: { item: item, index: index },
    });
    resolve();
  });
};

export const removeProductItem = (index) => (dispatch) => {
  dispatch({ type: types.ORDER_REMOVE_PRODUCT_ITEM, payload: index });
};

export const removeAllProductItems = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_REMOVE_ALL_PRODUCT_ITEMS });
    resolve();
  });
};

export const setSwipeCurrent = (index) => (dispatch) => {
  dispatch({ type: types.ORDER_SET_SWIPE_CURENT, payload: index });
};

export const pushSwipeList = (item) => (dispatch) => {
  dispatch({ type: types.ORDER_PUSH_SWIPE_LIST, payload: item });
};

export const removeAllSwipeList = () => (dispatch) => {
  dispatch({ type: types.ORDER_REMOVE_ALL_SWIPE_LIST });
};

export const setOrderVisitVdiVisit = (value) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_VISIT_SET_VDI_VISIT, payload: value });
    resolve();
  });
};

export const setDisBill1AfterDis = (value) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_SET_DIS_BILL1_AFTER_DISCOUNT, payload: value });
    resolve();
  });
};

export const setDisBill2AfterDis = (value) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_SET_DIS_BILL2_AFTER_DISCOUNT, payload: value });
    resolve();
  });
};

export const setDisBill1 = (value) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_SET_DIS_BILL1, payload: value });
    resolve();
  });
};

export const setDisBill2 = (value) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_SET_DIS_BILL2, payload: value });
    resolve();
  });
};
export const setDisCountType1 = (value) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_SET_DIS_COUNT_TYPE1, payload: value });
    resolve();
  });
};
export const setDisCountType2 = (value) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_SET_DIS_COUNT_TYPE2, payload: value });
    resolve();
  });
};

export const setVDIRemark = (value) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_SET_VDI_REMARK, payload: value });
    resolve();
  });
};

export const setDisBillProcess = (disBill1, disBill2) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.ORDER_SET_DIS_BILL_PROCESS,
      payload: { disBill1: disBill1, disBill2: disBill2 },
    });
    resolve();
  });
};

export const setHeaderProcessedShipDate = (value) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.ORDER_SET_HEADER_PROCESSED_SHIP_DATE,
      payload: value,
    });
    resolve();
  });
};

export const clearDisBill = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_CLEAR_DIS_BILL });
    resolve();
  });
};

export const calculateOrderProductSummary = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_CALCULATE_PRODUCT_SUMMARY });
    resolve();
  });
};

export const calculateOrderProductProcessSummary = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_CALCULATE_PRODUCT_PROCESSED_SUMMARY });
    resolve();
  });
};

export const calculateOrderNetPriceAfterDiscount = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_CALCULATE_NET_PRICE_AFTER_DISCOUNT });
    resolve();
  });
};

export const addVisitImageItem = (uri) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_ADD_VISIT_IMAGE_ITEM, payload: uri });
    resolve();
  });
};

export const removeVisitImageItem = (index) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_REMOVE_VISIT_IMAGE_ITEM, payload: index });
    resolve();
  });
};

export const removeAllVisitImageItems = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_REMOVE_ALL_VISIT_IMAGE_ITEMS });
    resolve();
  });
};

export const addStockImageItem = (uri) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_ADD_STOCK_IMAGE_ITEM, payload: uri });
    resolve();
  });
};

export const removeStockImageItem = (index) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_REMOVE_STOCK_IMAGE_ITEM, payload: index });
    resolve();
  });
};

export const removeAllStockImageItems = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_REMOVE_ALL_STOCK_IMAGE_ITEMS });
    resolve();
  });
};

export const processOrderSale = (data, order, vanConfig) => (
  dispatch,
  getState,
) => {
  return new Promise(async (resolve, reject) => {
    dispatch({ type: types.ORDER_PROCESS });
    const LoginGUID = await getLoginGuID();
    const customer = getState().customer;

     console.log('processOrderSale order ', order);
     console.log('processOrderSale data ', data);
    // console.log('processOrderSale data.ITEMS ', data.ITEMS.length);
    // console.log('processOrderSale vanConfig ', vanConfig);
    let isNegative = false;
    let good_inVan_qty = '';
    if (vanConfig.VANCNF_NOV_SKU_BAL == 1) {
      let dataObj2 = {
        'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': BPAPUS_FUNCTION_WH_CODE,
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER': "and WL_KEY = '" + vanConfig.VANCNF_WL + "'",
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      };
      let WL_CODE = null;
      await lookupErpV3Api(dataObj2)
        .then((v) => {
          const { ResponseData, ResponseCode, ReasonString } = v.data;
          if (ResponseCode == 200) {
            console.log(JSON.parse(ResponseData));
            let responseData = JSON.parse(ResponseData);
            WL_CODE = responseData.Wh000220
              ? responseData.Wh000220[0].WL_CODE
              : null;
          } else {
            console.log('ERROR lookupErpV3Api', ReasonString);
          }
        })
        .catch((err) => {
          console.log('ERROR lookupErpV3Api', err);
        });
      // ไม่สามารถขายสินค้าจำนวนติดลบได้

      for (let i in data.ITEMS) {
        await getWareLocationStockBalance(
          data.ITEMS[i].VTRD_CODE,
          vanConfig,
        ).then((v) => {
          const { ReasonString, ResponseCode, ResponseData } = v;
          console.log('getDropPointListItems ', v);
          let responseData = JSON.parse(ResponseData);
          if (ResponseCode == 200) {
            console.log('jkdfjsdjfkdkf 1==== ', JSON.stringify(responseData));

            for (let obj of responseData.ShowSkuBalance) {
              if (obj.WL_CODE == WL_CODE && parseInt(obj.QTY) < 0) {
                isNegative = true;
                good_inVan_qty = parseInt(obj.QTY) + ":";
              }
            }
          }
        });
      }
    }

    console.log('--VANCNF_NOV_SKU_BAL--', vanConfig.VANCNF_NOV_SKU_BAL);
    if (order.header.AR_ORDER_TYPE !== 'ขายสินค้า') { isNegative = false }

    console.log('isNeg ', isNegative);
    if (isNegative) {
      if (order.header.AR_ORDER_TYPE === 'ขายสินค้า') {
        dispatch({
          type: types.ORDER_PROCESS_FAIL,
          payload: 'สินค้าในคลังมีไม่พอ หรือ ไม่สามารถขายสินค้าจำนวนติดลบได้ :' + good_inVan_qty,
        });
        reject('สินค้าในคลังมีไม่พอ หรือ ไม่สามารถขายสินค้าจำนวนติดลบได้');
      }

    } else {
      let ImpTrhDetail = [];
      if (order.productListItems) {
        for (let i in order.productListItems) {
          let objData = await convertProductItemFromServerProcess2V3(
            order.productListItems[i],
          );
          console.log('data.ITEMS[i] objData1 :', objData);
          ImpTrhDetail.push(objData);
        }
      } else {
        for (let i in data.ITEMS) {
          let objData = await convertProductItemFromServerProcess2V3(
            data.ITEMS[i],
          );
          console.log('data.ITEMS[i] objData 2:', objData);
          ImpTrhDetail.push(objData);
        }
      }
      console.log('ImpTrhDetail ', JSON.stringify(ImpTrhDetail));
      let DT_KEY_FILTER = null;
      console.log('data.PROCESS_DETAIL  ', data.PROCESS_DETAIL);
      if (data.PROCESS_DETAIL == 'รับคืนสินค้า') {
        DT_KEY_FILTER = vanConfig.VANCNF_RTN_DT;
      } else if (data.PROCESS_DETAIL == 'จองสินค้า') {
        DT_KEY_FILTER = vanConfig.VANCNF_BOOK_DT;
      } else if (
        data.PROCESS_DETAIL == 'โอนสินค้า' ||
        data.PROCESS_DETAIL == 'โอนย้ายสินค้า'
      ) {
        DT_KEY_FILTER = vanConfig.VANCNF_TRANSFER_DT;
      } else if (data.PROCESS_DETAIL == 'ใบเสนอราคา') {
        DT_KEY_FILTER = vanConfig.VANCNF_QUOTE_DT;
      } else if (data.PROCESS_DETAIL == 'ขายสินค้า') {
        DT_KEY_FILTER = vanConfig.VANCNF_CASHSALES_DT;
      }
      let dataObj1 = {
        'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': BPAPUS_FUNCTION_DC_CODE,
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER': "and DT_KEY = '" + DT_KEY_FILTER + "'",
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      };
      let VANCNF_BOOK_DT = null;
      let DT_PROPERTIES = null;
      console.log('dataObj1 ', dataObj1);
      await lookupErpV3Api(dataObj1)
        .then((v) => {
          const { ResponseData, ResponseCode, ReasonString } = v.data;
          if (ResponseCode == 200) {
            // console.log(JSON.parse(ResponseData));
            let responseData = JSON.parse(ResponseData);
            VANCNF_BOOK_DT = responseData.Dc000110
              ? responseData.Dc000110[0].DT_DOCCODE
              : null;
            DT_PROPERTIES = responseData.Dc000110
              ? responseData.Dc000110[0].DT_PROPERTIES
              : null;
          } else {
            console.log('ERROR lookupErpV3Api', ReasonString);
          }
        })
        .catch((err) => {
          console.log('ERROR lookupErpV3Api', err);
        });
      console.log('VANCNF_BOOK_DT ', VANCNF_BOOK_DT);
      console.log('DT_PROPERTIES ', DT_PROPERTIES);
      let param = null;
      let dataObj3 = {
        'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': 'SL000130',
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER': "and SLMN_KEY = '" + vanConfig.VANCNF_SLMN + "'",
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      };
      let SLMN_CODE = null;
      await lookupErpV3Api(dataObj3)
        .then((v) => {
          const { ResponseData, ResponseCode, ReasonString } = v.data;
          if (ResponseCode == 200) {
            // console.log(JSON.parse(ResponseData));
            let responseData = JSON.parse(ResponseData);
            SLMN_CODE = responseData.SL000130
              ? responseData.SL000130[0].SLMN_CODE
              : null;
          } else {
            console.log('ERROR lookupErpV3Api', ReasonString);
          }
        })
        .catch((err) => {
          console.log('ERROR lookupErpV3Api', err);
        });
      let ARD_TDSC_KEYIN = data.DIS_BILL_1 + ',' + data.DIS_BILL_2;

      console.log('จองสินค้า 1', data.PROCESS_DETAIL);
      console.log('จองสินค้า 1', order.header);


      if (data.PROCESS_DETAIL == 'จองสินค้า' || data.PROCESS_DETAIL == 'ใบเสนอราคา') {
        param = {
          ErpUpdFunc: [
            {
              ImpTrhHeader: {
                TRH_ARPRB: vanConfig.VANCNF_ARPRB,
                DI_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
                DI_REF: '<เลขถัดไป>',
                DT_DOCCODE: VANCNF_BOOK_DT,
                DT_PROPERTIES: DT_PROPERTIES,
                VAT_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
                VAT_REF: '<เลขเดียวกัน>',
                VAT_RATE: vanConfig.VANCNF_VAT_RATE,
                VAT_RFR_REF: '<เลขเดียวกัน>',
                //TRH_SHIP_DATE: moment('23/12/2023').format('YYYYMMDDhhmm'),

                //TRH_SHIP_DATE: moment('20231201').format('YYYYMMDDhhmm'),

                TRH_SHIP_DATE: moment(order.header.VDI_SHIP_DATE).format('YYYYMMDDhhmm'),
                SLMN_CODE: SLMN_CODE,
                AR_CODE: order.header.AR_CODE,
                ARPRB_CODE: customer.item.ARPRB.ARPRB_CODE,
                AROE_TDSC_KEYIN: ARD_TDSC_KEYIN,
                AROE_DUE_DA: moment(
                  moment(order.header.VDI_DATE).add(3, 'months'),
                ).format('YYYYMMDDhhmm'),
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
                //   "CQIN_1_CHEQUE_DD": "18991230_1",
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
            },
          ],
        };
      } else {
        console.log("99999999" , data.ImpTranPayd)
        param = {
          ErpUpdFunc: [
            {
              ImpTrhHeader: {
                TRH_ARPRB: vanConfig.VANCNF_ARPRB,
                DI_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
                DI_REF: '<เลขถัดไป>',
                DT_DOCCODE: VANCNF_BOOK_DT,
                DT_PROPERTIES: DT_PROPERTIES,
                VAT_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
                VAT_REF: '<เลขเดียวกัน>',
                VAT_RATE: vanConfig.VANCNF_VAT_RATE,
                VAT_RFR_REF: '<เลขเดียวกัน>',
                TRH_SHIP_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
                SLMN_CODE: SLMN_CODE,
                AR_CODE: order.header.AR_CODE,
                ARPRB_CODE: customer.item.ARPRB.ARPRB_CODE,
                ARD_TDSC_KEYIN: ARD_TDSC_KEYIN,
                ARD_DUE_DA: moment(
                  moment(order.header.VDI_DATE).add(1, 'months'),
                ).format('YYYYMMDDhhmm'),
              },
              ImpTrhDetail: ImpTrhDetail,
              ImpTranPayd: [data.ImpTranPayd],
              // ImpTranPayd: [
              //   {
              //     "CASHAC_CODE": "",
              //     "CASHAC_NAME": "",
              //     "CASHAC_AMT": "0",
              //     "BNKAC_CODE": "",
              //     "BNKAC_NAME": "",
              //     "BNKAC_AMT": "0",
              //     "QRCT_CODE": "",
              //     "QRCT_NAME": "",
              //     "QRCT_AMT": "0",
              //     "CQIN_1_OWNER": "",
              //     "CQIN_1_BANK_INTL": "",
              //     "CQIN_1_BRANCH": "",
              //     "CQIN_1_CHEQUE_NO": "",
              //     "CQIN_1_CHEQUE_DD": "18991230_2",
              //     "CQIN_1_AMT": "0",
              //     "CQIN_2_OWNER": "",
              //     "CQIN_2_BANK_INTL": "",
              //     "CQIN_2_BRANCH": "",
              //     "CQIN_2_CHEQUE_NO": "",
              //     "CQIN_2_CHEQUE_DD": "18991230",
              //     "CQIN_2_AMT": "0",
              //     "CQIN_3_OWNER": "",
              //     "CQIN_3_BANK_INTL": "",
              //     "CQIN_3_BRANCH": "",
              //     "CQIN_3_CHEQUE_NO": "",
              //     "CQIN_3_CHEQUE_DD": "18991230",
              //     "CQIN_3_AMT": "0",
              //     "PMT_1_CODE": "",
              //     "PMT_1_NAME": "",
              //     "PMT_1_AMT": "0",
              //     "PMT_2_CODE": "",
              //     "PMT_2_NAME": "",
              //     "PMT_2_AMT": "0",
              //     "REMAIN_OPTION": ""
              //   }
              // ]
            },
          ],
        };
      }

      if (data.PROCESS_TYPE == 1) {
        console.log('param data.PROCESS_TYPE == 1 ', JSON.stringify(param));
        let dataObj = {
          'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
          'BPAPUS-LOGIN-GUID': LoginGUID,
          'BPAPUS-FUNCTION': 'CalcSellOrderDocinfo',
          'BPAPUS-PARAM': JSON.stringify(param),
          'BPAPUS-FILTER': '',
          'BPAPUS-ORDERBY': '',
          'BPAPUS-OFFSET': '0',
          'BPAPUS-FETCH': '0',
        };
        console.log('dataObj PROCESS_TYPE == 1', JSON.stringify(dataObj));
        processOrderItemV3Api(dataObj)
          .then((v) => {
            console.log('processOrderSale RESULT_DATA ', v);


            const { ResponseData, ResponseCode, ReasonString } = v;
            if (ResponseCode == 200) {
              let responseData = JSON.parse(ResponseData);
              // dispatch({
              //   type: types.ORDER_SET_HEADER_PROCESSED,
              //   payload: RESULT_DATA.RESULT.HEADER,
              // });
              console.log('processOrderItemV3Api responseData 1', responseData);
              let x = generateItemsProcessedFromServer(
                responseData.TRANSTKD,
                order.productListItems,
              );
              console.log('x ', x);
              let itemsPrt = [];
              for (let obj of x) {
                if (obj.TRD_Q_FREE > 0) {
                  itemsPrt.push({
                    ...obj,
                    VTRD_PRT_FREE_AUTO: false,

                    TRD_Q_FREE: 0,
                  });

                  itemsPrt.push({
                    ...obj,
                    VTRD_PRT_FREE_AUTO: true,
                    TRD_SH_NAME: '* แถม ' + obj.TRD_SH_NAME,
                    TRD_QTY: obj.TRD_Q_FREE,
                    TRD_Q_FREE: 0,
                    TRD_U_PRC: 0,
                    TRD_G_AMT: 0,
                    TRD_N_AMT: 0,
                    TRD_B_AMT: 0,
                    TRD_SH_GAMT: 0,
                    TRD_SH_GSELL: 0,
                    TRD_N_SELL: 0,
                    TRD_N_VAT: 0,
                    TRD_G_KEYIN: 0,
                    TRD_G_SELL: 0,
                    TRD_G_VAT: 0,
                    TRD_B_VAT: 0,
                    TRD_B_SELL: 0,
                    X_MODEL: 3,
                  });
                } else {
                  itemsPrt.push({ ...obj, VTRD_PRT_FREE_AUTO: false });
                }
              }
              console.log(' itemsPrt ', JSON.stringify(itemsPrt));
              dispatch({
                type: types.ORDER_SET_ITEMS_PROCESSED,
                payload: x,
              });
              dispatch({
                type: types.ORDER_SET_ITEMS_PRT_PROCESSED,
                payload: itemsPrt,
              });
            } else {
              dispatch({ type: types.ORDER_PROCESS_FAIL, payload: ReasonString });
            }
            resolve(v);
          })
          .catch((err) => {
            console.log('processOrderSale', err);
            dispatch({ type: types.ORDER_PROCESS_FAIL, payload: err });
            reject(err);
          });
      } else {
        console.log('param data.PROCESS_TYPE == else', JSON.stringify(param));
        let dataObj = {
          'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
          'BPAPUS-LOGIN-GUID': LoginGUID,
          'BPAPUS-FUNCTION': 'CalcInvoiceDocinfo',
          'BPAPUS-PARAM': JSON.stringify(param),
          'BPAPUS-FILTER': '',
          'BPAPUS-ORDERBY': '',
          'BPAPUS-OFFSET': '0',
          'BPAPUS-FETCH': '0',
        };
        console.log('dataObj', JSON.stringify(dataObj));
        processOrderItemV3Api(dataObj)
          .then((v) => {
            const { ResponseData, ResponseCode, ReasonString } = v;
            if (ResponseCode == 200) {
              // console.log(
              //   'processOrderSale RESULT_DATA ',
              //   JSON.parse(ResponseData),
              // );
              let responseData = JSON.parse(ResponseData);
              // dispatch({
              //   type: types.ORDER_SET_HEADER_PROCESSED,
              //   payload: RESULT_DATA.RESULT.HEADER,
              // });
              console.log('processOrderItemV3Api responseData 2', responseData);
              let x = generateItemsProcessedFromServer(
                responseData.TRANSTKD,
                order.productListItems,
              );
              console.log('processOrderItemV3Api x', x);

              let itemsPrt = [];
              for (let obj of x) {
                if (obj.TRD_Q_FREE > 0) {
                  itemsPrt.push({
                    ...obj,
                    VTRD_PRT_FREE_AUTO: false,

                    TRD_Q_FREE: 0,
                  });

                  itemsPrt.push({
                    ...obj,
                    VTRD_PRT_FREE_AUTO: true,
                    TRD_SH_NAME: '* แถม ' + obj.TRD_SH_NAME,
                    TRD_QTY: obj.TRD_Q_FREE,
                    TRD_Q_FREE: 0,
                    TRD_U_PRC: 0,
                    TRD_G_AMT: 0,
                    TRD_N_AMT: 0,
                    TRD_B_AMT: 0,
                    TRD_SH_GAMT: 0,
                    TRD_SH_GSELL: 0,
                    TRD_N_SELL: 0,
                    TRD_N_VAT: 0,
                    TRD_G_KEYIN: 0,
                    TRD_G_SELL: 0,
                    TRD_G_VAT: 0,
                    TRD_B_VAT: 0,
                    TRD_B_SELL: 0,
                    X_MODEL: 4,
                  });
                } else {
                  itemsPrt.push({ ...obj, VTRD_PRT_FREE_AUTO: false });
                }
              }
              console.log(' itemsPrt ', JSON.stringify(itemsPrt));

              dispatch({
                type: types.ORDER_SET_ITEMS_PROCESSED,
                payload: x,
              });
              dispatch({
                type: types.ORDER_SET_ITEMS_PRT_PROCESSED,
                payload: itemsPrt,
              });
            } else {
              dispatch({ type: types.ORDER_PROCESS_FAIL, payload: ReasonString });
            }
            resolve(v);
          })
          .catch((err) => {
            console.log('processOrderSale', err);
            dispatch({ type: types.ORDER_PROCESS_FAIL, payload: err });
            reject(err);
          });
      }
    }
  });


};

export const createOrderSaleV3 = (data, V3GUID, vanConfig , paymentType) => (
  dispatch,
  getState,
) => {
  return new Promise(async (resolve, reject) => {
    const order = getState().order;
    const customer = getState().customer;
    let DT_KEY;
    if (paymentType == '0') {
      DT_KEY = vanConfig.VANCNF_INV_DT;
    } else  {
      DT_KEY = vanConfig.VANCNF_CASHSALES_DT;
    }


    dispatch({ type: types.ORDER_CREATE });
     console.log('RESULT_DATA createOrderSaleV3', data);
     console.log('order createOrderSaleV3', JSON.stringify(order));
     console.log( "order หา ImpTranPayd 1"    , data.ImpTranPayd)
    // console.log('RESULT_DATA vanConfig', vanConfig);
    // console.log(data, V3GUID, vanConfig)
    let dataObj1 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': BPAPUS_FUNCTION_DC_CODE,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "and DT_KEY = '" + DT_KEY + "'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    let VANCNF_BOOK_DT = null;
    let DT_PROPERTIES = null;
    await lookupErpV3Api(dataObj1)
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;

        console.log("ResponseCode >>>> " ,v.data);


        if (ResponseCode == 200) {
          
          let responseData = JSON.parse(ResponseData);
          VANCNF_BOOK_DT = responseData.Dc000110
            ? responseData.Dc000110[0].DT_DOCCODE
            : null;
          DT_PROPERTIES = responseData.Dc000110
            ? responseData.Dc000110[0].DT_PROPERTIES
            : null;
        } else {
          console.log('ERROR lookupErpV3Api', ReasonString);
        }
      })
      .catch((err) => {
        console.log('ERROR lookupErpV3Api', err);
      });
    //---------------------------------------------
    console.log("ResponseCode >>>> " ,759);
    let dataObj2 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': BPAPUS_FUNCTION_WH_CODE,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "and WL_KEY = '" + vanConfig.VANCNF_WL + "'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    let WL_CODE = null;
    await lookupErpV3Api(dataObj2)
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          // console.log(JSON.parse(ResponseData));
          let responseData = JSON.parse(ResponseData);
          WL_CODE = responseData.Wh000220
            ? responseData.Wh000220[0].WL_CODE
            : null;
        } else {
          console.log('ERROR lookupErpV3Api', ReasonString);
        }
      })
      .catch((err) => {
        console.log('ERROR lookupErpV3Api', err);
      });

      console.log("ResponseCode >>>> " ,789);
    //---------------------------------------------

    let dataObj3 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': 'SL000130',
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "and SLMN_KEY = '" + vanConfig.VANCNF_SLMN + "'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    console.log("ResponseCode >>>> " ,803);
    let SLMN_CODE = null;
    await lookupErpV3Api(dataObj3)
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          // console.log(JSON.parse(ResponseData));
          let responseData = JSON.parse(ResponseData);
          SLMN_CODE = responseData.SL000130
            ? responseData.SL000130[0].SLMN_CODE
            : null;
        } else {
          console.log('ERROR lookupErpV3Api', ReasonString);
        }
      })
      .catch((err) => {
        console.log('ERROR lookupErpV3Api', err);
      });

      console.log("ResponseCode >>>> " ,822); 
    //---------------------------------------------
    let ImpTrhDetail = [];
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
        TRD_WL: WL_CODE,
        TRD_TO_WL: WL_CODE,
        TRD_K_U_PRC: parseFloat(data.ITEMS[i].TRD_U_PRC).toFixed(2),
        AMOUNT: parseFloat(data.ITEMS[i].TRD_G_AMT).toFixed(2),
        TRD_U_VATIO: data.ITEMS[i].TRD_U_VATIO,
        X_MODEL: 5,
      };
      ImpTrhDetail.push(newObj);
    }
    // console.log('DT_DOCCODE DT_PROPERTIES', VANCNF_BOOK_DT, DT_PROPERTIES);
    //---------------------------------------------
    let dataObj4 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': 'READARCDBYARKEY',
      'BPAPUS-PARAM':
        '{"AR_KEY":"' +
        order.header.VDI_KEY +
        '","ARCD_DATE":"' +
        moment(moment(order.header.VDI_DATE).add(1, 'months')).format(
          'YYYYMMDDhhmm',
        ) +
        '","ARCD_DEFAULT":"Y"}',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
     console.log('dataObj4 ==========================>', dataObj4);
    let ARCD_KEY = null;
    await readErpV3Api(dataObj4)
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
           console.log(JSON.parse(ResponseData));
          let responseData = JSON.parse(ResponseData);
          ARCD_KEY = responseData.READARCDBYARKEY
            ? responseData.READARCDBYARKEY[0].ARCD_KEY
            : null;
        } else {
          console.log('ERROR readErpV3Api', ReasonString);
        }
      })
      .catch((err) => {
        console.log('ERROR readErpV3Api', err);
      });

    let ARD_TDSC_KEYIN = '';
    if (order.orderProductSummary.DIS_COUNT_TYPE2) {
      //ส่วนลดบาท
      if (order.orderProductSummary.DIS_BILL_1) {
        ARD_TDSC_KEYIN = order.orderProductSummary.DIS_BILL_1 + 'B';
      }
    } else {
      //ส่วนลดเปอร์เซ็น
      if (
        order.orderProductSummary.DIS_BILL_1 ||
        order.orderProductSummary.DIS_BILL_2
      ) {
        if (
          order.orderProductSummary.DIS_BILL_1 &&
          order.orderProductSummary.DIS_BILL_2
        ) {
          ARD_TDSC_KEYIN =
            order.orderProductSummary.DIS_BILL_1 +
            ',' +
            order.orderProductSummary.DIS_BILL_2;
        } else {
          ARD_TDSC_KEYIN =
            (order.orderProductSummary.DIS_BILL_1
              ? order.orderProductSummary.DIS_BILL_1
              : '0') +
            ',' +
            (order.orderProductSummary.DIS_BILL_2
              ? order.orderProductSummary.DIS_BILL_2
              : '0');
        }
      }
    }

    console.log( "order หา ImpTranPayd 2"    ,data.ImpTranPayd)
    let param = {
      ErpUpdFunc: [
        {
          ImpTrhHeader: {
            TRH_ARPRB: vanConfig.VANCNF_ARPRB /* ตารางราคาที่ใช้อ้างอิงบิลนี้*/,
            DI_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            DI_REF: '<เลขถัดไป>',
            DT_DOCCODE: VANCNF_BOOK_DT,
            DT_PROPERTIES: DT_PROPERTIES,
            VAT_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            VAT_REF: '<เลขเดียวกัน>',
            VAT_RATE: vanConfig.VANCNF_VAT_RATE,
            VAT_RFR_REF: '<เลขเดียวกัน>',
            TRH_SHIP_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            SLMN_CODE: SLMN_CODE,
            AR_CODE: order.header.AR_CODE,
            ARPRB_CODE: customer.item.ARPRB.ARPRB_CODE,
            AROE_ARCD: ARCD_KEY, //ข้อตกลงเจ้าหนี้
            ARD_TDSC_KEYIN: ARD_TDSC_KEYIN,
            ARD_DUE_DA: moment(
              moment(order.header.VDI_DATE).add(1, 'months'),
            ).format('YYYYMMDDhhmm'),
            DI_REMARK: order.header.VDI_REMARK,
          },
          ImpTrhDetail: ImpTrhDetail,
          ImpTranPayd:  data.ImpTranPayd,
        },
      ],
    };




// let param1 = {
//   "ErpUpdFunc": [
//       {
//           "ImpTrhHeader": {
//               "DI_DATE": "20241027",
//               "DI_REF": "<เลขถัดไป>",
//               "DI_REMARK": "",
//               "DI_GPS_LAT_S": "",
//               "DI_GPS_LONG_S": "",
//               "DT_DOCCODE": "CS01",
//               "DT_PROPERTIES": "302",
//               "VAT_TYPE": "3",
//               "VAT_DATE": "20241027",
//               "VAT_REF": "CS01256710\/053",
//               "VAT_RFR_DATE": "20241027",
//               "VAT_RFR_REF": "CS01256710\/053",
//               "VAT_RATE": "7",
//               "AR_CODE": "A002",
//               "ARD_TDSC_KEYIN": "51,0",
//               "ARD_CRNCYCODE": "01",
//               "ARD_XCHG": "1",
//               "ARD_CASH_DC": "",
//               "ARD_CASH_B4": "20241027",
//               "ARD_BIL_DA": "20241027",
//               "ARD_DUE_DA": "20241127",
//               "ARD_CHQ_DA": "20241027",
//               "ARD_WH_TAX": "0",
//               "ARD_CN_RAMT": "0",
//               "ARD_REMARK": "",
//               "ARD_BILL_ADDB": "103",
//               "SLMN_CODE": "S0001",
//               "DEPT_CODE": "01",
//               "BR_CODE": "00009",
//               "PRJ_CODE": "006",
//               "MKTP_CODE": "0",
//               "PRMT_CODE": "0",
//               "ARPRB_CODE": "0",
//               "SB_CODE": "0",
//               "TRH_SHIP_REMARK": "",
//               "TRH_SHIP_DATE": "20241027",
//               "TRH_SHIP_ADDB": "0",
//               "ADDB_COMPANY": "ไม่ระบุ",
//               "ADDB_BRANCH": "สำนักงานใหญ่",
//               "ADDB_TAX_ID": "",
//               "ADDB_ADDB_1": "",
//               "ADDB_ADDB_2": "",
//               "ADDB_ADDB_3": "",
//               "ADDB_PROVINCE": "กรุงเทพฯ",
//               "ADDB_POST": "",
//               "ADDB_PHONE": "",
//               "ADDB_FAX": "",
//               "TRH_LAST_DATE": "18991230",
//               "TRH_CANCEL_DATE": "20241027",
//               "TRH_REMARK": ""
//           },
//           "ImpTrhDetail": [
//               {
//                   "DI_KEY": "7440",
//                   "TRD_SEQ": "1",
//                   "TRD_KEYIN": "1010200000709",
//                   "TRD_VAT_TY": "3",
//                   "TRD_VAT": "0",
//                   "TRD_VAT_R": "7",
//                   "TRD_QTY": "1",
//                   "TRD_Q_FREE": "0",
//                   "TRD_K_U_PRC": "150",
//                   "TRD_DSC_KEYIN": "0*1B",
//                   "TRD_OPTION": "0",
//                   "TRD_WEIGHT": "0",
//                   "TRD_C_DSCV": "0",
//                   "TRD_WH_TY": "0",
//                   "TRD_WH_RATE": "0",
//                   "TRD_WH_TAX": "0",
//                   "TRD_LOT_NO": "",
//                   "TRD_SERIAL": "",
//                   "TRD_EXP_D": "18991230",
//                   "TRD_MAN_D": "18991230",
//                   "TRD_WL_CODE": "HO",
//                   "TRD_TO_WL_CODE": "HO",
//                   "TRD_RTN_UPRC": "0",
//                   "TRD_RTN_AMT": "0",
//                   "TRD_COMM_RATE": "0",
//                   "TRD_COMM_AMT": "0",
//                   "TRD_B_PCNT": "0",
//                   "TRD_CAMPAIGN": "0",
//                   "TRD_ARCPGN_C": ""
//               }
//           ],
//           ImpTranPayd: data.ImpTranPayd,
//       }
//   ]
// }




    
    console.log( "order หา ImpTranPayd 3"    ,JSON.stringify(param))
    let dataObj = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      // 28.บันทึกรายละเอียดเอกสารขายสด(SaveCashSalesDocinfo)
      'BPAPUS-FUNCTION': 'SaveInvoiceDocinfo', //Bazz ขายสด
      //'BPAPUS-FUNCTION': 'SaveCashSalesDocinfo',
      
      'BPAPUS-PARAM': JSON.stringify(param),
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
     console.log('createOrderV31', JSON.stringify(dataObj));
  
    updateErpV3Api(dataObj)
      .then((v) => {
        console.log('RESULT_DATA createOrderSale 1', v.data);

        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
           console.log('RESULT_DATA createOrderSale 1', ResponseData);

          //ResponseData
          //////////////////////
          let dataObj00 = null;
          if (order.header.AR_ORDER_TYPE === 'ขายสินค้า') {
            dataObj00 = {
              'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
              'BPAPUS-LOGIN-GUID': V3GUID,
              'BPAPUS-FUNCTION': 'GetInvoiceDocinfo',
              'BPAPUS-PARAM': '{"DI_KEY": "' + JSON.parse(ResponseData).DI_KEY + '"}',
              'BPAPUS-FILTER': '',
              'BPAPUS-ORDERBY': '',
              'BPAPUS-OFFSET': '0',
              'BPAPUS-FETCH': '0',
            };
          } else if (order.header.AR_ORDER_TYPE === 'จองสินค้า' || order.header.AR_ORDER_TYPE === 'ใบเสนอราคา') {
            dataObj00 = {
              'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
              'BPAPUS-LOGIN-GUID': V3GUID,
              'BPAPUS-FUNCTION': 'GetSellOrderDocinfo',
              'BPAPUS-PARAM': '{"DI_KEY": "' + JSON.parse(ResponseData).DI_KEY + '"}',
              'BPAPUS-FILTER': '',
              'BPAPUS-ORDERBY': '',
              'BPAPUS-OFFSET': '0',
              'BPAPUS-FETCH': '0',
            };
          }

          let TRANSTKD = updateErpV3Api(dataObj00);

          TRANSTKD
            .then((x) => {
              const {
                ResponseData,
                ResponseCode,
                ReasonString
              } = x.data;
              let responseDatax = JSON.parse(ResponseData);
              console.log('ResponseDatax naja ', responseDatax.DOCINFO.DI_REF);
              if (ResponseCode == 200) {

                //ResponseData.VDI_USER_REF = 
                dispatch({
                  type: types.ORDER_SET_HEADER_VDI_USER_REF,
                  payload: responseDatax.DOCINFO.DI_REF,
                });
              }
            })
          dispatch({
            type: types.ORDER_SET_HEADER_PROCESSED,
            payload: ResponseData,
          });
          // dispatch({
          //   type: types.ORDER_SET_HEADER_VDI_USER_REF,
          //   payload: ResponseData.VDI_USER_REF,
          // });
          // dispatch({ type: types.ORDER_SET_ITEMS_PROCESSED, payload: RESULT_DATA.RESULT.ITEMS })
        } else {
          dispatch({ type: types.ORDER_CREATE_FAIL, payload: ReasonString });
          reject(ReasonString);
        }
        resolve(v.data);
      })
      .catch((err) => {
        dispatch({ type: types.ORDER_CREATE_FAIL, payload: err.message });
        reject(err.message);
      });
  });
};

export const updateOrderSale = (data) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_CREATE });
    // console.log('RESULT_DATA 32423', data)
    updateOrderSaleApi(data)
      .then((v) => {
        const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v;
        if (STATUS === '00') {
          // console.log('RESULT_DATA updateOrderSale', RESULT_DATA)
          dispatch({
            type: types.ORDER_SET_HEADER_PROCESSED,
            payload: RESULT_DATA,
          });
          // dispatch({ type: types.ORDER_SET_ITEMS_PROCESSED, payload: RESULT_DATA.RESULT.ITEMS })
        } else if (STATUS === '10') {
          dispatch({ type: types.ORDER_CREATE_FAIL, payload: ERROR_MESSAGES });
          reject(ERROR_MESSAGES);
        }
        resolve(v);
      })
      .catch((err) => {
        dispatch({ type: types.ORDER_CREATE_FAIL, payload: err.message });
        reject(err.message);
      });
  });
};

export const orderReservV3 = (data, V3GUID, vanConfig) => (
  dispatch,
  getState,
) => {
  return new Promise(async (resolve, reject) => {
    dispatch({ type: types.ORDER_CREATE });
    const order = getState().order;
    const customer = getState().customer;
    console.log('order ', order);
    let dataObj1 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': BPAPUS_FUNCTION_DC_CODE,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "and DT_KEY = '" + vanConfig.VANCNF_BOOK_DT + "'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    let VANCNF_BOOK_DT = null;
    let DT_PROPERTIES = null;
    await lookupErpV3Api(dataObj1)
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          // console.log(JSON.parse(ResponseData));
          let responseData = JSON.parse(ResponseData);
          VANCNF_BOOK_DT = responseData.Dc000110
            ? responseData.Dc000110[0].DT_DOCCODE
            : null;
          DT_PROPERTIES = responseData.Dc000110
            ? responseData.Dc000110[0].DT_PROPERTIES
            : null;
        } else {
          console.log('ERROR lookupErpV3Api', ReasonString);
        }
      })
      .catch((err) => {
        console.log('ERROR lookupErpV3Api', err);
      });
    //---------------------------------------------
    let dataObj2 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': BPAPUS_FUNCTION_WH_CODE,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "and WL_KEY = '" + vanConfig.VANCNF_WL + "'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    let WL_CODE = null;
    await lookupErpV3Api(dataObj2)
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          // console.log(JSON.parse(ResponseData));
          let responseData = JSON.parse(ResponseData);
          WL_CODE = responseData.Wh000220
            ? responseData.Wh000220[0].WL_CODE
            : null;
        } else {
          console.log('ERROR lookupErpV3Api', ReasonString);
        }
      })
      .catch((err) => {
        console.log('ERROR lookupErpV3Api', err);
      });
    //---------------------------------------------
    let api = null;
    let ImpTrhDetail = [];
    for (let i in data.ITEMS) {
      console.log('data.ITEMS[i] ', JSON.stringify(data.ITEMS[i]));
      let newObj = {
        KEY: '',
        TRD_DSC_KEYIN: data.ITEMS[i].TRD_DSC_KEYIN + '*' + data.ITEMS[i].TRD_QTY + 'B',
        TRD_DSC_KEYINV: parseFloat(data.ITEMS[i].TRD_DSC_KEYINV).toFixed(2),
        TRD_Q_FREE: parseFloat(data.ITEMS[i].TRD_Q_FREE).toFixed(2),
        TRD_OPTION: data.ITEMS[i].TRD_OPTION,
        TRD_KEYIN: data.ITEMS[i].TRD_KEYIN,
        SKU_NAME: data.ITEMS[i].TRD_SH_NAME ? data.ITEMS[i].TRD_SH_NAME : null,
        UTQ_NAME: data.ITEMS[i].TRD_UTQNAME,
        TRD_QTY: parseFloat(data.ITEMS[i].TRD_QTY).toFixed(2),
        TRD_WL: WL_CODE,
        TRD_TO_WL: WL_CODE,
        TRD_K_U_PRC: parseFloat(data.ITEMS[i].TRD_U_PRC).toFixed(2),
        AMOUNT: parseFloat(data.ITEMS[i].TRD_G_AMT).toFixed(2),
        TRD_U_VATIO: data.ITEMS[i].TRD_U_VATIO,
        X_MODEL: 6,

      };
      ImpTrhDetail.push(newObj);
    }
    console.log('ImpTrhDetail2', ImpTrhDetail);
    console.log('data', data);

    //---------------------------------------------
    let dataObj3 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': 'SL000130',
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "and SLMN_KEY = '" + vanConfig.VANCNF_SLMN + "'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    let SLMN_CODE = null;
    await lookupErpV3Api(dataObj3)
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          // console.log(JSON.parse(ResponseData));
          let responseData = JSON.parse(ResponseData);
          SLMN_CODE = responseData.SL000130
            ? responseData.SL000130[0].SLMN_CODE
            : null;
        } else {
          console.log('ERROR lookupErpV3Api', ReasonString);
        }
      })
      .catch((err) => {
        console.log('ERROR lookupErpV3Api', err);
      });

    //---------------------------------------------
    let dataObj4 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': 'READARCDBYARKEY',
      'BPAPUS-PARAM':
        '{"AR_KEY":"' +
        order.header.VDI_KEY +
        '","ARCD_DATE":"' +
        moment(moment(order.header.VDI_DATE).add(1, 'months')).format(
          'YYYYMMDDhhmm',
        ) +
        '","ARCD_DEFAULT":"Y"}',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    // console.log('dataObj4 ', dataObj4);
    let ARCD_KEY = null;
    await readErpV3Api(dataObj4)
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          // console.log(JSON.parse(ResponseData));
          let responseData = JSON.parse(ResponseData);
          ARCD_KEY = responseData.READARCDBYARKEY
            ? responseData.READARCDBYARKEY[0].ARCD_KEY
            : null;
        } else {
          console.log('ERROR readErpV3Api', ReasonString);
        }
      })
      .catch((err) => {
        console.log('ERROR readErpV3Api', err);
      });

    //---------------------------------------------
    let AROE_TDSC_KEYIN = '';
    if (order.orderProductSummary.DIS_COUNT_TYPE2) {
      //ส่วนลดบาท
      if (order.orderProductSummary.DIS_BILL_1) {
        AROE_TDSC_KEYIN = order.orderProductSummary.DIS_BILL_1 + 'B';
      }
    } else {
      //ส่วนลดเปอร์เซ็น
      if (
        order.orderProductSummary.DIS_BILL_1 ||
        order.orderProductSummary.DIS_BILL_2
      ) {
        if (
          order.orderProductSummary.DIS_BILL_1 &&
          order.orderProductSummary.DIS_BILL_2
        ) {
          AROE_TDSC_KEYIN =
            order.orderProductSummary.DIS_BILL_1 +
            ',' +
            order.orderProductSummary.DIS_BILL_2;
        } else {
          AROE_TDSC_KEYIN =
            (order.orderProductSummary.DIS_BILL_1
              ? order.orderProductSummary.DIS_BILL_1
              : '0') +
            ',' +
            (order.orderProductSummary.DIS_BILL_2
              ? order.orderProductSummary.DIS_BILL_2
              : '0');
        }
      }
    }

    console.log('orderReservV3 param order.header', order.header);




    let param = {
      ErpUpdFunc: [
        {
          ImpTrhHeader: {
            TRH_ARPRB: vanConfig.VANCNF_ARPRB /* ตารางราคาที่ใช้อ้างอิงบิลนี้*/,
            DI_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            DI_REF: '<เลขถัดไป>',
            DT_DOCCODE: VANCNF_BOOK_DT,
            DT_PROPERTIES: DT_PROPERTIES,
            VAT_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            VAT_REF: '<เลขเดียวกัน>',
            VAT_RATE: vanConfig.VANCNF_VAT_RATE,
            VAT_RFR_REF: '<เลขเดียวกัน>',
            // TRH_SHIP_DATE: moment(order.header.VDI_SHIP_DATE,'DD/MM/YYYY').format('YYYYMMDDhhmm'),
            TRH_SHIP_DATE: order.header.VDI_SHIP_DATE,

            SLMN_CODE: SLMN_CODE,
            AR_CODE: order.header.AR_CODE,
            ARPRB_CODE: customer.item.ARPRB.ARPRB_CODE,
            AROE_ARCD: ARCD_KEY, //ข้อตกลงเจ้าหนี้
            AROE_TDSC_KEYIN: AROE_TDSC_KEYIN,
            ARD_DUE_DA: moment(
              moment(order.header.VDI_DATE).add(1, 'months'),
            ).format('YYYYMMDDhhmm'),
            DI_REMARK: order.header.VDI_REMARK,
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
            //   "CQIN_1_CHEQUE_DD": "18991230_4",
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
        },
      ],
    };

    console.log('orderReservV3 param', JSON.stringify(param));
    let dataObj = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': 'SaveSellOrderDocinfo',
      'BPAPUS-PARAM': JSON.stringify(param),
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    console.log('orderReservV3', JSON.stringify(dataObj));
    if (order.header.VDI_USER_REF === null) {
      api = updateErpV3Api(dataObj);
    } else {
      api = updateErpV3Api(dataObj);
    }

    api
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        console.log(v.data);
        if (ResponseCode == 200) {

          //ResponseData
          //////////////////////
          let dataObj00 = null;
          if (order.header.AR_ORDER_TYPE === 'ขายสินค้า') {
            dataObj00 = {
              'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
              'BPAPUS-LOGIN-GUID': V3GUID,
              'BPAPUS-FUNCTION': 'GetInvoiceDocinfo',
              'BPAPUS-PARAM': '{"DI_KEY": "' + JSON.parse(ResponseData).DI_KEY + '"}',
              'BPAPUS-FILTER': '',
              'BPAPUS-ORDERBY': '',
              'BPAPUS-OFFSET': '0',
              'BPAPUS-FETCH': '0',
            };
          } else if (order.header.AR_ORDER_TYPE === 'จองสินค้า' || order.header.AR_ORDER_TYPE === 'ใบเสนอราคา') {
            dataObj00 = {
              'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
              'BPAPUS-LOGIN-GUID': V3GUID,
              'BPAPUS-FUNCTION': 'GetSellOrderDocinfo',
              'BPAPUS-PARAM': '{"DI_KEY": "' + JSON.parse(ResponseData).DI_KEY + '"}',
              'BPAPUS-FILTER': '',
              'BPAPUS-ORDERBY': '',
              'BPAPUS-OFFSET': '0',
              'BPAPUS-FETCH': '0',
            };
          }

          let TRANSTKD = updateErpV3Api(dataObj00);

          TRANSTKD
            .then((x) => {
              const {
                ResponseData,
                ResponseCode,
                ReasonString
              } = x.data;
              let responseDatax = JSON.parse(ResponseData);
              console.log('ResponseDatax naja ', responseDatax.DOCINFO.DI_REF);
              if (ResponseCode == 200) {

                //ResponseData.VDI_USER_REF = 
                dispatch({
                  type: types.ORDER_SET_HEADER_VDI_USER_REF,
                  payload: responseDatax.DOCINFO.DI_REF,
                });
              }
            })


          //////////////////////











          console.log('RESULT_DATA orderReservV3', ResponseData);
          dispatch({
            type: types.ORDER_SET_HEADER_PROCESSED,
            payload: ResponseData,
          });

          // dispatch({ type: types.ORDER_SET_ITEMS_PROCESSED, payload: RESULT_DATA.RESULT.ITEMS })
        } else {
          dispatch({ type: types.ORDER_CREATE_FAIL, payload: ReasonString });
          reject(ReasonString + ResponseData);
        }
        resolve(v);
      })
      .catch((err) => {
        console.log('err ', err);
        dispatch({ type: types.ORDER_CREATE_FAIL, payload: err.message });
        reject(err.message);
      });
  });
};

export const orderTransferV3 = (data, V3GUID, vanConfig) => (
  dispatch,
  getState,
) => {
  return new Promise(async (resolve, reject) => {
    const order = getState().order;
    console.log('order.header', order.header);
    dispatch({ type: types.ORDER_CREATE });
    let dataObj1 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': BPAPUS_FUNCTION_DC_CODE,
      'BPAPUS-PARAM': '',

      'BPAPUS-FILTER': "and DT_KEY = '" + vanConfig.VANCNF_TRANSFER_DT + "'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    let VANCNF_BOOK_DT = null;
    let DT_PROPERTIES = null;
    await lookupErpV3Api(dataObj1)
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          // console.log(JSON.parse(ResponseData));
          let responseData = JSON.parse(ResponseData);
          VANCNF_BOOK_DT = responseData.Dc000110
            ? responseData.Dc000110[0].DT_DOCCODE
            : null;
          DT_PROPERTIES = responseData.Dc000110
            ? responseData.Dc000110[0].DT_PROPERTIES
            : null;
        } else {
          console.log('ERROR lookupErpV3Api', ReasonString);
          dispatch({
            type: types.ORDER_CREATE_FAIL,
            payload: ResponseData + ReasonString,
          });
          reject(ResponseData + ReasonString);
        }
      })
      .catch((err) => {
        console.log('ERROR lookupErpV3Api', err);
        dispatch({ type: types.ORDER_CREATE_FAIL, payload: err.message });
        reject(err.message);
      });
    console.log('DT_PROPERTIES, VANCNF_BOOK_DT', DT_PROPERTIES, VANCNF_BOOK_DT);

    //---------------------------------------------

    let dataObj3 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': 'SL000130',
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "and SLMN_KEY = '" + vanConfig.VANCNF_SLMN + "'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    let SLMN_CODE = null;
    await lookupErpV3Api(dataObj3)
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          // console.log(JSON.parse(ResponseData));
          let responseData = JSON.parse(ResponseData);
          SLMN_CODE = responseData.SL000130
            ? responseData.SL000130[0].SLMN_CODE
            : null;
        } else {
          console.log('ERROR lookupErpV3Api', ReasonString);
          dispatch({
            type: types.ORDER_CREATE_FAIL,
            payload: ResponseData + ReasonString,
          });
          reject(ResponseData + ReasonString);
        }
      })
      .catch((err) => {
        console.log('ERROR lookupErpV3Api', err);
      });
    let ImpTrhDetail = [];
    console.log('data.ITEMS', data.ITEMS);
    for (let i in data.ITEMS) {
      let newObj = {
        KEY: '',
        TRD_DSC_KEYIN: data.ITEMS[i].VTRD_U_DISC_TEXT
          ? JSON.stringify(data.ITEMS[i].VTRD_U_DISC_TEXT)
          : data.ITEMS[i].TRD_DSC_KEYIN + '*' + (data.ITEMS[i].VTRD_QTY
            ? parseFloat(data.ITEMS[i].VTRD_QTY).toFixed(2)
            : data.ITEMS[i].TRD_QTY) + 'B'
            ? data.ITEMS[i].TRD_DSC_KEYIN + '*' + (data.ITEMS[i].VTRD_QTY
              ? parseFloat(data.ITEMS[i].VTRD_QTY).toFixed(2)
              : data.ITEMS[i].TRD_QTY) + 'B'
            : '',
        TRD_DSC_KEYINV: data.ITEMS[i].VTRD_U_DSC
          ? parseFloat(JSON.stringify(data.ITEMS[i].VTRD_U_DSC)).toFixed(2)
          : parseFloat(data.ITEMS[i].TRD_DSC_KEYINV).toFixed(2)
            ? parseFloat(data.ITEMS[i].TRD_DSC_KEYINV).toFixed(2)
            : '',
        TRD_Q_FREE: data.ITEMS[i].VTRD_Q_FREE
          ? parseFloat(JSON.stringify(data.ITEMS[i].VTRD_Q_FREE)).toFixed(2)
          : data.ITEMS[i].TRD_Q_FREE
            ? data.ITEMS[i].TRD_Q_FREE
            : '',
        TRD_OPTION: '',
        TRD_KEYIN: data.ITEMS[i].VTRD_CODE
          ? data.ITEMS[i].VTRD_CODE
          : data.ITEMS[i].TRD_KEYIN
            ? data.ITEMS[i].TRD_KEYIN
            : '',
        SKU_NAME: data.ITEMS[i].VTRD_NAMES
          ? data.ITEMS[i].VTRD_NAMES
          : data.ITEMS[i].TRD_SH_NAME,
        UTQ_NAME: data.ITEMS[i].VTRD_UTQ_NAME
          ? data.ITEMS[i].VTRD_UTQ_NAME
          : data.ITEMS[i].TRD_UTQNAME,
        TRD_QTY: data.ITEMS[i].VTRD_QTY
          ? parseFloat(data.ITEMS[i].VTRD_QTY).toFixed(2)
          : data.ITEMS[i].TRD_QTY,
        X_MODEL: 7,
        TRD_WL: order.header.FROM.WL_CODE,
        TRD_TO_WL: order.header.TO.WL_CODE,
        TRD_K_U_PRC: data.ITEMS[i].VTRD_U_PRC
          ? parseFloat(data.ITEMS[i].VTRD_U_PRC).toFixed(2)
          : data.ITEMS[i].TRD_K_U_PRC,

        // toWarehouse: true,
        // TRD_U_VATIO: undefined,
        AMOUNT: parseFloat(data.ITEMS[i].VTRD_AF_VALUES).toFixed(2),

        TRD_U_VATIO: data.ITEMS[i].TRD_U_VATIO ? data.ITEMS[i].TRD_U_VATIO : 2,
      };
      ImpTrhDetail.push(newObj);
    }

    let param = {
      ErpUpdFunc: [
        {
          ImpTrhHeader: {
            TRH_ARPRB: 1,
            DI_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),

            DI_REF: '<เลขถัดไป>',
            DT_DOCCODE: VANCNF_BOOK_DT,
            DT_PROPERTIES: DT_PROPERTIES,
            VAT_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            TRH_SHIP_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            DI_REMARK: order.header.VDI_REMARK,
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
            //   "CQIN_1_CHEQUE_DD": "18991230_5",
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
        },
      ],
    };

    let dataObj = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': 'SaveOtherIcDocinfo',
      'BPAPUS-PARAM': JSON.stringify(param),
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    console.log('dataObj before POST ', dataObj);
    let api = updateErpV3Api(dataObj);

    console.log('data', data);

    api
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          console.log('RESULT_DATA orderTransferV3', ResponseData);

          //ResponseData
          //////////////////////
          let dataObj00 = null;
          if (order.header.AR_ORDER_TYPE === 'โอนย้ายสินค้า') {
            dataObj00 = {
              'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
              'BPAPUS-LOGIN-GUID': V3GUID,
              'BPAPUS-FUNCTION': 'GetOtherIcDocinfo',
              'BPAPUS-PARAM': '{"DI_KEY": "' + JSON.parse(ResponseData).DI_KEY + '"}',
              'BPAPUS-FILTER': '',
              'BPAPUS-ORDERBY': '',
              'BPAPUS-OFFSET': '0',
              'BPAPUS-FETCH': '0',
            };
          }
          console.log('ResponseDatax naja dataObj00 ', dataObj00);

          let TRANSTKD = updateErpV3Api(dataObj00);

          console.log('ResponseDatax naja TRANSTKD ', TRANSTKD);

          TRANSTKD
            .then((x) => {
              const {
                ResponseData,
                ResponseCode,
                ReasonString
              } = x.data;
              let responseDatax = JSON.parse(ResponseData);
              console.log('ResponseDatax najax ', responseDatax);

              console.log('ResponseDatax naja ', responseDatax.DOCINFO.DI_REF);
              if (ResponseCode == 200) {

                //ResponseData.VDI_USER_REF = 
                dispatch({
                  type: types.ORDER_SET_HEADER_VDI_USER_REF,
                  payload: responseDatax.DOCINFO.DI_REF,
                });
              }
            })


          //////////////////////








          dispatch({
            type: types.ORDER_SET_HEADER_PROCESSED,
            payload: ResponseData,
          });
          // dispatch({
          //   type: types.ORDER_SET_HEADER_VDI_USER_REF,
          //   payload: RESULT_DATA.VDI_USER_REF,
          // });
          // // dispatch({ type: types.ORDER_SET_ITEMS_PROCESSED, payload: RESULT_DATA.RESULT.ITEMS })
        } else {
          dispatch({ type: types.ORDER_CREATE_FAIL, payload: ReasonString });
          reject(ReasonString);
        }
        resolve(v.data);
      })
      .catch((err) => {
        dispatch({ type: types.ORDER_CREATE_FAIL, payload: err.message });
        reject(err.message);
      });
  });
};

export const orderReturn = (data, type, vanConfig, V3GUID) => (
  dispatch,
  getState,
) => {
  return new Promise(async (resolve, reject) => {
    const order = getState().order;
    const customer = getState().customer;
    dispatch({ type: types.ORDER_CREATE });

    let dataObj1 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': BPAPUS_FUNCTION_DC_CODE,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "and DT_KEY = '" + vanConfig.VANCNF_RTN_DT + "'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    let VANCNF_BOOK_DT = null;
    let DT_PROPERTIES = null;
    await lookupErpV3Api(dataObj1)
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          // console.log(JSON.parse(ResponseData));
          let responseData = JSON.parse(ResponseData);
          VANCNF_BOOK_DT = responseData.Dc000110
            ? responseData.Dc000110[0].DT_DOCCODE
            : null;
          DT_PROPERTIES = responseData.Dc000110
            ? responseData.Dc000110[0].DT_PROPERTIES
            : null;
        } else {
          console.log('ERROR orderReturn lookupErpV3Api', ReasonString);
        }
      })
      .catch((err) => {
        console.log('ERROR orderReturn lookupErpV3Api', err);
      });
    //---------------------------------------------
    let dataObj2 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': BPAPUS_FUNCTION_WH_CODE,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "and WL_KEY = '" + vanConfig.VANCNF_WL + "'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    let WL_CODE = null;
    await lookupErpV3Api(dataObj2)
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          // console.log(JSON.parse(ResponseData));
          let responseData = JSON.parse(ResponseData);
          WL_CODE = responseData.Wh000220
            ? responseData.Wh000220[0].WL_CODE
            : null;
        } else {
          console.log('ERROR orderReturn lookupErpV3Api', ReasonString);
        }
      })
      .catch((err) => {
        console.log('ERROR orderReturn lookupErpV3Api', err);
      });
    //---------------------------------------------

    let ImpTrhDetail = [];
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
        X_MODEL: 8,
        TRD_WL: WL_CODE,
        TRD_TO_WL: WL_CODE,
        TRD_K_U_PRC: parseFloat(data.ITEMS[i].TRD_U_PRC).toFixed(2),
        AMOUNT: parseFloat(data.ITEMS[i].TRD_G_AMT).toFixed(2),
        TRD_U_VATIO: data.ITEMS[i].TRD_U_VATIO,
      };
      ImpTrhDetail.push(newObj);
    }
    console.log('orderReturn ImpTrhDetail', ImpTrhDetail);
    console.log('orderReturn data', data);

    //---------------------------------------------
    let dataObj3 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': 'SL000130',
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "and SLMN_KEY = '" + vanConfig.VANCNF_SLMN + "'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    let SLMN_CODE = null;
    await lookupErpV3Api(dataObj3)
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          // console.log(JSON.parse(ResponseData));
          let responseData = JSON.parse(ResponseData);
          SLMN_CODE = responseData.SL000130
            ? responseData.SL000130[0].SLMN_CODE
            : null;
        } else {
          console.log('ERROR orderReturn lookupErpV3Api', ReasonString);
        }
      })
      .catch((err) => {
        console.log('ERROR orderReturn lookupErpV3Api', err);
      });

    //---------------------------------------------
    let dataObj4 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': 'READARCDBYARKEY',
      'BPAPUS-PARAM':
        '{"AR_KEY":"' +
        order.header.VDI_KEY +
        '","ARCD_DATE":"' +
        moment(moment(order.header.VDI_DATE).add(1, 'months')).format(
          'YYYYMMDDhhmm',
        ) +
        '","ARCD_DEFAULT":""}',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    // console.log('orderReturn dataObj4 ', dataObj4);
    let ARCD_KEY = null;
    await readErpV3Api(dataObj4)
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          // console.log(JSON.parse(ResponseData));
          let responseData = JSON.parse(ResponseData);
          ARCD_KEY = responseData.READARCDBYARKEY
            ? responseData.READARCDBYARKEY[0].ARCD_KEY
            : null;
        } else {
          console.log('ERROR orderReturn readErpV3Api', ReasonString);
        }
      })
      .catch((err) => {
        console.log('ERROR orderReturn readErpV3Api', err);
      });

    //---------------------------------------------

    let ARD_TDSC_KEYIN = '';
    if (order.orderProductSummary.DIS_COUNT_TYPE2) {
      //ส่วนลดบาท
      if (order.orderProductSummary.DIS_BILL_1) {
        ARD_TDSC_KEYIN = order.orderProductSummary.DIS_BILL_1 + 'B';
      }
    } else {
      //ส่วนลดเปอร์เซ็น
      if (
        order.orderProductSummary.DIS_BILL_1 ||
        order.orderProductSummary.DIS_BILL_2
      ) {
        if (
          order.orderProductSummary.DIS_BILL_1 &&
          order.orderProductSummary.DIS_BILL_2
        ) {
          ARD_TDSC_KEYIN =
            order.orderProductSummary.DIS_BILL_1 +
            ',' +
            order.orderProductSummary.DIS_BILL_2;
        } else {
          ARD_TDSC_KEYIN =
            (order.orderProductSummary.DIS_BILL_1
              ? order.orderProductSummary.DIS_BILL_1
              : '0') +
            ',' +
            (order.orderProductSummary.DIS_BILL_2
              ? order.orderProductSummary.DIS_BILL_2
              : '0');
        }
      }
    }

    let param = {
      ErpUpdFunc: [
        {
          ImpTrhHeader: {
            TRH_ARPRB: vanConfig.VANCNF_ARPRB /* ตารางราคาที่ใช้อ้างอิงบิลนี้*/,
            DI_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            DI_REF: '<เลขถัดไป>',
            DT_DOCCODE: VANCNF_BOOK_DT,
            DT_PROPERTIES: DT_PROPERTIES,
            VAT_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            VAT_REF: '<เลขเดียวกัน>',
            VAT_RATE: vanConfig.VANCNF_VAT_RATE,
            VAT_RFR_REF: '<เลขเดียวกัน>',
            TRH_SHIP_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            SLMN_CODE: SLMN_CODE,
            AR_CODE: order.header.AR_CODE,
            ARPRB_CODE: customer.item.ARPRB.ARPRB_CODE,
            AROE_ARCD: ARCD_KEY, //ข้อตกลงเจ้าหนี้
            ARD_TDSC_KEYIN: ARD_TDSC_KEYIN,
            ARD_DUE_DA: moment(
              moment(order.header.VDI_DATE).add(1, 'months'),
            ).format('YYYYMMDDhhmm'),
            DI_REMARK: order.header.VDI_REMARK,
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
            //   "CQIN_1_CHEQUE_DD": "18991230_6",
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
        },
      ],
    };

    console.log('orderReturn param', JSON.stringify(param));
    let dataObj = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': 'SaveReturnSellDocinfo',
      'BPAPUS-PARAM': JSON.stringify(param),
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    console.log('orderReturn', JSON.stringify(dataObj));

    let api = null;
    console.log('orderReturn type', type);
    // if (type === '0') {
    //   order.header.VDI_USER_REF === null
    //     ? (api = createOrderReturnApi(data))
    //     : (api = updateOrderReturnApi(data));
    // } else {
    //   order.header.VDI_USER_REF === null
    //     ? (api = createOrderReturnCashApi(data))
    //     : (api = updateOrderReturnCashApi(data));
    // }

    if (type === '0') {
      order.header.VDI_USER_REF === null
        ? (api = updateErpV3Api(dataObj))
        : (api = updateErpV3Api(dataObj));
    } else {
      order.header.VDI_USER_REF === null
        ? (api = updateErpV3Api(dataObj))
        : (api = updateErpV3Api(dataObj));
    }

    api
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {


          //ResponseData
          //////////////////////
          let dataObj00 = null;
          if (order.header.AR_ORDER_TYPE === 'รับคืนสินค้า') {
            dataObj00 = {
              'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
              'BPAPUS-LOGIN-GUID': V3GUID,
              'BPAPUS-FUNCTION': 'GetInvoiceDocinfo',
              'BPAPUS-PARAM': '{"DI_KEY": "' + JSON.parse(ResponseData).DI_KEY + '"}',
              'BPAPUS-FILTER': '',
              'BPAPUS-ORDERBY': '',
              'BPAPUS-OFFSET': '0',
              'BPAPUS-FETCH': '0',
            };
          }
          let TRANSTKD = updateErpV3Api(dataObj00);

          TRANSTKD
            .then((x) => {
              const {
                ResponseData,
                ResponseCode,
                ReasonString
              } = x.data;
              let responseDatax = JSON.parse(ResponseData);
              console.log('ResponseDatax naja ', responseDatax.DOCINFO.DI_REF);
              if (ResponseCode == 200) {

                //ResponseData.VDI_USER_REF = 
                dispatch({
                  type: types.ORDER_SET_HEADER_VDI_USER_REF,
                  payload: responseDatax.DOCINFO.DI_REF,
                });
              }
            })


          //////////////////////



          console.log('RESULT_DATA orderReturn', ResponseData);
          dispatch({
            type: types.ORDER_SET_HEADER_PROCESSED,
            payload: ResponseData,
          });
          // dispatch({
          //   type: types.ORDER_SET_HEADER_VDI_USER_REF,
          //   payload: ResponseData.VDI_USER_REF,
          // });
        } else {
          dispatch({ type: types.ORDER_CREATE_FAIL, payload: ReasonString });
          reject(ReasonString + ResponseData);
        }
        resolve(v);
      })
      .catch((err) => {
        console.log('err ', err);
        dispatch({ type: types.ORDER_CREATE_FAIL, payload: err.message });
        reject(err.message);
      });
  });
};

export const getProductListItemsFromLastBillByArCode = (
  V3GUID,
  vancnf_machine,
) => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    const customer = getState().customer;
    const order = getState().order;
    const { VANCONFIG } = await getUserToken();
    //const {vanConfig} = await getSettingConfig();

    console.log('order.header.AR_ORDER_TYPE VANCONFIG ', VANCONFIG.VANCNF_INV_DT);

    dispatch({ type: types.ORDER_GET_PRODUCT_LIST_FROM_LAST_BILL_BY_AR_CODE });
    let vanmachine = vancnf_machine[2] + vancnf_machine[3];
    let api = null;
    console.log('order.header.AR_ORDER_TYPE ', order.header.AR_ORDER_TYPE);
    console.log('customer.item.INFO.AR_CODE ', customer.item.INFO.AR_CODE);
    if (order.header.AR_ORDER_TYPE === 'จองสินค้า') {
      console.log('จองสินค้า');
      let dataObj1 = {
        'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': V3GUID,
        'BPAPUS-FUNCTION': BPAPUS_FUNCTION_BK_CODE,
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER':
          "and AR_CODE = '" +
          customer.item.INFO.AR_CODE +
          "' and  DT_KEY = '" +
          VANCONFIG.VANCNF_BOOK_DT +
          "'",
        'BPAPUS-ORDERBY': 'order by DI_KEY desc',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '1',
      };
      console.log('getProductListItemsFromLastBillByArCode', dataObj1);
      api = lookupErpV3Api(dataObj1);
    } else if (order.header.AR_ORDER_TYPE === 'ขายสินค้า') {
      console.log('ขายสินค้า');
      let dataObj1 = {
        'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': V3GUID,
        'BPAPUS-FUNCTION': BPAPUS_FUNCTION_V_CODE,
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER':
          "and AR_CODE = '" +
          customer.item.INFO.AR_CODE +
          "' and  (DT_KEY = '" +
          VANCONFIG.VANCNF_INV_DT + 
          "' OR DT_KEY = '" +
          VANCONFIG.VANCNF_CASHSALES_DT + 
          "')",
        'BPAPUS-ORDERBY': 'order by DI_KEY desc',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '1',
      };
      console.log('getProductListItemsFromLastBillByArCode', dataObj1);
      api = lookupErpV3Api(dataObj1);
    }  else if (order.header.AR_ORDER_TYPE === 'ใบเสนอราคา'){
      console.log('ใบเสนอราคา');
      let dataObj1 = {
        'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': V3GUID,
        'BPAPUS-FUNCTION': BPAPUS_FUNCTION_BK_CODE,
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER':
          "and AR_CODE = '" +
          customer.item.INFO.AR_CODE +
          "' and  DT_KEY = '" +
          VANCONFIG.VANCNF_QUOTE_DT +
          "'",
        'BPAPUS-ORDERBY': 'order by DI_KEY desc',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '1',
      };
      console.log('getProductListItemsFromLastBillByArCode', dataObj1);
      api = lookupErpV3Api(dataObj1);
    }  
    if (order.header.AR_ORDER_TYPE !== 'ตรวจนับสินค้า') {
      api
        .then(async (v) => {
          console.log(v.data);
          const { ResponseData, ResponseCode, ReasonString } = v.data;
          let responseData1 = JSON.parse(ResponseData);
          console.log('responseData api', responseData1);
          if (
            ResponseCode == 200 &&
            (responseData1.Oe000304?.length > 0 ||
              responseData1.Oe002304?.length > 0)
          ) {
            console.log('responseData ', responseData1);
            let dataObj1 = null;
            let DI_REF = null;
            if (order.header.AR_ORDER_TYPE === 'ขายสินค้า') {
              dataObj1 = {
                'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
                'BPAPUS-LOGIN-GUID': V3GUID,
                'BPAPUS-FUNCTION': 'GetInvoiceDocinfo',
                'BPAPUS-PARAM':
                  '{"DI_KEY": "' + responseData1.Oe000304[0].DI_KEY + '"}',
                'BPAPUS-FILTER': '',
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '0',
              };
              DI_REF = responseData1.Oe000304[0].DI_REF;
            } else  if ( order.header.AR_ORDER_TYPE === 'ใบเสนอราคา') {
              dataObj1 = {
                'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
                'BPAPUS-LOGIN-GUID': V3GUID,
                'BPAPUS-FUNCTION': 'GetSellOrderDocinfo',
                'BPAPUS-PARAM':
                  '{"DI_KEY": "' + responseData1.Oe002304[0].DI_KEY + '"}',
                'BPAPUS-FILTER': '',
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '0',
              };
              DI_REF = responseData1.Oe002304[0].DI_REF;
            }  else if (order.header.AR_ORDER_TYPE === 'จองสินค้า') {
              dataObj1 = {
                'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
                'BPAPUS-LOGIN-GUID': V3GUID,
                'BPAPUS-FUNCTION': 'GetSellOrderDocinfo',
                'BPAPUS-PARAM':
                  '{"DI_KEY": "' + responseData1.Oe002304[0].DI_KEY + '"}',
                'BPAPUS-FILTER': '',
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '0',
              };
              DI_REF = responseData1.Oe002304[0].DI_REF;
            }

            console.log('dataObj1 dataObj1', dataObj1);



            let dataObj2 = {
              'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
              'BPAPUS-LOGIN-GUID': V3GUID,
              'BPAPUS-FUNCTION': BPAPUS_FUNCTION_WH_CODE,
              'BPAPUS-PARAM': '',
              'BPAPUS-FILTER': "and WL_KEY = '" + VANCONFIG.VANCNF_WL + "'",
              'BPAPUS-ORDERBY': '',
              'BPAPUS-OFFSET': '0',
              'BPAPUS-FETCH': '0',
            };
            let WL_CODE = null;

            await lookupErpV3Api(dataObj2).then((g) => {
              const {
                ResponseData,
                ResponseCode,
                ReasonString
              } = g.data;
              console.log('getDropPointListItems2 ', g.data);
              if (ResponseCode == 200) {
                // console.log(JSON.parse(ResponseData));
                let responseDataObj2 = JSON.parse(ResponseData);
                WL_CODE = responseDataObj2.Wh000220 ?
                  responseDataObj2.Wh000220[0].WL_CODE :
                  null;
              }
            })

            console.log('WL_CODE ', WL_CODE);






            let TRANSTKD = updateErpV3Api(dataObj1);



            TRANSTKD
              .then((v) => {
                const { ResponseData, ResponseCode, ReasonString } = v.data;
                let responseData = JSON.parse(ResponseData);
                console.log('ResponseData naja ', responseData);
                if (ResponseCode == 200) {
                  const order = getState().order;
                  console.log('ResponseData naja order ', order.orderProductSummary);


                  //  typeof order.orderProductSummary.DIS_COUNT_TYPE1 === 'undefined'
                  //   ? true
                  //   : order.orderProductSummary.DIS_COUNT_TYPE1

                  // order.orderProductSummary.DIS_COUNT_TYPE1 = false;
                  // order.orderProductSummary.DIS_COUNT_TYPE1 = false;

                  if (order.header.AR_ORDER_TYPE === 'ขายสินค้า') {
                    order.orderProductSummary.DIS_BILL_1 = responseData.ARDETAIL.ARD_TDSC_KEYIN.split(',')[0]
                    order.orderProductSummary.DIS_BILL_2 = responseData.ARDETAIL.ARD_TDSC_KEYIN.split(',')[1]
                    order.orderProductSummary.totalQty = 1;
                  } else if (order.header.AR_ORDER_TYPE === 'จองสินค้า' || order.header.AR_ORDER_TYPE === 'ใบเสนอราคา') {
                    order.orderProductSummary.DIS_BILL_1 = responseData.AROE.AROE_TDSC_KEYIN.split(',')[0]
                    order.orderProductSummary.DIS_BILL_2 = responseData.AROE.AROE_TDSC_KEYIN.split(',')[1]
                    order.orderProductSummary.totalQty = 1;
                  }

                  dispatch({
                    type:
                      types.ORDER_GET_PRODUCT_LIST_FROM_LAST_BILL_BY_AR_CODE_SUCCESS,
                  });
                  console.log('responseData1.Oe002304[0].DI_REF ', responseData.TRANSTKD);

                  let responseBazz = [];
                  let good_inVan = 0;

                  for (let obj of responseData.TRANSTKD) {

                    good_inVan = getWareLocationStockBalance(obj.GOODS_CODE, VANCONFIG,)
                      .then((v2) => {
                        const {
                          ReasonString,
                          ResponseCode,
                          ResponseData
                        } = v2;
                        console.log('getDropPointListItems ', v2);
                        // console.log('getDropPointListItems ', JSON.parse(v2));

                        let responseData2 = JSON.parse(ResponseData);
                        if (ResponseCode == 200) {

                          for (let obj2 of responseData2.ShowSkuBalance) {
                            if (obj2.WL_CODE == WL_CODE) {
                              return (obj2.QTY);
                            }
                          }
                        }
                      })
                    responseBazz.push({ ...obj, good_inVan_qty: good_inVan, });

                  }




                  dispatch({
                    type: types.ORDER_SET_ITEMS,
                    payload: convertProductItemLastBillToOrderItem(
                      responseBazz,
                      //responseData.TRANSTKD,
                    ),
                  });
                } else {
                  dispatch({
                    type:
                      types.ORDER_GET_PRODUCT_LIST_FROM_LAST_BILL_BY_AR_CODE_FAIL,
                    payload: ReasonString,
                  });
                  reject(ReasonString);
                }
                resolve(v);
              });






            // await updateErpV3Api(dataObj1).then((v) => {
            //   const {ResponseData, ResponseCode, ReasonString} = v.data;
            //   let responseData = JSON.parse(ResponseData);
            //   console.log('ResponseData naja ', responseData);
            //   if (ResponseCode == 200) {
            //     dispatch({
            //       type:
            //         types.ORDER_GET_PRODUCT_LIST_FROM_LAST_BILL_BY_AR_CODE_SUCCESS,
            //     });
            //     console.log('responseData1.Oe002304[0].DI_REF ', responseData.TRANSTKD);
            //     // dispatch({
            //     //   type: types.ORDER_SET_HEADER_VDI_USER_REF,
            //     //   payload: DI_REF,
            //     // });
            //     dispatch({
            //       type: types.ORDER_SET_ITEMS,
            //       payload: convertProductItemLastBillToOrderItem(
            //         responseData.TRANSTKD,
            //       ),
            //     });
            //   } else {
            //     dispatch({
            //       type:
            //         types.ORDER_GET_PRODUCT_LIST_FROM_LAST_BILL_BY_AR_CODE_FAIL,
            //       payload: ReasonString,
            //     });
            //     reject(ReasonString);
            //   }
            //   resolve(v);
            // });
          } else {
            dispatch({
              type: types.ORDER_GET_PRODUCT_LIST_FROM_LAST_BILL_BY_AR_CODE_FAIL,
              payload: 'Not Found',
            });
            reject(ReasonString);
          }
          resolve(v);
        })
        .catch((err) => {
          dispatch({
            type: types.ORDER_GET_PRODUCT_LIST_FROM_LAST_BILL_BY_AR_CODE_FAIL,
            payload: err.message,
          });
          reject(err.message);
        });
    }
  });
};

export const setOrderItems = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_SET_ITEMS, payload: data });
    resolve();
  });
};

export const orderCreateCash = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_CREATE });
    console.log('orderCreateCash data', data);
    orderCreateCashApi(data)
      .then((v) => {
        const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v;
        if (STATUS === '00') {
          // console.log('RESULT_DATA orderCreateCashApi', RESULT_DATA)
          dispatch({
            type: types.ORDER_SET_HEADER_PROCESSED,
            payload: RESULT_DATA,
          });
          dispatch({
            type: types.ORDER_SET_HEADER_VDI_USER_REF,
            payload: RESULT_DATA.VDI_USER_REF,
          });
          // dispatch({ type: types.ORDER_SET_ITEMS_PROCESSED, payload: RESULT_DATA.RESULT.ITEMS })
        } else if (STATUS === '10') {
          dispatch({ type: types.ORDER_CREATE_FAIL, payload: ERROR_MESSAGES });
          reject(ERROR_MESSAGES);
        }
        resolve(v);
      })
      .catch((err) => {
        dispatch({ type: types.ORDER_CREATE_FAIL, payload: err.message });
        reject(err.message);
      });
  });
};

export const orderUpdateCash = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.ORDER_CREATE });

    // console.log('orderUpdateCash data', data)

    orderUpdateCashApi(data)
      .then((v) => {
        const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v;
        if (STATUS === '00') {
          console.log('orderUpdateCash RESULT_DATA', RESULT_DATA);
          dispatch({
            type: types.ORDER_SET_HEADER_PROCESSED,
            payload: RESULT_DATA,
          });
          // dispatch({ type: types.ORDER_SET_ITEMS_PROCESSED, payload: RESULT_DATA.RESULT.ITEMS })
        } else if (STATUS === '10') {
          dispatch({ type: types.ORDER_CREATE_FAIL, payload: ERROR_MESSAGES });
          reject(ERROR_MESSAGES);
        }
        resolve(v);
      })
      .catch((err) => {
        dispatch({ type: types.ORDER_CREATE_FAIL, payload: err.message });
        reject(err.message);
      });
  });
};

export const setHeaderProcessedVdiChequeBank = (value) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.ORDER_SET_HEADER_PROCESSED_VDI_CHEQUE_BANK,
      payload: value,
    });
    resolve();
  });
};

export const setHeaderProcessedVdiChequeDate = (value) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.ORDER_SET_HEADER_PROCESSED_VDI_CHEQUE_DATE,
      payload: value,
    });
    resolve();
  });
};

export const setHeaderProcessedVdiChequeNo = (value) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.ORDER_SET_HEADER_PROCESSED_VDI_CHEQUE_NO,
      payload: value,
    });
    resolve();
  });
};

export const setHeaderProcessedVdiBankTransfer = (value) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.ORDER_SET_HEADER_PROCESSED_VDI_BANK_TRANSFER,
      payload: value,
    });
    resolve();
  });
};

export const setHeaderProcessedVdiQRRefer = (value) => (dispatch) => {
  console.log('value', value);
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.ORDER_SET_HEADER_PROCESSED_VDI_QR_REFER,
      payload: value,
    });
    resolve();
  });
};

export const createDocVisit = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    createDocVisitApi(data)
      .then((v) => {
        const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v;
        if (STATUS === '00') {
          // console.log('RESULT_DATA createDocVisit', RESULT_DATA)
          // dispatch({ type: types.ORDER_SET_HEADER_PROCESSED, payload: RESULT_DATA })
          // dispatch({ type: types.ORDER_SET_ITEMS_PROCESSED, payload: RESULT_DATA.RESULT.ITEMS })
        } else if (STATUS === '10') {
          reject(ERROR_MESSAGES);
        }
        resolve(v);
      })
      .catch((err) => {
        reject(err.message);
      });
  });
};

export const createDocSurvey = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    createDocSurveyApi(data)
      .then((v) => {
        const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v;
        if (STATUS === '00') {
          console.log('RESULT_DATA createDocSurvey data', data);
        } else if (STATUS === '10') {
          dispatch({ type: types.ORDER_CREATE_FAIL, payload: ERROR_MESSAGES });
          reject(ERROR_MESSAGES);
        }
        resolve(v);
      })
      .catch((err) => {
        dispatch({ type: types.ORDER_CREATE_FAIL, payload: err.message });
        reject(err.message);
      });
  });
};

export const loadOrderFileByById = (id, date) => (dispatch) => {
  return new Promise((resolve, reject) => {
    orderFileApi({ DI_REF: id }, date)
      .then((v) => {
        const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v;
        if (STATUS === '00') {
          // console.log('RESULT_DATA loadOrderFileByById', RESULT_DATA)
          resolve(v);
        } else if (STATUS === '10') {
          dispatch({ type: types.ORDER_CREATE_FAIL, payload: ERROR_MESSAGES[0] });
          reject(ERROR_MESSAGES[0]);
        }
      })
      .catch((error) => {
        dispatch({ type: types.ORDER_CREATE_FAIL, payload: err.message });
        reject(error.message);
      });
  });
};

export const orderCancel = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    orderCancelApi({ DI_REF: id })
      .then((v) => {
        console.log('glf', { DI_REF: id });
        const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v;
        if (STATUS === '00') {
          console.log('RESULT_DATA orderCancel', RESULT_DATA);
          resolve(v);
        } else if (STATUS === '10') {
          reject(ERROR_MESSAGES[0]);
        }
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const orderUpdate = (id, type) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const customer = getState().customer;
    // let api = null

    orderUpdateApi(customer.item.INFO.AR_CODE, id)
      .then((v) => {
        const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v;
        if (STATUS === '00') {
          // console.log('RESULT_DATA orderUpdate', RESULT_DATA)
          resolve(RESULT_DATA);
        } else if (STATUS === '10') {
          reject(ERROR_MESSAGES[0]);
        }
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const setVdiAns = (index, value) => (dispatch) => {
  dispatch({
    type: types.ORDER_SURVEY_SET_VDI_ANS,
    payload: { index: index, value: value },
  });
};

export const createQuotation = (data, V3GUID, vanConfig) => (
  dispatch,
  getState,
) => {
  return new Promise(async (resolve, reject) => {
    const order = getState().order;
    const customer = getState().customer;
    console.log(
      'order.productListItems createQuotation',
      order.productListItems,
    );
    let dataObj1 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': BPAPUS_FUNCTION_DC_CODE,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "and DT_KEY = '" + vanConfig.VANCNF_QUOTE_DT + "'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    let VANCNF_BOOK_DT = null;
    let DT_PROPERTIES = null;
    await lookupErpV3Api(dataObj1)
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          // console.log(JSON.parse(ResponseData));
          let responseData = JSON.parse(ResponseData);
          VANCNF_BOOK_DT = responseData.Dc000110
            ? responseData.Dc000110[0].DT_DOCCODE
            : null;
          DT_PROPERTIES = responseData.Dc000110
            ? responseData.Dc000110[0].DT_PROPERTIES
            : null;
        } else {
          console.log('ERROR createQuotation1 lookupErpV3Api', ReasonString);
        }
      })
      .catch((err) => {
        console.log('ERROR createQuotation1 lookupErpV3Api', err);
      });
    //---------------------------------------------
    let dataObj2 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': BPAPUS_FUNCTION_WH_CODE,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "and WL_KEY = '" + vanConfig.VANCNF_WL + "'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    let WL_CODE = null;
    await lookupErpV3Api(dataObj2)
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          // console.log(JSON.parse(ResponseData));
          let responseData = JSON.parse(ResponseData);
          WL_CODE = responseData.Wh000220
            ? responseData.Wh000220[0].WL_CODE
            : null;
        } else {
          console.log('ERROR createQuotation2  lookupErpV3Api', ReasonString);
        }
      })
      .catch((err) => {
        console.log('ERROR createQuotation2 lookupErpV3Api', err);
      });
    //---------------------------------------------
    let dataObj3 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': 'SL000130',
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "and SLMN_KEY = '" + vanConfig.VANCNF_SLMN + "'",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    let SLMN_CODE = null;
    await lookupErpV3Api(dataObj3)
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          // console.log(JSON.parse(ResponseData));
          let responseData = JSON.parse(ResponseData);
          SLMN_CODE = responseData.SL000130
            ? responseData.SL000130[0].SLMN_CODE
            : null;
        } else {
          console.log('ERROR  createQuotation3 lookupErpV3Api', ReasonString);
        }
      })
      .catch((err) => {
        console.log('ERROR createQuotation3 lookupErpV3Api', err);
      });

    //---------------------------------------------
    let ImpTrhDetail = [];
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
        X_MODEL: 9,
        TRD_WL: WL_CODE,
        TRD_TO_WL: WL_CODE,
        TRD_K_U_PRC: parseFloat(data.ITEMS[i].TRD_U_PRC).toFixed(2),
        AMOUNT: parseFloat(data.ITEMS[i].TRD_G_AMT).toFixed(2),
        TRD_U_VATIO: data.ITEMS[i].TRD_U_VATIO,
      };
      ImpTrhDetail.push(newObj);
    }
    console.log('DT_DOCCODE DT_PROPERTIES', VANCNF_BOOK_DT, DT_PROPERTIES);
    //---------------------------------------------
    let dataObj4 = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': 'READARCDBYARKEY',
      'BPAPUS-PARAM':
        '{"AR_KEY":"' +
        order.header.VDI_KEY +
        '","ARCD_DATE":"' +
        moment(moment(order.header.VDI_DATE).add(1, 'months')).format(
          'YYYYMMDDhhmm',
        ) +
        '","ARCD_DEFAULT":""}',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };
    // console.log('dataObj4 ', dataObj4);
    let ARCD_KEY = null;
    await readErpV3Api(dataObj4)
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {
          // console.log(JSON.parse(ResponseData));
          let responseData = JSON.parse(ResponseData);
          ARCD_KEY = responseData.READARCDBYARKEY
            ? responseData.READARCDBYARKEY[0].ARCD_KEY
            : null;
        } else {
          console.log('ERROR createQuotation1  readErpV3Api', ReasonString);
        }
      })
      .catch((err) => {
        console.log('ERROR createQuotation1  readErpV3Api', err);
      });

    //---------------------------------------------
    let ARD_TDSC_KEYIN = data.DIS_BILL_1 + ',' + data.DIS_BILL_2;



          console.log('datadatadatadata', ARD_TDSC_KEYIN);


  
    let param = {
      ErpUpdFunc: [
        {
          ImpTrhHeader: {
            TRH_ARPRB: vanConfig.VANCNF_ARPRB /* ตารางราคาที่ใช้อ้างอิงบิลนี้*/,
            DI_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            DI_REF: '<เลขถัดไป>',
            DT_DOCCODE: VANCNF_BOOK_DT,
            DT_PROPERTIES: DT_PROPERTIES,
            VAT_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            VAT_REF: '<เลขเดียวกัน>',
            VAT_RATE: vanConfig.VANCNF_VAT_RATE,
            VAT_RFR_REF: '<เลขเดียวกัน>',
            TRH_SHIP_DATE: moment(order.header.VDI_DATE).format('YYYYMMDDhhmm'),
            SLMN_CODE: SLMN_CODE,
            AR_CODE: order.header.AR_CODE,
            ARPRB_CODE: customer.item.ARPRB.ARPRB_CODE,
            AROE_ARCD: ARCD_KEY, //ข้อตกลงเจ้าหนี้
            AROE_TDSC_KEYIN: ARD_TDSC_KEYIN,
            AROE_DUE_DA: moment(
              moment(order.header.VDI_DATE).add(1, 'months'),
            ).format('YYYYMMDDhhmm'),
            DI_REMARK: order.header.VDI_REMARK,
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
            //   "CQIN_1_CHEQUE_DD": "18991230_7",
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
        },
      ],
    };


    let dataObj = {
      'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': V3GUID,
      'BPAPUS-FUNCTION': 'SaveSellOrderDocinfo',
      'BPAPUS-PARAM': JSON.stringify(param),
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };


        console.log('createQuotation param', JSON.stringify(param));
    console.log('createQuotation dataObj', JSON.stringify(dataObj));

    
    updateErpV3Api(dataObj)
      .then((v) => {
        const { ResponseData, ResponseCode, ReasonString } = v.data;
        if (ResponseCode == 200) {


          console.log('RESULT_DATA createOrderSale 2', ResponseData);
          console.log('RESULT_DATA createOrderSale 2', order.header.AR_ORDER_TYPE);



          //ResponseData
          //////////////////////
          let dataObj00 = null;
          if (order.header.AR_ORDER_TYPE === 'ใบเสนอราคา') {
            dataObj00 = {
              'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
              'BPAPUS-LOGIN-GUID': V3GUID,
              'BPAPUS-FUNCTION': 'GetSellOrderDocinfo',
              'BPAPUS-PARAM': '{"DI_KEY": "' + JSON.parse(ResponseData).DI_KEY + '"}',
              'BPAPUS-FILTER': '',
              'BPAPUS-ORDERBY': '',
              'BPAPUS-OFFSET': '0',
              'BPAPUS-FETCH': '0',
            };
          }

          let TRANSTKD = updateErpV3Api(dataObj00);

          TRANSTKD
            .then((x) => {
              const {
                ResponseData,
                ResponseCode,
                ReasonString
              } = x.data;
              let responseDatax = JSON.parse(ResponseData);
              console.log('ResponseDatax naja ', responseDatax.DOCINFO.DI_REF);
              if (ResponseCode == 200) {

                //ResponseData.VDI_USER_REF = 
                dispatch({
                  type: types.ORDER_SET_HEADER_VDI_USER_REF,
                  payload: responseDatax.DOCINFO.DI_REF,
                });
              }
            })

          //////////////////////

          dispatch({
            type: types.ORDER_SET_HEADER_PROCESSED,
            payload: ResponseData,
          });
          // dispatch({
          //   type: types.ORDER_SET_HEADER_VDI_USER_REF,
          //   payload: ResponseData.VDI_USER_REF,
          // });
          // // dispatch({ type: types.ORDER_SET_ITEMS_PROCESSED, payload: RESULT_DATA.RESULT.ITEMS })
        } else {
          dispatch({ type: types.ORDER_CREATE_FAIL, payload: ReasonString });
          reject(ReasonString);
        }
        resolve(v.data);
      })
      .catch((err) => {
        dispatch({ type: types.ORDER_CREATE_FAIL, payload: err.message });
        reject(err.message);
      });
  });
};

export const orderUpdateQuotation = (data) => (dispatch, getState) => {
  // console.log('ASDASD ', data);
  return new Promise((resolve, reject) => {
    orderUpdateQuotationApi(data)
      .then((v) => {
        const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v;
        if (STATUS === '00') {
          // console.log('RESULT_DATA createOrderSale', v)
          dispatch({
            type: types.ORDER_SET_HEADER_PROCESSED,
            payload: RESULT_DATA,
          });
          dispatch({
            type: types.ORDER_SET_HEADER_VDI_USER_REF,
            payload: RESULT_DATA.VDI_USER_REF,
          });
          // dispatch({ type: types.ORDER_SET_ITEMS_PROCESSED, payload: RESULT_DATA.RESULT.ITEMS })
        } else if (STATUS === '10') {
          dispatch({ type: types.ORDER_CREATE_FAIL, payload: ERROR_MESSAGES });
          reject(ERROR_MESSAGES);
        }
        resolve(v);
      })
      .catch((err) => {
        dispatch({ type: types.ORDER_CREATE_FAIL, payload: err.message });
        reject(err.message);
      });
  });
};

export const orderAttachImage = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    orderAttachImageApi(data)
      .then((v) => {
        const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v;
        if (STATUS === '00') {
          resolve(v);
        } else if (STATUS === '10') {
          reject(ERROR_MESSAGES[0]);
        }
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const orderAttachMultipleImages = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    orderAttachMultipleImagesApi(data)
      .then((v) => {
        const { RESULT_DATA, STATUS, ERROR_MESSAGES } = v;
        if (STATUS === '00') {
          resolve(v);
          dispatch({ type: types.ORDER_REMOVE_ALL_STOCK_IMAGE_ITEMS });
        } else if (STATUS === '10') {
          reject(ERROR_MESSAGES[0]);
        }
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};
