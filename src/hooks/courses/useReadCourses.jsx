import { useQuery } from '@tanstack/react-query';
import axios from '@/api/axios';

export const useReadCourses = (params = {}) => {

	return useQuery({
		queryKey: ['courses', params],
		queryFn: async () => {
			const res = await axios.get('/api/v1/courses/', { params });
			return res.data;
		},
	});
};
