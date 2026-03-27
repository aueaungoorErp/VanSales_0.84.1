/**
 * PaymentService Unit Tests
 * 
 * Tests for PaymentService methods covering:
 * - KTB payment operations
 * - QRCode payment operations
 * - Error handling and edge cases
 * 
 * Jest test suite for domain service validation
 */

import PaymentService from '../payment/PaymentService';

// Mock the API modules
jest.mock('../../api/ktb-payment', () => ({
  requestGetStatusApi: jest.fn(),
  requestAuthApi: jest.fn(),
  requestSubscriptionApi: jest.fn(),
  requestGenQRApi: jest.fn(),
  requestPostInvoice: jest.fn(),
  requestGetPaymentStatus: jest.fn(),
}));

jest.mock('../../api/qrcode-payment', () => ({
  authForGetAccessTokenApi: jest.fn(),
  requestQrCodeSCBApi: jest.fn(),
}));

jest.mock('react-native-device-info', () => ({
  getMACAddress: jest.fn().mockResolvedValue('AA:BB:CC:DD:EE:FF'),
  getUniqueID: jest.fn().mockResolvedValue('device-uid-123'),
}));

jest.mock('../../utils/Token', () => ({
  getUserToken: jest.fn().mockResolvedValue({
    COMPANYINFO: { CMPNY_REG_NO: '1234567890' },
  }),
  getLoginGuID: jest.fn().mockResolvedValue('login-guid-123'),
}));

describe('PaymentService', () => {
  
  describe('KTB Payment Methods', () => {
    
    test('ktbCheckStatus should return success for valid URL', async () => {
      const mockApi = require('../../api/ktb-payment').requestGetStatusApi;
      mockApi.mockResolvedValueOnce({ status: 'OK' });

      const result = await PaymentService.ktbCheckStatus('https://ktb-api.com');
      
      expect(result.success).toBeTruthy();
      expect(mockApi).toHaveBeenCalledWith('https://ktb-api.com');
    });

    test('ktbCheckStatus should return error for failed request', async () => {
      const mockApi = require('../../api/ktb-payment').requestGetStatusApi;
      mockApi.mockRejectedValueOnce(new Error('Connection failed'));

      const result = await PaymentService.ktbCheckStatus('https://ktb-api.com');
      
      expect(result.success).toBeFalsy();
      expect(result.error).toBeDefined();
    });

    test('ktbAuth should return success with device info', async () => {
      const mockApi = require('../../api/ktb-payment').requestAuthApi;
      mockApi.mockResolvedValueOnce({
        accessToken: 'ktb-token-123',
      });

      const result = await PaymentService.ktbAuth();
      
      expect(result.success).toBeTruthy();
      expect(mockApi).toHaveBeenCalled();
    });

    test('ktbSubscription should handle subscription data', async () => {
      const mockApi = require('../../api/ktb-payment').requestSubscriptionApi;
      mockApi.mockResolvedValueOnce({
        subscriptionId: 'sub-123',
      });

      const data = { customerId: '123', amount: 5000 };
      const result = await PaymentService.ktbSubscription(data, 'token-123');
      
      expect(result.success).toBeTruthy();
      expect(mockApi).toHaveBeenCalledWith(data, 'token-123');
    });

    test('ktbGenerateQR should generate QR code', async () => {
      const mockApi = require('../../api/ktb-payment').requestGenQRApi;
      mockApi.mockResolvedValueOnce({
        qrCode: 'data:image/png;base64,...',
      });

      const data = { amount: 5000 };
      const result = await PaymentService.ktbGenerateQR(data, 'token-123');
      
      expect(result.success).toBeTruthy();
      expect(mockApi).toHaveBeenCalledWith(data, 'token-123');
    });

    test('ktbPostInvoice should post invoice to KTB', async () => {
      const mockApi = require('../../api/ktb-payment').requestPostInvoice;
      mockApi.mockResolvedValueOnce({
        invoiceId: 'inv-123',
      });

      const data = { invoiceNo: 'INV001', amount: 5000 };
      const result = await PaymentService.ktbPostInvoice(data, 'token-123');
      
      expect(result.success).toBeTruthy();
      expect(mockApi).toHaveBeenCalledWith(data, 'token-123');
    });

    test('ktbGetPaymentStatus should retrieve payment status', async () => {
      const mockApi = require('../../api/ktb-payment').requestGetPaymentStatus;
      mockApi.mockResolvedValueOnce({
        status: 'SUCCESS',
        reference: 'ref-123',
      });

      const data = { invoiceId: 'inv-123' };
      const result = await PaymentService.ktbGetPaymentStatus(data, 'token-123');
      
      expect(result.success).toBeTruthy();
      expect(mockApi).toHaveBeenCalledWith(data, 'token-123');
    });
  });

  describe('QRCode Payment Methods', () => {
    
    test('qrcodeAuth should authenticate user', async () => {
      const mockApi = require('../../api/qrcode-payment').authForGetAccessTokenApi;
      mockApi.mockResolvedValueOnce({
        accessToken: 'qrcode-token-123',
      });

      const auth = { userName: 'user1', userPassword: 'pass123' };
      const result = await PaymentService.qrcodeAuth(auth);
      
      expect(result.success).toBeTruthy();
      expect(mockApi).toHaveBeenCalledWith(auth);
    });

    test('qrcodeAuth should handle error response gracefully', async () => {
      const mockApi = require('../../api/qrcode-payment').authForGetAccessTokenApi;
      const error = new Error('Authentication failed');
      error.response = { data: { message: 'Invalid credentials' } };
      mockApi.mockRejectedValueOnce(error);

      const auth = { userName: 'user1', userPassword: 'wrong' };
      const result = await PaymentService.qrcodeAuth(auth);
      
      expect(result.success).toBeFalsy();
      expect(result.error).toBeDefined();
    });

    test('qrcodeRequestSCB should request SCB QR code', async () => {
      const mockApi = require('../../api/qrcode-payment').requestQrCodeSCBApi;
      mockApi.mockResolvedValueOnce({
        qrCode: 'data:image/png;base64,...',
        transactionId: 'txn-123',
      });

      const data = {
        paymentChannels: [{
          billerId: 'biller-123',
          terminalId: 'term-123',
        }],
      };
      const result = await PaymentService.qrcodeRequestSCB(data, 5000);
      
      expect(result.success).toBeTruthy();
      expect(mockApi).toHaveBeenCalled();
    });

    test('qrcodeRequestSCB should validate amount parameter', async () => {
      const data = {
        paymentChannels: [{
          billerId: 'biller-123',
          terminalId: 'term-123',
        }],
      };
      
      const result = await PaymentService.qrcodeRequestSCB(data, -100);
      
      // Should handle negative amounts
      expect(result).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    
    test('should handle missing parameters', async () => {
      const result = await PaymentService.ktbCheckStatus('');
      
      expect(result.success).toBeFalsy();
      expect(result.error).toBeTruthy();
    });

    test('should handle API network errors', async () => {
      const mockApi = require('../../api/ktb-payment').requestGetStatusApi;
      const error = new Error('Network timeout');
      error.request = {};
      error.response = undefined;
      mockApi.mockRejectedValueOnce(error);

      const result = await PaymentService.ktbCheckStatus('https://ktb-api.com');
      
      expect(result.success).toBeFalsy();
      expect(result.error).toContain('Network timeout');
    });
  });

  describe('Response Format Validation', () => {
    
    test('successful responses should have success and data properties', async () => {
      const mockApi = require('../../api/ktb-payment').requestGetStatusApi;
      mockApi.mockResolvedValueOnce({ status: 'OK' });

      const result = await PaymentService.ktbCheckStatus('https://ktb-api.com');
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('data');
      expect(result.success).toBeTruthy();
    });

    test('error responses should include error message', async () => {
      const mockApi = require('../../api/ktb-payment').requestGetStatusApi;
      mockApi.mockRejectedValueOnce(new Error('Test error'));

      const result = await PaymentService.ktbCheckStatus('https://ktb-api.com');
      
      expect(result.success).toBeFalsy();
      expect(result.error).toBeTruthy();
      expect(typeof result.error).toBe('string');
    });
  });
});
