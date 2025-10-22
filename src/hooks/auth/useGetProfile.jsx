import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useGetProfile = () => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['userProfile'],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/users/profile/');
			return res.data;
		},
		staleTime: 5 * 60 * 1000, // 5 minutos
	});
};
