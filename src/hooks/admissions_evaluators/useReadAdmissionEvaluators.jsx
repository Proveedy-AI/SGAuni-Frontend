// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadAdmissionEvaluators = (params = {}, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['admission_evaluators', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/admission-evaluators/', {
				params,
			});
			return res.data;
		},
		...options, // permite opciones como enabled, refetchOnWindowFocus, etc.
	});
};
