// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadDisabilities = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['disabilities', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/type-disabilities/', {
				params,
			});
			return res.data;
		},
	});
};
