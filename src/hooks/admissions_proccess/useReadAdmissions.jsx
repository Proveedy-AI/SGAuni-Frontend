// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadAdmissions = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['countries', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/admission-processes/', {
				params,
			});
			return res.data;
		},
	});
};
