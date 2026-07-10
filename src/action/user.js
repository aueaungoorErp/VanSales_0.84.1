import { loginApi, registerV3Api } from '../api/user';
import * as types from '../constant/user';
import { getBiometricLoginState, setBiometricLoginState } from '../utils/Token';
import { removeData, retrieveData, storeData } from '../utils/Storage';

const BIOMETRIC_HYDRATE_COOLDOWN_MS = 1000;
const USER_WITH_FINGER_STORAGE_KEY = '@UserWithFinger';
const BIOMETRIC_USERS_STORAGE_KEY = '@BiometricUsers';

let lastBiometricHydrateAt = 0;
let biometricHydratePromise = null;

const normalizeBiometricState = rawState => ({
  isBiometrics: !!rawState?.isBiometrics,
  userInfo: normalizeUserIdentity(rawState?.userInfo),
  alreadyAskBiometrics: rawState?.alreadyAskBiometrics !== false,
  alreadyAskBiometricsUser: normalizeUserIdentity(
    rawState?.alreadyAskBiometricsUser,
  ),
});

const persistUserWithFinger = async userInfo => {
  if (!userInfo) {
    await removeData(USER_WITH_FINGER_STORAGE_KEY);
    return;
  }

  await storeData(USER_WITH_FINGER_STORAGE_KEY, JSON.stringify(userInfo));
};

const getPersistedUserWithFinger = async () => {
  try {
    const raw = await retrieveData(USER_WITH_FINGER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
};

export const login = userLogin => async dispatch => {
  return await loginApi(userLogin);
};

export const registerV3 = (username, password) => async dispatch => {
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

const normalizeBiometricUserEntry = user => {
  const normalizedUser = normalizeUserIdentity(user, { includePassword: true });

  if (!normalizedUser) {
    return null;
  }

  return {
    ...normalizedUser,
    isOpenBio: !!user?.isOpenBio,
  };
};

const getPersistedBiometricUsers = async () => {
  try {
    const raw = await retrieveData(BIOMETRIC_USERS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(item => normalizeBiometricUserEntry(item))
      .filter(Boolean);
  } catch (_error) {
    return [];
  }
};

const setPersistedBiometricUsers = async users => {
  await storeData(BIOMETRIC_USERS_STORAGE_KEY, JSON.stringify(users));
};

const upsertPersistedBiometricUser = async (userInfo, isOpenBio) => {
  const normalizedUser = normalizeBiometricUserEntry({
    ...userInfo,
    isOpenBio,
  });

  if (!normalizedUser) {
    return null;
  }

  const persistedUsers = await getPersistedBiometricUsers();
  const existingEntry = persistedUsers.find(item =>
    isSameUserIdentity(item, normalizedUser),
  );
  const nextEntry = {
    ...(existingEntry ?? {}),
    ...normalizedUser,
    USER_PASSWORD:
      normalizedUser.USER_PASSWORD ?? existingEntry?.USER_PASSWORD ?? null,
    isOpenBio,
  };
  const nextUsers = [
    ...persistedUsers.filter(item => !isSameUserIdentity(item, normalizedUser)),
    nextEntry,
  ];

  await setPersistedBiometricUsers(nextUsers);
  return nextEntry;
};

export const findPersistedBiometricUser = async userInfo => {
  const normalizedUser = normalizeUserIdentity(userInfo);

  if (!normalizedUser) {
    return null;
  }

  const persistedUsers = await getPersistedBiometricUsers();
  return (
    persistedUsers.find(item => isSameUserIdentity(item, normalizedUser)) ??
    null
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

export const setNewUser = userInfo => async dispatch => {
  const normalizedNewUser = normalizeUserIdentity(userInfo, {
    includePassword: true,
  });

  if (normalizedNewUser?.USER_CODE) {
    const persistedBiometricUser =
      await findPersistedBiometricUser(normalizedNewUser);
    const shouldAskBiometrics = !persistedBiometricUser;
    const normalizedAskUser = normalizeUserIdentity(normalizedNewUser);

    if (persistedBiometricUser) {
      await upsertPersistedBiometricUser(
        normalizedNewUser,
        !!persistedBiometricUser.isOpenBio,
      );
    }

    dispatch({
      type: types.USER_SET_ALREADY_ASK_BIOMETRICS,
      payload: shouldAskBiometrics,
    });
    dispatch({
      type: types.USER_SET_ALREADY_ASK_BIOMETRICS_USER,
      payload: normalizedAskUser,
    });
  }

  dispatch({
    type: types.USER_SET_NEW_USER,
    payload: normalizedNewUser,
  });
};

export const clearNewUser = () => dispatch => {
  dispatch({ type: types.USER_SET_NEW_USER, payload: null });
};

export const setUserWithFinger = userInfo => async dispatch => {
  const normalizedFingerUser = userInfo
    ? normalizeUserIdentity(userInfo, { includePassword: true })
    : null;

  await persistUserWithFinger(normalizedFingerUser);

  dispatch({
    type: types.USER_SET_USER_WITH_FINGER,
    payload: normalizedFingerUser,
  });
};

export const hydrateUserBiometricState = () => async dispatch => {
  const now = Date.now();

  if (biometricHydratePromise) {
    await biometricHydratePromise;
    return;
  }

  if (now - lastBiometricHydrateAt < BIOMETRIC_HYDRATE_COOLDOWN_MS) {
    return;
  }

  biometricHydratePromise = Promise.all([
    getBiometricLoginState(),
    getPersistedUserWithFinger(),
  ]);

  try {
    const [rawBiometricState, persistedFingerUser] =
      await biometricHydratePromise;
    const biometricState = normalizeBiometricState(rawBiometricState);

    lastBiometricHydrateAt = Date.now();

    dispatch({
      type: types.USER_SET_ISBIOMETRICS,
      payload: biometricState.isBiometrics,
    });
    dispatch({
      type: types.USER_SET_USER_INFO,
      payload: biometricState.userInfo,
    });
    dispatch({
      type: types.USER_SET_ALREADY_ASK_BIOMETRICS,
      payload: biometricState.alreadyAskBiometrics,
    });
    dispatch({
      type: types.USER_SET_ALREADY_ASK_BIOMETRICS_USER,
      payload: biometricState.alreadyAskBiometricsUser,
    });
    dispatch({
      type: types.USER_SET_USER_WITH_FINGER,
      payload: normalizeUserIdentity(persistedFingerUser, {
        includePassword: true,
      }),
    });
  } finally {
    biometricHydratePromise = null;
  }
};

export const persistBiometricPreference =
  (value, userInfo) => async dispatch => {
    const existingBiometricState = normalizeBiometricState(
      await getBiometricLoginState(),
    );
    const normalizedUserInfo = normalizeUserIdentity(userInfo);
    const normalizedBiometricUser = normalizeUserIdentity(userInfo, {
      includePassword: true,
    });

    if (normalizedBiometricUser?.USER_CODE) {
      await upsertPersistedBiometricUser(normalizedBiometricUser, !!value);
    }

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
    dispatch({
      type: types.USER_SET_ALREADY_ASK_BIOMETRICS,
      payload: false,
    });
    dispatch({
      type: types.USER_SET_ALREADY_ASK_BIOMETRICS_USER,
      payload:
        normalizedUserInfo ?? existingBiometricState.alreadyAskBiometricsUser,
    });
  };

export const setAlreadyAskBiometrics =
  (value, userInfo = null) => async dispatch => {
    const biometricState = normalizeBiometricState(
      await getBiometricLoginState(),
    );
    const normalizedUserInfo = normalizeUserIdentity(userInfo, {
      includePassword: true,
    });

    if (!value && normalizedUserInfo?.USER_CODE) {
      await upsertPersistedBiometricUser(normalizedUserInfo, false);
    }

    dispatch({
      type: types.USER_SET_ALREADY_ASK_BIOMETRICS,
      payload: !!value,
    });
    dispatch({
      type: types.USER_SET_ALREADY_ASK_BIOMETRICS_USER,
      payload:
        normalizeUserIdentity(normalizedUserInfo) ??
        biometricState.alreadyAskBiometricsUser,
    });
  };
