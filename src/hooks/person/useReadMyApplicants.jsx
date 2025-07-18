import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadMyApplicants = (options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['my-applicants'],
		queryFn: async () => {
			const res = await axiosPrivate.get(`/api/v1/persons/my_applications/`);
			return res.data;
		},
		...options, // permite pasar enabled, staleTime, etc.
	});
};
