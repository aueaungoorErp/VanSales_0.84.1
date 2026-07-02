import { useMutation } from '@tanstack/react-query';
import {
  fetchCustomerDueDateFromErp,
  fetchDocumentSwitchSettings,
} from './lookup-erp-services';
import type {
  FetchCustomerDueDateParam,
  FetchDocumentSwitchSettingsParam,
} from './param';

export const useFetchDocumentSwitchSettings = () =>
  useMutation({
    mutationKey: ['lookup-erp-services', 'document-switch-settings'],
    mutationFn: (params?: FetchDocumentSwitchSettingsParam) =>
      fetchDocumentSwitchSettings(params),
  });

export const useFetchCustomerDueDateFromErp = () =>
  useMutation({
    mutationKey: ['lookup-erp-services', 'customer-due-date'],
    mutationFn: (params: FetchCustomerDueDateParam) =>
      fetchCustomerDueDateFromErp(params),
  });
