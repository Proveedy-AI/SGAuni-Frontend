// src/hooks/countries/useCreateCountry.jsx
'@/hooks/axios/useAxiosPrivate';
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useCopyAdmissions = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (id) => {
			const res = await axiosPrivate.post(
				`/api/v1/admission-processes/${id}/copy/`
			);
			return res.data;
		},
	});
};
