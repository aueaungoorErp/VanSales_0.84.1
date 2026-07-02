import * as types from '../constant/customerSelect';

const initialState = {
  selected: null,
  arCondition: null,
  asset: null,
  dueDate: null,
  isLoading: false,
  error: null,
};

export const customerSelect = (state = initialState, action) => {
  switch (action.type) {
    case types.CUSTOMER_SELECT_SET_SELECTED:
      return {
        ...state,
        selected: action.payload,
        error: null,
      };
    case types.CUSTOMER_SELECT_FETCH_DUE_DATE_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case types.CUSTOMER_SELECT_FETCH_DUE_DATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        arCondition: action.payload?.arCondition ?? null,
        asset: action.payload?.asset ?? null,
        dueDate: action.payload?.dueDate ?? null,
        error: null,
      };
    case types.CUSTOMER_SELECT_FETCH_DUE_DATE_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.payload ?? null,
      };
    case types.CUSTOMER_SELECT_SET_DUE_DATE:
      return {
        ...state,
        dueDate: action.payload,
      };
    case types.CUSTOMER_SELECT_CLEAR:
      return { ...initialState };
    default:
      return state;
  }
};
