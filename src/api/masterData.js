import Request from '../utils/Request';
import { lookupErpV3Api } from '../api/setting';
import * as appConfig from '../../appConfig';
import { getLoginGuID } from '../utils/Token';

// export const xxsearchMasterDataBankFileListApi = () => {
//     return new Promise((resolve, reject) => {
//         Request.instance.get(`/MasterData/BankFile`)
//         .then(v => {

//             resolve(v.data) 
//         }).catch((err) => {
//             reject(err)
//         })
//     })  
// }

// _getLoginGuID = async () => {
//     const loginGUID = await getLoginGuID();
//     if (loginGUID) {
//       await this.setState((oldState) => {
//         return {
//           loginGUID: loginGUID,
//         };
//       });
//     }
//   };

export const searchMasterDataBankFileListApi = async GUID => {
  // const GUID = await getLoginGuID();
  return new Promise(async (resolve, reject) => {
    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': GUID,
      'BPAPUS-FUNCTION': 'Bk000201',
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': "",
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0'
    };
    await lookupErpV3Api(bodyRequest).then(v => {
      resolve(v);
    }).catch(err => {
      reject(err.message);
    });
  });
};

//   export const searchMasterDataBankFileListApi  = async (data) => {

//     const GUID = await getLoginGuID();
//     const bodyRequest = {
//         'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
//         'BPAPUS-LOGIN-GUID':  GUID,
//         'BPAPUS-FUNCTION': 'Bk000201',
//         'BPAPUS-PARAM': '',
//         'BPAPUS-FILTER': "",
//         'BPAPUS-ORDERBY': '',
//         'BPAPUS-OFFSET': '0',
//         'BPAPUS-FETCH': '0',
//       };

//     return new Promise((resolve, reject) => {
//         Request.instance.post(`/LookupErp`, bodyRequest)
//         .then(v => {
//             resolve(v.data) 
//         }).catch((error) => {
//             reject(error);
//         })
//     })  
// }

//   export const ggsearchMasterDataBankFileListApi = () => {
//     return new Promise((resolve, reject) => {
//         Request.instance.get(`/MasterData/BankFile`)
//         .then(v => {
//             resolve(v.data) 
//         }).catch((err) => {
//             reject(err)
//         })
//     })  
// }

export const searchMasterDataVanVisRListApi = () => {
  return new Promise((resolve, reject) => {
    Request.instance.get(`/MasterData/VanVisitReason`).then(v => {
      resolve(v.data);
    }).catch(err => {
      reject(err);
    });
  });
};
export const getMasterDataSurveyFormApi = () => {
  return new Promise((resolve, reject) => {
    Request.instance.get(`/MasterData/SurveyForm`).then(v => {
      resolve(v.data);
    }).catch(err => {
      reject(err);
    });
  });
};
export const getMasterDataProvincesApi = () => {
  return new Promise((resolve, reject) => {
    Request.instance.get(`/MasterData/Provinces`).then(v => {
      resolve(v.data);
    }).catch(err => {
      reject(err);
    });
  });
};
export const getMasterDataDistrictsApi = id => {
  return new Promise((resolve, reject) => {
    Request.instance.get(`/MasterData/Districts/${id}`).then(v => {
      resolve(v.data);
    }).catch(err => {
      reject(err);
    });
  });
};
export const getMasterDataSubDistrictsApi = id => {
  return new Promise((resolve, reject) => {
    Request.instance.get(`/MasterData/Subdistricts/${id}`).then(v => {
      resolve(v.data);
    }).catch(err => {
      reject(err);
    });
  });
};
export const getMasterDataBankAccountsApi = () => {
  return new Promise((resolve, reject) => {
    Request.instance.get(`/MasterData/GetBankAccounts`).then(v => {
      resolve(v.data);
    }).catch(err => {
      reject(err);
    });
  });
};
export const getMasterDataWareLocationsApi = () => {
  return new Promise((resolve, reject) => {
    Request.instance.get(`/MasterData/GetWareLocations`).then(v => {
      resolve(v.data);
    }).catch(err => {
      reject(err);
    });
  });
};