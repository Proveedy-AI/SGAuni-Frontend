// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import axios from '@/api/axios';

export const useReadDisabilities = (params = {}) => {


	return useQuery({
		queryKey: ['disabilities', params],
		queryFn: async () => {
			const res = await axios.get('/api/v1/type-disabilities/', {
				params,
			});
			return res.data;
		},
	});
};
