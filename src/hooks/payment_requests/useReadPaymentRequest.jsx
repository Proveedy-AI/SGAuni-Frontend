// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadPaymentRequest = () => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['payment-request'],
		queryFn: async () => {
			const res = await axiosPrivate.get(`/api/v1/payment-requests/`);
			return res.data;
		},
	});
};
