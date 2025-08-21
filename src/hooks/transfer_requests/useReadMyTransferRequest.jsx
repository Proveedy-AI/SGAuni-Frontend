import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadMyTransferRequest = (params = {}, options = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['my-transfer-requests', params],
    queryFn: async () => {
      const res = await axiosPrivate.get('/api/v1/internal-transfer-requests/my-requests/', { params });
      return res.data;
    },
    ...options,
  });
};
