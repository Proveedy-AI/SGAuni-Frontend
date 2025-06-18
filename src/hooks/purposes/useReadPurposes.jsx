// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadPurposes = () => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['purposes'],
		queryFn: async () => {
			const res = await axiosPrivate.get(`/api/v1/purposes/`);
			return res.data;
		},
	});
};
