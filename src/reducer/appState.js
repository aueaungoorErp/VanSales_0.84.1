import * as types from '../constant/appState'

const initialState = {
    state: null
    
}

export const appState = (state = initialState, action) => {
    switch (action.type) {
        case types.APP_SET_STATE:
            return { ...state, state: action.payload }
        default:
			return state;
    }
}
