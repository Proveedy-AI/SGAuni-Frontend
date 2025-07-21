// src/hooks/countries/useCreateCountry.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useGeneratePaymentOrderExcel = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (uuid, payload) => {
			const res = await axiosPrivate.post(
				`/api/v1/enrollment-programs/payment-orders/${uuid}/`,
				payload
			);
			return res.data;
		},
	});
};
