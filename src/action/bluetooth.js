import * as types from '../constant/bluetooth'

export const intialState = () => {
    return (dispatch) => {
        dispatch({ type: types.BLUETOOTH_INITIAL_STATE })
    }
}

export const intialStateConfig = () => {
    return (dispatch) => {
        dispatch({ type: types.BLUETOOTH_INITIAL_CONFIG })
    }
}

export const setInstance = (bluetooth) => {
    return (dispatch) => {
        dispatch({ type: types.BLUETOOTH_SET_INSTANCE, payload: bluetooth })
    }
}

export const setState = (state) => {
    return (dispatch) => {
        dispatch({ type: types.BLUETOOTH_SET_STATE, payload: state })
    }
}

export const setWarningState = (state) => {
    return (dispatch) => {
        dispatch({ type: types.BLUETOOTH_SET_WARNING_STATE, payload: state })
    }
}

export const setItem = (item) => {
    return (dispatch) => {
        dispatch({ type: types.BLUETOOTH_SET_ITEM, payload: item })
    }
}

export const setItemList = (items) => {
    return (dispatch) => {
        dispatch({ type: types.BLUETOOTH_SET_LIST_ITEMS, payload: items })
    }
}

export const setPrintingType = (payload) => {
    return (dispatch) => {
        dispatch({ type: types.BLUETOOTH_SET_PRINTING_TYPE, payload: payload })
    }
}

export const setModel = (model) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({ type: types.BLUETOOTH_SET_MODEL, payload: model })
        resolve()
    })
}

export const setModelList = (items) => {
    return (dispatch) => {
        dispatch({ type: types.BLUETOOTH_SET_MODEL_ITEMS, payload: items })
    }
}



