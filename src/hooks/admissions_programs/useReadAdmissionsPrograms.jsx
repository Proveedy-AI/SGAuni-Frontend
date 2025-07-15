// src/hooks/admission-programs/useReadAdmissionsPrograms.jsx
import { useInfiniteQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadAdmissionsPrograms = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useInfiniteQuery({
		queryKey: ['admission-programs', params],
		queryFn: async ({ pageParam = 1 }) => {
			const res = await axiosPrivate.get(
				'/api/v1/admission-process-programs/',
				{
					params: {
						...params,
						page: pageParam,
					},
				}
			);
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
