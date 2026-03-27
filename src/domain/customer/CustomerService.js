/**
 * CustomerService - Domain Service
 * 
 * Encapsulates customer business logic without React Native or Redux dependencies.
 * Responsible for:
 * - Customer lookup and search (local and V3 API)
 * - Customer data validation
 * - Customer address handling
 * - Customer account operations (close, skip, etc.)
 * 
 * Usage:
 *   const customerService = new CustomerService();
 *   const result = await customerService.searchCustomers(searchTerm);
 */

import {
  customerSearchListApi,
  findCustomerByIdApi,
  createTempCusApi,
  searchCustomerNearByApi,
  closeCustomerAccountApi,
  customerSkipApi,
  getArPricetabApi,
  customerSearchListV3Api,
  executiveV3Api,
  readErpV3Api,
  updateErpV3Api,
  NewArFileV3Api,
  getARL_KEY99,
  getARLV3Api,
  customerSearchArLineListV3Api,
  getCustArprbKEYApi,
} from '../../api/customer';

import {
  BPAPUS_FUNCTION_DC_CODE,
  BPAPUS_FUNCTION_V_CODE,
} from '../../constant/bPlusApi';

import { getUserToken, getLoginGuID } from '../../utils/Token';
import * as appConfig from '../../../appConfig';
import moment from 'moment';

class CustomerService {
  
  /**
   * Search customers using local API
   * @param {string} searchTerm - Customer name or code to search
   * @param {Object} options - Search options (limit, offset, etc)
   * @returns {Promise<{ success: boolean, customers?: Array, error?: string }>}
   */
  async searchCustomersLocal(searchTerm, options = {}) {
    try {
      if (!searchTerm || searchTerm.trim().length === 0) {
        return {
          success: false,
          error: 'Search term is required',
        };
      }

      const response = await customerSearchListApi(searchTerm, options);

      if (response && response.data) {
        return {
          success: true,
          customers: response.data,
        };
      }

      return {
        success: false,
        error: 'No customers found',
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || String(error),
      };
    }
  }

  /**
   * Search customers using V3 API
   * @param {string} searchTerm - Customer name or code
   * @param {Object} options - Search options
   * @returns {Promise<{ success: boolean, customers?: Array, error?: string }>}
   */
  async searchCustomersV3(searchTerm, options = {}) {
    try {
      if (!searchTerm || searchTerm.trim().length === 0) {
        return {
          success: false,
          error: 'Search term is required',
        };
      }

      const response = await customerSearchListV3Api(searchTerm, options);

      if (response && (response.data || Array.isArray(response))) {
        const customers = response.data || response;
        return {
          success: true,
          customers: customers,
        };
      }

      return {
        success: false,
        error: 'No customers found',
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || String(error),
      };
    }
  }

  /**
   * Get customer details by ID
   * @param {string} customerId - Customer ID or code
   * @returns {Promise<{ success: boolean, customer?: Object, error?: string }>}
   */
  async getCustomerDetails(customerId) {
    try {
      if (!customerId) {
        return {
          success: false,
          error: 'Customer ID is required',
        };
      }

      const response = await findCustomerByIdApi(customerId);

      if (response && response.customer) {
        return {
          success: true,
          customer: response.customer,
        };
      }

      return {
        success: false,
        error: 'Customer not found',
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || String(error),
      };
    }
  }

  /**
   * Search customers near current location
   * @param {Object} location - { latitude, longitude }
   * @param {number} radius - Search radius in km
   * @returns {Promise<{ success: boolean, customers?: Array, error?: string }>}
   */
  async searchNearBy(location, radius = 5) {
    try {
      if (!location || !location.latitude || !location.longitude) {
        return {
          success: false,
          error: 'Valid location coordinates are required',
        };
      }

      const response = await searchCustomerNearByApi(location, radius);

      if (response && response.data) {
        return {
          success: true,
          customers: response.data,
        };
      }

      return {
        success: false,
        error: 'No nearby customers found',
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || String(error),
      };
    }
  }

  /**
   * Close customer account
   * @param {string} customerId - Customer ID to close
   * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
   */
  async closeAccount(customerId) {
    try {
      if (!customerId) {
        return {
          success: false,
          error: 'Customer ID is required',
        };
      }

      const response = await closeCustomerAccountApi(customerId);

      if (response) {
        return {
          success: true,
          data: response,
        };
      }

      return {
        success: false,
        error: 'Failed to close customer account',
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || String(error),
      };
    }
  }

  /**
   * Skip customer (mark for later review)
   * @param {string} customerId - Customer ID to skip
   * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
   */
  async skipCustomer(customerId) {
    try {
      if (!customerId) {
        return {
          success: false,
          error: 'Customer ID is required',
        };
      }

      const response = await customerSkipApi(customerId);

      if (response) {
        return {
          success: true,
          data: response,
        };
      }

      return {
        success: false,
        error: 'Failed to skip customer',
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || String(error),
      };
    }
  }

  /**
   * Get customer price table
   * @param {string} customerId - Customer ID
   * @returns {Promise<{ success: boolean, priceTable?: any, error?: string }>}
   */
  async getPriceTable(customerId) {
    try {
      if (!customerId) {
        return {
          success: false,
          error: 'Customer ID is required',
        };
      }

      const response = await getArPricetabApi(customerId);

      if (response) {
        return {
          success: true,
          priceTable: response,
        };
      }

      return {
        success: false,
        error: 'Price table not found',
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || String(error),
      };
    }
  }

  /**
   * Find customer by ID with detailed information
   * Orchestrates multiple V3 API calls to build complete customer profile
   * 
   * @param {string} customerId - Customer ID/AR_KEY
   * @returns {Promise<{ success: boolean, customer?: Object, error?: string }>}
   */
  async findCustomerById(customerId) {
    try {
      if (!customerId) {
        return { success: false, error: 'Customer ID is required' };
      }

      const LoginGUID = await getLoginGuID();
      const { VANCONFIG } = await getUserToken();

      // Step 1: Get AR Summary
      const bodyRequest1 = {
        'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': 'SHOWARSUMMARY',
        'BPAPUS-PARAM': JSON.stringify({ AR_KEY: customerId }),
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      };

      const response1 = await executiveV3Api(bodyRequest1);
      if (response1?.ResponseCode !== 200) {
        return { success: false, error: 'Failed to get AR summary' };
      }

      const data1 = JSON.parse(response1.ResponseData);
      const arSummary = data1?.SHOWARSUMMARY?.[0];

      // Step 2: Get AR CD (credit details)
      const date = moment().format('YYYYMMDD');
      const bodyRequest2 = {
        'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': 'READARCDBYARKEY',
        'BPAPUS-PARAM': JSON.stringify({
          AR_KEY: customerId,
          ARCD_DATE: date,
          ARCD_DEFAULT: 'Y',
        }),
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      };

      const response2 = await readErpV3Api(bodyRequest2);
      const data2 = JSON.parse(response2.ResponseData);
      const arcd = data2?.READARCDBYARKEY?.[0];

      if (response2?.ResponseCode === 200 && arcd) {
        // Step 3: Set as current AR CD
        const bodyRequest3 = {
          'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
          'BPAPUS-LOGIN-GUID': LoginGUID,
          'BPAPUS-FUNCTION': 'SetAsArcdKey',
          'BPAPUS-PARAM': JSON.stringify({
            ARCD_KEY: arcd.ARCD_KEY,
            ARCD_DATE: date,
          }),
          'BPAPUS-FILTER': '',
          'BPAPUS-ORDERBY': '',
          'BPAPUS-OFFSET': '0',
          'BPAPUS-FETCH': '0',
        };

        const response3 = await updateErpV3Api(bodyRequest3);
        const data3 = JSON.parse(response3.ResponseData);

        return {
          success: response3?.ResponseCode === 200,
          customer: {
            arSummary,
            arcd,
            arprb: data3,
            creditLimit: VANCONFIG.VANCNF_NOV_CRE_LIM,
          },
          error: response3?.ResponseCode === 200 ? undefined : 'Failed to set current AR',
        };
      }

      return {
        success: arSummary !== undefined,
        customer: { arSummary, creditLimit: VANCONFIG.VANCNF_NOV_CRE_LIM },
        error: arSummary ? undefined : 'Customer not found',
      };
    } catch (error) {
      return { success: false, error: error?.message || String(error) };
    }
  }

  /**
   * Create temporary/new customer
   * Prepares customer data and submits via NEWARFILE function
   * 
   * @param {Object} customerData - Customer data to create
   * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
   */
  async createTempCustomer(customerData) {
    try {
      if (!customerData || !customerData.NAME) {
        return { success: false, error: 'Customer name is required' };
      }

      const LoginGUID = await getLoginGuID();

      // Step 1: Get ARL_KEY for group 99
      const bodyRequest99 = {
        'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': 'Ar000312',
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER': "and ARL_CODE = '99'",
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      };

      const response99 = await getARL_KEY99(bodyRequest99);
      const data99 = JSON.parse(response99.ResponseData);

      if (response99?.ResponseCode !== 200 || !data99?.Ar000312?.[0]) {
        return { success: false, error: 'Failed to get customer line (99)' };
      }

      const ARL_KEY = data99.Ar000312[0].ARL_KEY;

      // Step 2: Prepare customer data
      const contactNames = (customerData.CONTACTNAME || '').split(/\s+/);
      const contactFirstName = contactNames[0] || '';
      const contactLastName = contactNames[1] || contactFirstName;

      const paramObject = {
        AR_CODE: '/V',
        AR_NAME: customerData.NAME,
        ADDB_COMPANY: customerData.NAME,
        ADDB_PHONE: (customerData.TEL || '').replace('undefined', ''),
        ADDB_EMAIL: customerData.EMAIL || '',
        CT_INTL: 'คุณ',
        CT_NAME: contactFirstName,
        CT_SURNME: contactLastName,
        AR_ENABLE: 'Y',
        AR_ARL: ARL_KEY,
        DFAR_TYPE: '1',
        ADDB_ADDB_1: customerData.ADDRESS1 || '',
        ADDB_SUB_DISTRICT: customerData.ADDRESS2 || '',
        ADDB_DISTRICT: (customerData.ADDRESS3 || '').replace('เขต ', ''),
        ADDB_PROVINCE: customerData.PROVINCE || '',
        ADDB_POST: customerData.POSTCODE || '',
        ADDB_FAX: (customerData.FAX || '').replace('undefined', ''),
        ADDB_TAX_ID: customerData.TAXID || '',
        ARS_CRE_LIM: '0',
        ARCD_NAME: customerData.ARC_NAME || '',
        AR_SLMNCODE: customerData.SALESMANCODE || '',
        AR_AC: customerData.AR_AC || '',
      };

      // Step 3: Create customer
      const bodyRequest = {
        'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': 'NEWARFILE',
        'BPAPUS-PARAM': JSON.stringify(paramObject),
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      };

      const response = await NewArFileV3Api(bodyRequest);
      const responseData = JSON.parse(response.ResponseData);

      return {
        success: response?.ResponseCode === 200 && responseData?.RECORD_COUNT > 0,
        data: responseData,
        error: response?.ResponseCode === 200 ? undefined : response?.ReasonString,
      };
    } catch (error) {
      return { success: false, error: error?.message || String(error) };
    }
  }

  /**
   * Get customer AR lines (for delivery routing)
   * Retrieves customer lines based on VANCNF_AR_LIMIT setting
   * 
   * @returns {Promise<{ success: boolean, customers?: Array, error?: string }>}
   */
  async getARCustomerLine() {
    try {
      const LoginGUID = await getLoginGuID();
      const { VANCONFIG } = await getUserToken();

      let wsFunction = '';
      let wsOrderBy = '';

      if (VANCONFIG.VANCNF_AR_LIMIT === 2) {
        wsFunction = 'Vans0107';
        wsOrderBy = ' ORDER BY VANRT_KEY ASC ';
      } else {
        wsFunction = 'Vans0104';
        wsOrderBy = ' -- ORDER BY AR_KEY ASC ';
      }

      const bodyRequest = {
        'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
        'BPAPUS-LOGIN-GUID': LoginGUID,
        'BPAPUS-FUNCTION': wsFunction,
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER': ` AND VANCNF_MACHINE='${VANCONFIG.VANCNF_MACHINE}'`,
        'BPAPUS-ORDERBY': wsOrderBy,
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      };

      const response = await getARLV3Api(bodyRequest);
      const responseData = JSON.parse(response.ResponseData);

      if (response?.ResponseCode === 200 && responseData?.RECORD_COUNT > 0) {
        const customers = VANCONFIG.VANCNF_AR_LIMIT === 2
          ? responseData.Vans0107
          : responseData.Vans0104;

        return {
          success: true,
          customers: customers,
          error: undefined,
        };
      }

      return { success: false, error: 'No customer lines found' };
    } catch (error) {
      return { success: false, error: error?.message || String(error) };
    }
  }

  /**
   * Search AR Line customers with detailed information
   * Complex orchestration: search AR lines → get customer details for each → merge with ARPRB data
   * Uses nested loops to match data from multiple V3 API calls
   * 
   * @param {Object} criteria - Search criteria { ARCAT_KEY, KEYWORD, OFFSET, LIMIT }
   * @returns {Promise<{ success: boolean, customers?: Array, error?: string }>}
   */
  async searchArLine(criteria) {
    try {
      if (!criteria || !criteria.ARCAT_KEY || !criteria.KEYWORD) {
        return {
          success: false,
          error: 'Search criteria (ARCAT_KEY, KEYWORD) is required',
        };
      }

      const { VANCONFIG } = await getUserToken();

      // Step 1: Get AR Line list
      const response1 = await customerSearchArLineListV3Api(criteria);
      if (response1?.ResponseCode !== 200) {
        return {
          success: false,
          error: 'Failed to search AR lines',
        };
      }

      const data1 = JSON.parse(response1.ResponseData);
      const { RECORD_COUNT, OFFSET, FETCH } = data1;

      // Determine which data field to use based on config
      let additionalData = [];
      if (VANCONFIG.VANCNF_AR_LIMIT === 2) {
        additionalData = data1.Vans0107 || [];
      } else {
        additionalData = data1.Vans0104 || [];
      }

      if (!additionalData || parseInt(RECORD_COUNT) === 0) {
        return {
          success: true,
          customers: [],
        };
      }

      // Step 2: For each AR Line, get customer details
      const Response = [];
      const processedIds = new Set();

      for (let i = 0; i < additionalData.length; i++) {
        const arLine = additionalData[i];
        const arCode = arLine.AR_CODE;

        try {
          // Get customer details
          const response2 = await customerSearchListV3Api(arCode, criteria.ARCAT_KEY);
          if (response2?.ResponseCode !== 200) {
            continue;
          }

          const data2 = JSON.parse(response2.ResponseData);
          const custList = data2.Ar000131 || [];

          if (custList.length === 0) {
            continue;
          }

          const customer = custList[0];
          const arKey = parseFloat(customer.AR_KEY);

          // Check for duplicates
          if (processedIds.has(arKey)) {
            continue;
          }
          processedIds.add(arKey);

          // Step 3: Get ARPRB key
          let arPrbKey = null;
          try {
            arPrbKey = await getCustArprbKEYApi(arKey, VANCONFIG);
          } catch (e) {
            // Continue without ARPRB key if fetch fails
          }

          // Merge data from multiple sources
          const merged = {
            ...arLine,
            ...customer,
            AR_KEY: arKey,
            AR_ARCAT: customer.AR_ARCAT,
            ADDB_KEY: parseFloat(customer.ADDB_KEY),
            ADDB_GPS_LAT_S: this._parseCoordinate(customer.ADDB_GPS_LAT_S),
            ADDB_GPS_LONG_S: this._parseCoordinate(customer.ADDB_GPS_LONG_S),
            ARPRB_KEY: arPrbKey,
          };

          Response.push(merged);
        } catch (error) {
          // Continue processing other customers on individual error
          console.error(`Error processing customer ${arCode}:`, error);
          continue;
        }
      }

      return {
        success: true,
        customers: Response,
        metadata: {
          RECORD_COUNT: parseInt(RECORD_COUNT),
          OFFSET: parseInt(OFFSET),
          FETCH: parseInt(FETCH) || Response.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || String(error),
      };
    }
  }

  /**
   * Helper: Parse coordinate value safely
   * @private
   * @param {string|number} value - Latitude or longitude value
   * @returns {number|null} Parsed coordinate or null
   */
  _parseCoordinate(value) {
    if (!value || isNaN(parseFloat(value))) {
      return null;
    }
    return parseFloat(value);
  }

  /**
   * Validate customer data
   * @param {Object} customer - Customer data to validate
   * @returns {{ valid: boolean, errors?: Array<string> }}
   */
  validateCustomer(customer) {
    const errors = [];

    if (!customer) {
      errors.push('Customer data is required');
      return { valid: false, errors };
    }

    if (!customer.customerId || customer.customerId.trim() === '') {
      errors.push('Customer ID is required');
    }

    if (!customer.customerName || customer.customerName.trim() === '') {
      errors.push('Customer name is required');
    }

    if (!customer.address || customer.address.trim() === '') {
      errors.push('Customer address is required');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Format customer address
   * @param {Object} address - Address components
   * @returns {string} Formatted address
   */
  formatAddress(address) {
    if (typeof address === 'string') {
      return address;
    }

    if (!address) {
      return '';
    }

    const parts = [
      address.street,
      address.district,
      address.province,
      address.postalCode,
    ].filter(Boolean);

    return parts.join(', ');
  }
}

// Export singleton instance
export default new CustomerService();
