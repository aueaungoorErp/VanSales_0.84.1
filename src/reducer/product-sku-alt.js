import * as types from '../constant/product-sku-alt'

const initialState = {
    criteria: {
        KEYWORD: null
    },
    item: {
        SKUALT_KEY: null,
        SKUALT_CODE: null,
        SKUALT_NAME: null,
        SKUALT_UDF_1: null,
        SKUALT_UDF_2: null,
        SKUALT_UDF_3: null,
        SKUALT_UDF_4: null,
        SKUALT_UDF_5: null,
        SKUALT_UDF_6: null,
        SKUALT_LASTUPD: null,
        SKUALT_BAR: null
    },
    listItems: [],
    isNotFound: false,
    isLoading: false,
    isError: false
}

export const productSkuAlt = (state = initialState, action) => {
    switch (action.type) {
        case types.PRODUCT_SKU_ALT_SET_INITIAL_STATE: 
            return {...initialState}
        case types.PRODUCT_SKU_ALT_CLEAR_LIST: 
            return {...state, listItems: []}
        case types.PRODUCT_SKU_ALT_SET_CRITERIA:
            return {...state, criteria: action.payload}
        case types.PRODUCT_SKU_ALT_SET_KEYWORD:
            return {...state, criteria: {...state.criteria, KEYWORD: action.payload}}
        case types.PRODUCT_SKU_ALT_CLEAR_ITEM: 
            return {...state, item: initialState.item}
        case types.PRODUCT_SKU_ALT_SEARCH_LIST:
            return { ...state, isLoading: true, isNotFound: false, isError: false }
        case types.PRODUCT_SKU_ALT_SEARCH_LIST_SUCCESS:
            return { 
                ...state, 
                listItems: action.payload && action.payload.length > 0 ? state.listItems.concat(action.payload) : state.listItems, 
                isLoading: false, 
                isNotFound: !action.payload
        }
        case types.PRODUCT_SKU_ALT_SEARCH_LIST_FAIL:
            return { ...state, isLoading: false, isError: true }
        case types.PRODUCT_SKU_ALT_SET_ITEM:
            return { ...state, item: action.payload }
        default:
            return state
    }

}