// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadConvalidationRegister = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();
	return useQuery({
		queryKey: ['convalidations', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/convalidation-registers/', {
				params,
			});
			return res.data;
		},
	});
};
