// src/hooks/countries/useUpdateCountry.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useAproveeAdmissionsPrograms = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async ({ id, payload }) => {
			const res = await axiosPrivate.patch(
				`/api/v1/admission-reviews/${id}/process_schedule/`,
				payload
			);
			return res.data;
		},
	});
};
