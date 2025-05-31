import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';


export const useReadPermissionHasRole = (id, params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['roles_has_permissions', id, params],
		queryFn: async () => {
			const res = await axiosPrivate.get(`api/v1/roles/${id}/permissions_in_rol/`, {
				params,
			});
			return res.data;
		},
		enabled: !!id, // evita la llamada si no hay id
	});
};
