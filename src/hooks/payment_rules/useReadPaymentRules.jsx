// src/hooks/payment/useReadPaymentRules.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadPaymentRules = ({ payment_purpose }) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['payment-rules', payment_purpose],
		enabled: !!payment_purpose, // solo corre si hay valor
		queryFn: async () => {
			const res = await axiosPrivate.get(`/api/v1/payment-rules/`, {
				params: {
					payment_purpose,
				},
			});
			return res.data;
		},
	});
};
