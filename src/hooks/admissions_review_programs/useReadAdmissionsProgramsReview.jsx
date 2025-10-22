// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadAdmissionsProgramsReview = (params = {}, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['admission-programs-review', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/admission-reviews/', {
				params,
			});
			return res.data;
		},
		...options,
	});
};
