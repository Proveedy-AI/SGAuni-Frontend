// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadMyPaymentVouchers = () => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['payment-my-vouchers'],
		queryFn: async () => {
			const res = await axiosPrivate.get(`/api/v1/persons/my_vouchers/`);
			return res.data;
		},
	});
};
