import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadMyCredits = (options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['my-credits'],
		queryFn: async () => {
			const res = await axiosPrivate.get(`/api/v1/persons/credits/`);
			return res.data;
		},
		...options, // permite pasar enabled, staleTime, etc.
	});
};
