// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import axios from '@/api/axios';

export const useReadDistrict = (params = {}) => {

	return useQuery({
		queryKey: ['districts', params],
		queryFn: async () => {
			const res = await axios.get('/api/v1/districts/', { params });
			return res.data;
		},
	});
};
