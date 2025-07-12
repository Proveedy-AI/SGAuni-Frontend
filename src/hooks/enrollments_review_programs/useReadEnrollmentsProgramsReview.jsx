// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadEnrollmentsProgramsReview = (params = {}, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['enrollment-programs-review', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/enrollment-process-reviews/', {
				params,
			});
			return res.data;
		},
		...options,
	});
};
