// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadContracts = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['contracts', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/contracts/', { params });
			return res.data;
		},
	});
};
