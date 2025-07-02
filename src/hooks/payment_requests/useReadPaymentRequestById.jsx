import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadPaymentRequestById = (id) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['payment-request', id],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/api/v1/payment-requests/${id}/`);
      return res.data;
    },
    enabled: !!id
  });
};
