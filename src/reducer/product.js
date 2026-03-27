import * as types from '../constant/product';

const initialState = {
  criteria: {
    GOODS_CODE: null,
    ICDEPT_KEY: null,
    KEYWORD: null,
    OFFSET: 1,
    LIMIT: 15,
  },
  item: {
    // VGOODS_KEY: null,
    // VGOODS_SKU: null,
    // VGOODS_CODE: null,
    // SKU_NAME: null,
    // VGOODS_U_PRC: null,
    // VGOODS_UTQQTY: null,
    // VGOODS_VAT_TY: null,
    // VGOODS_UTQNAME: null,
    // VGOODS_DISCOUNT: null,
    // VGOODS_TOTAL_DISCOUNT: null,
    // VGOODS_QTY: null,
    // VGOODS_TOTAL_PRC: null,
    // VGOODS_FREE: null,
    // VGOODS_NET_PRC: null
    ICDEPT_THAIDESC: null,
    GOODS_CODE: null,
    GOODS_NAME: null,
    UTQ_NAME: null,
    SKU_CODE: null,
    SKUALT_CODE: null,
    UTQ_QTY: null,
    ARPLU_U_PRC: null,
    GOODS_DISCOUNT: null,
    GOODS_VAT: null,
    GOODS_TOTAL_DISCOUNT: null,
    GOODS_QTY: null,
    GOODS_TOTAL_PRC: null,
    GOODS_FREE: null,
    GOODS_NET_PRC: null,
    VTRD_SH_VALUES: null,
    TRD_LOT_NO: null,
    TRD_SERIAL: null,
    TMP_GOOD_QTY: null,
    TMP_GOOD_MODEL:2
  },
  // item: {
  //     SKUALT_KEY: null,
  //     SKUALT_CODE: null,
  //     SKUALT_NAME: null,
  //     SKUALT_UDF_1: null,
  //     SKUALT_UDF_2: null,
  //     SKUALT_UDF_3: null,
  //     SKUALT_UDF_4: null,
  //     SKUALT_UDF_5: null,
  //     SKUALT_UDF_6: null,
  //     SKUALT_LASTUPD: null,
  //     SKUALT_BAR: null
  // },
  listItems: [],
  scrListItems: [],
  scrChooseItems: [],
  skuAltListItems: [],
  isNotFound: false,
  isLoading: false,
  isError: false,
  isModalOpen: false,
  disabledButton: true,
};

export const product = (state = initialState, action) => {
  switch (action.type) {
    case types.PRODUCT_SET_INITIAL_STATE:
      return {...initialState};
    case types.PRODUCT_SET_INITIAL_STATE_IGNORE_MODAL:
      return {...initialState, isModalOpen: state.isModalOpen};
    case types.PRODUCT_CLEAR_LIST:
      return {...state, listItems: []};
    case types.PRODUCT_SET_CRITERIA:
      return {...state, criteria: action.payload};
    case types.PRODUCT_SET_KEYWORD:
      return {...state, criteria: {...state.criteria, KEYWORD: action.payload}};
    case types.PRODUCT_SET_CRITERIA_GOODS_CODE:
      console.log('setGoodsCodeCriteria >> 2 ' , action.payload)
      return {
        ...state,
        criteria: {...state.criteria, GOODS_CODE: action.payload},
      };
    case types.PRODUCT_CLEAR_ITEM:
      return {...state, item: initialState.item};
    case types.PRODUCT_SEARCH_LIST:
      return {...state, isLoading: true, isNotFound: false, isError: false};
    case types.PRODUCT_SEARCH_LIST_SUCCESS:
      return {
        ...state,
        listItems:action.payload && action.payload.length > 0 ? state.listItems.concat(action.payload) : state.listItems,
        isLoading: false,
        isNotFound: !action.payload,
      };
    case types.PRODUCT_SEARCH_LIST_FAIL:
      return {...state, isLoading: false, isError: true};
    case types.PRODUCT_SEARCH_BY_SKU_ALT_LIST_SUCCESS:
      return {
        ...state,
        listItems: action.payload,
        isLoading: false,
        isNotFound: !action.payload,
      };
    case types.PRODUCT_SET_ITEM:
      const {type, item} = action.payload;
      // console.log("type 55 ",type);
      // console.log("item 55",item);
      let productItem = {};
      if (type === 'add') {
        productItem = {
          ...item,
          GOODS_VAT: null,
          GOODS_DISCOUNT: null,
          GOODS_TOTAL_DISCOUNT: null,
          GOODS_QTY: null,
          GOODS_TOTAL_PRC: null,
          GOODS_FREE: null,
          GOODS_NET_PRC: null,
          VTRD_SH_VALUES: null,
          TRD_LOT_NO: null,
          TRD_SERIAL: null,
           //TMP_GOOD_QTY: null,
          TMP_GOOD_MODEL:3
        };
      } else if (type === 'edit') {
        productItem = {...item};
        console.log(productItem);
      }

      return {...state, item: productItem};
    case types.PRODUCT_SET_ITEM_FOR_EDIT:
      return {...state, item: action.payload};
    case types.PRODUCT_SET_ITEM_QTY:
      return {...state, item: {...state.item, GOODS_QTY: action.payload}};
    case types.PRODUCT_SET_ITEM_TOTAL_PRICE:
      return {...state, item: {...state.item, GOODS_TOTAL_PRC: action.payload}};
    case types.PRODUCT_SET_ITEM_NET_PRICE:
      return {...state, item: {...state.item, GOODS_NET_PRC: action.payload}};
    case types.PRODUCT_SET_ITEM_DISCOUNT:
      return {...state, item: {...state.item, GOODS_DISCOUNT: action.payload }};
    case types.PRODUCT_SET_ITEM_TOTAL_DISCOUNT:
      return {
        ...state,
        item: {...state.item, GOODS_TOTAL_DISCOUNT: action.payload},
      };
    case types.PRODUCT_SET_ITEM_FREE:
      return {...state, item: {...state.item, GOODS_FREE: action.payload}};
    case types.PRODUCT_SET_MODAL:
      return {...state, isModalOpen: action.payload};
    case types.PRODUCT_SET_ERROR:
      return {...state, isError: action.payload};
    case types.PRODUCT_SKU_ALT_SEARCH_LIST:
      return {...state, isLoading: true, isNotFound: false, isError: false};
    case types.PRODUCT_SKU_ALT_SEARCH_LIST_SUCCESS:
      return {
        ...state,
        skuAltListItems: action.payload,
        isLoading: false,
        isNotFound: !action.payload,
      };
    case types.PRODUCT_SKU_ALT_SEARCH_LIST_FAIL:
      return {...state, isLoading: false, isError: true};
    case types.PRODUCT_SET_SCR_LIST_ITEMS:
      return {...state, scrListItems: action.payload};
    case types.PRODUCT_ADD_OR_EDIT_SCR_CHOOSE_ITEMS:
      return {...state, scrChooseItems: action.payload};
    case types.PRODUCT_SET_DISABLED_BUTTON:
      return {...state, disabledButton: action.payload};
    case types.PRODUCT_SET_LIST_ITEMS:
      return {...state, listItems: action.payload};

    case types.PRODUCT_SET_ITEM_LOT:
      return {...state, item: {...state.item, TRD_LOT_NO: action.payload}};
    case types.PRODUCT_SET_ITEM_SERIAL:
      return {...state, item: {...state.item, TRD_SERIAL: action.payload}};
    default:
      return state;
  }
};
