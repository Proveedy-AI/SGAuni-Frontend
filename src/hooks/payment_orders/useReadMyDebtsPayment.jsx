// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadMyDebtsPayment = () => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['my-debts'],
		queryFn: async () => {
			try {
				const res = await axiosPrivate.get(`/api/v1/payment-orders/my-debts/`);
				return res.data || [];
			} catch (error) {
				return []; // Si hay error, devuelve array vacío
			}
		},
		retry: false, // No reintentar si falla
	});
};
