// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import axios from '@/api/axios';

export const useReadDepartments = (params = {}) => {

	return useQuery({
		queryKey: ['departments', params],
		queryFn: async () => {
			const res = await axios.get('/api/v1/departments/', { params });
			return res.data;
		},
	});
};
