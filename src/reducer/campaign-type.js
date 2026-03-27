import * as types from '../constant/campaign-type'

const initialState = {
    item: {},
    listItems: [],
    isError: false,
    isLoading: false,
    isNotFound: false,
    errorMessage: null
}

export const campaignType = (state = initialState, action) => {
    switch (action.type) {
        case types.CAMPAIGN_TYPE_INITIAL_STATE: 
            return {...initialState}
        case types.CAMPAIGN_TYPE_SEARCH_LIST: 
            return { ...state, isLoading: true, isNotFound: false, isError: false }
        case types.CAMPAIGN_TYPE_SEARCH_LIST_SUCCESS: 
            return { ...state, isLoading: false, isNotFound: false, isError: false, errorMessage: null, listItems: action.payload }
        case types.CAMPAIGN_TYPE_SEARCH_LIST_FAIL:
            return { ...state, isLoading: false, isError: true, errorMessage: action.payload }
        case types.CAMPAIGN_TYPE_SET_ITEM:
            return { ...state, item: action.payload }
        default:
			return state;
    }
}