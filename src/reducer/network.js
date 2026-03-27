import * as types from '../constant/network'

const initialState = {
    connectionInfo: null
    
}

export const network = (state = initialState, action) => {
    switch (action.type) {
        case types.NETWORK_SET_CONNECT_INFO:
            return { ...state, state: action.payload }
        default:
			return state;
    }
}
