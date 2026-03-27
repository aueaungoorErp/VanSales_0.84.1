import Request from '../utils/Request'

export const checkDistanceApi = (arKey, lat, lnt) => {
    return new Promise((resolve, reject) => {
        Request.instance.get(`/Checkin/Verify/${arKey}/${lat}/${lnt}`)
        .then(v => {
            resolve(v.data) 
        }).catch((error) => {
            reject(error)
        })
    })  
};

export const UpdAddrBookV3Api = (bodyRequest) => {
  return new Promise((resolve, reject) => {
    Request.instanceV3
      .post('/CreateUpdateMaster', bodyRequest)
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};