// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadNationality = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['nationality', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/nationalities/', { params });
			return res.data;
		},
	});
};
