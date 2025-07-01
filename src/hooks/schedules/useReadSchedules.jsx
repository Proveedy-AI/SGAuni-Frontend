import { useQuery } from '@tanstack/react-query';
import axios from '@/api/axios';

export const useReadSchedules = (params = {}) => {

	return useQuery({
		queryKey: ['schedules', params],
		queryFn: async () => {
			const res = await axios.get('/api/v1/schedules/', { params });
			return res.data;
		},
	});
};
