// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadDepartments = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['departments', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/departments/', { params });
			return res.data;
		},
	});
};
