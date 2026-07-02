import moment from 'moment';
import {stockBalanceByLocation} from '../../../api/VanSalesServices/report-services';
import * as types from '../../../constant/report';
import {getUserToken} from '../../../utils/Token';

type AnyRecord = Record<string, any>;
type Dispatch = (action: {type: string; payload?: any}) => void;

const toSafeNumber = (value: unknown): number => {
  const parsed = parseFloat(String(value ?? 0));
  return Number.isFinite(parsed) ? parsed : 0;
};

const buildUnitLabel = (qty: number, unitName: string | null | undefined) => {
  if (!unitName) {
    return qty.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return `${qty.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${unitName}`;
};

export const normalizeStockBalanceByLocationPayload = (
  payload: AnyRecord = {},
) => {
  const rawItems = Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload?.RESULT)
      ? payload.RESULT
      : Array.isArray(payload?.data?.items)
        ? payload.data.items
        : [];

  const groupedByWarehouse = new Map<string, AnyRecord>();

  rawItems.forEach((row: AnyRecord) => {
    const key = String(row?.warehouseLocationKey ?? row?.WL_KEY ?? 'unknown');
    const existingWarehouse = groupedByWarehouse.get(key) || {
      WL_KEY: row?.warehouseLocationKey ?? null,
      WL_CODE: row?.warehouseLocationCode ?? row?.WL_CODE ?? '-',
      WL_NAME: row?.warehouseLocationName ?? row?.WL_NAME ?? '-',
      ITEMS: [],
      SUM_WL_QTY_S: 0,
      SUM_WL_QTY_T: 0,
      SUM_WL_QTY_K: 0,
      SUM_TRD_NX_QTY: 0,
    };

    const normalizedRow = {
      SKU_CODE: row?.skuCode ?? row?.SKU_CODE ?? '-',
      SKU_NAME: row?.skuName ?? row?.SKU_NAME ?? '-',
      WL_QTY_S: toSafeNumber(
        row?.smallWarehouseQty ?? row?.WL_QTY_S ?? row?.warehouseQty,
      ),
      WL_QTY_T: toSafeNumber(
        row?.mediumWarehouseQty ?? row?.WL_QTY_T ?? 0,
      ),
      WL_QTY_K: toSafeNumber(
        row?.largeWarehouseQty ?? row?.WL_QTY_K ?? row?.warehouseQty,
      ),
      SKU_S_UTQ_NAME: row?.smallUnitName ?? row?.SKU_S_UTQ_NAME ?? row?.unitName ?? '',
      SKU_T_UTQ_NAME: row?.mediumUnitName ?? row?.SKU_T_UTQ_NAME ?? row?.unitName ?? '',
      SKU_K_UTQ_NAME: row?.largeUnitName ?? row?.SKU_K_UTQ_NAME ?? row?.unitName ?? '',
      TRD_NX_QTY: toSafeNumber(
        row?.pendingDocumentQty ?? row?.TRD_NX_QTY ?? 0,
      ),
    };

    existingWarehouse.ITEMS.push(normalizedRow);
    existingWarehouse.SUM_WL_QTY_S += normalizedRow.WL_QTY_S;
    existingWarehouse.SUM_WL_QTY_T += normalizedRow.WL_QTY_T;
    existingWarehouse.SUM_WL_QTY_K += normalizedRow.WL_QTY_K;
    existingWarehouse.SUM_TRD_NX_QTY += normalizedRow.TRD_NX_QTY;

    groupedByWarehouse.set(key, existingWarehouse);
  });

  const result = Array.from(groupedByWarehouse.values());

  return {
    ...payload,
    RESULT: result,
    GROUP_COUNT: result.length,
    SUM_ALL_WL_QTY: buildUnitLabel(
      result.reduce((sum, row) => sum + toSafeNumber(row.SUM_WL_QTY_K), 0),
      result[0]?.ITEMS?.[0]?.SKU_K_UTQ_NAME || '',
    ),
    SUM_ALL_TRD_NX_QTY: buildUnitLabel(
      result.reduce((sum, row) => sum + toSafeNumber(row.SUM_TRD_NX_QTY), 0),
      result[0]?.ITEMS?.[0]?.SKU_K_UTQ_NAME || '',
    ),
  };
};

export const getStockBalanceByLocation =
  (criteria: {FROM: string; TO?: string}) => (dispatch: Dispatch) => {
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

        const response = await stockBalanceByLocation({
          vanCode,
          fromDate: moment(criteria.FROM, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          warehouseLocationKey: -1,
        });

        console.log(
          '[Report][StockBalanceByWL] raw response',
          JSON.stringify(response, null, 2),
        );

        const normalizedPayload = normalizeStockBalanceByLocationPayload(
          response || {},
        );

        console.log(
          '[Report][StockBalanceByWL] normalized payload',
          JSON.stringify(normalizedPayload, null, 2),
        );
        console.log(
          '[Report][StockBalanceByWL] normalized first warehouse items',
          JSON.stringify(normalizedPayload?.RESULT?.[0]?.ITEMS || [], null, 2),
        );
        console.log(
          '[Report][StockBalanceByWL] field guide',
          JSON.stringify(
            {
              warehouse: {
                WL_KEY: 'รหัสตำแหน่งเก็บ',
                WL_CODE: 'โค้ดตำแหน่งเก็บ',
                WL_NAME: 'ชื่อตำแหน่งเก็บ',
              },
              row: {
                SKU_CODE: 'รหัสสินค้า',
                SKU_NAME: 'ชื่อสินค้า',
                WL_QTY_S: 'คงเหลือหน่วยเล็ก',
                WL_QTY_T: 'คงเหลือหน่วยกลาง',
                WL_QTY_K: 'คงเหลือหน่วยใหญ่',
                SKU_S_UTQ_NAME: 'ชื่อหน่วยเล็ก',
                SKU_T_UTQ_NAME: 'ชื่อหน่วยกลาง',
                SKU_K_UTQ_NAME: 'ชื่อหน่วยใหญ่',
                TRD_NX_QTY: 'จำนวนค้างส่ง',
              },
              summary: {
                SUM_WL_QTY_S: 'รวมคงเหลือหน่วยเล็ก',
                SUM_WL_QTY_T: 'รวมคงเหลือหน่วยกลาง',
                SUM_WL_QTY_K: 'รวมคงเหลือหน่วยใหญ่',
                SUM_TRD_NX_QTY: 'รวมค้างส่ง',
              },
            },
            null,
            2,
          ),
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
