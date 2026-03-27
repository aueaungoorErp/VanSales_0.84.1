import * as types from '../constant/user';

const initialState = {
  isLoading: false,
  userInfo: null,

};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case types.USER_LOGIN:
      return {...state, isLoading: true};
    case types.USER_LOGIN_SUCCESS:
      return {...state, isLoading: false};
    case types.USER_LOGIN_FAIL:
      return {...state, isLoading: false};
    default:
      return state;
  }
};
