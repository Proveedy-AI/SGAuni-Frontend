import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadScheduleTypes = (params = {}, options = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['type-schedules', params],
    queryFn: async () => {
      const res = await axiosPrivate.get('/api/v1/type-schedules/', { params });
      return res.data;
    },
    ...options,
  });
};
