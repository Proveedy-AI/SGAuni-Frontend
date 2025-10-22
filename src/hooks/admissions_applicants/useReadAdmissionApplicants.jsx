// src/hooks/admission/useReadAdmissionApplicants.jsx
import { useInfiniteQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadAdmissionApplicants = (initialParams = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useInfiniteQuery({
		queryKey: ['admission_applications', initialParams],
		queryFn: async ({ pageParam = 1 }) => {
			const res = await axiosPrivate.get('/api/v1/admission-applications/', {
				params: { ...initialParams, page: pageParam },
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
