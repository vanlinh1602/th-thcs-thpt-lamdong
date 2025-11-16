import { useQuery } from '@tanstack/react-query';

import { getSystemConfig } from '../api';

export const useSystemConfig = () => {
  return useQuery({
    queryKey: ['systemConfig'],
    queryFn: () => getSystemConfig(),
    staleTime: 1000 * 60 * 60 * 1, // 1 hour
  });
};
