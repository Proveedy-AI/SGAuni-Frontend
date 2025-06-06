// src/hooks/countries/useCreateCountry.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useCreateAdmissions = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (payload) => {
			const res = await axiosPrivate.post(
				'/api/v1/admission-processes/',
				payload
			);
			return res.data;
		},
	});
};
