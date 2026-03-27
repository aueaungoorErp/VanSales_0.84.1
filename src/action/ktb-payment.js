import DeviceInfo from 'react-native-device-info';
import {
    requestAuthApi,
    requestGenQRApi,
    requestGetPaymentStatus,
    requestGetStatusApi,
    requestPostInvoice,
    requestSubscriptionApi,
} from '../api/ktb-payment';
import { getUserToken } from '../utils/Token';

export const checkStatusService = (data) => async (dispatch) => {
  const {ktbURL} = data;
  return await requestGetStatusApi(ktbURL);
};

export const auth = () => async (dispatch) => {
  const userToken = await getUserToken();
  // console.log('userToken: ', userToken);
  const mac = await DeviceInfo.getMACAddress();
  const uid = await DeviceInfo.getUniqueId();
  const data = {

    deviceName: mac,
    machineId: uid,
    crn: '9100990000161',
   // crn: userToken.COMPANYINFO.CMPNY_REG_NO,
  };
  return await requestAuthApi(data);
};

export const subscription = (data, accessToken) => async (dispatch) => {
  return await requestSubscriptionApi(data, accessToken);
};

export const getQRCode = (data, accessToken) => async (dispatch) => {
  return await requestGenQRApi(data, accessToken);
};

export const postinvoice = (data, accessToken) => async (dispatch) => {
  return await requestPostInvoice(data, accessToken);
};

export const getPaymentStatus = (data, accessToken) => async (dispatch) => {
  return await requestGetPaymentStatus(data, accessToken);
};
