import React, {useCallback} from 'react';
import {useDispatch} from 'react-redux';

import {useSalespersonSalesPerformance} from '../../../../api/VanSalesServices/useTanStack';
import * as types from '../../../../constant/report';
import {getUserToken} from '../../../../utils/Token';
import CTSearchForm from '../../container/CTSearchForm';
import {normalizeSalespersonSalesPerformancePayload, formatSalespersonReportCriteriaForApi} from '../action';

const SalespersonSalesPerformanceSearchContainer = () => {
  const dispatch = useDispatch();
  const {mutateAsync: requestSalespersonSalesPerformance} =
    useSalespersonSalesPerformance();

  const getSalespersonSalesPerformanceViaHook = useCallback(
    async (criteria: {FROM: string; TO?: string}) => {
      dispatch({type: types.REPORT_GET_DATA});

      try {
        const userToken = await getUserToken();
        const vanCode = String(userToken?.VANCONFIG?.VANCNF_MACHINE || '').trim();
        const licensePlate = String(
          userToken?.VANCONFIG?.VANCNF_REG_NAME || '',
        ).trim();

        if (!vanCode) {
          const errorMessage = 'ไม่พบการส่งรหัสหน่วยรถ';
          dispatch({
            type: types.REPORT_SET_ERROR_MESSAGE,
            payload: errorMessage,
          });
          throw new Error(errorMessage);
        }

        const response = await requestSalespersonSalesPerformance({
          vanCode,
          licensePlate,
          fromDate: formatSalespersonReportCriteriaForApi(criteria.FROM),
          toDate: criteria.TO
            ? formatSalespersonReportCriteriaForApi(criteria.TO)
            : formatSalespersonReportCriteriaForApi(criteria.FROM),
        });

        const normalizedPayload = normalizeSalespersonSalesPerformancePayload(
          response || {},
        );

        dispatch({
          type: types.REPORT_GET_DATA_SUCCESS,
          payload: normalizedPayload,
        });

        return normalizedPayload;
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
        throw error;
      }
    },
    [dispatch, requestSalespersonSalesPerformance],
  );

  return (
    <CTSearchForm
      getSalespersonSalesPerformanceViaHook={
        getSalespersonSalesPerformanceViaHook
      }
    />
  );
};

export default SalespersonSalesPerformanceSearchContainer;
