import Request from '../utils/RequestKTBPayment';

export const requestGetStatusApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .get(`/status`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const requestAuthApi = (data) => {
  return new Promise((resolve) => {
    Request.instance
      .post(`/machine/auth`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
        resolve(err.response.data);
      });
  });
};

export const requestSubscriptionApi = (data, accessToken) => {
  return new Promise((resolve) => {
    Request.instance.defaults.headers.common['accessToken'] = `${accessToken}`;
    Request.instance
      .post(`/secure/subscription`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
        resolve(err.response.data);
      });
  });
};

export const requestGenQRApi = (data, accessToken) => {
  return new Promise((resolve) => {
    Request.instance.defaults.headers.common['accessToken'] = `${accessToken}`;
    Request.instance
      .post(`/CalculateCRC16`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
        resolve(err.response.data);
      });
  });
};

export const requestPostInvoice = (data, accessToken) => {
  return new Promise((resolve, reject) => {
    Request.instance.defaults.headers.common['accessToken'] = `${accessToken}`;
    Request.instance.defaults.headers.common['appNameType'] = `VANSALES`;
    Request.instance
      .post(`/secure/postinvoice`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
        resolve(err.response.data);
      });
  });
};

export const requestGetPaymentStatus = (data, accessToken) => {
  return new Promise((resolve, reject) => {
    Request.instance.defaults.headers.common['accessToken'] = `${accessToken}`;
    Request.instance
      .post(`/secure/paymentstatus`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
        resolve(err.response.data);
      });
  });
};
