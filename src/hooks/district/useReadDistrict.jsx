// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadDistrict = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['districts', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/districts/', { params });
			return res.data;
		},
	});
};
