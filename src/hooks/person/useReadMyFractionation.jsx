import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadMyFractionation = (options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['my_fractionation'],
		queryFn: async () => {
			const res = await axiosPrivate.get(`/api/v1/persons/request-debt-installment/`);
			return res.data;
		},
		...options, // permite pasar enabled, staleTime, etc.
	});
};
