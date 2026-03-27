import * as types from '../constant/check-in'

const initialState = {
    item: {
        photo: null,
        isSubmit: false
    },
    isError: false,
    isLoading: false
}

export const checkin = (state = initialState, action) => {
    switch (action.type) {
        case types.CHECK_IN_SET_INITIAL_STATE: 
            return {...initialState}
        case types.CHECK_IN_ADD_PHOTO: 
            return { ...state, item: { ...state.item, photo: action.payload }}
        case types.CHECK_IN_SET_IS_SUBMIT: 
            return { ...state, item: { ...state.item, isSubmit: action.payload }}
        case types.CHECK_IN_SUBMIT: 
            return { ...state, isLoading: true, isError: false }
        case types.CHECK_IN_SUBMIT_SUCCESS: 
            return { ...state, isLoading: false, isError: false }
        case types.CHECK_IN_SUBMIT_FAIL: 
            return { ...state, isLoading: false, isError: true }
        case types.CHECK_IN_SET_IS_LOADING: 
            return {...state, isLoading: action.payload}
        default:
			return state;
    }
}
