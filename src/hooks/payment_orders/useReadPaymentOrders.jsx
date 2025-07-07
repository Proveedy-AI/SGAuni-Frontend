import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadPaymentOrders = (params = {}, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['payment_orders', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/payment-orders/', { params });
			return res.data;
		},
		...options,
	});
};
