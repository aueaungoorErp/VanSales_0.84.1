import { VanSalesBaseUrl } from './vansales-services';
import { getLoginGuID, getVanSalesWebServiceUrl } from '../../utils/Token';
import { normalizePaymentBaseUrl } from '../../utils/webService';
import axios from 'axios';
import * as appConfig from '../../../appConfig';
import {
  customerReportPerformanceParam,
  productCategoryReportPerformanceParam,
  salesSummaryByDocumentParam,
  salespersonSalesPerformanceParam,
  stockBalanceByLocationParam,
} from './param-request';

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

export const productCategoryReportPerformance = async (
  critial: productCategoryReportPerformanceParam,
) => {
  try {
    const storedBaseUrl = await getVanSalesWebServiceUrl();
    const loginGuid = await getLoginGuID();
    console.log('loginGuid', loginGuid);
    const normalizedBaseUrl = normalizePaymentBaseUrl(storedBaseUrl);

    if (!normalizedBaseUrl) {
      throw new Error('ไม่พบ VanSalesServicesBaseUrl');
    }

    const url =
      VanSalesBaseUrl(normalizedBaseUrl) +
      'erp/reports/product-category-performance';

    console.log('urlaaa', url);

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
    console.log('[VanSalesServices] productCategoryReportPerformance failed', {
      message: error?.message,
    });
    throw error;
  }
};

export const salesSummaryByDocument = async (
  critial: salesSummaryByDocumentParam,
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
      'erp/reports/sales-summary-by-document';

    const response = await axios.post(url, critial, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'x-erp-login-guid': loginGuid ?? '',
      },
    });

    return response.data;
  } catch (error: any) {
    console.log('[VanSalesServices] salesSummaryByDocument failed', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    throw error;
  }
};

export const salespersonSalesPerformance = async (
  critial: salespersonSalesPerformanceParam,
) => {
  try {
    console.log(
      '[VanSalesServices] salespersonSalesPerformance start',
      critial,
    );
    const storedBaseUrl = await getVanSalesWebServiceUrl();
    const loginGuid = await getLoginGuID();
    console.log(
      '[VanSalesServices] salespersonSalesPerformance loginGuid',
      loginGuid,
    );

    const normalizedBaseUrl = normalizePaymentBaseUrl(storedBaseUrl);

    if (!normalizedBaseUrl) {
      throw new Error('ไม่พบ VanSalesServicesBaseUrl');
    }

    const url =
      VanSalesBaseUrl(normalizedBaseUrl) +
      'erp/reports/salesperson-sales-performance';

    console.log('[VanSalesServices] salespersonSalesPerformance url', url);

    const response = await axios.post(url, critial, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'x-erp-login-guid': loginGuid ?? '',
      },
    });

    console.log(
      '[VanSalesServices] salespersonSalesPerformance response',
      response,
    );

    return response.data;
  } catch (error: any) {
    console.log('[VanSalesServices] salespersonSalesPerformance failed', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    throw error;
  }
};

export const stockBalanceByLocation = async (
  critial: stockBalanceByLocationParam,
) => {
  try {
    const storedBaseUrl = await getVanSalesWebServiceUrl();
    const loginGuid = await getLoginGuID();
    console.log('[VanSalesServices] stockBalanceByLocation critial', critial);

    const normalizedBaseUrl = normalizePaymentBaseUrl(storedBaseUrl);

    if (!normalizedBaseUrl) {
      throw new Error('ไม่พบ VanSalesServicesBaseUrl');
    }

    const url =
      VanSalesBaseUrl(normalizedBaseUrl) +
      'erp/reports/stock-balance-by-location';

    const response = await axios.post(url, critial, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'x-erp-login-guid': loginGuid ?? '',
      },
    });

    console.log('responseaaaa', response);
    return response.data;
  } catch (error: any) {
    console.log('[VanSalesServices] stockBalanceByLocation failed', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    throw error;
  }
};
