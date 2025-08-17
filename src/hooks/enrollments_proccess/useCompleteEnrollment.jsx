// src/hooks/countries/useCreateCountry.jsx
'@/hooks/axios/useAxiosPrivate';
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useCompleteEnrollment = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (uuid) => {
			const res = await axiosPrivate.post(
				`/api/v1/enrollment-processes/complete/${uuid}/`
			);
			return res.data;
		},
	});
};
