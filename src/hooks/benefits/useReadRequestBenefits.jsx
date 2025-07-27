// src/hooks/payment-orders/useReadPaymentOrders.jsx
import { useInfiniteQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadRequestBenefits = (params = {}, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useInfiniteQuery({
		queryKey: ['benefits', params],
		queryFn: async ({ pageParam = 1 }) => {
			const res = await axiosPrivate.get('/api/v1/requests-benefit/', {
				params: { page: pageParam, ...params },
			});
			return res.data;
		},
		getNextPageParam: (lastPage) => {
			if (lastPage.next) {
				const url = new URL(lastPage.next);
				return url.searchParams.get('page');
			}
			return undefined;
		},
		...options,
	});
};
