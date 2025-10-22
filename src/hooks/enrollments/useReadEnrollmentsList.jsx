// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadEnrollmentsList = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['enrollments', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/enrollments/', {
				params,
			});
			return res.data;
		},
	});
};
