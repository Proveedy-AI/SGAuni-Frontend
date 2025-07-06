// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadAdmissionsPrograms = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['admission-programs', params],
		queryFn: async () => {
			const res = await axiosPrivate.get(
				'/api/v1/admission-process-programs/',
				{
					params,
				}
			);
			console.log(res.data)
			return res.data;
		},
	});
};
