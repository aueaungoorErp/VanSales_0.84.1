import axios from 'axios';
import * as appConfig from '../../appConfig';
import { BPAPUS_FUNCTION_DOCSWITCH } from '../constant/bPlusApi';
import { getLoginGuID, getSettingConfig } from '../utils/Token';

const LOOKUP_ERP_ENDPOINT = '/LookupErp';

const buildLookupErpUrl = baseUrl => {
  const normalizedBaseUrl = String(baseUrl || '').trim().replace(/\/+$/, '');

  if (!normalizedBaseUrl) {
    throw new Error('ไม่พบ baseUrl จาก SettingConfig');
  }

  return `${normalizedBaseUrl}${LOOKUP_ERP_ENDPOINT}`;
};

export const getDocSwitch = async () => {
  try {
    const loginGuid = await getLoginGuID();
    const settingConfig = await getSettingConfig();
    const baseUrl = settingConfig?.baseUrl;

    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': loginGuid,
      'BPAPUS-FUNCTION': BPAPUS_FUNCTION_DOCSWITCH,
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    const url = buildLookupErpUrl(baseUrl);

    console.log('[getDocSwitch] request url', url);
    console.log('[getDocSwitch] request body', JSON.stringify(bodyRequest));

    const response = await axios.post(url, bodyRequest, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-erp-login-guid': loginGuid ?? '',
      },
    });

    console.log('[getDocSwitch] raw response', JSON.stringify(response?.data));

    return response?.data;
  } catch (error) {
    console.log('[getDocSwitch] error', {
      message: error?.message,
      status: error?.response?.status,
      response: error?.response?.data,
    });
    throw error;
  }
};
