// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadAdmissionsProgramPending = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['admission-pending', params],
		queryFn: async () => {
			const res = await axiosPrivate.get(
				'/api/v1/admission-reviews/pending_reviews/',
				{
					params,
				}
			);
			return res.data;
		},
	});
};
