import { loginApi, registerV3Api } from '../api/user';
import * as types from '../constant/user';
import { getBiometricLoginState, setBiometricLoginState } from '../utils/Token';

export const login = userLogin => async dispatch => {
  return await loginApi(userLogin);
};

export const registerV3 = (username, password) => async dispatch => {
  // console.log("username, password ",username, password);
  return await registerV3Api(username, password);
};

export const toggleRememberPassword = item => async dispatch => {
  return dispatch => {
    dispatch({ type: types.USER_REMEMBER_PASSWORD, payload: item });
  };
};

export const normalizeUserIdentity = (user, options = {}) => {
  const { includePassword = false } = options;

  if (!user || typeof user !== 'object') {
    return null;
  }

  const service =
    user.service === null || user.service === undefined
      ? null
      : String(user.service).trim() || null;
  const USER_CODE =
    user.USER_CODE === null || user.USER_CODE === undefined
      ? null
      : String(user.USER_CODE).trim().toUpperCase() || null;
  const USER_PASSWORD =
    user.USER_PASSWORD === null || user.USER_PASSWORD === undefined
      ? null
      : String(user.USER_PASSWORD);

  if (!service && !USER_CODE && (!includePassword || !USER_PASSWORD)) {
    return null;
  }

  return {
    service,
    USER_CODE,
    ...(includePassword ? { USER_PASSWORD } : {}),
  };
};

export const isSameUserIdentity = (left, right) => {
  const normalizedLeft = normalizeUserIdentity(left);
  const normalizedRight = normalizeUserIdentity(right);

  if (!normalizedLeft || !normalizedRight) {
    return false;
  }

  return (
    normalizedLeft.service === normalizedRight.service &&
    normalizedLeft.USER_CODE === normalizedRight.USER_CODE
  );
};

export const setIsBiometrics = value => dispatch => {
  dispatch({ type: types.USER_SET_ISBIOMETRICS, payload: !!value });
};

export const setUserInfo = userInfo => dispatch => {
  dispatch({
    type: types.USER_SET_USER_INFO,
    payload: normalizeUserIdentity(userInfo),
  });
};

export const setNewUser = userInfo => dispatch => {
  dispatch({
    type: types.USER_SET_NEW_USER,
    payload: normalizeUserIdentity(userInfo, { includePassword: true }),
  });
};

export const clearNewUser = () => dispatch => {
  dispatch({ type: types.USER_SET_NEW_USER, payload: null });
};

export const hydrateUserBiometricState = () => async dispatch => {
  const biometricState = await getBiometricLoginState();
  console.log('[BiometricLogin] hydrate', {
    raw: biometricState,
    isBiometrics: !!biometricState?.isBiometrics,
    userInfo: biometricState?.userInfo,
  });

  dispatch({
    type: types.USER_SET_ISBIOMETRICS,
    payload: !!biometricState?.isBiometrics,
  });
  dispatch({
    type: types.USER_SET_USER_INFO,
    payload: normalizeUserIdentity(biometricState?.userInfo),
  });
};

export const persistBiometricPreference =
  (value, userInfo) => async dispatch => {
    const normalizedUserInfo = normalizeUserIdentity(userInfo);
    const payload = {
      isBiometrics: !!value,
      userInfo: normalizedUserInfo,
    };

    await setBiometricLoginState(payload);

    dispatch({
      type: types.USER_SET_ISBIOMETRICS,
      payload: payload.isBiometrics,
    });
    dispatch({
      type: types.USER_SET_USER_INFO,
      payload: payload.userInfo,
    });
  };
