import { useInfiniteQuery } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';

export const useReadCourseSchedule = (params = {}, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useInfiniteQuery({
		queryKey: ['course-schedules', params],
		queryFn: async ({ pageParam = 1 }) => {
			const res = await axiosPrivate.get('/api/v1/course-schedules/', {
				params: {
					...params,
					page: pageParam,
				},
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
		...options, // aquí puedes pasar enabled, staleTime, retry, etc.
	});
};
