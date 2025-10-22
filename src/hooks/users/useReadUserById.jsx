import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadUserById = ({ id, enabled = true }) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['user', id],
		queryFn: async () => {
			const response = await axiosPrivate.get(`/api/v1/users/${id}/`);
			return response.data;
		},
		enabled: !!id && enabled, // solo ejecuta si hay id y enabled no es false
	});
};
