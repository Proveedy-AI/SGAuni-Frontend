// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadAcademicDegrees = (params = {}) => {
  const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['academic-degrees', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/academic-degrees/', { params });
			return res.data;
		},
	});
};
