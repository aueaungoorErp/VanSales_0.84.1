import moment from 'moment';
import {salespersonSalesPerformance} from '../../../api/VanSalesServices/report-services';
import * as types from '../../../constant/report';
import {getUserToken} from '../../../utils/Token';

type AnyRecord = Record<string, any>;
type Dispatch = (action: {type: string; payload?: any}) => void;

const toSafeNumber = (value: unknown): number => {
  const parsed = parseFloat(String(value ?? 0));
  return Number.isFinite(parsed) ? parsed : 0;
};

const toPaymentBucket = (payment: AnyRecord) => {
  const code = String(payment?.paymentCode ?? '').trim();
  const name = String(payment?.paymentName ?? '').trim();
  const amount = toSafeNumber(payment?.paymentAmount);

  return {code, name, amount};
};

const sumAmounts = (items: AnyRecord[]) =>
  items.reduce((sum, item) => sum + toSafeNumber(item?.paymentAmount), 0);

const buildSection = (sumAmt = 0, countDoc = 0) => ({
  SUM_AMT: sumAmt,
  SUM_ITEM_DSC: 0,
  SUM_BILL_DSC: 0,
  COUNT_DOC: countDoc,
  SUM_PCS: 0,
  SUM_QTY: 0,
  SUM_FREE_ITEM_QTY: 0,
});

const classifyDocumentType = (item: AnyRecord) => {
  const properties = String(item?.documentTypeProperties ?? '').trim();

  if (['207', '208'].includes(properties)) {
    return 'BOOK';
  }

  if (['303', '304', '305'].includes(properties)) {
    return 'RETURN';
  }

  return 'SELL';
};

const buildSectionFromSummary = (summary: AnyRecord = {}, sumAmt = 0) => ({
  SUM_AMT: sumAmt,
  SUM_ITEM_DSC: toSafeNumber(summary?.lineDiscountTotal),
  SUM_BILL_DSC: toSafeNumber(summary?.billDiscountTotal),
  COUNT_DOC: toSafeNumber(summary?.billCount),
  SUM_PCS: toSafeNumber(summary?.itemLineCount),
  SUM_QTY: toSafeNumber(summary?.quantityTotal),
  SUM_FREE_ITEM_QTY: toSafeNumber(summary?.freeQuantityTotal),
});

export const normalizeSalespersonSalesPerformancePayload = (
  payload: AnyRecord = {},
) => {
  const criteria = payload?.criteria || {};
  const reportData = payload?.data || payload?.RESULT_DATA?.data || {};
  const bookingTotal = reportData?.bookingTotal || {};
  const salesTotal = reportData?.salesTotal || {};
  const returnTotal = reportData?.returnTotal || {};
  const arTransfer = reportData?.arTransfer || {};
  const mileage = reportData?.mileage || {};
  const documentTypePayments = Array.isArray(reportData?.documentTypePayments)
    ? reportData.documentTypePayments
    : [];
  const dailyPayments = Array.isArray(reportData?.dailyPayments)
    ? reportData.dailyPayments
    : [];

  const sellItems = documentTypePayments.filter(
    (item: AnyRecord) => classifyDocumentType(item) === 'SELL',
  );
  const bookItems = documentTypePayments.filter(
    (item: AnyRecord) => classifyDocumentType(item) === 'BOOK',
  );
  const returnItems = documentTypePayments.filter(
    (item: AnyRecord) => classifyDocumentType(item) === 'RETURN',
  );

  const paymentBuckets = dailyPayments.map(toPaymentBucket);
  const paidByCash = paymentBuckets
    .filter(
      (item: {code: string; name: string; amount: number}) =>
        item.code === '01' ||
        item.name.includes('เงินสด') ||
        item.name.toLowerCase().includes('cash'),
    )
    .reduce(
      (sum: number, item: {code: string; name: string; amount: number}) =>
        sum + item.amount,
      0,
    );
  const sumCashReturn = paymentBuckets
    .filter((item: {code: string; name: string; amount: number}) =>
      item.name.includes('คืน'),
    )
    .reduce(
      (sum: number, item: {code: string; name: string; amount: number}) =>
        sum + item.amount,
      0,
    );

  return {
    ...payload,
    F_TIME: criteria?.fromDate
      ? moment(criteria.fromDate).format('DD/MM/YYYY')
      : null,
    E_TIME: criteria?.toDate ? moment(criteria.toDate).format('DD/MM/YYYY') : null,
    BOOK: buildSectionFromSummary(
      bookingTotal,
      bookingTotal?.amountTotal ?? sumAmounts(bookItems),
    ),
    SELL: buildSectionFromSummary(
      salesTotal,
      salesTotal?.amountTotal ?? sumAmounts(sellItems),
    ),
    RETURN: buildSectionFromSummary(
      returnTotal,
      returnTotal?.amountTotal ?? sumAmounts(returnItems),
    ),
    TRANSFER_TO_AR: toSafeNumber(arTransfer?.transferToArAmount),
    PAID_BY_CHEQUE: toSafeNumber(
      reportData?.chequeAmount ?? arTransfer?.chequePayment,
    ),
    PAID_BY_CASH: toSafeNumber(
      arTransfer?.cashPayment ?? paidByCash,
    ),
    SUM_CASH_RTN: toSafeNumber(arTransfer?.cashRefund ?? sumCashReturn),
    CASH_FROM_SELL: toSafeNumber(
      arTransfer?.cashFromSales ?? paidByCash - sumCashReturn,
    ),
    PGL: toSafeNumber(arTransfer?.unchangeableChange),
    MILE_START: toSafeNumber(mileage?.startMile),
    MILE_END: toSafeNumber(mileage?.endMile),
    DISTANCE: toSafeNumber(mileage?.totalDistance),
  };
};

export const getSalespersonSalesPerformance =
  (criteria: {FROM: string; TO: string}) => (dispatch: Dispatch) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(
          '[SalespersonSalesPerformance] dispatch criteria',
          criteria,
        );
        dispatch({type: types.REPORT_GET_DATA});

        const userToken = await getUserToken();
        const vanCode = String(userToken?.VANCONFIG?.VANCNF_MACHINE || '').trim();

        if (!vanCode) {
          dispatch({
            type: types.REPORT_SET_ERROR_MESSAGE,
            payload: 'ไม่พบการส่งรหัสหน่วยรถ',
          });
          reject('ไม่พบการส่งรหัสหน่วยรถ');
          return;
        }

        const requestPayload = {
          vanCode,
          fromDate: moment(criteria.FROM, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          toDate: moment(criteria.TO, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        };

        console.log(
          '[SalespersonSalesPerformance] request payload',
          requestPayload,
        );

        const response = await salespersonSalesPerformance(requestPayload);

        const normalizedPayload = normalizeSalespersonSalesPerformancePayload(
          response || {},
        );

        dispatch({
          type: types.REPORT_GET_DATA_SUCCESS,
          payload: normalizedPayload,
        });
        resolve(normalizedPayload);
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.ERROR_MESSAGE ||
          error?.response?.data?.message ||
          error?.message ||
          'เกิดข้อผิดพลาดในการโหลดข้อมูลรายงาน';

        dispatch({
          type: types.REPORT_SET_ERROR_MESSAGE,
          payload: errorMessage,
        });
        reject(error);
      }
    });
  };
