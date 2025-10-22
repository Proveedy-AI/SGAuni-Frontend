// src/hooks/countries/useCreateCountry.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useCreateRequestBenefits = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (payload) => {
			const res = await axiosPrivate.post('/api/v1/requests-benefit/', payload);
			return res.data;
		},
	});
};
