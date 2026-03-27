import * as types from '../constant/mile'

const initialState = {
    item: {
        photo: null,
        mileage: null,
        isSubmit: false
    },
    isError: false,
    isLoading: false
}

export const mile = (state = initialState, action) => {
    switch (action.type) {
        case types.MILE_SET_INITIAL_STATE: 
            return {...initialState}
        case types.MILE_ADD_PHOTO: 
            return { ...state, item: { ...state.item, photo: action.payload }}
        case types.MILE_SET_MILEAGE: 
            return { ...state, item: { ...state.item, mileage: action.payload}}
        case types.MILE_SET_IS_SUBMIT:
            return { ...state, item: { ...state.item, isSubmit: action.payload }}
        default:
			return state
    }
}
