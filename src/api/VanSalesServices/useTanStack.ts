import { useMutation } from '@tanstack/react-query';
import { updateVanPosition } from './vansales-services';

export const useUpdateVanPosition = () =>
  useMutation({
    mutationKey: ['vansales-services', 'update-van-position'],
    mutationFn: updateVanPosition,
  });
