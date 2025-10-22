import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';

export const useReadPermissionHasRole = (id, params = {}, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['roles_has_permissions', id, params],
		queryFn: async () => {
			const res = await axiosPrivate.get(
				`api/v1/roles/${id}/permissions_in_rol/`,
				{
					params,
				}
			);
			return res.data;
		},
		enabled: !!id, // por defecto, evita llamada sin id
		...options, // permite sobreescribir o extender comportamiento
	});
};
