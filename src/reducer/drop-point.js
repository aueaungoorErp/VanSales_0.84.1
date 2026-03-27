import * as types from '../constant/drop-point'

const initialState = {
    listItems: [],
    item: null,
    isError: false,
    isLoading: false,
    isNotFound: false
}

export const dropPoint = (state = initialState, action) => {
    switch (action.type) {
        case types.DROP_POINT_SET_INITIAL_STATE: 
            return {...initialState}
        case types.DROP_POINT_CLEAR_LIST_ITEMS: 
            return {...state, listItems: []}
        case types.DROP_POINT_GET_LIST_ITEMS: 
            return { ...state, isLoading: true, isError: false }
        case types.DROP_POINT_GET_LIST_ITEMS_SUCCESS: 
            return { ...state, isLoading: false, isError: false, listItems: action.payload }
        case types.DROP_POINT_GET_LIST_ITEMS_FAIL: 
            return { ...state, isLoading: false, isError: true }
        case types.DROP_POINT_SET_IS_LOADING: 
            return {...state, isLoading: action.payload}
        case types.DROP_POINT_SET_IS_ERROR: 
            return {...state, isError: action.payload}
        case types.DROP_POINT_SEARCH_LIST_ITEMS:
            return { ...state, isLoading: true, isNotFound: false, isError: false }
        case types.DROP_POINT_SEARCH_LIST_ITEMS_SUCCESS:
            return { ...state, isLoading: false, isError: false, listItems: action.payload }
        case types.DROP_POINT_SEARCH_LIST_ITEMS_FAIL:
            return { ...state, isLoading: false, isError: true }
        default:
			return state;
    }
}
