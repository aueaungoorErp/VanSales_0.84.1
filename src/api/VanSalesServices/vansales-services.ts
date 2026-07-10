import axios from 'axios';
import * as appConfig from '../../../appConfig';
import { getVanSalesWebServiceUrl, getLoginGuID } from '../../utils/Token';
import { normalizePaymentBaseUrl } from '../../utils/webService';
import type { latestVehicleMileageParam, saveVehicleMileageParam, updateVanPositionParam } from './param-request';
export const VanSalesBaseUrl = (baseUrl: string) => `${baseUrl}/api/${appConfig.ApiVersion}/`;
export const updateVanPosition = async (critial: updateVanPositionParam) => {
  try {
    const storedBaseUrl = await getVanSalesWebServiceUrl();
    const loginGuid = await getLoginGuID();
    const normalizedBaseUrl = normalizePaymentBaseUrl(storedBaseUrl);
    if (!normalizedBaseUrl) {
      throw new Error('ไม่พบ VanSalesServicesBaseUrl');
    }
    const url = VanSalesBaseUrl(normalizedBaseUrl) + 'vehicle-locations';
    const response = await axios.post(url, critial, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'x-erp-login-guid': loginGuid ?? ''
      }
    });
    return response.data;
  } catch (error: any) {
    console.log('[VanSalesServices] updateVanPosition failed', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};
export const getLatestVehicleMileage = async (criteria: latestVehicleMileageParam) => {
  try {
    const storedBaseUrl = await getVanSalesWebServiceUrl();
    const loginGuid = await getLoginGuID();
    const normalizedBaseUrl = normalizePaymentBaseUrl(storedBaseUrl);
    if (!normalizedBaseUrl) {
      throw new Error('ไม่พบ VanSalesServicesBaseUrl');
    }
    const url = VanSalesBaseUrl(normalizedBaseUrl) + 'vehicles/mileages/latest';
    const response = await axios.post(url, criteria, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'x-erp-login-guid': loginGuid ?? ''
      }
    });
    return response.data;
  } catch (error: any) {
    console.log('[VanSalesServices] getLatestVehicleMileage failed', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};
export const saveVehicleMileage = async (criteria: saveVehicleMileageParam) => {
  try {
    const storedBaseUrl = await getVanSalesWebServiceUrl();
    const loginGuid = await getLoginGuID();
    const normalizedBaseUrl = normalizePaymentBaseUrl(storedBaseUrl);
    if (!normalizedBaseUrl) {
      throw new Error('ไม่พบ VanSalesServicesBaseUrl');
    }
    const url = VanSalesBaseUrl(normalizedBaseUrl) + 'vehicle-mileages';
    const response = await axios.post(url, criteria, {
      timeout: appConfig.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'x-erp-login-guid': loginGuid ?? ''
      }
    });
    if (response.data?.success === false) {
      const error: any = new Error(response.data?.message || 'บันทึกเลขไมล์ไม่สำเร็จ');
      error.response = {
        data: response.data
      };
      throw error;
    }
    return response.data;
  } catch (error: any) {
    console.log('[VanSalesServices] saveVehicleMileage failed', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};