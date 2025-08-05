// src/hooks/countries/useUpdateCountry.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useUpdateAdmissionApplicants = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (id) => {
			const res = await axiosPrivate.patch(
				`/api/v1/admission-applications/complete/${id}/`
			);
			return res.data;
		},
	});
};
