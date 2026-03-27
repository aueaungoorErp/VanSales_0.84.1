import * as types from '../constant/customer-type'
import { removeDuplicateArr } from '../utils/Array'

const initialState = {
    criteria: {
        KEYWORD: null
    },
    item: {
        ARCAT_KEY: null,
        ARCAT_NAME: null
    },
    listItems: [],
    isNotFound: false,
    isLoading: false,
    isError: false
}

export const customerType = (state = initialState, action) => {
    switch (action.type) {
        case types.CUSTOMER_TYPE_SET_INITIAL_STATE: 
        return {...initialState}
            case types.CUSTOMER_TYPE_SET_IS_ERROR: 
            return {...state, isError: action.payload}
        case types.CUSTOMER_TYPE_CLEAR_LIST: 
            return {...state, listItems: []}
        case types.CUSTOMER_TYPE_SET_CRITERIA:
            return {...state, criteria: action.payload}
        case types.CUSTOMER_TYPE_SET_KEYWORD:
            return {...state, criteria: {...state.criteria, KEYWORD: action.payload}}
        case types.CUSTOMER_TYPE_CLEAR_ITEM: 
            return {...state, item: initialState.item}
        case types.CUSTOMER_TYPE_SEARCH_LIST:
            return { ...state, isLoading: true, isNotFound: false, isError: false }
        case types.CUSTOMER_TYPE_SEARCH_LIST_SUCCESS:
            return { 
                ...state, 
                listItems: action.payload, 
                isLoading: false, 
                isNotFound: !action.payload
        }
        case types.CUSTOMER_TYPE_SEARCH_LIST_FAIL:
            return { ...state, isLoading: false, isError: true }
        case types.CUSTOMER_TYPE_SET_ITEM:
            return { ...state, item: action.payload }
        default:
            return state
    }

}