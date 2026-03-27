import * as types from '../constant/bluetooth'

const initialState = {
    printingType: null,
    item: {
        name: null,
        address: null
    },
    model: null,
    state: null,
    warningState: null,
    listItems: [],
    modelItems: []
}

export const bluetooth = (state = initialState, action) => {
    switch (action.type) {
        case types.BLUETOOTH_INITIAL_STATE:
            return { ...initialState }
        case types.BLUETOOTH_INITIAL_CONFIG:
            return { ...state, item: initialState.item, model: null, state: null }
        case types.BLUETOOTH_SET_INSTANCE:
            return action.payload 
        case types.BLUETOOTH_SET_STATE:
            return { ...state, state: action.payload }
        case types.BLUETOOTH_SET_WARNING_STATE:
            return { ...state, warningState: action.payload }
        case types.BLUETOOTH_SET_ITEM:
                return { ...state, item: action.payload }
        case types.BLUETOOTH_SET_LIST_ITEMS:
            return { ...state, listItems: action.payload }
        case types.BLUETOOTH_SET_MODEL:
            return { ...state, model: action.payload }
        case types.BLUETOOTH_SET_MODEL_ITEMS:
            return { ...state, modelItems: action.payload }
        case types.BLUETOOTH_SET_PRINTING_TYPE:
            return { ...state, printingType: action.payload }
        default:
			return state;
    }
}
