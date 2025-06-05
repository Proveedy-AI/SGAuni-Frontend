// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadProvince = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['provinces', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/provinces/', { params });
			return res.data;
		},
	});
};
