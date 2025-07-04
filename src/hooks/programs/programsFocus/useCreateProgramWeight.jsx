// src/hooks/countries/useCreateCountry.jsx
import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useMutation } from '@tanstack/react-query';


export const useCreateProgramWeight = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (payload) => {
			const res = await axiosPrivate.post(
				'/api/v1/focus-weights/',
				payload
			);
			return res.data;
		},
	});
};
