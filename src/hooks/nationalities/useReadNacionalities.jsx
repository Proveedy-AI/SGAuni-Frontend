import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadNacionalities = (params = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['nationalities', params],
    queryFn: async () => {
      const res = await axiosPrivate.get('/api/v1/nationalities/', { params });
      return res.data;
    },
  });
};
