import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadInstallmentsPlans = (params = {}, options = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['installments', params],
    queryFn: async () => {
      const res = await axiosPrivate.get('/api/v1/payment-installments/', {
        params,
      });
      return res.data;
    },
    ...options, // permite pasar enabled, staleTime, select, etc.
  });
};
