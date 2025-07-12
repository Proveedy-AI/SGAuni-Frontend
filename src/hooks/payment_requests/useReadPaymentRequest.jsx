// src/hooks/payment-requests/useReadPaymentRequests.jsx
import { useInfiniteQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadPaymentRequest = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useInfiniteQuery({
		queryKey: ['payment-requests', params], // <- importante para que el query se actualice si cambian los filtros
		queryFn: async ({ pageParam = 1 }) => {
			const res = await axiosPrivate.get('/api/v1/payment-requests/', {
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
	});
};
