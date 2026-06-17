import { VanSalesBaseUrl } from './vansales-services';
import { getLoginGuID, getVanSalesWebServiceUrl } from '../../utils/Token';
import { normalizePaymentBaseUrl } from '../../utils/webService';
import axios from 'axios';
import * as appConfig from '../../../appConfig';
import { customerReportPerformanceParam } from './param-request';

export const customerReportPerformance = async (
  critial: customerReportPerformanceParam,
) => {
  try {
    const storedBaseUrl = await getVanSalesWebServiceUrl();
    const loginGuid = await getLoginGuID();

    const normalizedBaseUrl = normalizePaymentBaseUrl(storedBaseUrl);

    if (!normalizedBaseUrl) {
      throw new Error('ไม่พบ VanSalesServicesBaseUrl');
    }

    const url =
      VanSalesBaseUrl(normalizedBaseUrl) +
      'erp/reports/customer-line-performance';
    console.log('urlAAA', url);

    const response = await axios.post(url, critial, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'x-erp-login-guid': loginGuid ?? '',
      },
    });
    console.log('response.data', response.data);

    return response.data;
  } catch (error: any) {
    console.log('[VanSalesServices] customerReportPerformance failed', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    throw error;
  }
};
