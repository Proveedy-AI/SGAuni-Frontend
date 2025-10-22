import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadDataDirectorMain = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['principal-director', params], // ✅ incluye params en la cache key
		queryFn: async () => {
			const response = await axiosPrivate.get(
				'/api/v1/users/principal-director/',
				{ params } // ✅ pasa parámetros dinámicos
			);
			return response.data;
		},
	});
};
