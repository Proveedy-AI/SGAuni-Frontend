import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadModalityRules = (params = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['modality_rules', params],
    queryFn: async () => {
      const res = await axiosPrivate.get('/api/v1/modality-rules/', { params });
      return res.data;
    },
  });
};
