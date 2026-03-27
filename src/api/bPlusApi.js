import Request from '../utils/Request';

export const updateErpV3Api = (data) => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post(`/UpdateErp`, data)
      .then((v) => {
        resolve(v);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const lookupErpV3Api = (data) => {

  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post(`/LookupErp`, data)
      .then((v) => {
        resolve(v);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const executiveErpV3Api = (data) => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post(`/Executive`, data)
      .then((v) => {
        resolve(v);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const readErpV3Api = (data) => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post(`/ReadErp`, data)
      .then((v) => {
        resolve(v);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const RptServerErpV3Api = (data) => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post(`/RptServer`, data)
      .then((v) => {
        resolve(v);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


export const showPriceErpV3Api = (data) => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post(`/ShowPrice`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


export const parseResDataToJson = (resData) => {
  try {
    const jsonData = JSON.parse(resData.ResponseData);
    return jsonData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


