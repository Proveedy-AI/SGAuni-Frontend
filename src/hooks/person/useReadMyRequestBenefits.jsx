import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadMyRequestBenefits = (options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['benefits'],
		queryFn: async () => {
			const res = await axiosPrivate.get(`/api/v1/persons/my_request_benefits/`);
			return res.data;
		},
		...options, // permite pasar enabled, staleTime, etc.
	});
};
