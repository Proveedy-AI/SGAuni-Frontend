// src/hooks/countries/useReadCountries.jsx
import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';

export const useReadProgramsWeigth = (params = {}, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['programs_weight', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/focus-weights/', {
				params,
			});
			return res.data;
		},
		...options, // permite opciones como enabled, refetchOnWindowFocus, etc.
	});
};
