import axios from 'axios';
import moment from 'moment';
import * as appConfig from '../../../appConfig';
import { buildDueDateFromCreditTerm } from '../../utils/customerDueDate';
import { getLoginGuID, getSettingConfig } from '../../utils/Token';
import type {
  ApplyCustomerCreditTermParam,
  CustomerCreditTermAsset,
  CustomerCreditTermRow,
  CustomerDueDateResult,
  DocumentSwitchSettingsResponseData,
  DocumentSwitchSettingsRow,
  FetchCustomerCreditTermsParam,
  FetchCustomerCreditTermsResponseData,
  FetchCustomerDueDateParam,
  FetchDocumentSwitchSettingsParam,
  LookupErpResponse,
} from './param';

const LOOKUP_ERP_ENDPOINT = '/LookupErp';
const READ_ERP_ENDPOINT = '/ReadErp';
const UPDATE_ERP_ENDPOINT = '/UpdateErp';

const buildServiceBaseUrl = (baseUrl?: string | null) => {
  const normalizedBaseUrl = String(baseUrl || '').trim().replace(/\/+$/, '');

  if (!normalizedBaseUrl) {
    throw new Error('ไม่พบ baseUrl จาก SettingConfig');
  }

  return normalizedBaseUrl;
};

const buildLookupErpUrl = (baseUrl?: string | null) =>
  `${buildServiceBaseUrl(baseUrl)}${LOOKUP_ERP_ENDPOINT}`;

const buildReadErpUrl = (baseUrl?: string | null) =>
  `${buildServiceBaseUrl(baseUrl)}${READ_ERP_ENDPOINT}`;

const buildUpdateErpUrl = (baseUrl?: string | null) =>
  `${buildServiceBaseUrl(baseUrl)}${UPDATE_ERP_ENDPOINT}`;

const parseLookupErpResponseData = <T>(
  response?: LookupErpResponse | null,
): T | null => {
  if (!response?.ResponseData) {
    return null;
  }

  if (typeof response.ResponseData === 'string') {
    try {
      return JSON.parse(response.ResponseData) as T;
    } catch (error) {
      console.log('[LookupErpServices] parse ResponseData failed', error);
      return null;
    }
  }

  return response.ResponseData as T;
};

const logLookupErpError = (logPrefix: string, error: any) => {
  console.log(`${logPrefix} error`, {
    message: error?.message,
    status: error?.response?.status,
    response: error?.response?.data,
  });
};

const assertErpResponseOk = (
  response: LookupErpResponse<unknown> | null | undefined,
  logPrefix: string,
) => {
  const responseCode = response?.ResponseCode;
  const isOk =
    responseCode === undefined ||
    responseCode === 200 ||
    responseCode === '200';

  if (isOk) {
    return;
  }

  const reason =
    response?.ReasonString ??
    (response as { ResponseMessage?: string })?.ResponseMessage ??
    'unknown';

  console.log(`${logPrefix} ERP ResponseCode not OK`, {
    ResponseCode: responseCode,
    ReasonString: reason,
    response,
  });

  throw new Error(
    `${logPrefix} ERP ResponseCode=${String(responseCode)}: ${reason}`,
  );
};

const postLookupErpRequest = async <T>(
  url: string,
  bodyRequest: Record<string, unknown>,
  logPrefix: string,
) => {
  const loginGuid = await getLoginGuID();

  console.log(`${logPrefix} request url`, url);
  console.log(`${logPrefix} request body`, JSON.stringify(bodyRequest));

  try {
    const response = await axios.post<LookupErpResponse<T>>(url, bodyRequest, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-erp-login-guid': loginGuid ?? '',
      },
    });

    console.log(`${logPrefix} raw response`, JSON.stringify(response?.data));
    assertErpResponseOk(response?.data, logPrefix);

    return response?.data ?? {};
  } catch (error: any) {
    logLookupErpError(logPrefix, error);
    throw error;
  }
};

export const parseDocumentSwitchResponse = (
  response?: LookupErpResponse | null,
): DocumentSwitchSettingsResponseData | null =>
  parseLookupErpResponseData<DocumentSwitchSettingsResponseData>(response);

export const extractDocumentSwitchRows = (
  responseData?: DocumentSwitchSettingsResponseData | null,
): DocumentSwitchSettingsRow[] => {
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
  return Array.isArray(firstArray)
    ? (firstArray as DocumentSwitchSettingsRow[])
    : [];
};

const logDocumentSwitchResponse = (response?: LookupErpResponse | null) => {
  const parsedResponseData = parseDocumentSwitchResponse(response);
  const rows = extractDocumentSwitchRows(parsedResponseData);
  const firstRow = rows[0] ?? null;

  console.log(
    '[fetchDocumentSwitchSettings] parsed ResponseData',
    JSON.stringify(parsedResponseData),
  );
  console.log(
    '[fetchDocumentSwitchSettings] firstRow keys',
    Object.keys(firstRow ?? {}),
  );
  console.log(
    '[fetchDocumentSwitchSettings] firstRow',
    JSON.stringify(firstRow),
  );
};

export const fetchDocumentSwitchSettings = async (
  _params?: FetchDocumentSwitchSettingsParam,
) => {
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

    console.log('[fetchDocumentSwitchSettings] request url', url);
    console.log(
      '[fetchDocumentSwitchSettings] request body',
      JSON.stringify(bodyRequest),
    );

    const response = await axios.post<LookupErpResponse>(url, bodyRequest, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-erp-login-guid': loginGuid ?? '',
      },
    });

    console.log(
      '[fetchDocumentSwitchSettings] raw response',
      JSON.stringify(response?.data),
    );
    logDocumentSwitchResponse(response?.data);

    return response?.data ?? {};
  } catch (error: any) {
    console.log('[fetchDocumentSwitchSettings] error', {
      message: error?.message,
      status: error?.response?.status,
      response: error?.response?.data,
    });
    throw error;
  }
};

export const fetchCustomerCreditTermsByArKey = async (
  params: FetchCustomerCreditTermsParam,
) => {
  try {
    const loginGuid = await getLoginGuID();
    const settingConfig = await getSettingConfig();
    const url = buildReadErpUrl(settingConfig?.baseUrl);
    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': loginGuid,
      'BPAPUS-FUNCTION': 'READARCDBYARKEY',
      'BPAPUS-PARAM': JSON.stringify(params),
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    const response = await postLookupErpRequest<FetchCustomerCreditTermsResponseData>(
      url,
      bodyRequest,
      '[fetchCustomerCreditTermsByArKey]',
    );
    const parsed =
      parseLookupErpResponseData<FetchCustomerCreditTermsResponseData>(
        response,
      );
    const rows = parsed?.READARCDBYARKEY ?? [];

    console.log(
      '[fetchCustomerCreditTermsByArKey] parsed ResponseData',
      JSON.stringify(parsed),
    );
    console.log(
      '[fetchCustomerCreditTermsByArKey] firstRow',
      JSON.stringify(rows[0] ?? null),
    );

    return {
      response,
      parsed,
      rows,
      firstRow: rows[0] ?? null,
    };
  } catch (error: any) {
    logLookupErpError('[fetchCustomerCreditTermsByArKey]', error);
    throw error;
  }
};

export const applyCustomerCreditTermByKey = async (
  params: ApplyCustomerCreditTermParam,
) => {
  try {
    const loginGuid = await getLoginGuID();
    const settingConfig = await getSettingConfig();
    const url = buildUpdateErpUrl(settingConfig?.baseUrl);
    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': loginGuid,
      'BPAPUS-FUNCTION': 'SetAsArcdKey',
      'BPAPUS-PARAM': JSON.stringify(params),
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    const response = await postLookupErpRequest<CustomerCreditTermAsset>(
      url,
      bodyRequest,
      '[applyCustomerCreditTermByKey]',
    );
    const asset = parseLookupErpResponseData<CustomerCreditTermAsset>(response);

    console.log(
      '[applyCustomerCreditTermByKey] parsed ResponseData',
      JSON.stringify(asset),
    );
    console.log(
      '[applyCustomerCreditTermByKey] ARCD_DUE_DATE',
      asset?.ARCD_DUE_DATE ?? null,
    );

    return {
      response,
      asset,
    };
  } catch (error: any) {
    logLookupErpError('[applyCustomerCreditTermByKey]', error);
    throw error;
  }
};

const selectDefaultCustomerCreditTerm = (
  rows: CustomerCreditTermRow[],
): CustomerCreditTermRow | null => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  return (
    rows.find(row => String(row?.ARCD_DEFAULT ?? '').toUpperCase() === 'Y') ??
    rows[0] ??
    null
  );
};

export const fetchCustomerDueDateFromErp = async (
  params: FetchCustomerDueDateParam,
): Promise<CustomerDueDateResult> => {
  const arKey = String(params?.arKey ?? '').trim();
  const arcdDate =
    String(params?.arcdDate ?? '').trim() || moment().format('YYYYMMDD');

  console.log('[fetchCustomerDueDateFromErp] start', { arKey, arcdDate });

  try {
    if (!arKey) {
      throw new Error('ไม่พบ AR_KEY สำหรับดึงวันครบกำหนด');
    }

    console.log('[fetchCustomerDueDateFromErp] step 1 READARCDBYARKEY', {
      arKey,
      arcdDate,
    });

    const readResult = await fetchCustomerCreditTermsByArKey({
      AR_KEY: arKey,
      ARCD_DATE: arcdDate,
      ARCD_DEFAULT: 'Y',
    });
    const arCondition = selectDefaultCustomerCreditTerm(readResult.rows);
    const arcdKey = arCondition?.ARCD_KEY;

    if (!arcdKey) {
      console.log('[fetchCustomerDueDateFromErp] no ARCD_KEY', {
        arKey,
        arcdDate,
        rowCount: readResult.rows?.length ?? 0,
        rows: readResult.rows,
        erpResponse: readResult.response,
      });
      throw new Error(
        'ไม่พบข้อตกลงลูกหนี้ (ARCD_KEY) จาก READARCDBYARKEY',
      );
    }

    console.log('[fetchCustomerDueDateFromErp] step 2 SetAsArcdKey', {
      arKey,
      arcdDate,
      ARCD_KEY: arcdKey,
    });

    const setResult = await applyCustomerCreditTermByKey({
      ARCD_KEY: arcdKey,
      ARCD_DATE: arcdDate,
    });
    const asset = setResult.asset ?? null;
    const dueDate = buildDueDateFromCreditTerm(
      asset?.ARCD_DUE_DATE,
      arcdDate,
    );

    console.log('[fetchCustomerDueDateFromErp] final dueDate', {
      arKey,
      arcdDate,
      ARCD_KEY: arcdKey,
      ARCD_DUE_DATE: asset?.ARCD_DUE_DATE ?? null,
      dueDate,
    });

    return {
      arCondition,
      asset,
      dueDate,
    };
  } catch (error: any) {
    logLookupErpError('[fetchCustomerDueDateFromErp]', error);
    throw error;
  }
};
