import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadPrograms = (params = {}, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['programs', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/postgraduate-programs/', {
				params,
			});
			return res.data;
		},
		...options, // permite `enabled`, `refetchOnWindowFocus`, etc.
	});
};
