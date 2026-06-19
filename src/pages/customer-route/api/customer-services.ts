import axios from 'axios';
import { getLoginGuID } from '../../../utils/Token';
import * as appConfig from '../../../../appConfig';

export type CustomerRouteBatchDetailParams = {
  arCodes: Array<string | number>;
};

const formatElapsedMs = (startedAt: number) => `${Date.now() - startedAt} ms`;

const formatResponseForLog = (payload: any) => {
  if (!payload?.ResponseData || typeof payload.ResponseData !== 'string') {
    return payload;
  }

  try {
    return {
      ...payload,
      ResponseData: JSON.parse(payload.ResponseData),
    };
  } catch (error) {
    return payload;
  }
};

const formatArrayResponseForLog = (payload: any) => {
  const formattedPayload = formatResponseForLog(payload);
  const responseData = formattedPayload?.ResponseData;

  if (!responseData || typeof responseData !== 'object') {
    return formattedPayload;
  }

  const arrayKey = Object.keys(responseData).find(key =>
    Array.isArray(responseData[key]),
  );

  if (!arrayKey) {
    return formattedPayload;
  }

  return {
    ...formattedPayload,
    ResponseData: {
      ...responseData,
      totalCount: Number(responseData.RECORD_COUNT || 0),
      currentRowCount: Array.isArray(responseData[arrayKey])
        ? responseData[arrayKey].length
        : 0,
      arrayKey,
      rows: responseData[arrayKey],
    },
  };
};

const buildArCodeInFilter = (arCodes: Array<string | number>) => {
  const normalizedCodes = arCodes
    .map(item => String(item ?? '').trim())
    .filter(Boolean);

  if (normalizedCodes.length === 0) {
    return '';
  }

  return `and AR_CODE in (${normalizedCodes.map(item => `'${item}'`).join(',')})`;
};

export const customerRouteBatchDetails = async (
  params: CustomerRouteBatchDetailParams,
) => {
  const apiStartedAt = Date.now();
  const loginGuid = await getLoginGuID();
  const filter = buildArCodeInFilter(params.arCodes);
  const baseUrl = String(appConfig.API_ENDPOINT_V3 || '').trim().replace(
    /\/+$/,
    '',
  );

  if (!baseUrl) {
    throw new Error('ไม่พบ API_ENDPOINT_V3');
  }

  const url = `${baseUrl}/LookupErp`;

  const bodyRequest = {
    'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': loginGuid,
    'BPAPUS-FUNCTION': 'Ar000131',
    'BPAPUS-PARAM': '',
    'BPAPUS-FILTER': filter,
    'BPAPUS-ORDERBY': '',
    'BPAPUS-OFFSET': '0',
    'BPAPUS-FETCH': '0',
  };

  console.log('[customer-route detail] request body', {
    url,
    arCodeCount: params.arCodes.length,
    arCodes: params.arCodes,
    bodyRequest,
  });

  try {
    const response = await axios.post(url, bodyRequest, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'x-erp-login-guid': loginGuid ?? '',
      },
    });

    console.log('[customer-route detail] api timing', {
      url,
      function: bodyRequest['BPAPUS-FUNCTION'],
      arCodeCount: params.arCodes.length,
      elapsedMs: Date.now() - apiStartedAt,
      elapsedText: formatElapsedMs(apiStartedAt),
      responseCode: response?.data?.ResponseCode,
    });
    console.log(
      '[customer-route detail] response json',
      formatArrayResponseForLog(response?.data),
    );
    return response.data;
  } catch (error: any) {
    console.log('[customer-route detail] api timing error', {
      url,
      function: bodyRequest['BPAPUS-FUNCTION'],
      arCodeCount: params.arCodes.length,
      elapsedMs: Date.now() - apiStartedAt,
      elapsedText: formatElapsedMs(apiStartedAt),
      message: error?.message,
      status: error?.response?.status,
      response: error?.response?.data,
      bodyRequest,
    });
    throw error;
  }
};
