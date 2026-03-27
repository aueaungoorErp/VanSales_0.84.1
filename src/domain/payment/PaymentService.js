/**
 * PaymentService - Domain Service
 * 
 * Encapsulates payment business logic without React Native or Redux dependencies.
 * Responsible for:
 * - KTB payment processing (status, auth, subscription, QR code, invoices)
 * - QRCode payment (SCB authentication and payment)
 * - Payment validation
 * - Payment state transformations
 * 
 * Response format attempts to match app's conventions where possible:
 *   Success: { success: true, data: <api_response> }
 *   Error: { success: false, error: <error_message> }
 * 
 * Usage:
 *   const paymentService = new PaymentService();
 *   const result = await paymentService.ktbCheckStatus(data);
 */

import {
    requestAuthApi,
    requestGenQRApi,
    requestGetPaymentStatus,
    requestGetStatusApi,
    requestPostInvoice,
    requestSubscriptionApi,
} from '../../api/ktb-payment';

import {
    authForGetAccessTokenApi,
    requestQrCodeSCBApi,
} from '../../api/qrcode-payment';

import DeviceInfo from 'react-native-device-info';
import { getUserToken } from '../../utils/Token';

class PaymentService {
  
  // ============= KTB Payment Methods =============
  
  /**
   * Check KTB payment service status
   * @param {string} ktbURL - KTB service URL
   * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
   */
  async ktbCheckStatus(ktbURL) {
    try {
      if (!ktbURL) {
        return {
          success: false,
          error: 'KTB URL is required',
        };
      }

      const response = await requestGetStatusApi(ktbURL);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,        data: null,        data: null,
        error: error?.message || String(error),
      };
    }
  }

  /**
   * Authenticate with KTB service
   * Requires device MAC address and machine ID
   * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
   */
  async ktbAuth() {
    try {
      const userToken = await getUserToken();
      const mac = await DeviceInfo.getMACAddress();
      const uid = await DeviceInfo.getUniqueId();

      if (!mac || !uid) {
        return {
          success: false,
          error: 'Unable to retrieve device information',
        };
      }

      const data = {
        deviceName: mac,
        machineId: uid,
        crn: '9100990000161', // TODO: Use userToken.COMPANYINFO.CMPNY_REG_NO
      };

      const response = await requestAuthApi(data);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error?.message || String(error),
      };
    }
  }

  /**
   * Create KTB subscription
   * @param {Object} data - Subscription data
   * @param {string} accessToken - KTB access token
   * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
   */
  async ktbSubscription(data, accessToken) {
    try {
      if (!data || !accessToken) {
        return {
          success: false,
          error: 'Subscription data and access token are required',
        };
      }

      const response = await requestSubscriptionApi(data, accessToken);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,        data: null,        error: error?.message || String(error),
      };
    }
  }

  /**
   * Generate KTB QR code
   * @param {Object} data - QR code request data
   * @param {string} accessToken - KTB access token
   * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
   */
  async ktbGenerateQR(data, accessToken) {
    try {
      if (!data || !accessToken) {
        return {
          success: false,
          error: 'QR code data and access token are required',
        };
      }

      const response = await requestGenQRApi(data, accessToken);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error?.message || String(error),
      };
    }
  }

  /**
   * Post invoice to KTB
   * @param {Object} data - Invoice data
   * @param {string} accessToken - KTB access token
   * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
   */
  async ktbPostInvoice(data, accessToken) {
    try {
      if (!data || !accessToken) {
        return {
          success: false,
          error: 'Invoice data and access token are required',
        };
      }

      const response = await requestPostInvoice(data, accessToken);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error?.message || String(error),
      };
    }
  }

  /**
   * Get KTB payment status
   * @param {Object} data - Status query data
   * @param {string} accessToken - KTB access token
   * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
   */
  async ktbGetPaymentStatus(data, accessToken) {
    try {
      if (!data || !accessToken) {
        return {
          success: false,
          error: 'Status data and access token are required',
        };
      }

      const response = await requestGetPaymentStatus(data, accessToken);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || String(error),
      };
    }
  }

  // ============= QRCode Payment Methods (SCB) =============

  /**
   * Authenticate with QRCode payment service to get access token
   * @param {Object} auth - Authentication credentials { userName, userPassword }
   * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
   */
  async qrcodeAuth(auth) {
    try {
      if (!auth || !auth.userName || !auth.userPassword) {
        return {
          success: false,
          error: 'Username and password are required',
        };
      }

      const response = await authForGetAccessTokenApi(auth);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      // Handle error response structure
      let errorMessage = 'QRCode authentication failed';
      
      if (error?.response?.data) {
        errorMessage = error.response.data.message || JSON.stringify(error.response.data);
      } else if (error?.request) {
        errorMessage = 'No response from server';
      } else if (error?.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Request QRCode from SCB payment service
   * @param {Object} paymentData - Payment channel data
   * @param {number} amount - Payment amount
   * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
   */
  async qrcodeRequestSCB(paymentData, amount) {
    try {
      if (!paymentData || !paymentData.paymentChannels || paymentData.paymentChannels.length === 0) {
        return {
          success: false,
          error: 'Payment channel data is required',
        };
      }

      if (!amount || amount <= 0) {
        return {
          success: false,
          error: 'Valid amount is required',
        };
      }

      const request = {
        billerId: paymentData.paymentChannels[0].billerId,
        amount: amount,
        terminal: paymentData.paymentChannels[0].terminalId,
      };

      console.log('qrcodeRequestSCB request:', request);
      const response = await requestQrCodeSCBApi(request);
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || String(error),
      };
    }
  }
}

// Export singleton instance
export default new PaymentService();
