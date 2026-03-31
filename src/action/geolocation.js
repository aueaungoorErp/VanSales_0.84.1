import * as types from '../constant/geolocation';

let geolocationModule = null;

try {
  const importedModule = require('@react-native-community/geolocation');
  geolocationModule = importedModule?.default ?? importedModule;
} catch (error) {
  geolocationModule = null;
}

if (geolocationModule && typeof geolocationModule.setRNConfiguration === 'function') {
  try {
    geolocationModule.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
      enableBackgroundLocationUpdates: false,
      locationProvider: 'auto',
    });
  } catch (error) {
    console.log('setRNConfiguration error:', error);
  }
}

const getGeolocationInstance = () => {
  if (geolocationModule?.getCurrentPosition) {
    return geolocationModule;
  }

  if (global?.navigator?.geolocation?.getCurrentPosition) {
    return global.navigator.geolocation;
  }

  return null;
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

    const geolocation = getGeolocationInstance();

    if (!geolocation) {
      const message = 'Geolocation module is not available';
      dispatch({
        type: types.GEOLOCATION_GET_CURRENT_POSITION_FAIL,
        payload: message,
      });
      reject(message);
      return;
    }

    // Request permission first if available
    const doGetPosition = () => {
      // First attempt: high accuracy with 30s timeout
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
          // Retry: low accuracy with 30s timeout as fallback
          console.log('Retrying with low accuracy...');
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
              dispatch({
                type: types.GEOLOCATION_GET_CURRENT_POSITION_FAIL,
                payload: secondError.message || 'ไม่สามารถระบุตำแหน่งได้',
              });
              reject(secondError.message);
            },
            {enableHighAccuracy: false, timeout: 30000, maximumAge: 60000},
          );
        },
        {enableHighAccuracy: true, timeout: 30000, maximumAge: 10000},
      );
    };

    if (typeof geolocation.requestAuthorization === 'function') {
      geolocation.requestAuthorization(
        () => doGetPosition(),
        (error) => {
          console.log('requestAuthorization error, trying anyway:', error);
          doGetPosition();
        }
      );
    } else {
      doGetPosition();
    }
  });
};

export const setMessage = (message) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({type: types.GEOLOCATION_SET_MESSAGE, payload: message});
    resolve();
  });
};
