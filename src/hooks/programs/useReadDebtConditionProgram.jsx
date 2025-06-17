import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadDebtConditionProgram = (params = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['programs-debts', params],
    queryFn: async () => {
      const res = await axiosPrivate.get('/api/v1/admission-debts/', { params });
      return res.data;
    },
  });
};
