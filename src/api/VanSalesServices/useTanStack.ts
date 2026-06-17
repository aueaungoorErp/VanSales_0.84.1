import { useMutation } from '@tanstack/react-query';
import { updateVanPosition } from './vansales-services';
import { customerReportPerformance } from './report-services';

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
