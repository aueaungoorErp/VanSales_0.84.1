import axios from 'axios';
import * as appConfig from '../../../appConfig';
import { getVanSalesWebServiceUrl, getLoginGuID } from '../../utils/Token';
import { normalizePaymentBaseUrl } from '../../utils/webService';
import type { updateVanPositionParam } from './param-request';
const VanSalesBaseUrl = (baseUrl: string) =>
  `${baseUrl}/api/${appConfig.ApiVersion}/`;

export const updateVanPosition = async (critial: updateVanPositionParam) => {
  try {
    const storedBaseUrl = await getVanSalesWebServiceUrl();
    const loginGuid = await getLoginGuID();
    const normalizedBaseUrl = normalizePaymentBaseUrl(storedBaseUrl);

    if (!normalizedBaseUrl) {
      throw new Error('ไม่พบ VanSalesServicesBaseUrl');
    }

    const url = VanSalesBaseUrl(normalizedBaseUrl) + 'vehicle-locations';

    console.log('requestPayload', critial);
    console.log('baseUrlaaa', url, loginGuid);

    const response = await axios.post(url, critial, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'x-erp-login-guid': loginGuid ?? '',
      },
    });

    console.log('responseaaa', response);

    return response.data;
  } catch (error: any) {
    console.log('[VanSalesServices] updateVanPosition failed', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    throw error;
  }
};
