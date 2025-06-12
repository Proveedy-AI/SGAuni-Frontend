// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import axios from '@/api/axios';

export const useReadCountries = (params = {}) => {

	return useQuery({
		queryKey: ['countries', params],
		queryFn: async () => {
			const res = await axios.get('/api/v1/countries/', { params });
			return res.data;
		},
	});
};
