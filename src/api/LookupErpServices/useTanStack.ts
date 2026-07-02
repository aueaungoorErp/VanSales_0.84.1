import { useMutation } from '@tanstack/react-query';
import { getDocSwitch } from './lookup-erp-services';
import type { getDocSwitchParam } from './param';

export const useGetDocSwitch = () =>
  useMutation({
    mutationKey: ['lookup-erp-services', 'doc-switch'],
    mutationFn: (params?: getDocSwitchParam) => getDocSwitch(params),
  });
