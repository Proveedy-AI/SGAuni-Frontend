import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';


export const useReadProgramsFocus = (params = {}, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['programs-focus', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/admission-focus/', {
				params,
			});
			return res.data;
		},
		...options, // permite `enabled`, `refetchOnWindowFocus`, etc.
	});
};
