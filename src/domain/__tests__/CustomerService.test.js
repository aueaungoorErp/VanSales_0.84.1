/**
 * CustomerService Unit Tests
 * 
 * Tests for CustomerService methods covering:
 * - Customer search and lookup
 * - Customer account management
 * - Customer data utilities
 * - Error handling and edge cases
 * 
 * Jest test suite for customer domain service validation
 */

import CustomerService from '../customer/CustomerService';

// Mock the API modules
jest.mock('../../api/customer', () => ({
  customerSearchListApi: jest.fn(),
  findCustomerByIdApi: jest.fn(),
  createTempCusApi: jest.fn(),
  searchCustomerNearByApi: jest.fn(),
  closeCustomerAccountApi: jest.fn(),
  customerSkipApi: jest.fn(),
  getArPricetabApi: jest.fn(),
  customerSearchListV3Api: jest.fn(),
  executiveV3Api: jest.fn(),
  readErpV3Api: jest.fn(),
  updateErpV3Api: jest.fn(),
  NewArFileV3Api: jest.fn(),
  getARL_KEY99: jest.fn(),
  getARLV3Api: jest.fn(),
  customerSearchArLineListV3Api: jest.fn(),
  getCustArprbKEYApi: jest.fn(),
}));

jest.mock('../../utils/Token', () => ({
  getUserToken: jest.fn().mockResolvedValue({
    VANCONFIG: { VANCNF_MACHINE: 'M001', VANCNF_AR_LIMIT: 1 },
  }),
  getLoginGuID: jest.fn().mockResolvedValue('login-guid-123'),
}));

jest.mock('moment', () => {
  const mockMoment = () => ({
    format: jest.fn().mockReturnValue('20260318'),
  });
  return mockMoment;
});

describe('CustomerService', () => {

  describe('Search Methods', () => {

    test('searchCustomersLocal should return customers on success', async () => {
      const mockApi = require('../../api/customer').customerSearchListApi;
      mockApi.mockResolvedValueOnce({
        data: [
          { customerId: '001', customerName: 'Customer 1' },
          { customerId: '002', customerName: 'Customer 2' },
        ],
      });

      const result = await CustomerService.searchCustomersLocal('cust');

      expect(result.success).toBeTruthy();
      expect(result.customers).toHaveLength(2);
    });

    test('searchCustomersLocal should handle empty search term', async () => {
      const result = await CustomerService.searchCustomersLocal('');

      expect(result.success).toBeFalsy();
      expect(result.error).toContain('Search term is required');
    });

    test('searchCustomersV3 should return customers from V3 API', async () => {
      const mockApi = require('../../api/customer').customerSearchListV3Api;
      mockApi.mockResolvedValueOnce({
        data: [{ AR_KEY: '001', AR_NAME: 'Company A' }],
      });

      const result = await CustomerService.searchCustomersV3('company');

      expect(result.success).toBeTruthy();
      expect(mockApi).toHaveBeenCalledWith('company', {});
    });

    test('getCustomerDetails should return customer data', async () => {
      const mockApi = require('../../api/customer').findCustomerByIdApi;
      mockApi.mockResolvedValueOnce({
        customer: { customerId: '001', customerName: 'Test Customer' },
      });

      const result = await CustomerService.getCustomerDetails('001');

      expect(result.success).toBeTruthy();
      expect(result.customer.customerId).toBe('001');
    });

    test('getCustomerDetails should fail without ID', async () => {
      const result = await CustomerService.getCustomerDetails('');

      expect(result.success).toBeFalsy();
      expect(result.error).toContain('Customer ID is required');
    });

    test('searchNearBy should find nearby customers', async () => {
      const mockApi = require('../../api/customer').searchCustomerNearByApi;
      mockApi.mockResolvedValueOnce({
        data: [
          { customerId: '001', distance: 1.5 },
          { customerId: '002', distance: 3.2 },
        ],
      });

      const location = { latitude: 13.7563, longitude: 100.5018 };
      const result = await CustomerService.searchNearBy(location, 5);

      expect(result.success).toBeTruthy();
      expect(result.customers).toHaveLength(2);
    });

    test('searchNearBy should validate location', async () => {
      const result = await CustomerService.searchNearBy({}, 5);

      expect(result.success).toBeFalsy();
      expect(result.error).toContain('Valid location coordinates are required');
    });
  });

  describe('Account Management', () => {

    test('closeAccount should successfully close customer', async () => {
      const mockApi = require('../../api/customer').closeCustomerAccountApi;
      mockApi.mockResolvedValueOnce({ status: 'success' });

      const result = await CustomerService.closeAccount('001');

      expect(result.success).toBeTruthy();
      expect(mockApi).toHaveBeenCalledWith('001');
    });

    test('closeAccount should fail without ID', async () => {
      const result = await CustomerService.closeAccount('');

      expect(result.success).toBeFalsy();
    });

    test('skipCustomer should mark customer for later', async () => {
      const mockApi = require('../../api/customer').customerSkipApi;
      mockApi.mockResolvedValueOnce({ status: 'skipped' });

      const result = await CustomerService.skipCustomer('001');

      expect(result.success).toBeTruthy();
      expect(mockApi).toHaveBeenCalledWith('001');
    });

    test('getPriceTable should retrieve customer pricing', async () => {
      const mockApi = require('../../api/customer').getArPricetabApi;
      mockApi.mockResolvedValueOnce({
        priceTable: { customerId: '001', basePriceLevel: 'A' },
      });

      const result = await CustomerService.getPriceTable('001');

      expect(result.success).toBeTruthy();
      expect(result.priceTable).toBeDefined();
    });
  });

  describe('Complex Operations', () => {

    test('findCustomerById should orchestrate multiple API calls', async () => {
      const mockExec = require('../../api/customer').executiveV3Api;
      const mockRead = require('../../api/customer').readErpV3Api;
      const mockUpdate = require('../../api/customer').updateErpV3Api;

      mockExec.mockResolvedValueOnce({
        ResponseCode: 200,
        ResponseData: JSON.stringify({
          SHOWARSUMMARY: [{ AR_KEY: '001', AR_NAME: 'Customer' }],
        }),
      });

      mockRead.mockResolvedValueOnce({
        ResponseCode: 200,
        ResponseData: JSON.stringify({
          READARCDBYARKEY: [{ ARCD_KEY: 'cd-001', AR_KEY: '001' }],
        }),
      });

      mockUpdate.mockResolvedValueOnce({
        ResponseCode: 200,
        ResponseData: JSON.stringify({ RECORD_COUNT: 1 }),
      });

      const result = await CustomerService.findCustomerById('001');

      expect(result.success).toBeTruthy();
      expect(mockExec).toHaveBeenCalled();
      expect(mockRead).toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalled();
    });

    test('createTempCustomer should prepare customer data', async () => {
      const mockLine = require('../../api/customer').getARL_KEY99;
      const mockCreate = require('../../api/customer').NewArFileV3Api;

      mockLine.mockResolvedValueOnce({
        ResponseCode: 200,
        ResponseData: JSON.stringify({
          Ar000312: [{ ARL_KEY: 'line-99' }],
        }),
      });

      mockCreate.mockResolvedValueOnce({
        ResponseCode: 200,
        ResponseData: JSON.stringify({ RECORD_COUNT: 1 }),
      });

      const customerData = {
        NAME: 'New Company',
        CONTACTNAME: 'John Doe',
        TEL: '0812345678',
        ADDRESS1: '123 Main St',
      };

      const result = await CustomerService.createTempCustomer(customerData);

      expect(result.success).toBeTruthy();
      expect(mockLine).toHaveBeenCalled();
      expect(mockCreate).toHaveBeenCalled();
    });

    test('getARCustomerLine should retrieve customer lines', async () => {
      const mockApi = require('../../api/customer').getARLV3Api;
      mockApi.mockResolvedValueOnce({
        ResponseCode: 200,
        ResponseData: JSON.stringify({
          RECORD_COUNT: 2,
          Vans0104: [
            { AR_KEY: '001', AR_NAME: 'Cust 1' },
            { AR_KEY: '002', AR_NAME: 'Cust 2' },
          ],
        }),
      });

      const result = await CustomerService.getARCustomerLine();

      expect(result.success).toBeTruthy();
      expect(result.customers).toHaveLength(2);
    });
  });

  describe('Data Utilities', () => {

    test('validateCustomer should pass valid data', () => {
      const customer = {
        customerId: '001',
        customerName: 'Test Customer',
        address: '123 Main St',
      };

      const result = CustomerService.validateCustomer(customer);

      expect(result.valid).toBeTruthy();
      expect(result.errors).toBeUndefined();
    });

    test('validateCustomer should catch missing fields', () => {
      const customer = {
        customerId: '001',
        // missing customerName
        address: '123 Main St',
      };

      const result = CustomerService.validateCustomer(customer);

      expect(result.valid).toBeFalsy();
      expect(result.errors).toContain('Customer name is required');
    });

    test('formatAddress should handle object format', () => {
      const address = {
        street: '123 Main St',
        district: 'District 1',
        province: 'Bangkok',
        postalCode: '10110',
      };

      const formatted = CustomerService.formatAddress(address);

      expect(formatted).toContain('123 Main St');
      expect(formatted).toContain('Bangkok');
      expect(formatted).toContain('10110');
    });

    test('formatAddress should handle string format', () => {
      const address = '123 Main St, Bangkok 10110';

      const formatted = CustomerService.formatAddress(address);

      expect(formatted).toBe('123 Main St, Bangkok 10110');
    });
  });

  describe('Error Handling', () => {

    test('should handle API call rejection', async () => {
      const mockApi = require('../../api/customer').customerSearchListApi;
      mockApi.mockRejectedValueOnce(new Error('API Error'));

      const result = await CustomerService.searchCustomersLocal('test');

      expect(result.success).toBeFalsy();
      expect(result.error).toContain('API Error');
    });

    test('should handle empty/null responses', async () => {
      const mockApi = require('../../api/customer').customerSearchListApi;
      mockApi.mockResolvedValueOnce(null);

      const result = await CustomerService.searchCustomersLocal('test');

      expect(result.success).toBeFalsy();
    });

    test('should handle null customer data', () => {
      const result = CustomerService.validateCustomer(null);

      expect(result.valid).toBeFalsy();
      expect(result.errors).toContain('Customer data is required');
    });
  });

  describe('Response Format Validation', () => {

    test('all responses should have success property', async () => {
      const mockApi = require('../../api/customer').customerSearchListApi;
      mockApi.mockResolvedValueOnce({ data: [] });

      const result = await CustomerService.searchCustomersLocal('test');

      expect(result).toHaveProperty('success');
    });

    test('error responses should include error message', async () => {
      const result = await CustomerService.searchCustomersLocal('');

      expect(result.success).toBeFalsy();
      expect(result.error).toBeTruthy();
      expect(typeof result.error).toBe('string');
    });
  });
});
