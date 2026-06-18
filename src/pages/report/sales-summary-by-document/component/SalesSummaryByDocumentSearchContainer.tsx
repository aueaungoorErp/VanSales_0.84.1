import moment from 'moment';
import React, {useCallback} from 'react';
import {useDispatch} from 'react-redux';

import {useSalesSummaryByDocument} from '../../../../api/VanSalesServices/useTanStack';
import * as types from '../../../../constant/report';
import {getUserToken} from '../../../../utils/Token';
import CTSearchForm from '../../container/CTSearchForm';
import {normalizeSalesSummaryByDocumentPayload} from '../action';

const SalesSummaryByDocumentSearchContainer = () => {
  const dispatch = useDispatch();
  const {mutateAsync: requestSalesSummaryByDocument} =
    useSalesSummaryByDocument();

  const getSalesSummaryByDocumentViaHook = useCallback(
    async (criteria: {FROM: string; TO: string}) => {
      dispatch({type: types.REPORT_GET_DATA});

      try {
        const userToken = await getUserToken();
        const vanCode = String(userToken?.VANCONFIG?.VANCNF_MACHINE || '').trim();

        if (!vanCode) {
          const errorMessage = 'ไม่พบการส่งรหัสหน่วยรถ';
          dispatch({
            type: types.REPORT_SET_ERROR_MESSAGE,
            payload: errorMessage,
          });
          throw new Error(errorMessage);
        }

        const response = await requestSalesSummaryByDocument({
          vanCode,
          fromDate: moment(criteria.FROM, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          toDate: moment(criteria.TO, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        });

        const resultData = response?.RESULT_DATA ?? response ?? null;
        const normalizedPayload = normalizeSalesSummaryByDocumentPayload(
          resultData || {},
        );

        if (Array.isArray(normalizedPayload?.ITEMS) && normalizedPayload.ITEMS.length > 0) {
          dispatch({
            type: types.REPORT_GET_DATA_SUCCESS,
            payload: normalizedPayload,
          });
          return normalizedPayload;
        }

        dispatch({
          type: types.REPORT_SET_ERROR_MESSAGE,
          payload: 'ไม่พบข้อมูลรายงาน',
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
    [dispatch, requestSalesSummaryByDocument],
  );

  return (
    <CTSearchForm
      getSalesSummaryByDocumentViaHook={getSalesSummaryByDocumentViaHook}
    />
  );
};

export default SalesSummaryByDocumentSearchContainer;
