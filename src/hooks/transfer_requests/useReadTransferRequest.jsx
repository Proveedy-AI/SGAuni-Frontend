import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadTransferRequest = (params = {}, options = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['transfer-requests', params],
    queryFn: async () => {
      const res = await axiosPrivate.get('/api/v1/internal-transfer-requests/', { params });
      return res.data;
    },
    ...options,
  });
};
