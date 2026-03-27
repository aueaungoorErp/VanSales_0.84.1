import * as types from '../constant/bill'

const initialState = {
    criteria: {
        FROM: null,
        TO: null,
        AR_CODE: null,
        OFFSET: 1,
        LIMIT: 10
    },
    listItems: [],
    billToday: {
        item: {
            DI_KEY: null,
            DI_DT: null,
            DI_SUBS_DI: null,
            DI_REVISION: null,
            DI_ACTIVE: null,
            DI_EDIT_TIME: null,
            DI_FLAG: null,
            DI_REF: null,
            DI_DATE: null,
            DI_CRE_DATE: null,
            DI_CRE_BY: null,
            DI_CRE_CPTN: null,
            DI_CRE_LGNN: null,
            DI_UPD_DATE: null,
            DI_UPD_BY: null,
            DI_UPD_CPTN: null,
            DI_UPD_LGNN: null,
            DI_DEL_DATE: null,
            DI_DEL_BY: null,
            DI_DEL_CPTN: null,
            DI_DEL_LGNN: null,
            DI_PRN_TIME: null,
            DI_PRN_DATE: null,
            DI_PRN_BY: null,
            DI_PRN_CPTN: null,
            DI_PRN_LGNN: null,
            DI_PRN_STATUS: null,
            DI_EXM_DATE: null,
            DI_EXM_BY: null,
            DI_EXM_CPTN: null,
            DI_EXM_LGNN: null,
            DI_APV_DATE: null,
            DI_APV_BY: null,
            DI_APV_CPTN: null,
            DI_APV_LGNN: null,
            DI_APV_STATUS: null,
            DI_DFRS: null,
            DI_1ST_ITEMS: null,
            DI_1ST_AMOUNT: null,
            DI_ITEMS: null,
            DI_AMOUNT: null,
            DI_AUTO: null,
            DI_CREATOR_DI: null,
            DI_REMARK: null,
            DI_LASTUPD: null
        },
        listItems: [],
        isNotFound: false,
        isLoading: false,
        errorMessage: null
    },
    isNotFound: false,
    isLoading: false,
    errorMessage: null
}

export const bill = (state = initialState, action) => {
    switch (action.type) {
        case types.BILL_SET_INITIAL_STATE:
            return { ...initialState }
        case types.BILL_SET_CRITERIA: 
            return { ...state, criteria: action.payload }
        case types.BILL_TODAY_CLEAR_ITEM:
            return { ...state, billToday: { ...state.billToday, item: initialState.billToday.item}}
        case types.BILL_TODAY_SET_ITEM:
            return { ...state, billToday: { ...state.billToday, item: action.payload}}
        case types.BILL_TODAY_CLEAR_LIST_ITEMS:
            return { ...state, billToday: { ...state.billToday, listItems: []}}
        case types.BILL_TODAY_GET_LIST_ITEMS: 
            return { ...state, isLoading: true, errorMessage: null}
        case types.BILL_TODAY_GET_LIST_ITEMS_SUCCESS: 
            return { ...state, billToday: { ...state.billToday, listItems: action.payload}, isLoading: false, errorMessage: null}
        case types.BILL_TODAY_GET_LIST_ITEMS_FAIL:
            return { ...state, isLoading: false, errorMessage: action.payload}
        case types.BILL_CLEAR_LIST_ITEMS:
            return { ...state, listItems: []}
        case types.BILL_SEARCH_LIST_ITEMS:
            return { ...state, isLoading: true, isNotFound: false, isError: false }
        case types.BILL_SEARCH_LIST_ITEMS_SUCCESS:
            return { 
                ...state, 
                listItems: action.payload && action.payload.length > 0 ? state.listItems.concat(action.payload) : state.listItems, 
                isLoading: false, 
                isNotFound: action.payload.length == 0
        }
        case types.BILL_SEARCH_LIST_ITEMS_FAIL:
            return { ...state, isLoading: false, isError: true }
        case types.BILL_SET_ERROR: 
            return { ...state, isError: action.payload}
        default:
			return state;
    }
}
