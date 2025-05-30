import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadUsers = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['users', params],
		queryFn: async () => {
			const response = await axiosPrivate.get('/user/internal', { params });
			return response.data;
		},
	});
};
