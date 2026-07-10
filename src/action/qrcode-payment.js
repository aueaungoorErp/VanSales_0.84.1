import { authForGetAccessTokenApi, requestBBLPaymentInquiryApi, requestBBLQrCodeApi, requestQrCodeSCBApi } from '../api/qrcode-payment';
// import { QRCODE_PAYMENT_AUTH_USERNAME, QRCODE_PAYMENT_AUTH_PASSWORD } from '../../appConfig'

export const authForGetAccessToken = auth => dispatch => {
  return new Promise((resolve, reject) => {
    // dispatch({ type: types.QR_CODE_PAYMENT_AUTH_LOGIN})
    // const auth = {
    //     'userName': QRCODE_PAYMENT_AUTH_USERNAME,
    //     'userPassword': QRCODE_PAYMENT_AUTH_PASSWORD,
    // }

    authForGetAccessTokenApi(auth).then(v => {
      resolve(v);
    }).catch(error => {
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.response?.data || error?.request?.data || error?.message || 'QRCode authentication failed';
      reject(errorMessage);
    });
  });
};
export const requestQrCodeSCB = (data, amount) => dispatch => {
  return new Promise((resolve, reject) => {
    const request = {
      billerId: data.paymentChannels[0].billerId,
      amount: amount,
      terminal: data.paymentChannels[0].terminalId
    };
    requestQrCodeSCBApi(request).then(v => {
      resolve(v);
    }).catch(error => {
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.response?.data || error?.message || 'Request QRCode SCB failed';
      reject(errorMessage);
    });
  });
};
export const requestBBLQrCode = payload => dispatch => {
  return new Promise(resolve => {
    requestBBLQrCodeApi(payload).then(v => {
      resolve({
        isError: !v?.success,
        data: v?.data || null,
        message: v?.responseMesg || v?.message || null,
        raw: v
      });
    }).catch(error => {
      const errorMessage = error?.response?.data?.responseMesg || error?.response?.data?.message || error?.response?.data?.error || error?.response?.data?.details?.responseBody?.responseMesg || error?.message || 'Request BBL QR Code failed';
      resolve({
        isError: true,
        data: null,
        message: errorMessage,
        raw: error?.response?.data || null
      });
    });
  });
};
export const requestBBLPaymentInquiry = payload => dispatch => {
  return new Promise(resolve => {
    requestBBLPaymentInquiryApi(payload).then(v => {
      const isApproved = v?.success === true && v?.data?.statusCode === '00';
      resolve({
        isError: !isApproved,
        data: v?.data || null,
        message: v?.responseMesg || v?.message || v?.data?.statusMesg || null,
        raw: v
      });
    }).catch(error => {
      const errorMessage = error?.response?.data?.details?.responseBody?.responseMesg || error?.response?.data?.responseMesg || error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Request BBL payment inquiry failed';
      resolve({
        isError: true,
        data: null,
        message: errorMessage,
        raw: error?.response?.data || null
      });
    });
  });
};