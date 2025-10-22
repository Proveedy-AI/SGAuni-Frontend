// src/hooks/countries/useCreateCountry.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useCreateProgramsReview = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (id) => {
			const res = await axiosPrivate.patch(
				`/api/v1/admission-process-programs/${id}/send_to_review/`
			);
			return res.data;
		},
	});
};
