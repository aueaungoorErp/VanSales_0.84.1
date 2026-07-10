import axios from 'axios';
import * as appConfig from '../../appConfig';
import Request from '../utils/RequestQRPayment';
import { normalizePaymentBaseUrl } from '../utils/webService';
const formatAmountToTwoDecimals = value => parseFloat(Number(value || 0).toFixed(2));
const formatAmountToTwoDecimalText = value => Number(value || 0).toFixed(2);
export const authForGetAccessTokenApi = data => {
  return new Promise((resolve, reject) => {
    Request.instance.post(`/Auth/Login`, data).then(v => {
      Request.setHeaders({
        userToken: v.data.token
      });
      resolve(v.data);
    }).catch(err => {
      reject(err);
    });
  });
};
export const requestQrCodeSCBApi = data => {
  return new Promise((resolve, reject) => {
    Request.instance.post(`/Payments/RequestQrCode/SCB`, data).then(v => {
      resolve(v.data);
    }).catch(err => {
      reject(err);
    });
  });
};
export const requestBBLPaymentHealthApi = baseUrl => {
  return new Promise((resolve, reject) => {
    const normalizedBaseUrl = normalizePaymentBaseUrl(baseUrl);
    if (!normalizedBaseUrl) {
      reject(new Error('กรุณาระบุ Base URL'));
      return;
    }
    axios.get(`${normalizedBaseUrl}/health`, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(v => {
      resolve(v.data);
    }).catch(err => {
      reject(err);
    });
  });
};
export const requestBBLQrCodeApi = ({
  baseUrl,
  taxIdNo,
  amount,
  extra1 = ''
}) => {
  return new Promise((resolve, reject) => {
    const normalizedBaseUrl = normalizePaymentBaseUrl(baseUrl);
    const requestUrl = `${normalizedBaseUrl}/api/v1/payments/bbl/qr-code/text`;
    const amountText = formatAmountToTwoDecimalText(amount);
    const requestBody = {
      amount: formatAmountToTwoDecimals(amount),
      cardNetworkPermList: ['01'],
      extra1
    };
    const requestBodyRaw = `{"amount":${amountText},"cardNetworkPermList":["01"],"extra1":${JSON.stringify(extra1)}}`;
    const requestHeaders = {
      'Content-Type': 'application/json',
      tax_id_no: taxIdNo
    };
    if (!normalizedBaseUrl) {
      reject(new Error('กรุณาระบุ Base URL'));
      return;
    }
    axios.post(requestUrl, requestBodyRaw, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: requestHeaders
    }).then(v => {
      resolve(v.data);
    }).catch(err => {
      reject(err);
    });
  });
};
export const requestBBLPaymentInquiryApi = ({
  baseUrl,
  taxIdNo,
  amount,
  qrCodeId,
  reference2
}) => {
  return new Promise((resolve, reject) => {
    const normalizedBaseUrl = normalizePaymentBaseUrl(baseUrl);
    const amountText = formatAmountToTwoDecimalText(amount);
    const requestBodyRaw = `{"amount":${amountText},"qrCodeId":${JSON.stringify(qrCodeId)},"reference2":${JSON.stringify(reference2)}}`;
    if (!normalizedBaseUrl) {
      reject(new Error('กรุณาระบุ Base URL'));
      return;
    }
    axios.post(`${normalizedBaseUrl}/api/v1/payments/bbl/payment-inquiry`, requestBodyRaw, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        tax_id_no: taxIdNo
      }
    }).then(v => {
      resolve(v.data);
    }).catch(err => {
      reject(err);
    });
  });
};