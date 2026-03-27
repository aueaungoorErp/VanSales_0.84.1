import qs from 'qs';
import * as types from '../constant/check-in';
import {checkDistanceApi} from '../api/check-in';
import getDistance from 'geolib/es/getDistance';
export const setInitialState = () => (dispatch) => {
  dispatch({type: types.CHECK_IN_SET_INITIAL_STATE});
};

export const addPhoto = (uri) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({type: types.CHECK_IN_ADD_PHOTO, payload: uri});
    resolve();
  });
};

export const setIsSubmit = (bool) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({type: types.CHECK_IN_SET_IS_SUBMIT, payload: bool});
    resolve();
  });
};

export const submit = () => (dispatch, getState) => {
  dispatch({type: types.CHECK_IN_SUBMIT});
  let checkin = getState().checkin;
  let geolocation = getState().geolocation;

  const request = qs.stringify({
    image: checkin.item.photo,
    latitude: geolocation.position.latitude,
    longitude: geolocation.position.longitude,
  });
};

export const checkDistance = (arInfo, lat, lnt, range) => (dispatch) => {
  return new Promise((resolve, reject) => {
    console.log('arInfo lat lnt range', arInfo, lat, lnt,range , arInfo.ADDB_GPS_LAT_S,arInfo.ADDB_GPS_LONG_S);

    let res = 0 ;
    if (arInfo.ADDB_GPS_LAT_S != null  ||  arInfo.ADDB_GPS_LONG_S != null)
    {
        res = getDistance(
        {latitude: arInfo.ADDB_GPS_LAT_S, longitude: arInfo.ADDB_GPS_LONG_S},
        {latitude: lat, longitude: lnt},
        0.01,
        );
    }

    console.log('arInfo lat lnt range res', res);
    // const res = getDistance(
    //     {latitude: lat, longitude: lnt},
    //     {latitude: lat, longitude: lnt},
    //     0.01,
    //   );

    if (res >= 0 && (res < range + 20)) {
      resolve(true);
    } else if (res >= 0 && (res >= range + 20)) {
      reject(
        `ไม่ได้อยู่ในระยะการเช็คอิน ระยะห่างการเช็คอินต้องไม่เกิน ${range} ม.`,
      );
    } else  {
      resolve(false);
    }

    // checkDistanceApi(arKey, lat, lnt)
    //   .then((v) => {
    //     const {RESULT_DATA, STATUS, ERROR_MESSAGES} = v;
    //     console.log('v', v);
    //     if (STATUS === '00') {
    //       const {VERIFIED, VANCNF_RANGECHECKIN} = RESULT_DATA;
    //       if (VERIFIED) resolve(VERIFIED);
    //       else
    //         reject(
    //           `ไม่ได้อยู่ในระยะการเช็คอิน ระยะห่างการเช็คอินต้องไม่เกิน${VANCNF_RANGECHECKIN}`,
    //         );
    //     } else if (STATUS === '10' && ERROR_MESSAGES[0]) {
    //       reject(ERROR_MESSAGES[0]);
    //     }
    //   })
    //   .catch((error) => {
    //     reject(error.message);
    //   });
  });
};

export const setIsLoading = (bool) => (dispatch) => {
  dispatch({type: types.CHECK_IN_SET_IS_LOADING, payload: bool});
};

