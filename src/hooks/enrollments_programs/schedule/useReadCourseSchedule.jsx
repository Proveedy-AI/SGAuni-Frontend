import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';

export const useReadCourseSchedule = (params = {}, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['course-schedules', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/course-schedules/', { params });
			return res.data;
		},
		// opciones adicionales como enabled, staleTime, etc.
		...options,
	});
};
