import { PermissionsAndroid, Platform } from 'react-native';
import * as types from '../constant/geolocation';

let cachedGeolocation = undefined;

const getLinkedGeolocationModule = () => {
  if (cachedGeolocation !== undefined) {
    return cachedGeolocation;
  }

  try {
    const importedModule = require('@react-native-community/geolocation');
    const resolvedModule = importedModule?.default ?? importedModule;

    if (resolvedModule && typeof resolvedModule.setRNConfiguration === 'function') {
      try {
        resolvedModule.setRNConfiguration({
          skipPermissionRequests: false,
          authorizationLevel: 'whenInUse',
          enableBackgroundLocationUpdates: false,
          locationProvider: 'auto',
        });
      } catch (error) {
        console.log('setRNConfiguration error:', error);
      }
    }

    cachedGeolocation = resolvedModule;
  } catch (error) {
    console.log('geolocation require error:', error);
    cachedGeolocation = null;
  }

  return cachedGeolocation;
};

const getGeolocationInstance = () => {
  const geolocationModule = getLinkedGeolocationModule();

  if (geolocationModule?.getCurrentPosition) {
    return geolocationModule;
  }

  if (navigator?.geolocation?.getCurrentPosition) {
    return navigator.geolocation;
  }

  if (global?.navigator?.geolocation?.getCurrentPosition) {
    return global.navigator.geolocation;
  }

  return null;
};

const LOCATION_ERROR_MESSAGES = {
  permissionDenied: 'ไม่ได้รับอนุญาตให้เข้าถึงตำแหน่งที่ตั้ง',
  permissionBlocked: 'สิทธิ์ตำแหน่งที่ตั้งถูกปิดถาวร กรุณาเปิดสิทธิ์จากการตั้งค่าแอป',
  positionUnavailable: 'ไม่สามารถค้นหาพิกัดได้ กรุณาเปิด GPS และลองใหม่',
  timeout: 'ค้นหาพิกัดนานเกินไป กรุณาลองใหม่อีกครั้ง',
  unavailable: 'Geolocation module is not available',
  unknown: 'ไม่สามารถระบุตำแหน่งได้',
};

const formatGeolocationErrorMessage = (error) => {
  switch (error?.code) {
    case 1:
      return LOCATION_ERROR_MESSAGES.permissionDenied;
    case 2:
      return LOCATION_ERROR_MESSAGES.positionUnavailable;
    case 3:
      return LOCATION_ERROR_MESSAGES.timeout;
    default:
      return error?.message || LOCATION_ERROR_MESSAGES.unknown;
  }
};

const requestLocationPermission = async () => {
  if (Platform.OS !== 'android') {
    return { granted: true, blocked: false };
  }

  const finePermission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
  const coarsePermission = PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION;

  const hasFine = await PermissionsAndroid.check(finePermission);
  const hasCoarse = await PermissionsAndroid.check(coarsePermission);

  if (hasFine || hasCoarse) {
    return { granted: true, blocked: false };
  }

  const granted = await PermissionsAndroid.requestMultiple([
    finePermission,
    coarsePermission,
  ]);

  const fineResult = granted[finePermission];
  const coarseResult = granted[coarsePermission];
  const grantedPermission =
    fineResult === PermissionsAndroid.RESULTS.GRANTED ||
    coarseResult === PermissionsAndroid.RESULTS.GRANTED;
  const blockedPermission =
    fineResult === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
    coarseResult === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;

  return {
    granted: grantedPermission,
    blocked: blockedPermission,
  };
};

export const setInitialState = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({type: types.GEOLOCATION_SET_INITIAL_STATE});
    resolve();
  });
};

export const getCurrentPosition = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({type: types.GEOLOCATION_GET_CURRENT_POSITION});

    const handleFailure = (message) => {
      dispatch({
        type: types.GEOLOCATION_GET_CURRENT_POSITION_FAIL,
        payload: message,
      });
      reject(message);
    };

    const run = async () => {
      const permissionState = await requestLocationPermission();
      if (!permissionState.granted) {
        handleFailure(
          permissionState.blocked
            ? LOCATION_ERROR_MESSAGES.permissionBlocked
            : LOCATION_ERROR_MESSAGES.permissionDenied,
        );
        return;
      }

      const geolocation = getGeolocationInstance();

      if (!geolocation) {
        handleFailure(LOCATION_ERROR_MESSAGES.unavailable);
        return;
      }

      const doGetPosition = () => {
        geolocation.getCurrentPosition(
          (position) => {
            dispatch({
              type: types.GEOLOCATION_GET_CURRENT_POSITION_SUCCESS,
              payload: {
                latitude: position.coords.latitude.toString(),
                longitude: position.coords.longitude.toString(),
              },
            });
            resolve(position);
          },
          (firstError) => {
            console.log('geolocation high-accuracy error:', firstError);
            geolocation.getCurrentPosition(
              (position) => {
                dispatch({
                  type: types.GEOLOCATION_GET_CURRENT_POSITION_SUCCESS,
                  payload: {
                    latitude: position.coords.latitude.toString(),
                    longitude: position.coords.longitude.toString(),
                  },
                });
                resolve(position);
              },
              (secondError) => {
                console.log('geolocation low-accuracy error:', secondError);
                handleFailure(formatGeolocationErrorMessage(secondError));
              },
              {enableHighAccuracy: false, timeout: 30000, maximumAge: 60000},
            );
          },
          {enableHighAccuracy: true, timeout: 30000, maximumAge: 10000},
        );
      };

      if (Platform.OS === 'ios' && typeof geolocation.requestAuthorization === 'function') {
        try {
          geolocation.requestAuthorization();
        } catch (error) {
          console.log('requestAuthorization error:', error);
        }
      }

      doGetPosition();
    };

    run().catch((error) => {
      console.log('getCurrentPosition unexpected error:', error);
      handleFailure(formatGeolocationErrorMessage(error));
    });
  });
};

export const setMessage = (message) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({type: types.GEOLOCATION_SET_MESSAGE, payload: message});
    resolve();
  });
};
