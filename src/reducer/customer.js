import * as types from '../constant/customer';

const initialState = {
  criteria: {
    KEYWORD: null,
    OFFSET: 1,
    LIMIT: 10,
  },
  item: {
    INFO: {},
    CUS_ADDB: null,
    LST_VISIT_DOC: null,
    LST_BILL_DOC: null,
    CUS_PAY_INF: null,
    CREDIT_LIM: null,
    ARCONDITION: null,
    TEMP_CUS: {},
    AR_SUMMARY: null,
    ARPRB: {},
  },
  listItems: [],
  nearByListItems: [],
  arLineListItems: [],
  arPriceTab: [],
  isNotFound: false,
  isError: false,
  isLoading: false,
};

export const customer = (state = initialState, action) => {
  switch (action.type) {
    case types.CUSTOMER_SET_INITIAL_STATE:
      return {...initialState, arPriceTab: state.arPriceTab};
    case types.CUSTOMER_CLEAR_LIST:
      return {...state, listItems: []};
    case types.CUSTOMER_SET_CRITERIA:
      return {...state, criteria: action.payload};
    case types.CUSTOMER_SET_KEYWORD:
      return {...state, criteria: {...state.criteria, KEYWORD: action.payload}};
    case types.CUSTOMER_SEARCH_LIST:
      return {...state, isLoading: true, isNotFound: false, isError: false};
    case types.CUSTOMER_SEARCH_LIST_SUCCESS:
      return {
        ...state,
        listItems:
          action.payload && action.payload.length > 0
            ? state.listItems.concat(action.payload)
            : state.listItems,
        isLoading: false,
        isNotFound: !action.payload,
      };
    case types.CUSTOMER_SEARCH_LIST_FAIL:
      return {...state, isLoading: false, isError: true};
    case types.CUSTOMER_SET_ARSUMMARY:
      return {...state, item: {...state.item, AR_SUMMARY: action.payload}};
    case types.CUSTOMER_SET_ARPRB:
      return {...state, item: {...state.item, ARPRB: action.payload}};
    case types.CUSTOMER_SET_ITEM_INFO:
      return {...state, item: {...state.item, INFO: action.payload}};
    case types.CUSTOMER_SET_ITEM_CUS_ADDB:
      return {...state, item: {...state.item, CUS_ADDB: action.payload}};
    case types.CUSTOMER_SET_ITEM_LST_VISIT_DOC:
      return {...state, item: {...state.item, LST_VISIT_DOC: action.payload}};
    case types.CUSTOMER_SET_ITEM_LST_BILL_DOC:
      return {...state, item: {...state.item, LST_BILL_DOC: action.payload}};
    case types.CUSTOMER_SET_ITEM_CUS_PAY_INF:
      return {...state, item: {...state.item, CUS_PAY_INF: action.payload}};
    case types.CUSTOMER_SET_ITEM_CREDIT_LIM:
      return {...state, item: {...state.item, CREDIT_LIM: action.payload}};
    case types.CUSTOMER_SET_ITEM_ARCONDITION:
      return {...state, item: {...state.item, ARCONDITION: action.payload}};
    case types.CUSTOMER_SET_ITEM_TEMP_CUS:
      return {...state, item: {...state.item, TEMP_CUS: action.payload}};
    case types.CUSTOMER_SET_ERROR:
      return {...state, isError: action.payload};
    case types.CUSTOMER_SEARCH_NEAR_BY:
      return {...state, isLoading: true, isNotFound: false, isError: false};
    case types.CUSTOMER_SEARCH_NEAR_BY_SUCCESS:
      return {
        ...state,
        nearByListItems: action.payload,
        isLoading: false,
        isNotFound: false,
      };
    case types.CUSTOMER_SEARCH_NEAR_BY_FAIL:
      return {...state, isLoading: false, isError: true, nearByListItems: []};
    case types.CUSTOMER_GET_AR_LINE:
      return {...state, isLoading: true, isNotFound: false, isError: false};
    case types.CUSTOMER_GET_AR_LINE_SUCCESS:
      return {
        ...state,
        arLineListItems: action.payload,
        isLoading: false,
        isNotFound: false,
      };
    case types.CUSTOMER_GET_AR_LINE_FAIL:
      return {...state, isLoading: false, isError: true, arLineListItems: []};
    case types.CUSTOMER_GET_AR_PRICE_TAB_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isNotFound: !action.payload,
        arPriceTab: action.payload,
      };
    case types.CUSTOMER_GET_AR_PRICE_TAB_FAIL:
      return {...state, isLoading: false, isError: true};
    default:
      return state;
  }
};
