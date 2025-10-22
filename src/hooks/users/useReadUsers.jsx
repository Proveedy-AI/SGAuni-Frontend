import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadUsers = (params = {}, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['users', params],
		queryFn: async () => {
			const response = await axiosPrivate.get('/api/v1/users/', { params });
			return response.data;
		},
		...options, // Ahora puedes pasar `enabled: false`, `refetchOnWindowFocus`, etc.
	});
};
