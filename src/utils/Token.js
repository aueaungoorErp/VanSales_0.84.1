import DeviceInfo from 'react-native-device-info';
import { v4 as uuidv4 } from 'uuid';
import { getVanConfigV3Api } from '../api/setting';
import { removeData, retrieveData, storeData } from '../utils/Storage';

let _settingConfigVanTimeRefreshPromise = null;



export const getDeviceUniqeId = async () => {
  try {
    console.log('getDeviceUniqeId')
    /* Calling a function that is not defined in the code you posted. */
    let deviceId = await retrieveData('@mac');
    //deviceId = '02:00:00:00:00:00';

    if (
      (!deviceId || deviceId == '' || deviceId == '02:00:00:00:00:00') &&
      typeof DeviceInfo.getMACAddress === 'function'
    ) {
      deviceId = await DeviceInfo.getMACAddress();
    }

    if (!deviceId || deviceId == '' || deviceId == '02:00:00:00:00:00') {
      deviceId = DeviceInfo.getUniqueId();
    }

    if (!deviceId || deviceId == '' || deviceId == '02:00:00:00:00:00') {
      deviceId = uuidv4().toString();
    }

    await storeData('@mac', deviceId);

    return deviceId;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// export const getDeviceUniqeId = async () => {
//   try {
//     /* Calling a function that is not defined in the code you posted. */
//     let deviceId = null;

//     // console.log('getDeviceUniqeId getSavedDeviceUniqueId', deviceId);

//     if (!deviceId || deviceId == '') {
//       deviceId = await DeviceInfo.getMACAddress();
//       console.log('getDeviceUniqeId getMacAddress', deviceId);
//     }
//     if (!deviceId || deviceId == '') {
//       deviceId = DeviceInfo.getUniqueId();
//       console.log('getDeviceUniqeId getUniqueId', deviceId);
//     }
//     return deviceId;
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// };

export const saveListServiceSetting = async (list) => {
  try {
    return await storeData('@ListServiceSetting', JSON.stringify(list));
  } catch (e) {
    return null;
  }
};

export const getListServiceSetting = async () => {
  try {
    return JSON.parse(await retrieveData('@ListServiceSetting'));
  } catch (e) {
    return false;
  }
};

export const setUserToken = async (token) => {
  try {
    return await storeData('@UserToken', JSON.stringify(token));
  } catch (e) {
    return null;
  }
};

export const getUserToken = async () => {
  try {
    return JSON.parse(await retrieveData('@UserToken'));
  } catch (e) {
    return null;
  }
};

export const removeUserToken = async () => {
  try {
    return await removeData('@UserToken');
  } catch (e) {
    return false;
  }
};

export const setAccessTimeToken = async (token) => {
  try {
    return await storeData('@AccessTimeToken', token);
  } catch (e) {
    return false;
  }
};

export const getAccessTimeToken = async () => {
  try {
    return await retrieveData('@AccessTimeToken');
  } catch (e) {
    return false;
  }
};

export const setBluetoothToken = async (token) => {
  try {
    return await storeData('@BluetoothToken', JSON.stringify(token));
  } catch (e) {
    return false;
  }
};

export const getBluetoothToken = async () => {
  try {
    return JSON.parse(await retrieveData('@BluetoothToken'));
  } catch (e) {
    return false;
  }
};

export const removeBluetoothToken = async () => {
  try {
    return await removeData('@BluetoothToken');
  } catch (e) {
    return false;
  }
};

export const setSettingConfig = async (token) => {
  try {
    return await storeData('@SettingConfig', JSON.stringify(token));
  } catch (e) {
    return false;
  }
};
export const getSettingConfig = async () => {
  try {
    const tmp = await retrieveData('@SettingConfig');
    if (!tmp) {
      return false;
    }

    const parsed = JSON.parse(tmp);

    // Return cached config immediately to avoid blocking app startup.
    // Refresh VANCONFIG time windows in the background (best-effort).
    const VANCNF_MACHINE = parsed?.vanCNFMachine;
    if (VANCNF_MACHINE && !_settingConfigVanTimeRefreshPromise) {
      _settingConfigVanTimeRefreshPromise = (async () => {
        try {
          const response = await getVanConfigV3Api(VANCNF_MACHINE, {timeout: 5000});
          if (response && parsed?.VANCONFIG) {
            const updated = {
              ...parsed,
              VANCONFIG: {
                ...parsed.VANCONFIG,
                VANCNF_TIME_FM: response.VANCNF_TIME_FM,
                VANCNF_TIME_TO: response.VANCNF_TIME_TO,
              },
            };
            await storeData('@SettingConfig', JSON.stringify(updated));
          }
        } catch (e) {
          // Ignore refresh failures; cached config is still usable.
        } finally {
          _settingConfigVanTimeRefreshPromise = null;
        }
      })();
    }

    return parsed;
  } catch (e) {
    try {
      const tmp = await retrieveData('@SettingConfig');
      return tmp ? JSON.parse(tmp) : false;
    } catch (e2) {
      return false;
    }
  }
};

export const removeSettingConfig = async () => {
  try {
    return await removeData('@SettingConfig');
  } catch (e) {
    return false;
  }
};

export const setKTBSettingConfig = async (token) => {
  try {
    return await storeData('@KTBSettingConfig', JSON.stringify(token));
  } catch (e) {
    return false;
  }
};

export const getKTBSettingConfig = async () => {
  try {
    return JSON.parse(await retrieveData('@KTBSettingConfig'));
  } catch (e) {
    return false;
  }
};

export const removeKTBSettingConfig = async () => {
  try {
    return await removeData('@KTBSettingConfig');
  } catch (e) {
    return false;
  }
};

export const setWSv3SettingConfig = async (token) => {
  try {
    return await storeData('@WSv3SettingConfig', JSON.stringify(token));
  } catch (e) {
    return false;
  }
};

export const getWSv3SettingConfig = async () => {
  try {
    return JSON.parse(await retrieveData('@WSv3SettingConfig'));
  } catch (e) {
    return false;
  }
};

export const removeWSv3SettingConfig = async () => {
  try {
    return await removeData('@WSv3SettingConfig');
  } catch (e) {
    return false;
  }
};

export const setDeviceInfo = async (token) => {
  try {
    return await storeData('@DeviceInfo', JSON.stringify(token));
  } catch (e) {
    return false;
  }
};

export const getDeviceInfo = async () => {
  try {
    return JSON.parse(await retrieveData('@DeviceInfo'));
  } catch (e) {
    return false;
  }
};

export const removeDeviceInfo = async () => {
  try {
    return await removeData('@DeviceInfo');
  } catch (e) {
    return false;
  }
};

export const setPrintingType = async (token) => {
  try {
    return await storeData('@PrintingType', JSON.stringify(token));
  } catch (e) {
    return false;
  }
};

export const getPrintingType = async () => {
  try {
    return JSON.parse(await retrieveData('@PrintingType'));
  } catch (e) {
    return false;
  }
};

export const removePrintingType = async () => {
  try {
    return await removeData('@PrintingType');
  } catch (e) {
    return false;
  }
};

export const setLoginGuID = async (token) => {
  try {
    return await storeData('@LoginGuID', JSON.stringify(token));
  } catch (e) {
    return null;
  }
};

export const getLoginGuID = async () => {
  try {
    return JSON.parse(await retrieveData('@LoginGuID'));
  } catch (e) {
    return null;
  }
};

export const setLoginInfo = async (obj) => {
  try {
    return await storeData('@LoginInfo', JSON.stringify(obj));
  } catch (e) {
    return null;
  }
};

export const getLoginInfo = async () => {
  try {
    return JSON.parse(await retrieveData('@LoginInfo'));
  } catch (e) {
    return null;
  }
};
export const removeLoginInfo = async () => {
  try {
    return await removeData('@LoginInfo');
  } catch (e) {
    return false;
  }
};
