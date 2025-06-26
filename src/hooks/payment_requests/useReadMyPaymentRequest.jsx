// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadMyPaymentRequest = () => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['payment-my-request'],
		queryFn: async () => {
			const res = await axiosPrivate.get(`/api/v1/persons/my_requests/`);
			return res.data;
		},
	});
};
