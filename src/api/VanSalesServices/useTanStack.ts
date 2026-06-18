import { useMutation } from '@tanstack/react-query';
import { updateVanPosition } from './vansales-services';
import {
  customerReportPerformance,
  productCategoryReportPerformance,
  salesSummaryByDocument,
} from './report-services';

export const useUpdateVanPosition = () =>
  useMutation({
    mutationKey: ['vansales-services', 'update-van-position'],
    mutationFn: updateVanPosition,
  });

export const useCustomerReportPerformance = () =>
  useMutation({
    mutationKey: ['vansales-services', 'customer-report-performance'],
    mutationFn: customerReportPerformance,
  });

export const useProductCategoryReportPerformance = () =>
  useMutation({
    mutationKey: ['vansales-services', 'product-category-report-performance'],
    mutationFn: productCategoryReportPerformance,
  });

export const useSalesSummaryByDocument = () =>
  useMutation({
    mutationKey: ['vansales-services', 'sales-summary-by-document'],
    mutationFn: salesSummaryByDocument,
  });
