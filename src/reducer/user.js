import * as types from '../constant/user';

const initialState = {
  isLoading: false,
  userInfo: null,
  newUser: null,
  isBiometrics: false,
  alreadyAskBiometrics: true,
  alreadyAskBiometricsUser: null,
  userWithFinger: null,
};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case types.USER_LOGIN:
      return { ...state, isLoading: true };
    case types.USER_LOGIN_SUCCESS:
      return { ...state, isLoading: false };
    case types.USER_LOGIN_FAIL:
      return { ...state, isLoading: false };
    case types.USER_SET_ISBIOMETRICS:
      return { ...state, isBiometrics: action.payload };
    case types.USER_SET_USER_INFO:
      return { ...state, userInfo: action.payload };
    case types.USER_SET_NEW_USER:
      return { ...state, newUser: action.payload };
    case types.USER_SET_ALREADY_ASK_BIOMETRICS:
      return { ...state, alreadyAskBiometrics: action.payload };
    case types.USER_SET_ALREADY_ASK_BIOMETRICS_USER:
      return { ...state, alreadyAskBiometricsUser: action.payload };
    case types.USER_SET_USER_WITH_FINGER:
      return { ...state, userWithFinger: action.payload };
    default:
      return state;
  }
};
