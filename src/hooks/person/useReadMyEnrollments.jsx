import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadMyEnrollments = (options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['my-enrollments'],
		queryFn: async () => {
			const res = await axiosPrivate.get(`/api/v1/persons/my_enrollments/`);
			return res.data;
		},
		...options, // permite pasar enabled, staleTime, etc.
	});
};
