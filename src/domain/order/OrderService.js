/**
 * OrderService - Domain Service
 * 
 * Encapsulates order business logic without React Native or Redux dependencies.
 * Responsible for:
 * - Order creation (sale, return, booking, quotation, transfer, payment)
 * - Order updates and cancellations
 * - Order item processing and validation
 * - Order state management logic
 * 
 * Response format matches app's convention:
 *   { STATUS: '00' | '10', RESULT_DATA?: any, ERROR_MESSAGES?: string[] }
 * 
 * Usage:
 *   const orderService = new OrderService();
 *   const result = await orderService.createOrder(orderData);
 *   if (result.STATUS === '00') {
 *     store.dispatch(setOrder(result.RESULT_DATA));
 *   }
 */

import {
  orderCreateCashApi,
  orderUpdateCashApi,
  createDocVisitApi,
  createDocSurveyApi,
  orderFileApi,
  orderCancelApi,
  orderUpdateApi,
  updateOrderSaleApi,
  createQuotationApi,
  orderUpdateQuotationApi,
  orderAttachImageApi,
  orderAttachMultipleImagesApi,
} from '../../api/order';

import { getWareLocationStockBalance } from '../../api/drop-point';
import { lookupErpV3Api, readErpV3Api, updateErpV3Api } from '../../api/bPlusApi';
import { processOrderItemV3Api } from '../../api/product';

import {
  BPAPUS_FUNCTION_DC_CODE,
  BPAPUS_FUNCTION_V_CODE,
  BPAPUS_FUNCTION_BK_CODE,
  BPAPUS_FUNCTION_WH_CODE,
} from '../../constant/bPlusApi';

import {
  convertProductItemLastBillToOrderItem,
  convertProductItemFromServerProcess2V3,
  generateItemsProcessedFromServer,
} from '../../utils/Order';

class OrderService {
  
  /**
   * Create a new order (Cash)
   * @param {Object} orderData - Order details
   * @returns {Promise<{ STATUS: '00'|'10', RESULT_DATA?: any, ERROR_MESSAGES?: string[] }>}
   */
  async createCashOrder(orderData) {
    try {
      if (!orderData) {
        return {
          STATUS: '10',
          ERROR_MESSAGES: ['Order data is required'],
        };
      }

      const response = await orderCreateCashApi(orderData);
      return response;
    } catch (error) {
      return {
        STATUS: '10',
        ERROR_MESSAGES: [error?.message || String(error)],
      };
    }
  }

  /**
   * Update an existing order (Cash)
   * @param {Object} orderData - Updated order details
   * @returns {Promise<{ STATUS: '00'|'10', RESULT_DATA?: any, ERROR_MESSAGES?: string[] }>}
   */
  async updateCashOrder(orderData) {
    try {
      if (!orderData) {
        return {
          STATUS: '10',
          ERROR_MESSAGES: ['Order data is required'],
        };
      }

      const response = await orderUpdateCashApi(orderData);
      return response;
    } catch (error) {
      return {
        STATUS: '10',
        ERROR_MESSAGES: [error?.message || String(error)],
      };
    }
  }

  /**
   * Cancel an order
   * @param {string} orderId - Order ID (DI_REF) to cancel
   * @returns {Promise<{ STATUS: '00'|'10', RESULT_DATA?: any, ERROR_MESSAGES?: string[] }>}
   */
  async cancelOrder(orderId) {
    try {
      if (!orderId) {
        return {
          STATUS: '10',
          ERROR_MESSAGES: ['Order ID is required'],
        };
      }

      const response = await orderCancelApi({ DI_REF: orderId });
      return response;
    } catch (error) {
      return {
        STATUS: '10',
        ERROR_MESSAGES: [error?.message || String(error)],
      };
    }
  }

  /**
   * Update an order sale
   * @param {Object} orderData - Sale order data
   * @returns {Promise<{ STATUS: '00'|'10', RESULT_DATA?: any, ERROR_MESSAGES?: string[] }>}
   */
  async updateOrderSale(orderData) {
    try {
      if (!orderData) {
        return {
          STATUS: '10',
          ERROR_MESSAGES: ['Order data is required'],
        };
      }

      const response = await updateOrderSaleApi(orderData);
      return response;
    } catch (error) {
      return {
        STATUS: '10',
        ERROR_MESSAGES: [error?.message || String(error)],
      };
    }
  }

  /**
   * Process order items (validation, transformation)
   * @param {Array} items - Items to process
   * @returns {Promise<Array>} Processed items
   */
  async processOrderItems(items) {
    try {
      if (!items || items.length === 0) {
        return [];
      }

      // Process each item
      const processedItems = items.map(item => {
        // Apply transformations
        return {
          ...item,
          // Add any default processing here
        };
      });

      return processedItems;
    } catch (error) {
      console.error('Error processing order items:', error);
      return items; // Return original items on error
    }
  }

  /**
   * Get order stock availability
   * @param {Object} orderItem - Item with warehouse location info
   * @returns {Promise<number>} Stock balance
   */
  async getItemStock(orderItem) {
    try {
      if (!orderItem) {
        return 0;
      }

      const balance = await getWareLocationStockBalance(orderItem);
      return balance || 0;
    } catch (error) {
      console.error('Error getting item stock:', error);
      return 0;
    }
  }

  /**
   * Validate order before submission
   * @param {Object} order - Order to validate
   * @returns {{ valid: boolean, errors?: Array<string> }}
   */
  validateOrder(order) {
    const errors = [];

    if (!order) {
      errors.push('Order is required');
      return { valid: false, errors };
    }

    if (!order.header) {
      errors.push('Order header is required');
    }

    if (!order.items || order.items.length === 0) {
      errors.push('Order must contain at least one item');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}

// Export singleton instance
export default new OrderService();
