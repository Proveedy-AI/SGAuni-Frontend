// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadPaymentRules = () => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['payment-rules'],
		queryFn: async () => {
			const res = await axiosPrivate.get(`/api/v1/payment-rules/`);
			return res.data;
		},
	});
};
