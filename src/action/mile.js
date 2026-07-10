import * as types from '../constant/mile';
import { mileCheckinCreateApi, mileAttachImageApi } from '../api/mile';
import { getLatestVehicleMileage, saveVehicleMileage } from '../api/VanSalesServices/vansales-services';
import { getUserToken } from '../utils/Token';
const normalizeLatestMileage = value => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};
export const isMileageLessThanLatest = (mileage, latestMileage) => {
  if (mileage === null || mileage === undefined || mileage === '') {
    return false;
  }
  const entered = parseFloat(String(mileage));
  const latest = normalizeLatestMileage(latestMileage);
  if (!Number.isFinite(entered)) {
    return false;
  }
  return entered < latest;
};
export const getMileageLessThanLatestMessage = latestMileage => `เลขไมล์ต้องไม่น้อยกว่า ${normalizeLatestMileage(latestMileage)} (ล่าสุด)`;
export const setInitialState = () => dispatch => {
  dispatch({
    type: types.MILE_SET_INITIAL_STATE
  });
};
export const addPhoto = uri => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.MILE_ADD_PHOTO,
      payload: uri
    });
    resolve();
  });
};
export const setMileage = value => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.MILE_SET_MILEAGE,
      payload: value
    });
    resolve();
  });
};
export const setIsSubmit = bool => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.MILE_SET_IS_SUBMIT,
      payload: bool
    });
    resolve();
  });
};
export const fetchLatestVehicleMileage = () => async dispatch => {
  try {
    const userToken = await getUserToken();
    const vanCode = String(userToken?.VANCONFIG?.VANCNF_MACHINE || '').trim();
    const licensePlate = String(userToken?.VANCONFIG?.VANCNF_REG_NAME || '').trim();
    if (!vanCode) {
      dispatch({
        type: types.MILE_SET_LATEST_MILEAGE,
        payload: 0
      });
      return 0;
    }
    const response = await getLatestVehicleMileage({
      vanCode,
      licensePlate
    });
    const latestMileage = normalizeLatestMileage(response?.data?.mileage);
    dispatch({
      type: types.MILE_SET_LATEST_MILEAGE,
      payload: latestMileage
    });
    return latestMileage;
  } catch (error) {
    console.log('[Mile] fetchLatestVehicleMileage failed', error);
    dispatch({
      type: types.MILE_SET_LATEST_MILEAGE,
      payload: 0
    });
    return 0;
  }
};
export const initializeMileScreen = () => async dispatch => {
  dispatch({
    type: types.MILE_SET_INITIAL_STATE
  });
  return dispatch(fetchLatestVehicleMileage());
};
const resolveSaveVehicleMileageErrorMessage = error => error?.response?.data?.message || error?.message || 'บันทึกเลขไมล์ไม่สำเร็จ';
export const saveVehicleMileageRecord = mileage => async dispatch => {
  const userToken = await getUserToken();
  const vanCode = String(userToken?.VANCONFIG?.VANCNF_MACHINE || '').trim();
  const licensePlate = String(userToken?.VANCONFIG?.VANCNF_REG_NAME || '').trim();
  const parsedMileage = parseFloat(String(mileage));
  if (!vanCode) {
    throw new Error('ไม่พบการส่งรหัสหน่วยรถ');
  }
  if (!Number.isFinite(parsedMileage)) {
    throw new Error('กรุณากรอกเลขไมล์ให้ถูกต้อง');
  }
  try {
    const response = await saveVehicleMileage({
      vanCode,
      licensePlate,
      mileage: parsedMileage
    });
    dispatch({
      type: types.MILE_SET_LATEST_MILEAGE,
      payload: normalizeLatestMileage(response?.data?.mileage ?? parsedMileage)
    });
    return {
      message: response?.message || 'บันทึกเลขไมล์สำเร็จ',
      data: response?.data || null
    };
  } catch (error) {
    throw new Error(resolveSaveVehicleMileageErrorMessage(error));
  }
};
export const mileCheckinCreate = data => async dispatch => {
  return new Promise((resolve, reject) => {
    mileCheckinCreateApi(data).then(v => {
      const {
        RESULT_DATA,
        STATUS,
        ERROR_MESSAGES
      } = v;
      if (STATUS === '00') {
        resolve(v);
      } else if (STATUS === '10') {
        reject(ERROR_MESSAGES);
      }
    }).catch(err => {
      reject(err.message);
    });
  });
};
export const mileAttachImage = data => dispatch => {
  return new Promise((resolve, reject) => {
    mileAttachImageApi(data).then(v => {
      const {
        RESULT_DATA,
        STATUS,
        ERROR_MESSAGES
      } = v;
      if (STATUS === '00') {
        resolve(v);
      } else if (STATUS === '10') {
        reject(ERROR_MESSAGES[0]);
      }
    }).catch(error => {
      reject(error.message);
    });
  });
};