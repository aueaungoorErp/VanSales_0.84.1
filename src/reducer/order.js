import * as types from '../constant/order';
import {
  calculateOrderProductSummary,
  calculateOrderProductProcessedSummary,
  calculateOrderNetPriceAfterDiscount,
  calculateOrderDiscountAfterDiscount
} from '../utils/Culculate';

const initialState = {
  item: null,
  listItems: [],
  header: {
    VDI_KEY: null,
    VDI_DATE: null,
    VDI_REF: null,
    VDI_AR: null,
    VDI_PROPERTIES: null,
    VDI_ACTIVE: null,
    VDI_CRE_DATE: null,
    VDI_UPD_DATE: null,
    VDI_DEL_DATE: null,
    VDI_1ST_ITEMS: null,
    VDI_1ST_PCS: null,
    VDI_1ST_AMOUNT: null,
    VDI_1ST_PMT: null,
    VDI_ITEMS: null,
    VDI_PCS: null,
    VDI_AMOUNT: null,
    VDI_AF_ROUND: null,
    VDI_AF_ROUND_V: null,
    VDI_PMT: null,
    VDI_MILE: null,
    VDI_SHIP_DATE: null,
    VDI_MACHINE: null,
    VDI_DISC_1: null,
    VDI_DISC_2: null,
    VDI_DISC_V1: null,
    VDI_DISC_V2: null,
    VDI_AF_DISC: null,
    VDI_BANK: null,
    VDI_CHEQUE_DATE: null,
    VDI_CHEQUE_NO: null,
    VDI_BANK_TRANSFER: null,
    VDI_VISIT: null,
    VDI_GPS_LAT_S: null,
    VDI_GPS_LONG_S: null,
    VDI_GPS_LAT_V: null,
    VDI_GPS_LONG_V: null,
    VDI_GPS_DATE_S: null,
    VDI_GPS_DISTANCE: null,
    VDI_PRN_TIME: null,
    VDI_PRN_DATE: null,
    VDI_ANS_1: null,
    VDI_ANS_2: null,
    VDI_ANS_3: null,
    VDI_ANS_4: null,
    VDI_ANS_5: null,
    VDI_ANS_6: null,
    VDI_ANS_7: null,
    VDI_ANS_8: null,
    VDI_WL: null,
    VDI_USER_REF: null,
    VDI_VANCNF_KEY: null,
    VDI_REMARK: null,
  },
  headerProcessed: null,
  productListItems: [],
  productListItemsProcessed: [],
  productListItemsPRTProcessed: [],
  orderProductSummary: {
    totalItems: null,
    totalQty: null,
    totalPrice: null,
    totalVat: null,
    totalFree: null,
    netPrice: null,
    totalDiscount: null,
    DIS_BILL_1: null,
    DIS_BILL_2: null,
    DIS_COUNT_TYPE1: null,
    DIS_COUNT_TYPE2: null,
    DIS_BILL_1_AFTER_DISCOUNT: null,
    DIS_BILL_2_AFTER_DISCOUNT: null,
    ORDER_PROCESS_FAIL:null,
  },
  orderProductSummaryProcessed: {
    totalItems: null,
    totalQty: null,
    totalPrice: null,
    totalVat: null,
    totalFree: null,
    netPrice: null,
    totalDiscount: null,
    DIS_BILL_1: null,
    DIS_BILL_2: null,
    DIS_COUNT_TYPE1: null,
    DIS_COUNT_TYPE2: null,
    DIS_BILL_1_AFTER_DISCOUNT: null,
    DIS_BILL_2_AFTER_DISCOUNT: null,
    DIS_BILL_FINALIZE: null,
   //ORDER_PROCESS_FAIL:null,
  },
  visit: {
    item: {
      VDI_AR: null,
      VDI_MILE: null,
      VDI_VISIT: null,
      VDI_GPS_LAT_S: null,
      VDI_GPS_LONG_S: null,
      VDI_GPS_LAT_V: null,
      VDI_GPS_LONG_V: null,
      VDI_GPS_DATE_S: null,
      VDI_GPS_DISTANCE: null,
      IMAGES_1: null,
      IMAGES_2: null,
      IMAGES_3: null,
      IMAGES_4: null,
    },
    imageItems: [],
  },
  stock: {
    imageItems: [],
  },
  survey: {
    VDI_ANS: [0, 0, 0, 0, 0, 0, 0, 0],
  },
  swipeCurrent: -1,
  swipeList: [],
  isNotFound: false,
  isLoading: false,
  errorMessage: null,
};

export const order = (state = initialState, action) => {
  switch (action.type) {

    case types.ORDER_PROCESS_FAIL:
      console.log('ORDER_PROCESS_FAIL'); 
    return {
      ...state, orderProductSummary: { ...state.orderProductSummary,
        ORDER_PROCESS_FAIL: action.payload,
      }};

    case types.ORDER_SET_INITIAL_STATE:
      return {...initialState};
    case types.ORDER_SET_IS_NOT_FOUND:
      return {...state, isNotFound: action.payload};
    case types.ORDER_SET_IS_LOADING:
      return {...state, isLoading: action.payload};
    case types.ORDER_SET_IS_ERROR_MESSAGE:
      return {...state, errorMessage: action.payload};
    case types.ORDER_SET_HEADER:
      return {...state, header: action.payload};
    case types.ORDER_ADD_PRODUCT_ITEM:
      return {
        ...state,
        productListItems: [...state.productListItems, action.payload],
      };
    case types.ORDER_ADD_PRODUCT_ITEMS:
      return {
        ...state,
        productListItems: state.productListItems.concat(action.payload),
      };
    case types.ORDER_EDIT_PRODUCT_ITEM:
      const {item, index} = action.payload;
      state.productListItems[index] = item;
      return {...state};
    case types.ORDER_REMOVE_PRODUCT_ITEM:
      return {
        ...state,
        productListItems: [
          ...state.productListItems.filter(
            (value, index) => index != action.payload,
          ),
        ],
      };
    case types.ORDER_REMOVE_ALL_PRODUCT_ITEMS:
      return {...state, productListItems: []};
    case types.ORDER_SET_SWIPE_CURENT:
      return {...state, swipeCurrent: action.payload};
    case types.ORDER_PUSH_SWIPE_LIST:
      return {...state, swipeList: [...state.swipeList, action.payload]};
    case types.ORDER_REMOVE_ALL_SWIPE_LIST:
      return {...state, swipeList: []};
    case types.ORDER_SET_VDI_REMARK:
      return {...state, header: {...state.header, VDI_REMARK: action.payload}};
    case types.ORDER_SET_DIS_BILL1:
      console.log('ORDER_SET_DIS_BILL1');
      return {
        ...state,
        orderProductSummary: {
          ...state.orderProductSummary,
          DIS_BILL_1: action.payload,
        },
      };
    case types.ORDER_SET_DIS_BILL2:
      console.log('ORDER_SET_DIS_BILL2');
      return {
        ...state,
        orderProductSummary: {
          ...state.orderProductSummary,
          DIS_BILL_2: action.payload,
        },
      };
    case types.ORDER_SET_DIS_BILL1_AFTER_DISCOUNT:
      console.log('ORDER_SET_DIS_BILL1_AFTER_DISCOUNT');
      return {
        ...state,
        orderProductSummary: {
          ...state.orderProductSummary,
          DIS_BILL_1_AFTER_DISCOUNT: action.payload,
        },
      };
    case types.ORDER_SET_DIS_BILL2_AFTER_DISCOUNT:
      console.log('ORDER_SET_DIS_BILL2_AFTER_DISCOUNT');
      return {
        ...state,
        orderProductSummary: {
          ...state.orderProductSummary,
          DIS_BILL_2_AFTER_DISCOUNT: action.payload,
        },
      };
    case types.ORDER_SET_DIS_COUNT_TYPE1:
      return {
        ...state,
        orderProductSummary: {
          ...state.orderProductSummary,
          DIS_COUNT_TYPE1: action.payload,
        },
      };
    case types.ORDER_SET_DIS_COUNT_TYPE2:
      return {
        ...state,
        orderProductSummary: {
          ...state.orderProductSummary,
          DIS_COUNT_TYPE2: action.payload,
        },
      };
    case types.ORDER_SET_DIS_BILL_PROCESS:
      console.log('ORDER_SET_DIS_BILL_PROCESS');
      return {
        ...state,
        orderProductSummaryProcessed: {
          ...state.orderProductSummaryProcessed,
          DIS_BILL_1: action.payload.disBill1,
          DIS_BILL_2: action.payload.disBill2,
        },
      };
    case types.ORDER_CLEAR_DIS_BILL:
      console.log('ORDER_CLEAR_DIS_BILL');
      return {
        ...state,
        orderProductSummary: {
          ...state.orderProductSummary,
          DIS_BILL_1: null,
          DIS_BILL_2: null,
          DIS_COUNT_TYPE1: null,
          DIS_COUNT_TYPE2: null,
          DIS_BILL_1_AFTER_DISCOUNT: null,
          DIS_BILL_2_AFTER_DISCOUNT: null,
          DIS_BILL_FINALIZE: null,
        },
      };
    case types.ORDER_CALCULATE_PRODUCT_SUMMARY:
      console.log('ORDER_CALCULATE_PRODUCT_SUMMARY');
      return {
        ...state,
        orderProductSummary: calculateOrderProductSummary(
          state.productListItems,
        ),
      };
    case types.ORDER_CALCULATE_PRODUCT_PROCESSED_SUMMARY:
      console.log('ORDER_CALCULATE_PRODUCT_PROCESSED_SUMMARY');
      return {
        ...state,
        orderProductSummaryProcessed: calculateOrderProductProcessedSummary(
          state.headerProcessed,
          state.productListItemsProcessed,
        ),
      };
    case types.ORDER_CALCULATE_NET_PRICE_AFTER_DISCOUNT:
      console.log('ORDER_CALCULATE_NET_PRICE_AFTER_DISCOUNT');
      return {
        ...state,
        orderProductSummary: calculateOrderDiscountAfterDiscount(
          state.orderProductSummary,
        ),
      };
    case types.ORDER_ADD_VISIT_IMAGE_ITEM:
      state.visit.imageItems = [...state.visit.imageItems, action.payload];
      return {...state};
    case types.ORDER_REMOVE_VISIT_IMAGE_ITEM:
      state.visit.imageItems = [
        ...state.visit.imageItems.filter(
          (value, index) => index != action.payload,
        ),
      ];
      return {...state};
    case types.ORDER_REMOVE_ALL_VISIT_IMAGE_ITEMS:
      state.visit.imageItems = [];
      return {...state};
    case types.ORDER_SET_HEADER_PROCESSED_SHIP_DATE:
      return {
        ...state,
        headerProcessed: {
          ...state.headerProcessed,
          VDI_SHIP_DATE: action.payload,
        },
      };
    case types.ORDER_SET_HEADER_PROCESSED:
      return {...state, headerProcessed: action.payload};
    case types.ORDER_SET_ITEMS_PROCESSED:
      return {...state, productListItemsProcessed: action.payload};
    case types.ORDER_SET_ITEMS_PRT_PROCESSED:
      return {...state, productListItemsPRTProcessed: action.payload};
    case types.ORDER_SET_ITEMS:
      return {...state, productListItems: action.payload};
    case types.ORDER_GET_PRODUCT_LIST_FROM_LAST_BILL_BY_AR_CODE:
      return {...state, isLoading: true, errorMessage: null};
    case types.ORDER_GET_PRODUCT_LIST_FROM_LAST_BILL_BY_AR_CODE_SUCCESS:
      return {...state, isLoading: false};
    case types.ORDER_GET_PRODUCT_LIST_FROM_LAST_BILL_BY_AR_CODE_FAIL:
      return {...state, isLoading: false, errorMessage: action.payload};
    case types.ORDER_SET_HEADER_PROCESSED_VDI_CHEQUE_BANK:
      return {
        ...state,
        headerProcessed: {...state.headerProcessed, VDI_BANK: action.payload},
      };
    case types.ORDER_SET_HEADER_PROCESSED_VDI_CHEQUE_DATE:
      return {
        ...state,
        headerProcessed: {
          ...state.headerProcessed,
          VDI_CHEQUE_DATE: action.payload,
        },
      };
    case types.ORDER_SET_HEADER_PROCESSED_VDI_CHEQUE_NO:
      return {
        ...state,
        headerProcessed: {
          ...state.headerProcessed,
          VDI_CHEQUE_NO: action.payload,
        },
      };
    case types.ORDER_SET_HEADER_PROCESSED_VDI_BANK_TRANSFER:
      return {
        ...state,
        headerProcessed: {
          ...state.headerProcessed,
          VDI_BANK_TRANSFER: action.payload,
        },
      };
    case types.ORDER_SURVEY_SET_VDI_ANS:
      return {
        ...state,
        survey: {
          ...state.survey,
          VDI_ANS: {
            ...state.survey.VDI_ANS,
            [action.payload.index]: action.payload.value,
          },
        },
      };
    case types.ORDER_VISIT_SET_VDI_VISIT:
      return {
        ...state,
        visit: {
          ...state.visit,
          item: {...state.visit.item, VDI_VISIT: action.payload},
        },
      };
    case types.ORDER_SET_HEADER_VDI_USER_REF:
      return {
        ...state,
        header: {...state.header, VDI_USER_REF: action.payload},
      };
    case types.ORDER_ADD_STOCK_IMAGE_ITEM:
      state.stock.imageItems = [...state.stock.imageItems, action.payload];
      return {...state};
    case types.ORDER_REMOVE_STOCK_IMAGE_ITEM:
      state.stock.imageItems = [
        ...state.stock.imageItems.filter(
          (value, index) => index != action.payload,
        ),
      ];
      return {...state};
    case types.ORDER_REMOVE_ALL_STOCK_IMAGE_ITEMS:
      state.stock.imageItems = [];
      return {...state};
    default:
      return state;
  }
};
