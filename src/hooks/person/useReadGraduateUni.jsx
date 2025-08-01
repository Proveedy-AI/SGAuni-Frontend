import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadGraduateUni = (options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['graduate-uni'],
		queryFn: async () => {
			const res = await axiosPrivate.get(`/api/v1/persons/uni-graduate/`);
			return res.data;
		},
		...options, // permite pasar enabled, staleTime, etc.
	});
};
