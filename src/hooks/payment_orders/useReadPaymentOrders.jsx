import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadPaymentOrders = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    queryKey: ['payment_orders'],
		queryFn: async () => {
      const res = await axiosPrivate.get(`/api/v1/payment-orders/`);
      return res.data;
    },
  });
};
