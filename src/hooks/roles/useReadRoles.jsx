import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadRoles = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['roles', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/roles/', { params });
			return res.data;
		},
	});
};
