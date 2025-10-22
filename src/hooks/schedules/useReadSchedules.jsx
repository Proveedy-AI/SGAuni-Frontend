import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadSchedules = (params = {}) => {
  const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['schedules', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/course-schedules/', { params });
			return res.data;
		},
	});
};
