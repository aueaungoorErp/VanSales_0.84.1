import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { open } from 'react-native-nitro-sqlite';
import {
  closeDatabaseQueue,
  isDatabaseOpen,
} from 'react-native-nitro-sqlite/lib/module/DatabaseQueue';
import * as types from '../constant/masterData';

const PROVINCES_DB_NAME = 'provinces.db';
const PROVINCES_DB_ASSET_PATH = 'www/provinces.db';
const PROVINCES_DB_LOCATION = 'sqlite';
const PROVINCES_DB_DIR = `${RNFS.DocumentDirectoryPath}/sqlite`;
const PROVINCES_DB_PATH = `${PROVINCES_DB_DIR}/${PROVINCES_DB_NAME}`;

let provincesDb = null;

const ensureDbDirectory = async () => {
  const exists = await RNFS.exists(PROVINCES_DB_DIR);
  if (!exists) {
    await RNFS.mkdir(PROVINCES_DB_DIR);
  }
};

const copyBundledDatabaseIfNeeded = async (force = false) => {
  await ensureDbDirectory();

  const alreadyExists = await RNFS.exists(PROVINCES_DB_PATH);
  if (alreadyExists && !force) {
    return;
  }

  if (alreadyExists && force) {
    await RNFS.unlink(PROVINCES_DB_PATH);
  }

  if (Platform.OS === 'android') {
    await RNFS.copyFileAssets(PROVINCES_DB_ASSET_PATH, PROVINCES_DB_PATH);
    return;
  }

  if (Platform.OS === 'ios') {
    const sourcePath = `${RNFS.MainBundlePath}/${PROVINCES_DB_NAME}`;
    const sourceExists = await RNFS.exists(sourcePath);

    if (!sourceExists) {
      throw new Error(
        'ไม่พบ provinces.db ใน iOS bundle กรุณาเพิ่มไฟล์ฐานข้อมูลเข้า iOS resources',
      );
    }

    await RNFS.copyFile(sourcePath, PROVINCES_DB_PATH);
    return;
  }

  throw new Error(`Platform ${Platform.OS} ยังไม่รองรับ flow นี้`);
};

const openProvincesDb = () => {
  // Fast refresh can reset this module while Nitro's internal queue still
  // thinks the database is open. Clear the stale JS queue entry first.
  if (isDatabaseOpen(PROVINCES_DB_NAME)) {
    closeDatabaseQueue(PROVINCES_DB_NAME);
  }

  return open({
    name: PROVINCES_DB_NAME,
    location: PROVINCES_DB_LOCATION,
  });
};

const hasRequiredTables = async (db) => {
  const result = await db.executeAsync(
    "SELECT lower(name) as name FROM sqlite_master WHERE type = 'table' AND lower(name) IN ('provinces', 'districts', 'subdistricts')",
  );
  const rows = Array.isArray(result?.results) ? result.results : [];
  return rows.length === 3;
};

const getProvincesDb = async () => {
  await copyBundledDatabaseIfNeeded();

  if (!provincesDb) {
    provincesDb = openProvincesDb();

    const tablesExist = await hasRequiredTables(provincesDb);
    if (!tablesExist) {
      provincesDb.close();
      provincesDb = null;

      await copyBundledDatabaseIfNeeded(true);
      provincesDb = openProvincesDb();

      const retryTablesExist = await hasRequiredTables(provincesDb);
      if (!retryTablesExist) {
        throw new Error(
          'เปิด provinces.db ได้แต่ไม่พบตาราง Provinces/Districts/Subdistricts',
        );
      }
    }
  }

  return provincesDb;
};

const executeSelect = async (query, params = []) => {
  const db = await getProvincesDb();
  const result = await db.executeAsync(query, params);
  return Array.isArray(result?.results) ? result.results : [];
};

export const setInitialState = () => (dispatch) => {
  dispatch({type: types.MASTER_DATA_INITIAL_STATE});
  return Promise.resolve();
};

export const clearMasterBankFileList = () => (dispatch) => {
  dispatch({type: types.MASTER_DATA_CLEAR_BANK_FILE_LIST});
  return Promise.resolve();
};

export const searchMasterDataBankFileList = (GUID) => (dispatch) => {
  return Promise.resolve();
};

export const searchMasterDataVanVisRList = () => (dispatch) => {
  return Promise.resolve();
};

export const getMasterDataSurveyForm = () => (dispatch) => {
  return Promise.resolve();
};

export const getMasterDataProvinces = () => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    dispatch({type: types.MASTER_DATA_GET_PROVINCE_LIST_ITEMS});

    try {
      const results = await executeSelect('SELECT * FROM Provinces');

      if (!results.length) {
        throw new Error('ไม่พบข้อมูลจังหวัด');
      }

      dispatch({
        type: types.MASTER_DATA_GET_PROVINCE_LIST_ITEMS_SUCCESS,
        payload: results,
      });
      resolve(results);
    } catch (error) {
      dispatch({type: types.MASTER_DATA_GET_PROVINCE_LIST_ITEMS_FAIL});
      reject(error);
    }
  });
};

export const getMasterDataDistricts = (provinceId) => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    dispatch({type: types.MASTER_DATA_GET_DISTRICT_LIST_ITEMS_BY_PROVINCE_ID});

    try {
      const state = getState();
      const selectedProvinceId =
        provinceId || state?.customer?.item?.TEMP_CUS?.PROVINCE;

      if (!selectedProvinceId) {
        dispatch({
          type: types.MASTER_DATA_GET_DISTRICT_LIST_ITEMS_BY_PROVINCE_ID_SUCCESS,
          payload: [],
        });
        resolve([]);
        return;
      }

      const results = await executeSelect(
        'SELECT * FROM Districts WHERE ProvinceId = ?',
        [selectedProvinceId],
      );

      if (!results.length) {
        throw new Error('ไม่พบข้อมูลเขต/อำเภอ');
      }

      dispatch({
        type: types.MASTER_DATA_GET_DISTRICT_LIST_ITEMS_BY_PROVINCE_ID_SUCCESS,
        payload: results,
      });
      resolve(results);
    } catch (error) {
      dispatch({type: types.MASTER_DATA_GET_DISTRICT_LIST_ITEMS_BY_PROVINCE_ID_FAIL});
      reject(error);
    }
  });
};

export const getMasterDataSubDistricts = (districtId) => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    dispatch({
      type: types.MASTER_DATA_GET_SUB_DISTRICT_LIST_ITEMS_BY_DISTRICT_ID,
    });

    try {
      const state = getState();
      const selectedDistrictId =
        districtId || state?.customer?.item?.TEMP_CUS?.ADDRESS3;

      if (!selectedDistrictId) {
        dispatch({
          type: types.MASTER_DATA_GET_SUB_DISTRICT_LIST_ITEMS_BY_DISTRICT_ID_SUCCESS,
          payload: [],
        });
        resolve([]);
        return;
      }

      const results = await executeSelect(
        'SELECT * FROM Subdistricts WHERE DistrictId = ?',
        [selectedDistrictId],
      );

      if (!results.length) {
        throw new Error('ไม่พบข้อมูลแขวง/ตำบล');
      }

      dispatch({
        type: types.MASTER_DATA_GET_SUB_DISTRICT_LIST_ITEMS_BY_DISTRICT_ID_SUCCESS,
        payload: results,
      });
      resolve(results);
    } catch (error) {
      dispatch({type: types.MASTER_DATA_GET_SUB_DISTRICT_LIST_ITEMS_BY_DISTRICT_ID_FAIL});
      reject(error);
    }
  });
};

export const setProvinceListItems = (items) => (dispatch) => {
  return new Promise((resolve) => {
    dispatch({type: types.MASTER_DATA_SET_PROVINCE_LIST_ITEMS, payload: items});
    resolve(items);
  });
};

export const setDistrictListItems = (items) => (dispatch) => {
  return new Promise((resolve) => {
    dispatch({type: types.MASTER_DATA_SET_DISTRICT_LIST_ITEMS, payload: items});
    resolve(items);
  });
};

export const setSubDistrictListItems = (items) => (dispatch) => {
  return new Promise((resolve) => {
    dispatch({type: types.MASTER_DATA_SET_SUB_DISTRICT_LIST_ITEMS, payload: items});
    resolve(items);
  });
};

export const getMasterDataBankAccounts = () => (dispatch) => {
  return Promise.resolve();
};

export const getMasterDataWareLocations = () => (dispatch) => {
  return Promise.resolve();
};

// --- Original commented-out implementations below ---

// import {
//   searchMasterDataBankFileListApi,
//   searchMasterDataVanVisRListApi,
//   getMasterDataSurveyFormApi,
//   getMasterDataProvincesApi,
//   getMasterDataDistrictsApi,
//   getMasterDataSubDistrictsApi,
//   getMasterDataBankAccountsApi,
//   getMasterDataWareLocationsApi,
// } from '../api/masterData';
// import * as types from '../constant/masterData';
// import {openDatabase} from 'react-native-sqlite-storage';

// export const setInitialState = () => (dispatch) => {
//   dispatch({type: types.MASTER_DATA_INITIAL_STATE});
// };

// export const clearMasterBankFileList = () => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     dispatch({type: types.MASTER_DATA_CLEAR_BANK_FILE_LIST});
//     resolve();
//   });
// };



// export const searchMasterDataBankFileList = (GUID) => (dispatch) => {
// // console.log("searchMasterDataBankFileList >>> 2" , GUID);


//   return new Promise((resolve, reject) => {
//     dispatch({type: types.MASTER_DATA_SEARCH_BANK_FILE_LIST});
//     searchMasterDataBankFileListApi(GUID)
//       .then((v) => {
//         // console.log("searchMasterDataBankFileList >>> 33" , v );
//        // const {RESULT_DATA, STATUS, ERROR_MESSAGES} = v;
//         const {ResponseData, ResponseCode , ReasonString} = v;
//         // console.log(JSON.parse(ResponseData));
//         let responseData = JSON.parse(ResponseData)

//         // console.log("searchMasterDataBankFileList >>> 34" , responseData.Bk000201 );

//         if (ResponseCode === '200') {
//           const RESULT =  responseData.Bk000201;

//           // console.log("searchMasterDataBankFileList >>> 222" , RESULT );

//           if (ResponseData && RESULT && RESULT.length > 0) {
//             dispatch({
//               type: types.MASTER_DATA_SEARCH_BANK_FILE_LIST_SUCCESS,
//               payload: RESULT,
//             });
//             // console.log("searchMasterDataBankFileList >>> v" , v );
//             resolve(v);
       
         
//           } else {
//             reject('ไม่พบข้อมูลธนาคาร');
//           }
//         } else if (ResponseCode === '10' && ReasonString[0]) {
//           reject(ReasonString[0]);
//         }
//       })
//       .catch((error) => {
//         reject(error.message);
//       });
//   });
// };

// export const searchMasterDataVanVisRList = () => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     dispatch({type: types.MASTER_DATA_SEARCH_VANVISR_LIST});

//     searchMasterDataVanVisRListApi()
//       .then((v) => {
//         const {RESULT_DATA, STATUS, ERROR_MESSAGES} = v;
//         if (STATUS === '00') {
//           const {RESULT} = RESULT_DATA;
//           if (RESULT_DATA && RESULT && RESULT.length > 0) {
//             dispatch({
//               type: types.MASTER_DATA_SEARCH_VANVISR_LIST_SUCCESS,
//               payload: RESULT,
//             });
//             resolve(v);
//           } else {
//             reject('ไม่พบข้อมูลเหตุผลการเยี่ยม');
//           }
//         } else if (STATUS === '10' && ERROR_MESSAGES[0]) {
//           reject(ERROR_MESSAGES[0]);
//         }
//       })
//       .catch((error) => {
//         reject(error.message);
//       });
//   });
// };

// export const getMasterDataSurveyForm = () => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     dispatch({type: types.MASTER_DATA_GET_SURVEY_FORM});

//     getMasterDataSurveyFormApi()
//       .then((v) => {
//         const {RESULT_DATA, STATUS, ERROR_MESSAGES} = v;
//         if (STATUS === '00') {
//           const {SVF_QUESTIONS} = RESULT_DATA;
//           if (RESULT_DATA && SVF_QUESTIONS && SVF_QUESTIONS.length > 0) {
//             dispatch({
//               type: types.MASTER_DATA_GET_SURVEY_FORM_SUCCESS,
//               payload: RESULT_DATA,
//             });
//             resolve(v);
//           } else {
//             reject('ไม่พบข้อมูลแบบสำรวจ');
//           }
//         } else if (STATUS === '10' && ERROR_MESSAGES[0]) {
//           reject(ERROR_MESSAGES[0]);
//         }
//       })
//       .catch((error) => {
//         reject(error.message);
//       });
//   });
// };

// export const getMasterDataProvinces = () => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     dispatch({type: types.MASTER_DATA_GET_PROVINCE_LIST_ITEMS});

//     let db = openDatabase(
//       {name: 'provinces.db', createFromLocation: 1},
//       () => {
//         db.transaction((tx) => {
//           // console.log('tx ', tx);
//           tx.executeSql('SELECT * FROM Provinces', [], (tx, result) => {
//             // console.log('SELECT * FROM Provinces ' , result);
//             let dataLength = result.rows.length;

//             var temp = [];

//             for (let i = 0; i < result.rows.length; i++) {
//               temp.push(result.rows.item(i));
//             }

//             // console.log('SELECT * FROM Provinces ' , temp);



//             if (temp && temp.length > 0) {
//               dispatch({
//                 type: types.MASTER_DATA_GET_PROVINCE_LIST_ITEMS_SUCCESS,
//                 payload: temp,
//               });
//               resolve(temp);
//             } else {
//               reject('ไม่พบข้อมูลจังหวัด');
//             }
  
//           });
//         });
//       },
//       (err) => {
//         reject(err);
//       },
//     );
//   });
// };

// export const getMasterDataDistricts = (id) => (dispatch, getState) => {
//   return new Promise((resolve, reject) => {
//     const customer = getState().customer;

//     dispatch({type: types.MASTER_DATA_GET_DISTRICT_LIST_ITEMS_BY_PROVINCE_ID});

//     let db = openDatabase(
//       {name: 'provinces.db', createFromLocation: 2},
//       () => {
//         db.transaction((tx) => {
//           console.log(
//             'customer.item.TEMP_CUS.PROVINCE ',
//             customer.item.TEMP_CUS.PROVINCE,
//           );
//           tx.executeSql(
//             "SELECT * FROM Districts WHERE ProvinceId = '" +
//               customer.item.TEMP_CUS.PROVINCE +
//               "'",
//             [],
//             (tx, result) => {
//               console.log('getMasterDataDistricts result', result);
//               let dataLength = result.rows.length;

//               var temp = [];

//               for (let i = 0; i < result.rows.length; i++) {
//                 temp.push(result.rows.item(i));
//               }
//               if (temp && temp.length > 0) {
//                 dispatch({
//                   type:
//                     types.MASTER_DATA_GET_DISTRICT_LIST_ITEMS_BY_PROVINCE_ID_SUCCESS,
//                   payload: temp,
//                 });
//                 resolve(temp);
//               } else {
//                 reject('ไม่พบข้อมูลเขต/อำเภอ');
//               }
//             },
//           );
//         });
//       },
//       (err) => {
//         reject(err);
//       },
//     );
//   });
// };

// export const getMasterDataSubDistricts = (id) => (dispatch, getState) => {
//   return new Promise((resolve, reject) => {
//     const customer = getState().customer;

//     dispatch({
//       type: types.MASTER_DATA_GET_SUB_DISTRICT_LIST_ITEMS_BY_DISTRICT_ID,
//     });

//     let db = openDatabase(
//       {name: 'provinces.db', createFromLocation: 2},
//       () => {
//         db.transaction((tx) => {
//           console.log(
//             'customer.item.TEMP_CUS.ADDRESS3 ',
//             customer.item.TEMP_CUS.ADDRESS3,
//           );
//           tx.executeSql(
//             "SELECT * FROM SubDistricts WHERE DistrictId = '" +
//               customer.item.TEMP_CUS.ADDRESS3 +
//               "'",
//             [],
//             (tx, result) => {
//               console.log('getMasterDataSubDistricts result', result);
//               let dataLength = result.rows.length;

//               var temp = [];

//               for (let i = 0; i < result.rows.length; i++) {
//                 temp.push(result.rows.item(i));
//               }
//               if (temp && temp.length > 0) {
//                 dispatch({
//                   type:
//                     types.MASTER_DATA_GET_SUB_DISTRICT_LIST_ITEMS_BY_DISTRICT_ID_SUCCESS,
//                   payload: temp,
//                 });
//                 resolve(temp);
//               } else {
//                 dispatch({
//                   type:
//                     types.MASTER_DATA_GET_SUB_DISTRICT_LIST_ITEMS_BY_DISTRICT_ID_FAIL,
//                 });
//                 reject('ไม่พบข้อมูลแขวง/ตำบล');
//               }

//             },
//           );
//         });
//       },
//       (err) => {
//         reject(err);
//       },
//     );
//   });
// };

// // export const getMasterDataProvinces = () => (dispatch) => {
// //   return new Promise((resolve, reject) => {
// //     dispatch({type: types.MASTER_DATA_GET_PROVINCE_LIST_ITEMS});

// //     getMasterDataProvincesApi()
// //       .then((v) => {
// //         const {RESULT_DATA, STATUS, ERROR_MESSAGES} = v;
// //         if (STATUS === '00') {
// //           const {RESULT} = RESULT_DATA;
// //           if (RESULT_DATA && RESULT && RESULT.length > 0) {
// //             dispatch({
// //               type: types.MASTER_DATA_GET_PROVINCE_LIST_ITEMS_SUCCESS,
// //               payload: RESULT,
// //             });
// //             resolve(v);
// //           } else {
// //             reject('ไม่พบข้อมูลจังหวัด');
// //           }
// //         } else if (STATUS === '10' && ERROR_MESSAGES[0]) {
// //           dispatch({type: types.MASTER_DATA_GET_PROVINCE_LIST_ITEMS_FAIL});
// //           reject(ERROR_MESSAGES[0]);
// //         }
// //       })
// //       .catch((error) => {
// //         dispatch({type: types.MASTER_DATA_GET_PROVINCE_LIST_ITEMS_FAIL});
// //         reject(error.message);
// //       });
// //   });
// // };
// // export const getMasterDataDistricts = (id) => (dispatch, getState) => {
// //   return new Promise((resolve, reject) => {
// //     const customer = getState().customer;

// //     dispatch({type: types.MASTER_DATA_GET_DISTRICT_LIST_ITEMS_BY_PROVINCE_ID});

// //     getMasterDataDistrictsApi(customer.item.TEMP_CUS.PROVINCE)
// //       .then((v) => {
// //         const {RESULT_DATA, STATUS, ERROR_MESSAGES} = v;
// //         if (STATUS === '00') {
// //           const {RESULT} = RESULT_DATA;

// //           if (RESULT_DATA && RESULT && RESULT.length > 0) {
// //             dispatch({
// //               type:
// //                 types.MASTER_DATA_GET_DISTRICT_LIST_ITEMS_BY_PROVINCE_ID_SUCCESS,
// //               payload: RESULT,
// //             });
// //             resolve(v);
// //           } else {
// //             dispatch({
// //               type:
// //                 types.MASTER_DATA_GET_DISTRICT_LIST_ITEMS_BY_PROVINCE_ID_FAIL,
// //             });
// //             reject('ไม่พบข้อมูลเขต/อำเภอ');
// //           }
// //         } else if (STATUS === '10' && ERROR_MESSAGES[0]) {
// //           dispatch({
// //             type: types.MASTER_DATA_GET_DISTRICT_LIST_ITEMS_BY_PROVINCE_ID_FAIL,
// //           });
// //           reject(ERROR_MESSAGES[0]);
// //         }
// //       })
// //       .catch((error) => {
// //         dispatch({
// //           type: types.MASTER_DATA_GET_DISTRICT_LIST_ITEMS_BY_PROVINCE_ID_FAIL,
// //         });
// //         reject(error.message);
// //       });
// //   });
// // };

// // export const getMasterDataSubDistricts = (id) => (dispatch, getState) => {
// //   return new Promise((resolve, reject) => {
// //     const customer = getState().customer;

// //     dispatch({
// //       type: types.MASTER_DATA_GET_SUB_DISTRICT_LIST_ITEMS_BY_DISTRICT_ID,
// //     });

// //     getMasterDataSubDistrictsApi(customer.item.TEMP_CUS.ADDRESS3)
// //       .then((v) => {
// //         const {RESULT_DATA, STATUS, ERROR_MESSAGES} = v;

// //         if (STATUS === '00') {
// //           const {RESULT} = RESULT_DATA;
// //           console.log('RESULT ', RESULT);
// //           if (RESULT_DATA && RESULT && RESULT.length > 0) {
// //             dispatch({
// //               type:
// //                 types.MASTER_DATA_GET_SUB_DISTRICT_LIST_ITEMS_BY_DISTRICT_ID_SUCCESS,
// //               payload: RESULT,
// //             });
// //             resolve(v);
// //           } else {
// //             dispatch({
// //               type:
// //                 types.MASTER_DATA_GET_SUB_DISTRICT_LIST_ITEMS_BY_DISTRICT_ID_FAIL,
// //             });
// //             reject('ไม่พบข้อมูลแขวง/ตำบล');
// //           }
// //         } else if (STATUS === '10' && ERROR_MESSAGES[0]) {
// //           dispatch({
// //             type:
// //               types.MASTER_DATA_GET_SUB_DISTRICT_LIST_ITEMS_BY_DISTRICT_ID_FAIL,
// //           });
// //           reject(ERROR_MESSAGES[0]);
// //         }
// //       })
// //       .catch((error) => {
// //         dispatch({
// //           type:
// //             types.MASTER_DATA_GET_SUB_DISTRICT_LIST_ITEMS_BY_DISTRICT_ID_FAIL,
// //         });
// //         reject(error.message);
// //       });
// //   });
// // };

// export const setProvinceListItems = (items) => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     dispatch({type: types.MASTER_DATA_SET_PROVINCE_LIST_ITEMS, payload: items});
//     resolve();
//   });
// };

// export const setDistrictListItems = (items) => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     dispatch({type: types.MASTER_DATA_SET_DISTRICT_LIST_ITEMS, payload: items});
//     resolve();
//   });
// };

// export const setSubDistrictListItems = (items) => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     dispatch({
//       type: types.MASTER_DATA_SET_SUB_DISTRICT_LIST_ITEMS,
//       payload: items,
//     });
//     resolve();
//   });
// };

// export const getMasterDataBankAccounts = () => (dispatch) => {
//   //console.log("types.MASTER_DATA_GET_BANK_ACCOUNTS")
//   return new Promise((resolve, reject) => {
//     dispatch({type: types.MASTER_DATA_GET_BANK_ACCOUNTS});
//     getMasterDataBankAccountsApi()
//       .then((v) => {
//         const {RESULT_DATA, STATUS, ERROR_MESSAGES} = v;
//         if (STATUS === '00') {
//           const {RESULT} = RESULT_DATA;
//           if (RESULT_DATA && RESULT && RESULT.length > 0) {
//             dispatch({
//               type: types.MASTER_DATA_GET_BANK_ACCOUNTS_SUCCESS,
//               payload: RESULT,
//             });
//             resolve(v);
//           } else {
//             reject('ไม่พบข้อมูลบัญชีธนาคาร');
//           }
//         } else if (STATUS === '10' && ERROR_MESSAGES[0]) {
//           reject(ERROR_MESSAGES[0]);
//         }
//       })
//       .catch((error) => {
//         reject(error.message);
//       });
//   });
// };

// export const getMasterDataWareLocations = () => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     dispatch({type: types.MASTER_DATA_GET_WARE_LOCATIONS});
//     getMasterDataWareLocationsApi()
//       .then((v) => {
//         const {RESULT_DATA, STATUS, ERROR_MESSAGES} = v;
//         if (STATUS === '00') {
//           const {RESULT} = RESULT_DATA;
//           if (RESULT_DATA && RESULT && RESULT.length > 0) {
//             dispatch({
//               type: types.MASTER_DATA_GET_WARE_LOCATIONS_SUCCESS,
//               payload: RESULT,
//             });
//             resolve(v);
//           } else {
//             reject(
//               'ไม่พบข้อมูลจุดรับสินค้า\nโปรดระบุจุดรับสินค้าที่โปรแกรม Data4van ก่อน',
//             );
//           }
//         } else if (STATUS === '10' && ERROR_MESSAGES[0]) {
//           reject(ERROR_MESSAGES[0]);
//         }
//       })
//       .catch((error) => {
//         reject(error.message);
//       });
//   });
// };





// import SQLite from 'react-native-sqlite-2';
// import {
//   getMasterDataBankAccountsApi,
//   getMasterDataSurveyFormApi,
//   getMasterDataWareLocationsApi,
//   searchMasterDataBankFileListApi,
//   searchMasterDataVanVisRListApi
// } from '../api/masterData';
// import * as types from '../constant/masterData';

// const PROVINCES_DB_NAME = 'provinces.db';
// const PROVINCES_DB_VERSION = '1.0';
// const PROVINCES_DB_DISPLAY_NAME = 'Provinces Database';
// const PROVINCES_DB_SIZE = 1;

// let provincesDb = null;

// const getProvincesDb = () => {
//   if (!provincesDb) {
//     provincesDb = SQLite.openDatabase(
//       PROVINCES_DB_NAME,
//       PROVINCES_DB_VERSION,
//       PROVINCES_DB_DISPLAY_NAME,
//       PROVINCES_DB_SIZE,
//     );
//   }
//   return provincesDb;
// };

// const normalizeDbError = (error) => {
//   if (!error) {
//     return new Error('Unknown SQLite error');
//   }

//   if (error instanceof Error) {
//     return error;
//   }

//   if (typeof error === 'string') {
//     return new Error(error);
//   }

//   if (error.message) {
//     return new Error(error.message);
//   }

//   return new Error(JSON.stringify(error));
// };

// const mapRows = (result) => {
//   const rows = [];
//   for (let i = 0; i < result.rows.length; i += 1) {
//     rows.push(result.rows.item(i));
//   }
//   return rows;
// };

// const executeSelect = (sql, params = []) =>
//   new Promise((resolve, reject) => {
//     try {
//       const db = getProvincesDb();

//       db.transaction(
//         (tx) => {
//           tx.executeSql(
//             sql,
//             params,
//             (_tx, result) => {
//               resolve(mapRows(result));
//             },
//             (_tx, error) => {
//               reject(normalizeDbError(error));
//               return false;
//             },
//           );
//         },
//         (error) => {
//           reject(normalizeDbError(error));
//         },
//       );
//     } catch (error) {
//       reject(normalizeDbError(error));
//     }
//   });

// export const setInitialState = () => (dispatch) => {
//   dispatch({type: types.MASTER_DATA_INITIAL_STATE});
// };

// export const clearMasterBankFileList = () => (dispatch) => {
//   return new Promise((resolve) => {
//     dispatch({type: types.MASTER_DATA_CLEAR_BANK_FILE_LIST});
//     resolve();
//   });
// };

// export const searchMasterDataBankFileList = (GUID) => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     dispatch({type: types.MASTER_DATA_SEARCH_BANK_FILE_LIST});
//     searchMasterDataBankFileListApi(GUID)
//       .then((v) => {
//         const {ResponseData, ResponseCode, ReasonString} = v;
//         const responseData = JSON.parse(ResponseData);

//         if (ResponseCode === '200') {
//           const RESULT = responseData.Bk000201;

//           if (ResponseData && RESULT && RESULT.length > 0) {
//             dispatch({
//               type: types.MASTER_DATA_SEARCH_BANK_FILE_LIST_SUCCESS,
//               payload: RESULT,
//             });
//             resolve(v);
//           } else {
//             reject('ไม่พบข้อมูลธนาคาร');
//           }
//         } else if (ResponseCode === '10' && ReasonString[0]) {
//           reject(ReasonString[0]);
//         } else {
//           reject('เกิดข้อผิดพลาดในการค้นหาข้อมูลธนาคาร');
//         }
//       })
//       .catch((error) => {
//         reject(error.message);
//       });
//   });
// };

// export const searchMasterDataVanVisRList = () => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     dispatch({type: types.MASTER_DATA_SEARCH_VANVISR_LIST});

//     searchMasterDataVanVisRListApi()
//       .then((v) => {
//         const {RESULT_DATA, STATUS, ERROR_MESSAGES} = v;
//         if (STATUS === '00') {
//           const {RESULT} = RESULT_DATA;
//           if (RESULT_DATA && RESULT && RESULT.length > 0) {
//             dispatch({
//               type: types.MASTER_DATA_SEARCH_VANVISR_LIST_SUCCESS,
//               payload: RESULT,
//             });
//             resolve(v);
//           } else {
//             reject('ไม่พบข้อมูลเหตุผลการเยี่ยม');
//           }
//         } else if (STATUS === '10' && ERROR_MESSAGES[0]) {
//           reject(ERROR_MESSAGES[0]);
//         } else {
//           reject('เกิดข้อผิดพลาดในการค้นหาข้อมูลเหตุผลการเยี่ยม');
//         }
//       })
//       .catch((error) => {
//         reject(error.message);
//       });
//   });
// };

// export const getMasterDataSurveyForm = () => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     dispatch({type: types.MASTER_DATA_GET_SURVEY_FORM});

//     getMasterDataSurveyFormApi()
//       .then((v) => {
//         const {RESULT_DATA, STATUS, ERROR_MESSAGES} = v;
//         if (STATUS === '00') {
//           const {SVF_QUESTIONS} = RESULT_DATA;
//           if (RESULT_DATA && SVF_QUESTIONS && SVF_QUESTIONS.length > 0) {
//             dispatch({
//               type: types.MASTER_DATA_GET_SURVEY_FORM_SUCCESS,
//               payload: RESULT_DATA,
//             });
//             resolve(v);
//           } else {
//             reject('ไม่พบข้อมูลแบบสำรวจ');
//           }
//         } else if (STATUS === '10' && ERROR_MESSAGES[0]) {
//           reject(ERROR_MESSAGES[0]);
//         } else {
//           reject('เกิดข้อผิดพลาดในการดึงข้อมูลแบบสำรวจ');
//         }
//       })
//       .catch((error) => {
//         reject(error.message);
//       });
//   });
// };

// export const getMasterDataProvinces = () => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     dispatch({type: types.MASTER_DATA_GET_PROVINCE_LIST_ITEMS});

//     executeSelect('SELECT * FROM Provinces')
//       .then((rows) => {
//         if (rows && rows.length > 0) {
//           dispatch({
//             type: types.MASTER_DATA_GET_PROVINCE_LIST_ITEMS_SUCCESS,
//             payload: rows,
//           });
//           resolve(rows);
//         } else {
//           reject('ไม่พบข้อมูลจังหวัด');
//         }
//       })
//       .catch((error) => {
//         reject(error.message || 'เกิดข้อผิดพลาดในการอ่านข้อมูลจังหวัด');
//       });
//   });
// };

// export const getMasterDataDistricts = (id) => (dispatch, getState) => {
//   return new Promise((resolve, reject) => {
//     const customer = getState().customer;
//     const provinceId = customer?.item?.TEMP_CUS?.PROVINCE;

//     dispatch({type: types.MASTER_DATA_GET_DISTRICT_LIST_ITEMS_BY_PROVINCE_ID});

//     executeSelect('SELECT * FROM Districts WHERE ProvinceId = ?', [provinceId])
//       .then((rows) => {
//         if (rows && rows.length > 0) {
//           dispatch({
//             type:
//               types.MASTER_DATA_GET_DISTRICT_LIST_ITEMS_BY_PROVINCE_ID_SUCCESS,
//             payload: rows,
//           });
//           resolve(rows);
//         } else {
//           reject('ไม่พบข้อมูลเขต/อำเภอ');
//         }
//       })
//       .catch((error) => {
//         reject(error.message || 'เกิดข้อผิดพลาดในการอ่านข้อมูลเขต/อำเภอ');
//       });
//   });
// };

// export const getMasterDataSubDistricts = (id) => (dispatch, getState) => {
//   return new Promise((resolve, reject) => {
//     const customer = getState().customer;
//     const districtId = customer?.item?.TEMP_CUS?.ADDRESS3;

//     dispatch({
//       type: types.MASTER_DATA_GET_SUB_DISTRICT_LIST_ITEMS_BY_DISTRICT_ID,
//     });

//     executeSelect('SELECT * FROM SubDistricts WHERE DistrictId = ?', [districtId])
//       .then((rows) => {
//         if (rows && rows.length > 0) {
//           dispatch({
//             type:
//               types.MASTER_DATA_GET_SUB_DISTRICT_LIST_ITEMS_BY_DISTRICT_ID_SUCCESS,
//             payload: rows,
//           });
//           resolve(rows);
//         } else {
//           dispatch({
//             type:
//               types.MASTER_DATA_GET_SUB_DISTRICT_LIST_ITEMS_BY_DISTRICT_ID_FAIL,
//           });
//           reject('ไม่พบข้อมูลแขวง/ตำบล');
//         }
//       })
//       .catch((error) => {
//         dispatch({
//           type:
//             types.MASTER_DATA_GET_SUB_DISTRICT_LIST_ITEMS_BY_DISTRICT_ID_FAIL,
//         });
//         reject(error.message || 'เกิดข้อผิดพลาดในการอ่านข้อมูลแขวง/ตำบล');
//       });
//   });
// };

// export const setProvinceListItems = (items) => (dispatch) => {
//   return new Promise((resolve) => {
//     dispatch({type: types.MASTER_DATA_SET_PROVINCE_LIST_ITEMS, payload: items});
//     resolve();
//   });
// };

// export const setDistrictListItems = (items) => (dispatch) => {
//   return new Promise((resolve) => {
//     dispatch({type: types.MASTER_DATA_SET_DISTRICT_LIST_ITEMS, payload: items});
//     resolve();
//   });
// };

// export const setSubDistrictListItems = (items) => (dispatch) => {
//   return new Promise((resolve) => {
//     dispatch({
//       type: types.MASTER_DATA_SET_SUB_DISTRICT_LIST_ITEMS,
//       payload: items,
//     });
//     resolve();
//   });
// };

// export const getMasterDataBankAccounts = () => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     dispatch({type: types.MASTER_DATA_GET_BANK_ACCOUNTS});
//     getMasterDataBankAccountsApi()
//       .then((v) => {
//         const {RESULT_DATA, STATUS, ERROR_MESSAGES} = v;
//         if (STATUS === '00') {
//           const {RESULT} = RESULT_DATA;
//           if (RESULT_DATA && RESULT && RESULT.length > 0) {
//             dispatch({
//               type: types.MASTER_DATA_GET_BANK_ACCOUNTS_SUCCESS,
//               payload: RESULT,
//             });
//             resolve(v);
//           } else {
//             reject('ไม่พบข้อมูลบัญชีธนาคาร');
//           }
//         } else if (STATUS === '10' && ERROR_MESSAGES[0]) {
//           reject(ERROR_MESSAGES[0]);
//         } else {
//           reject('เกิดข้อผิดพลาดในการดึงข้อมูลบัญชีธนาคาร');
//         }
//       })
//       .catch((error) => {
//         reject(error.message);
//       });
//   });
// };

// export const getMasterDataWareLocations = () => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     dispatch({type: types.MASTER_DATA_GET_WARE_LOCATIONS});
//     getMasterDataWareLocationsApi()
//       .then((v) => {
//         const {RESULT_DATA, STATUS, ERROR_MESSAGES} = v;
//         if (STATUS === '00') {
//           const {RESULT} = RESULT_DATA;
//           if (RESULT_DATA && RESULT && RESULT.length > 0) {
//             dispatch({
//               type: types.MASTER_DATA_GET_WARE_LOCATIONS_SUCCESS,
//               payload: RESULT,
//             });
//             resolve(v);
//           } else {
//             reject(
//               'ไม่พบข้อมูลจุดรับสินค้า\nโปรดระบุจุดรับสินค้าที่โปรแกรม Data4van ก่อน',
//             );
//           }
//         } else if (STATUS === '10' && ERROR_MESSAGES[0]) {
//           reject(ERROR_MESSAGES[0]);
//         } else {
//           reject('เกิดข้อผิดพลาดในการดึงข้อมูลจุดรับสินค้า');
//         }
//       })
//       .catch((error) => {
//         reject(error.message);
//       });
//   });
// };
