// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadCountries = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['countries', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/countries/', { params });
			return res.data;
		},
	});
};
