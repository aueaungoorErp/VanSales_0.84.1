import * as types from '../constant/network'

export const setConnectionInfo = (state) => {
    return (dispatch) => {
        dispatch({ type: types.NETWORK_SET_CONNECT_INFO, payload: state })
    }
}