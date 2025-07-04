import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadProgramTypes = (params = {}, options = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['postgraduate_program_types', params],
    queryFn: async () => {
      const res = await axiosPrivate.get('/api/v1/postgraduate-program-types/', { params });
      return res.data;
    },
    ...options,
  });
};
