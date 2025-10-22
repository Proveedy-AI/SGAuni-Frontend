import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadCourses = (params = {}, options = {}) => {
  const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['courses', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/courses/', { params });
			return res.data;
		},
		...options, // permite pasar `enabled`, `staleTime`, etc.
	});
};
