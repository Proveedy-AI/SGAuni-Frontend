// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadAdmissionsProgramAproved = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['admission-aproved', params],
		queryFn: async () => {
			const res = await axiosPrivate.get(
				'/api/v1/admission-reviews/active-programs/',
				{
					params,
				}
			);
			return res.data;
		},
	});
};
