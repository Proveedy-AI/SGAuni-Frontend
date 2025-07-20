import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadDebtStatus = (params = {}, options = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['debt-status', params],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/api/v1/persons/debt_status/`, { params });
      return res.data;
    },
    ...options, // permite pasar enabled, staleTime, etc.
  });
};
