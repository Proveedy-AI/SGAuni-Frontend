import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadNotification = (params = {}, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['notifications', params],
		queryFn: async () => {
			const res = await axiosPrivate.get(
				'/api/v1/notifications/',
				{ params }
			);
			return res.data;
		},
		...options,
	});
};
