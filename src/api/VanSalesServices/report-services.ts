import { VanSalesBaseUrl } from './vansales-services';
import { getLoginGuID, getVanSalesWebServiceUrl } from '../../utils/Token';
import { normalizePaymentBaseUrl } from '../../utils/webService';
import axios from 'axios';
import * as appConfig from '../../../appConfig';
import { customerReportPerformanceParam, productCategoryReportPerformanceParam, salesSummaryByDocumentParam, salespersonSalesPerformanceParam, stockBalanceByLocationParam, paymentTypeSummaryParam } from './param-request';
export const customerReportPerformance = async (critial: customerReportPerformanceParam) => {
  try {
    const storedBaseUrl = await getVanSalesWebServiceUrl();
    const loginGuid = await getLoginGuID();
    const normalizedBaseUrl = normalizePaymentBaseUrl(storedBaseUrl);
    if (!normalizedBaseUrl) {
      throw new Error('ไม่พบ VanSalesServicesBaseUrl');
    }
    const url = VanSalesBaseUrl(normalizedBaseUrl) + 'erp/reports/customer-line-performance';
    const response = await axios.post(url, critial, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'x-erp-login-guid': loginGuid ?? ''
      }
    });
    return response.data;
  } catch (error: any) {
    console.log('[VanSalesServices] customerReportPerformance failed', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};
export const productCategoryReportPerformance = async (critial: productCategoryReportPerformanceParam) => {
  try {
    const storedBaseUrl = await getVanSalesWebServiceUrl();
    const loginGuid = await getLoginGuID();
    const normalizedBaseUrl = normalizePaymentBaseUrl(storedBaseUrl);
    if (!normalizedBaseUrl) {
      throw new Error('ไม่พบ VanSalesServicesBaseUrl');
    }
    const url = VanSalesBaseUrl(normalizedBaseUrl) + 'erp/reports/product-category-performance';
    const response = await axios.post(url, critial, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'x-erp-login-guid': loginGuid ?? ''
      }
    });
    return response.data;
  } catch (error: any) {
    console.log('[VanSalesServices] productCategoryReportPerformance failed', {
      message: error?.message
    });
    throw error;
  }
};
export const salesSummaryByDocument = async (critial: salesSummaryByDocumentParam) => {
  try {
    const storedBaseUrl = await getVanSalesWebServiceUrl();
    const loginGuid = await getLoginGuID();
    const normalizedBaseUrl = normalizePaymentBaseUrl(storedBaseUrl);
    if (!normalizedBaseUrl) {
      throw new Error('ไม่พบ VanSalesServicesBaseUrl');
    }
    const url = VanSalesBaseUrl(normalizedBaseUrl) + 'erp/reports/sales-summary-by-document';
    const response = await axios.post(url, critial, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'x-erp-login-guid': loginGuid ?? ''
      }
    });
    return response.data;
  } catch (error: any) {
    console.log('[VanSalesServices] salesSummaryByDocument failed', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};
export const salespersonSalesPerformance = async (critial: salespersonSalesPerformanceParam) => {
  try {
    const storedBaseUrl = await getVanSalesWebServiceUrl();
    const loginGuid = await getLoginGuID();
    const normalizedBaseUrl = normalizePaymentBaseUrl(storedBaseUrl);
    if (!normalizedBaseUrl) {
      throw new Error('ไม่พบ VanSalesServicesBaseUrl');
    }
    const url = VanSalesBaseUrl(normalizedBaseUrl) + 'erp/reports/salesperson-sales-performance';
    const response = await axios.post(url, critial, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'x-erp-login-guid': loginGuid ?? ''
      }
    });
    return response.data;
  } catch (error: any) {
    console.log('[VanSalesServices] salespersonSalesPerformance failed', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};
export const stockBalanceByLocation = async (critial: stockBalanceByLocationParam) => {
  try {
    const storedBaseUrl = await getVanSalesWebServiceUrl();
    const loginGuid = await getLoginGuID();
    const normalizedBaseUrl = normalizePaymentBaseUrl(storedBaseUrl);
    if (!normalizedBaseUrl) {
      throw new Error('ไม่พบ VanSalesServicesBaseUrl');
    }
    const url = VanSalesBaseUrl(normalizedBaseUrl) + 'erp/reports/stock-balance-by-location';
    const response = await axios.post(url, critial, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'x-erp-login-guid': loginGuid ?? ''
      }
    });
    return response.data;
  } catch (error: any) {
    console.log('[VanSalesServices] stockBalanceByLocation failed', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};
export const paymentTypeSummary = async (criteria: paymentTypeSummaryParam) => {
  try {
    const storedBaseUrl = await getVanSalesWebServiceUrl();
    const loginGuid = await getLoginGuID();
    const normalizedBaseUrl = normalizePaymentBaseUrl(storedBaseUrl);
    if (!normalizedBaseUrl) {
      throw new Error('ไม่พบ VanSalesServicesBaseUrl');
    }
    const url = VanSalesBaseUrl(normalizedBaseUrl) + 'erp/reports/payment-type-summary';
    const response = await axios.post(url, criteria, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'x-erp-login-guid': loginGuid ?? ''
      }
    });
    if (response.data?.success === false) {
      const error: any = new Error(response.data?.message || 'โหลดรายงานสรุปประเภทการชำระไม่สำเร็จ');
      error.response = {
        data: response.data
      };
      throw error;
    }
    return response.data;
  } catch (error: any) {
    console.log('[VanSalesServices] paymentTypeSummary failed', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};