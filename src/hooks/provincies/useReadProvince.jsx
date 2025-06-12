// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import axios from '@/api/axios';

export const useReadProvince = (params = {}) => {

	return useQuery({
		queryKey: ['provinces', params],
		queryFn: async () => {
			const res = await axios.get('/api/v1/provinces/', { params });
			return res.data;
		},
	});
};
