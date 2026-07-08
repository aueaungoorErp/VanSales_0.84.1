import { useMutation } from '@tanstack/react-query';
import { getLatestVehicleMileage, saveVehicleMileage, updateVanPosition } from './vansales-services';
import {
  customerReportPerformance,
  paymentTypeSummary,
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

export const useLatestVehicleMileage = () =>
  useMutation({
    mutationKey: ['vansales-services', 'vehicles-mileages-latest'],
    mutationFn: getLatestVehicleMileage,
  });

export const useSaveVehicleMileage = () =>
  useMutation({
    mutationKey: ['vansales-services', 'vehicle-mileages'],
    mutationFn: saveVehicleMileage,
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

export const usePaymentTypeSummary = () =>
  useMutation({
    mutationKey: ['vansales-services', 'payment-type-summary'],
    mutationFn: paymentTypeSummary,
  });
