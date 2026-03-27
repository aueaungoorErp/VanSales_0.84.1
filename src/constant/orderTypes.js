/**
 * Canonical order type string constants used across the application.
 * All AR_ORDER_TYPE comparisons MUST reference these constants
 * instead of inline Thai string literals.
 *
 * When adding a new document type:
 *  1. Add the constant here
 *  2. Use it in the new screen/action
 *  3. Do NOT add plain string literals elsewhere
 */

export const ORDER_TYPE_SALE       = 'ขายสินค้า';
export const ORDER_TYPE_RETURN     = 'รับคืนสินค้า';
export const ORDER_TYPE_BOOKING    = 'จองสินค้า';
export const ORDER_TYPE_QUOTATION  = 'ใบเสนอราคา';
export const ORDER_TYPE_TRANSFER   = 'โอนย้ายสินค้า';
export const ORDER_TYPE_PAYMENT    = 'รับชำระเงิน';

/** All order type values, useful for validation or iteration. */
export const ORDER_TYPES = [
  ORDER_TYPE_SALE,
  ORDER_TYPE_RETURN,
  ORDER_TYPE_BOOKING,
  ORDER_TYPE_QUOTATION,
  ORDER_TYPE_TRANSFER,
  ORDER_TYPE_PAYMENT,
];
