// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadMethodPayment = () => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['method-payment'],
		queryFn: async () => {
			const res = await axiosPrivate.get(`/api/v1/payment-methods/`);
			return res.data;
		},
	});
};
