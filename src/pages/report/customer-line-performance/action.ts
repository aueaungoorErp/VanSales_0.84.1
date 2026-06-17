import moment from 'moment';
import {customerReportPerformance} from '../../../api/VanSalesServices/report-services';
import * as types from '../../../constant/report';
import {getUserToken} from '../../../utils/Token';

type AnyRecord = Record<string, any>;

type PerformanceRow = {
  ARL_NAME: string;
  COUNTAR: number;
  COUNTSELLBOOK: number;
  COUNTVISIT: number;
  COUNTSURVEY: number;
};

type CustomerPerformanceCriteria = {
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

const normalizePerformanceRow = (row: AnyRecord): PerformanceRow => {
  const countAr = toSafeNumber(
    row?.COUNTAR ?? row?.countAr ?? row?.CUSTOMER_COUNT ?? row?.ITEM_COUNTAR,
  );
  const countSellBook = toSafeNumber(
    row?.COUNTSELLBOOK ??
      row?.countSellBook ??
      row?.SELL_COUNT ??
      row?.ITEM_COUNTSELLBOOK,
  );
  const countVisit = toSafeNumber(
    row?.COUNTVISIT ??
      row?.countVisit ??
      row?.VISIT_COUNT ??
      row?.ITEM_COUNTVISIT,
  );
  const countSurvey = toSafeNumber(
    row?.COUNTSURVEY ??
      row?.countSurvey ??
      row?.SURVEY_COUNT ??
      row?.ITEM_COUNTSURVEY,
  );

  return {
    ARL_NAME:
      row?.ARL_NAME ??
      row?.arlName ??
      row?.ITEM_NAME ??
      row?.customerLineName ??
      'ไม่ระบุสายลูกค้า',
    COUNTAR: countAr,
    COUNTSELLBOOK: countSellBook,
    COUNTVISIT: countVisit,
    COUNTSURVEY: countSurvey,
  };
};

const buildPerformancePercentRow = (row: PerformanceRow) => ({
  ARL_NAME: row.ARL_NAME,
  COUNTAR_PERCENT: row.COUNTAR > 0 ? 100 : 0,
  COUNTSELLBOOK_PERCENT: toPercent(row.COUNTSELLBOOK, row.COUNTAR),
  COUNTVISIT_PERCENT: toPercent(row.COUNTVISIT, row.COUNTAR),
  COUNTSURVEY_PERCENT: toPercent(row.COUNTSURVEY, row.COUNTAR),
});

const mergePerformanceRows = (rows: AnyRecord[]): PerformanceRow[] => {
  const grouped = new Map<string, PerformanceRow>();

  rows.forEach(row => {
    const normalizedRow = normalizePerformanceRow(row);
    const key = normalizedRow.ARL_NAME || 'ไม่ระบุสายลูกค้า';
    const existing = grouped.get(key);

    if (existing) {
      existing.COUNTAR += normalizedRow.COUNTAR;
      existing.COUNTSELLBOOK += normalizedRow.COUNTSELLBOOK;
      existing.COUNTVISIT += normalizedRow.COUNTVISIT;
      existing.COUNTSURVEY += normalizedRow.COUNTSURVEY;
      return;
    }

    grouped.set(key, {...normalizedRow});
  });

  return Array.from(grouped.values());
};

const extractPerformanceRowsFromGroup = (group: AnyRecord): AnyRecord[] => {
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

const extractPerformanceGroupDate = (
  group?: AnyRecord | null,
  row?: AnyRecord | null,
) =>
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

const buildPerformanceSummarySection = (rows: PerformanceRow[]) => {
  const summaryRows = mergePerformanceRows(rows).map(row => ({
    ITEM_NAME: row.ARL_NAME,
    ITEM_COUNTAR: row.COUNTAR,
    ITEM_COUNTSELLBOOK: row.COUNTSELLBOOK,
    ITEM_COUNTVISIT: row.COUNTVISIT,
    ITEM_COUNTSURVEY: row.COUNTSURVEY,
    ITEM_COUNTAR_PERCENT: row.COUNTAR > 0 ? 100 : 0,
    ITEM_COUNTSELLBOOK_PERCENT: toPercent(row.COUNTSELLBOOK, row.COUNTAR),
    ITEM_COUNTVISIT_PERCENT: toPercent(row.COUNTVISIT, row.COUNTAR),
    ITEM_COUNTSURVEY_PERCENT: toPercent(row.COUNTSURVEY, row.COUNTAR),
  }));

  const sumCountAr = summaryRows.reduce(
    (sum, row) => sum + toSafeNumber(row.ITEM_COUNTAR),
    0,
  );
  const sumCountSellBook = summaryRows.reduce(
    (sum, row) => sum + toSafeNumber(row.ITEM_COUNTSELLBOOK),
    0,
  );
  const sumCountVisit = summaryRows.reduce(
    (sum, row) => sum + toSafeNumber(row.ITEM_COUNTVISIT),
    0,
  );
  const sumCountSurvey = summaryRows.reduce(
    (sum, row) => sum + toSafeNumber(row.ITEM_COUNTSURVEY),
    0,
  );

  return {
    summarySection: {
      ITEMS: summaryRows,
      SUM_COUNTAR: sumCountAr,
      SUM_COUNTSELLBOOK: sumCountSellBook,
      SUM_COUNTVISIT: sumCountVisit,
      SUM_COUNTSURVEY: sumCountSurvey,
    },
    summarySectionPercent: {
      ITEMS: summaryRows,
      SUM_COUNTAR_PERCENT: sumCountAr > 0 ? 100 : 0,
      SUM_COUNTSELLBOOK_PERCENT: toPercent(sumCountSellBook, sumCountAr),
      SUM_COUNTVISIT_PERCENT: toPercent(sumCountVisit, sumCountAr),
      SUM_COUNTSURVEY_PERCENT: toPercent(sumCountSurvey, sumCountAr),
    },
    sums: {
      SUM_COUNTAR: sumCountAr,
      SUM_COUNTSELLBOOK: sumCountSellBook,
      SUM_COUNTVISIT: sumCountVisit,
      SUM_COUNTSURVEY: sumCountSurvey,
      SUM_COUNTAR_PERCENT: sumCountAr > 0 ? 100 : 0,
      SUM_COUNTSELLBOOK_PERCENT: toPercent(sumCountSellBook, sumCountAr),
      SUM_COUNTVISIT_PERCENT: toPercent(sumCountVisit, sumCountAr),
      SUM_COUNTSURVEY_PERCENT: toPercent(sumCountSurvey, sumCountAr),
    },
  };
};

export const normalizeCustomerPerformancePayload = (payload: AnyRecord = {}) => {
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
      const groupDate = extractPerformanceGroupDate(null, row);
      const existingRows = groupedMap.get(groupDate) || [];
      existingRows.push(row);
      groupedMap.set(groupDate, existingRows);
    });

    groupedSource = Array.from(groupedMap.entries()).map(
      ([GROUP_NAME, rows]) => ({
        GROUP_NAME,
        ITEMS: rows,
      }),
    );
  }

  const normalizedGroups = groupedSource.map((group: AnyRecord) => {
    const groupRows = mergePerformanceRows(
      extractPerformanceRowsFromGroup(group),
    );
    const groupPercentRows = groupRows.map(buildPerformancePercentRow);
    const sumCountAr = groupRows.reduce((sum, row) => sum + row.COUNTAR, 0);
    const sumCountSellBook = groupRows.reduce(
      (sum, row) => sum + row.COUNTSELLBOOK,
      0,
    );
    const sumCountVisit = groupRows.reduce((sum, row) => sum + row.COUNTVISIT, 0);
    const sumCountSurvey = groupRows.reduce(
      (sum, row) => sum + row.COUNTSURVEY,
      0,
    );

    return {
      GROUP_NAME: extractPerformanceGroupDate(group),
      ITEMS: [
        {
          ITEMS: groupRows,
          ITEMS_PERCENT: groupPercentRows,
        },
      ],
      SUM_COUNTAR: sumCountAr,
      SUM_COUNTSELLBOOK: sumCountSellBook,
      SUM_COUNTVISIT: sumCountVisit,
      SUM_COUNTSURVEY: sumCountSurvey,
      SUM_COUNTAR_PERCENT: sumCountAr > 0 ? 100 : 0,
      SUM_COUNTSELLBOOK_PERCENT: toPercent(sumCountSellBook, sumCountAr),
      SUM_COUNTVISIT_PERCENT: toPercent(sumCountVisit, sumCountAr),
      SUM_COUNTSURVEY_PERCENT: toPercent(sumCountSurvey, sumCountAr),
    };
  });

  const allRows = normalizedGroups.flatMap(group =>
    group.ITEMS.flatMap((item: {ITEMS: PerformanceRow[]}) => item.ITEMS),
  );
  const {summarySection, summarySectionPercent, sums} =
    buildPerformanceSummarySection(allRows);

  return {
    ...payload,
    RPT_DATA: {
      ...(payload?.RPT_DATA || {}),
      RESULT: normalizedGroups,
    },
    SUMMARY_SECTION: summarySection,
    SUMMARY_SECTION_PERCENT: summarySectionPercent,
    ...sums,
  };
};

export const getCustomerReportPerformance =
  (criteria: CustomerPerformanceCriteria) => (dispatch: Dispatch) => {
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

        const response = await customerReportPerformance({
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

        const normalizedPayload = normalizeCustomerPerformancePayload(
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
