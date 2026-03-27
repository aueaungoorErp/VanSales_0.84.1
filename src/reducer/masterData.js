import * as types from '../constant/masterData'

const initialState = {
    criteria: { },
    bankFileItem: {
        BANK_KEY: null,
        BANK_CODE: null,
        BANK_INITIAL: null,
        BANK_T_NAME: null,
        BANK_E_NAME: null,
        BANK_DISK: null,
        BANK_FILENAME: null,
        BANK_ATS_DESC: null,
        BANK_ATS_TYPE: null,
        BANK_ATS_LEN: null,
        BANK_BRANCH_DESC: null,
        BANK_BRANCH_TYPE: null,
        BANK_BRANCH_LEN: null,
        BANK_AC_LEN: null,
        BANK_REC_PREFIX: null,
        BANK_BR_START: null,
        BANK_FORMAT_TY: null,
        BANK_XTRA_DESC: null,
        BANK_XTRA_TYPE: null,
        BANK_XTRA_LEN: null,
        BANK_FIX_BRCODE: null
    },
    bankFileListItems: [], 
    bankAccountListItems: [], 
    wareLocationListItems: [],
    VANVISR: {
        item: {
            VANVISR_KEY: null,
            VANVISR_T_NAME: null,
            VANVISR_E_NAME: null
        },
        listItems: []
    }, 
    SVF: {
        item: {
            SVF_KEY: null,
            SVF_CODE: null,
            SVF_NAME: null,
            SVF_ANS_YES: null,
            SVF_ANS_NO: null,
            SVF_REMARK: null,
            SVF_QUESTIONS: [] 
        }
    }, 
    province: {
        listItems: []
    }, 
    district: {
        listItems: []
    }, 
    subDistrict: {
        listItems: []
    }, 
    isNotFound: false,
    isLoading: false,
    isError: false,
}

export const masterData = (state = initialState, action) => {
    
    switch (action.type) {
        case types.MASTER_DATA_INITIAL_STATE: 
            return {...initialState}
        case types.MASTER_DATA_CLEAR_BANK_FILE_LIST: 
            return {...state, bankFileListItems: []}
        case types.MASTER_DATA_SEARCH_BANK_FILE_LIST:
            return { ...state, bankFileListItems: action , isLoading: true, isNotFound: false, isError: false }
        case types.MASTER_DATA_SEARCH_BANK_FILE_LIST_SUCCESS:
            return { 
                ...state, 
                bankFileListItems: action.payload, 
                isLoading: false, 
                isNotFound: !action.payload
            }
        case types.MASTER_DATA_SEARCH_BANK_FILE_LIST_FAIL:
            return { ...state, isLoading: false, isError: true }
        case types.MASTER_DATA_CLEAR_VANVISR_LIST: 
            return {...state, VANVISR: {...state.VANVISR, listItems: []}}
        case types.MASTER_DATA_SEARCH_VANVISR_LIST: 
            return { ...state, isLoading: true, isNotFound: false, isError: false }
        case types.MASTER_DATA_SEARCH_VANVISR_LIST_SUCCESS: 
            return { 
                ...state, 
                VANVISR: {...state.VANVISR, listItems: action.payload},
                isLoading: false, 
                isNotFound: !action.payload
            }
        case types.MASTER_DATA_SEARCH_VANVISR_LIST_FAIL:
            return { ...state, isLoading: false, isError: true }
        case types.MASTER_DATA_CLEAR_SURVEY_FORM: 
            return {...state, SVF: {...state.SVF, item: []}}
        case types.MASTER_DATA_GET_SURVEY_FORM: 
            return { ...state, isLoading: true, isNotFound: false, isError: false }
        case types.MASTER_DATA_GET_SURVEY_FORM_SUCCESS: 
            return { 
                ...state, 
                SVF: {...state.SVF, item: action.payload},
                isLoading: false, 
                isNotFound: !action.payload
            }
        case types.MASTER_DATA_GET_SURVEY_FORM_FAIL:
            return { ...state, isLoading: false, isError: true }
        case types.MASTER_DATA_GET_PROVINCE_LIST_ITEMS: 
            return { ...state, isLoading: true, isNotFound: false, isError: false }
        case types.MASTER_DATA_GET_PROVINCE_LIST_ITEMS_SUCCESS: 
        // console.log("Reducer triggered:", action);  // ห้ามลบ
            return { 
                ...state, 
                province: {...state.province, listItems: action.payload},
                isLoading: false, 
                isNotFound: !action.payload
            }
        case types.MASTER_DATA_GET_PROVINCE_LIST_ITEMS_FAIL:
            return { ...state, isLoading: false, isError: true }
        case types.MASTER_DATA_GET_DISTRICT_LIST_ITEMS_BY_PROVINCE_ID: 
            return { ...state, isLoading: true, isNotFound: false, isError: false }
        case types.MASTER_DATA_GET_DISTRICT_LIST_ITEMS_BY_PROVINCE_ID_SUCCESS: 
            return { 
                ...state, 
                district: {...state.district, listItems: action.payload},
                isLoading: false, 
                isNotFound: !action.payload
            }
        case types.MASTER_DATA_GET_DISTRICT_LIST_ITEMS_BY_PROVINCE_ID_FAIL:
            return { ...state, isLoading: false, isError: true }
        case types.MASTER_DATA_GET_SUB_DISTRICT_LIST_ITEMS_BY_DISTRICT_ID: 
            return { ...state, isLoading: true, isNotFound: false, isError: false }
        case types.MASTER_DATA_GET_SUB_DISTRICT_LIST_ITEMS_BY_DISTRICT_ID_SUCCESS: 
            return { 
                ...state, 
                subDistrict: {...state.subDistrict, listItems: action.payload},
                isLoading: false, 
                isNotFound: !action.payload
            }
        case types.MASTER_DATA_GET_SUB_DISTRICT_LIST_ITEMS_BY_DISTRICT_ID_FAIL:
                return { ...state, isLoading: false, isError: true }
        case types.MASTER_DATA_SET_DISTRICT_LIST_ITEMS:
            return { 
                ...state, 
                district: {...state.district, listItems: action.payload}
            }
        case types.MASTER_DATA_SET_SUB_DISTRICT_LIST_ITEMS:
            return { 
                ...state, 
                subDistrict: {...state.subDistrict, listItems: action.payload}
            }
        case types.MASTER_DATA_GET_BANK_ACCOUNTS:
            return { ...state, isLoading: true, isNotFound: false, isError: false }
        case types.MASTER_DATA_GET_BANK_ACCOUNTS_SUCCESS:
            return { 
                ...state, 
                bankAccountListItems: action.payload, 
                isLoading: false, 
                isNotFound: !action.payload
            }
        case types.MASTER_DATA_GET_BANK_ACCOUNTS_FAIL:
            return { ...state, isLoading: false, isError: true }
        case types.MASTER_DATA_GET_WARE_LOCATIONS:
            return { ...state, isLoading: true, isNotFound: false, isError: false }
        case types.MASTER_DATA_GET_WARE_LOCATIONS_SUCCESS:
            return { 
                ...state, 
                wareLocationListItems: action.payload, 
                isLoading: false, 
                isNotFound: !action.payload
            }
        case types.MASTER_DATA_GET_WARE_LOCATIONS_FAIL:
            return { ...state, isLoading: false, isError: true }
            
        default:
			return state
    }
}
