import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadVouchers = (params = {}) => {
  const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['payment_vouchers', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/payment-vouchers/', { params });
			return res.data;
		},
	});
};
