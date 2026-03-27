import * as types from '../constant/report';

const initialState = {
  sales: {
    item: null,
  },
  data: null,
  isError: false,
  isLoading: false,
  errorMessage: null,
  dataReportV3: null,
  RPTQUE_GUID: null,
  dataStatus: null,
  date: null,
  settingERP: {
    cash: 1, //ขาย
    skucount: 1, //ตรวจนับ
    transfer: 1, //โอน
    reserv: 1, //จอง
    return: 1, // รับคืน
    quotation: 1, //เสนอราคา
  },
};

export const report = (state = initialState, action) => {
  switch (action.type) {
    case types.REPORT_SET_INITIAL_STATE:
      return {...initialState};
    case types.REPORT_SALE_SET_INITIAL_STATE:
      return {...state, sales: initialState.sales};
    case types.REPORT_SET_DATE:
      return {...state, date: action.payload};
    case types.REPORT_SALE_GET_ITEM:
      return {...state, isLoading: true, isError: false};
    case types.REPORT_SALE_GET_ITEM_SUCCESS:
      return {...state, sales: {...state.sales, item: action.payload}};
    case types.REPORT_SALE_GET_ITEM_FAIL:
      return {...state, isLoading: false, isError: true};
    case types.REPORT_GET_DATA:
      return {...state, isLoading: true};
    case types.REPORT_GET_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errorMessage: null,
        data: action.payload,
      };
    case types.REPORT_GET_DATA_FAIL:
      return {...state, isLoading: false, isError: true};
    case types.REPORT_SET_IS_LOADING:
      return {...state, isLoading: action.payload};
    case types.REPORT_SET_IS_ERROR:
      return {...state, isError: action.payload};
    case types.REPORT_SET_ERROR_MESSAGE:
      return {...state, errorMessage: action.payload};
    //===============
    case types.GET_REPORT_NAME:
      return {...state, isLoading: true};
    case types.GET_REPORT_NAME_SUCCESS:
      console.log('GET_REPORT_NAME_SUCCESS action.payload ', action.payload);
      return {
        ...state,
        isLoading: false,
        errorMessage: null,
        dataReportV3: action.payload,
      };
    case types.GET_REPORT_NAME_FAIL:
      return {...state, isLoading: false, isError: true};
    //===============
    case types.GET_PRINT_REPORT:
      return {...state, isLoading: true};
    case types.GET_PRINT_REPORT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errorMessage: null,
        RPTQUE_GUID: action.payload,
      };
    case types.GET_PRINT_REPORT_FAIL:
      return {...state, isLoading: false, isError: true};
    //===============
    case types.GET_PRINT_STATUS:
      return {...state, isLoading: true};
    case types.GET_PRINT_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errorMessage: null,
        dataStatus: action.payload,
      };
    case types.GET_PRINT_STATUS_FAIL:
      return {...state, isLoading: false, isError: true};
    case types.GET_DOWNLOAD_SUCCESS:
      return {...state, isLoading: false, isError: false};
    case types.SET_SETTING_ERP:
      return {...state, settingERP: action.payload};
    default:
      return state;
  }
};
