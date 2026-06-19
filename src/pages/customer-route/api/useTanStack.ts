import { useMutation } from '@tanstack/react-query';
import {
  customerRouteBatchDetails,
  CustomerRouteBatchDetailParams,
} from './customer-services';

export const useCustomerRouteBatchDetails = () =>
  useMutation({
    mutationKey: ['customer-route', 'batch-details'],
    mutationFn: (params: CustomerRouteBatchDetailParams) =>
      customerRouteBatchDetails(params),
  });
