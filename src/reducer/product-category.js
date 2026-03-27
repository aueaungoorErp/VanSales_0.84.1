import * as types from '../constant/product-category'
import { removeDuplicateArr } from '../utils/Array'

const initialState = {
    criteria: {
        KEYWORD: null
    },
    item: {
        ICDEPT_KEY: null,
        ICDEPT_THAIDESC: null
    },
    listItems: [],
    isNotFound: false,
    isLoading: false,
    isError: false
}

export const productCategory = (state = initialState, action) => {
    switch (action.type) {
        case types.PRODUCT_CATEGORY_SET_INITIAL_STATE: 
            return {...initialState}
        case types.PRODUCT_CATEGORY_CLEAR_LIST: 
            return {...state, listItems: []}
        case types.PRODUCT_CATEGORY_SET_CRITERIA:
            return {...state, criteria: action.payload}
        case types.PRODUCT_CATEGORY_SET_KEYWORD:
            return {...state, criteria: {...state.criteria, KEYWORD: action.payload}}
        case types.PRODUCT_CATEGORY_CLEAR_ITEM: 
            return {...state, item: initialState.item}
        case types.PRODUCT_CATEGORY_SEARCH_LIST:
            return { ...state, isLoading: true, isNotFound: false, isError: false }
        case types.PRODUCT_CATEGORY_SEARCH_LIST_SUCCESS:
            return { 
                ...state, 
                listItems: action.payload,
                isLoading: false, 
                isNotFound: !action.payload
        }
        case types.PRODUCT_CATEGORY_SEARCH_LIST_FAIL:
            return { ...state, isLoading: false, isError: true }
        case types.PRODUCT_CATEGORY_SET_ITEM:
            return { ...state, item: action.payload }
        default:
            return state
    }

}