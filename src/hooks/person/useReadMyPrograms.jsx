import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadMyPrograms = (options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['my-programs'],
		queryFn: async () => {
			const res = await axiosPrivate.get(`/api/v1/persons/my_programs/`);
			return res.data;
		},
		...options, // permite pasar enabled, staleTime, etc.
	});
};
