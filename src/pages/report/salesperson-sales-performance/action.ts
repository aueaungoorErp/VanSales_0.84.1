import moment from 'moment';
import { salespersonSalesPerformance } from '../../../api/VanSalesServices/report-services';
import * as types from '../../../constant/report';
import { getUserToken } from '../../../utils/Token';
type AnyRecord = Record<string, any>;
type Dispatch = (action: {
  type: string;
  payload?: any;
}) => void;
const CRITERIA_INPUT_FORMATS = ['DD/MM/YYYY HH:mm', 'DD/MM/YYYY'];
const CRITERIA_API_FORMATS = [moment.ISO_8601, 'YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD'];
const toSafeNumber = (value: unknown): number => {
  const parsed = parseFloat(String(value ?? 0));
  return Number.isFinite(parsed) ? parsed : 0;
};
const toNullableNumber = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const parsed = parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : null;
};
export const parseSalespersonReportCriteriaDateTime = (value: string) => moment(value, CRITERIA_INPUT_FORMATS, true);
export const formatSalespersonReportCriteriaForApi = (value: string) => {
  const parsed = parseSalespersonReportCriteriaDateTime(value);
  if (!parsed.isValid()) {
    return moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD');
  }
  if (String(value).includes(':')) {
    return parsed.format('YYYY-MM-DDTHH:mm:ss');
  }
  return parsed.format('YYYY-MM-DD');
};
export const formatSalespersonReportCriteriaForDisplay = (value?: string | null) => {
  if (!value) {
    return null;
  }
  const parsed = moment(value, CRITERIA_API_FORMATS, true);
  if (!parsed.isValid()) {
    return value;
  }
  const datePart = `${parsed.format('DD/MM')}/${parsed.year() + 543}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value).trim())) {
    return datePart;
  }
  if (!String(value).includes(':') && !String(value).includes('T')) {
    return datePart;
  }
  return `${datePart} ${parsed.format('HH:mm')}`;
};
export const formatSalespersonReportDocumentDateTimeForDisplay = (value?: string | null) => {
  if (!value) {
    return null;
  }

  // API ส่ง ISO UTC (ลงท้าย Z) — แสดงเวลาตามค่าใน response ไม่แปลงเป็น timezone เครื่อง
  const parsed = moment.utc(value, CRITERIA_API_FORMATS, true);
  if (!parsed.isValid()) {
    return value;
  }
  return `${parsed.format('DD/MM')}/${parsed.year() + 543} ${parsed.format('HH:mm')}`;
};
const buildSectionFromSummary = (summary: AnyRecord = {}) => ({
  SUM_AMT: summary?.amountTotal != null ? toSafeNumber(summary.amountTotal) : null,
  SUM_ITEM_DSC: toSafeNumber(summary?.lineDiscountTotal),
  SUM_BILL_DSC: toSafeNumber(summary?.billDiscountTotal),
  COUNT_DOC: toSafeNumber(summary?.billCount),
  SUM_PCS: toSafeNumber(summary?.itemLineCount),
  SUM_QTY: toSafeNumber(summary?.quantityTotal),
  SUM_FREE_ITEM_QTY: toSafeNumber(summary?.freeQuantityTotal)
});
export const normalizeSalespersonSalesPerformancePayload = (payload: AnyRecord = {}) => {
  const criteria = payload?.criteria || {};
  const reportData = payload?.data || payload?.RESULT_DATA?.data || {};
  const bookingTotal = reportData?.bookingTotal || {};
  const salesTotal = reportData?.salesTotal || {};
  const returnTotal = reportData?.returnTotal || {};
  const arTransfer = reportData?.arTransfer || {};
  const mileage = reportData?.mileage || {};
  return {
    ...payload,
    criteria,
    F_TIME: formatSalespersonReportDocumentDateTimeForDisplay(reportData?.firstDocumentDateTime),
    E_TIME: formatSalespersonReportDocumentDateTimeForDisplay(reportData?.lastDocumentDateTime),
    BOOK: buildSectionFromSummary(bookingTotal),
    SELL: buildSectionFromSummary(salesTotal),
    RETURN: buildSectionFromSummary(returnTotal),
    TRANSFER_TO_AR: toSafeNumber(arTransfer?.transferToArAmount),
    PAID_BY_CHEQUE: toSafeNumber(arTransfer?.chequePayment),
    PAID_BY_CASH: toSafeNumber(arTransfer?.cashPayment),
    SUM_CASH_RTN: toSafeNumber(arTransfer?.cashRefund),
    CASH_FROM_SELL: toSafeNumber(arTransfer?.cashFromSales),
    PGL: toSafeNumber(arTransfer?.unchangeableChange),
    MILE_START: toNullableNumber(mileage?.startMile),
    MILE_END: toNullableNumber(mileage?.endMile),
    DISTANCE: toNullableNumber(mileage?.totalDistance)
  };
};
export const getSalespersonSalesPerformance = (criteria: {
  FROM: string;
  TO?: string;
}) => (dispatch: Dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch({
        type: types.REPORT_GET_DATA
      });
      const userToken = await getUserToken();
      const vanCode = String(userToken?.VANCONFIG?.VANCNF_MACHINE || '').trim();
      const licensePlate = String(userToken?.VANCONFIG?.VANCNF_REG_NAME || '').trim();
      if (!vanCode) {
        dispatch({
          type: types.REPORT_SET_ERROR_MESSAGE,
          payload: 'ไม่พบการส่งรหัสหน่วยรถ'
        });
        reject('ไม่พบการส่งรหัสหน่วยรถ');
        return;
      }
      const requestPayload = {
        vanCode,
        licensePlate,
        fromDate: formatSalespersonReportCriteriaForApi(criteria.FROM),
        toDate: criteria.TO ? formatSalespersonReportCriteriaForApi(criteria.TO) : formatSalespersonReportCriteriaForApi(criteria.FROM)
      };
      const response = await salespersonSalesPerformance(requestPayload);
      const normalizedPayload = normalizeSalespersonSalesPerformancePayload(response || {});
      dispatch({
        type: types.REPORT_GET_DATA_SUCCESS,
        payload: normalizedPayload
      });
      resolve(normalizedPayload);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.ERROR_MESSAGE || error?.response?.data?.message || error?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลรายงาน';
      dispatch({
        type: types.REPORT_SET_ERROR_MESSAGE,
        payload: errorMessage
      });
      reject(error);
    }
  });
};