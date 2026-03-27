import * as types from '../constant/geolocation'

const initialState = {
    position: {
        latitude: null,
        longitude: null
    },
    isLoading: false,
    isError: false,
    message: null 
}

export const geolocation = (state = initialState, action) => {
    switch (action.type) {
        case types.GEOLOCATION_SET_INITIAL_STATE:
            return {...initialState}
        case types.GEOLOCATION_GET_CURRENT_POSITION: 
            return { ...initialState, isLoading: true, isError: false, message: null }
        case types.GEOLOCATION_GET_CURRENT_POSITION_SUCCESS:
            return { 
                ...state, 
                position: {latitude: action.payload.latitude, longitude: action.payload.longitude}, 
                isLoading: false, 
                isError: false, 
                message: null 
            }
        case types.GEOLOCATION_GET_CURRENT_POSITION_FAIL:
            return { ...state, isLoading: false, isError: true, message: null }
        case types.GEOLOCATION_SET_MESSAGE:
            return { ...state, message: action.payload }
        default:
			return state;
    }
}
