import * as types from '../constant/screen';

const initialState = {
    dimensions: null,
    isPortrait: false,
    isLandscape: false,
    isPhone: false,
    isTablet: false
}

export const screen = (state = initialState, action) => {
    switch (action.type) {
        case types.SCREEN_STATE_CHANGE:
            return action.payload 
        default:
			return state;
    }

}