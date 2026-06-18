import moment from 'moment';
import {productCategoryReportPerformance} from '../../../api/VanSalesServices/report-services';
import * as types from '../../../constant/report';
import {getUserToken} from '../../../utils/Token';

type AnyRecord = Record<string, any>;

type ProductCategoryPerformanceRow = {
  ICDEPT_THAIDESC: string;
  COUNTSKU: number;
  COUNTSKM: number;
};

type ProductCategoryPerformanceCriteria = {
  FROM: string;
  TO: string;
};

type Dispatch = (action: {type: string; payload?: any}) => void;

const toSafeNumber = (value: unknown): number => {
  const parsed = parseFloat(String(value ?? 0));
  return Number.isFinite(parsed) ? parsed : 0;
};

const toPercent = (value: unknown, total: unknown): number => {
  const numerator = toSafeNumber(value);
  const denominator = toSafeNumber(total);

  if (denominator <= 0) {
    return 0;
  }

  return Number(((numerator * 100) / denominator).toFixed(2));
};

const formatGroupDate = (value: unknown): string => {
  if (!value) {
    return '-';
  }

  if (typeof value === 'string' && moment(value, 'DD/MM/YYYY', true).isValid()) {
    return value;
  }

  if (moment(value).isValid()) {
    return moment(value).format('DD/MM/YYYY');
  }

  return String(value);
};

const normalizeRow = (row: AnyRecord): ProductCategoryPerformanceRow => ({
  ICDEPT_THAIDESC:
    row?.ICDEPT_THAIDESC ??
    row?.icdeptName ??
    row?.ICCAT_NAME ??
    row?.icdeptCode ??
    row?.ITEM_NAME ??
    row?.categoryName ??
    'ไม่ระบุหมวดสินค้า',
  COUNTSKU: toSafeNumber(
    row?.COUNTSKU ??
      row?.countSkuTotal ??
      row?.countSku ??
      row?.ITEM_COUNTSKU ??
      row?.TOTAL_COUNT,
  ),
  COUNTSKM: toSafeNumber(
    row?.COUNTSKM ??
      row?.countSkuSold ??
      row?.countSkm ??
      row?.ITEM_COUNTSKM ??
      row?.SELL_COUNT,
  ),
});

const mergeRows = (rows: AnyRecord[]): ProductCategoryPerformanceRow[] => {
  const grouped = new Map<string, ProductCategoryPerformanceRow>();

  rows.forEach(row => {
    const normalizedRow = normalizeRow(row);
    const key = normalizedRow.ICDEPT_THAIDESC || 'ไม่ระบุหมวดสินค้า';
    const existing = grouped.get(key);

    if (existing) {
      existing.COUNTSKU += normalizedRow.COUNTSKU;
      existing.COUNTSKM += normalizedRow.COUNTSKM;
      return;
    }

    grouped.set(key, {...normalizedRow});
  });

  return Array.from(grouped.values());
};

const extractRowsFromGroup = (group: AnyRecord): AnyRecord[] => {
  if (!group) {
    return [];
  }

  if (Array.isArray(group.ITEMS)) {
    return group.ITEMS.flatMap((item: AnyRecord) => {
      if (Array.isArray(item?.ITEMS)) {
        return item.ITEMS;
      }

      if (item && typeof item === 'object') {
        return [item];
      }

      return [];
    });
  }

  if (Array.isArray(group.RESULT)) {
    return group.RESULT;
  }

  return [];
};

const extractGroupDate = (group?: AnyRecord | null, row?: AnyRecord | null) =>
  formatGroupDate(
    group?.GROUP_NAME ??
      group?.DATE ??
      group?.date ??
      group?.groupName ??
      row?.GROUP_NAME ??
      row?.DATE ??
      row?.date ??
      row?.DOC_DATE ??
      row?.docDate ??
      row?.DI_DATE,
  );

const buildSummarySection = (rows: ProductCategoryPerformanceRow[]) => {
  const mergedRows = mergeRows(rows);
  const sumCountSku = mergedRows.reduce((sum, row) => sum + row.COUNTSKU, 0);
  const sumCountSkm = mergedRows.reduce((sum, row) => sum + row.COUNTSKM, 0);

  const summaryRows = mergedRows.map(row => ({
    ITEM_NAME: row.ICDEPT_THAIDESC,
    ITEM_COUNTSKU: row.COUNTSKU,
    ITEM_COUNTSKM: row.COUNTSKM,
    ITEM_COUNTSKU_PERCENT: toPercent(row.COUNTSKU, sumCountSku),
    ITEM_COUNTSKM_PERCENT: toPercent(row.COUNTSKM, sumCountSkm),
  }));

  return {
    ITEMS: summaryRows,
    SUM_COUNTSKU: sumCountSku,
    SUM_COUNTSKM: sumCountSkm,
    SUM_COUNTSKU_PERCENT: sumCountSku > 0 ? 100 : 0,
    SUM_COUNTSKM_PERCENT: sumCountSkm > 0 ? 100 : 0,
  };
};

export const normalizeProductCategoryPerformancePayload = (
  payload: AnyRecord = {},
) => {
  const rawGroups =
    payload?.RPT_DATA?.RESULT ??
    payload?.RESULT ??
    payload?.items ??
    payload?.ITEMS ??
    [];

  let groupedSource = Array.isArray(rawGroups) ? rawGroups : [];

  const looksLikeFlatRows =
    groupedSource.length > 0 &&
    !groupedSource.some(
      (group: AnyRecord) =>
        Array.isArray(group?.ITEMS) || Array.isArray(group?.RESULT),
    );

  if (looksLikeFlatRows) {
    const groupedMap = new Map<string, AnyRecord[]>();

    groupedSource.forEach((row: AnyRecord) => {
      const groupDate = extractGroupDate(null, row);
      const existingRows = groupedMap.get(groupDate) || [];
      existingRows.push(row);
      groupedMap.set(groupDate, existingRows);
    });

    groupedSource = Array.from(groupedMap.entries()).map(([GROUP_NAME, rows]) => ({
      GROUP_NAME,
      ITEMS: rows,
    }));
  }

  const normalizedGroups = groupedSource.map((group: AnyRecord) => {
    const groupRows = mergeRows(extractRowsFromGroup(group));
    const sumCountSku = groupRows.reduce((sum, row) => sum + row.COUNTSKU, 0);
    const sumCountSkm = groupRows.reduce((sum, row) => sum + row.COUNTSKM, 0);

    return {
      GROUP_NAME: extractGroupDate(group),
      ITEMS: groupRows,
      ITEMS_PERCENT: groupRows.map(row => ({
        ICDEPT_THAIDESC: row.ICDEPT_THAIDESC,
        COUNTSKU: toPercent(row.COUNTSKU, sumCountSku),
        COUNTSKM: toPercent(row.COUNTSKM, sumCountSkm),
      })),
      SUM_COUNTSKU: sumCountSku,
      SUM_COUNTSKM: sumCountSkm,
      SUM_COUNTSKU_PERCENT: sumCountSku > 0 ? 100 : 0,
      SUM_COUNTSKM_PERCENT: sumCountSkm > 0 ? 100 : 0,
    };
  });

  const allRows = normalizedGroups.flatMap((group: AnyRecord) => group.ITEMS || []);
  const summarySection = buildSummarySection(allRows);

  return {
    ...payload,
    RPT_DATA: {
      ...(payload?.RPT_DATA || {}),
      RESULT: normalizedGroups,
    },
    SUMMARY_SECTION: summarySection,
    SUMMARY_SECTION_PERCENT: summarySection,
  };
};

export const getProductCategoryReportPerformance =
  (criteria: ProductCategoryPerformanceCriteria) => (dispatch: Dispatch) => {
    return new Promise(async (resolve, reject) => {
      try {
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

        const response = await productCategoryReportPerformance({
          vanCode,
          fromDate: moment(criteria.FROM, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          toDate: moment(criteria.TO, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        });

        const resultData = response?.RESULT_DATA ?? response ?? null;
        const resultItems =
          resultData?.RPT_DATA?.RESULT ??
          resultData?.RESULT ??
          resultData?.items ??
          [];

        const normalizedPayload = normalizeProductCategoryPerformancePayload(
          resultData?.RPT_DATA
            ? resultData
            : {
                ...resultData,
                RPT_DATA: {
                  ...(resultData?.RPT_DATA || {}),
                  RESULT: resultItems,
                },
              },
        );

        if (Array.isArray(resultItems) && resultItems.length > 0) {
          dispatch({
            type: types.REPORT_GET_DATA_SUCCESS,
            payload: normalizedPayload,
          });
          resolve(normalizedPayload);
          return;
        }

        dispatch({
          type: types.REPORT_SET_ERROR_MESSAGE,
          payload: 'ไม่พบข้อมูลรายงาน',
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
