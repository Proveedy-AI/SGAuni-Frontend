import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadUserById = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['users', params],
		queryFn: async () => {
			const response = await axiosPrivate.get(`/api/v1/users/${params.id}/`);
			return response.data;
		},
    enabled: !!params.id && (params.enabled !== false),
	});
};
