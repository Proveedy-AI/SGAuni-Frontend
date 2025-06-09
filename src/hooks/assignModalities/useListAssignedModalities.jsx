// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useListAssignedModalities = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['assignedModalities', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/program-modalities/', {
				params,
			});
			return res.data;
		},
	});
};
