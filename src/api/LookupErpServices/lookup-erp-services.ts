import axios from 'axios';
import * as appConfig from '../../../appConfig';
import { getLoginGuID, getSettingConfig } from '../../utils/Token';
import type {
  DocSwitchResponseData,
  DocSwitchRow,
  getDocSwitchParam,
  LookupErpResponse,
} from './param';

const LOOKUP_ERP_ENDPOINT = '/LookupErp';

const buildLookupErpUrl = (baseUrl?: string | null) => {
  const normalizedBaseUrl = String(baseUrl || '').trim().replace(/\/+$/, '');

  if (!normalizedBaseUrl) {
    throw new Error('ไม่พบ baseUrl จาก SettingConfig');
  }

  return `${normalizedBaseUrl}${LOOKUP_ERP_ENDPOINT}`;
};

export const parseDocSwitchResponseData = (
  response?: LookupErpResponse | null,
): DocSwitchResponseData | null => {
  if (!response?.ResponseData) {
    return null;
  }

  if (typeof response.ResponseData === 'string') {
    try {
      return JSON.parse(response.ResponseData) as DocSwitchResponseData;
    } catch (error) {
      console.log('[getDocSwitch] parse ResponseData failed', error);
      return null;
    }
  }

  return response.ResponseData as DocSwitchResponseData;
};

export const getDocSwitchRows = (
  responseData?: DocSwitchResponseData | null,
): DocSwitchRow[] => {
  if (!responseData || typeof responseData !== 'object') {
    return [];
  }

  if (Array.isArray(responseData.Sy000500)) {
    return responseData.Sy000500;
  }

  if (Array.isArray(responseData.DOCSWITCH_TABLE)) {
    return responseData.DOCSWITCH_TABLE;
  }

  const firstArray = Object.values(responseData).find(Array.isArray);
  return Array.isArray(firstArray) ? (firstArray as DocSwitchRow[]) : [];
};

const logDocSwitchResponse = (response?: LookupErpResponse | null) => {
  const parsedResponseData = parseDocSwitchResponseData(response);
  const rows = getDocSwitchRows(parsedResponseData);
  const firstRow = rows[0] ?? null;

  console.log(
    '[getDocSwitch] parsed ResponseData',
    JSON.stringify(parsedResponseData),
  );
  console.log('[getDocSwitch] firstRow keys', Object.keys(firstRow ?? {}));
  console.log('[getDocSwitch] firstRow', JSON.stringify(firstRow));
};

export const getDocSwitch = async (_params?: getDocSwitchParam) => {
  try {
    const loginGuid = await getLoginGuID();
    const settingConfig = await getSettingConfig();
    const baseUrl = settingConfig?.baseUrl;
    const url = buildLookupErpUrl(baseUrl);

    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': loginGuid,
      'BPAPUS-FUNCTION': 'Sy000500',
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    console.log('[getDocSwitch] request url', url);
    console.log('[getDocSwitch] request body', JSON.stringify(bodyRequest));

    const response = await axios.post<LookupErpResponse>(url, bodyRequest, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-erp-login-guid': loginGuid ?? '',
      },
    });

    console.log('[getDocSwitch] raw response', JSON.stringify(response?.data));
    logDocSwitchResponse(response?.data);

    return response?.data ?? {};
  } catch (error: any) {
    console.log('[getDocSwitch] error', {
      message: error?.message,
      status: error?.response?.status,
      response: error?.response?.data,
    });
    throw error;
  }
};
