import * as types from '../constant/appState'

export const setAppState = (state) => {
    return (dispatch) => {
        dispatch({ type: types.APP_SET_STATE, payload: state })
    }
}