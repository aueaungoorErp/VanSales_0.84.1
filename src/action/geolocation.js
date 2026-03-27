import * as types from '../constant/geolocation';

let geolocationModule = null;

try {
  const importedModule = require('@react-native-community/geolocation');
  geolocationModule = importedModule?.default ?? importedModule;
} catch (error) {
  geolocationModule = null;
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

    geolocation.getCurrentPosition(
      (position) => {
        position.coords.latitude.toString(),
          dispatch({
            type: types.GEOLOCATION_GET_CURRENT_POSITION_SUCCESS,
            payload: {
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString(),
            },
          });
        resolve(position);
      },
      (error) => {
        dispatch({
          type: types.GEOLOCATION_GET_CURRENT_POSITION_FAIL,
          payload: error.message,
        });
        reject(error.message);
      },
      {enableHighAccuracy: false, timeout: 5000, maximumAge: 10000},
    );
  });
};

export const setMessage = (message) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({type: types.GEOLOCATION_SET_MESSAGE, payload: message});
    resolve();
  });
};
