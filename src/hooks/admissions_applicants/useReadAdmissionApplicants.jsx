// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadAdmissionApplicants = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['admission_applications', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/admission-applications/', {
				params,
			});
			return res.data;
		},
	});
};
