import { useMutation } from '@tanstack/react-query';
import { updateVanPosition } from './vansales-services';
import {
  customerReportPerformance,
  productCategoryReportPerformance,
  salesSummaryByDocument,
  salespersonSalesPerformance,
  stockBalanceByLocation,
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

export const useSalespersonSalesPerformance = () =>
  useMutation({
    mutationKey: ['vansales-services', 'salesperson-sales-performance'],
    mutationFn: salespersonSalesPerformance,
  });

export const useStockBalanceByLocation = () =>
  useMutation({
    mutationKey: ['vansales-services', 'stock-balance-by-location'],
    mutationFn: stockBalanceByLocation,
  });
