import * as types from '../constant/campaign'

const initialState = {
    item: {},
    listItems: [],
    isError: false,
    isLoading: false,
    isNotFound: false,
    errorMessage: null
}

export const campaign = (state = initialState, action) => {
    switch (action.type) {
        case types.CAMPAIGN_SET_INITIAL_STATE:
            return {...initialState}
        case types.CAMPAIGN_SET_ERROR_MESSAGE:
                return {...state, errorMessage: action.payload}
        case types.CAMPAIGN_FIND_BY_CONDITION:
            return { ...state, isLoading: true, isNotFound: false, isError: false, errorMessage: null }
        case types.CAMPAIGN_FIND_BY_CONDITION_SUCCESS:
            return { 
                ...state, 
                listItems: action.payload, 
                isLoading: false, 
                isNotFound: false,
                errorMessage: null
        }
        case types.CAMPAIGN_FIND_BY_CONDITION_FAIL:
            return { ...state, isLoading: false, isError: true, isNotFound: true, errorMessage: action.payload }
        default:
            return state
    }
}