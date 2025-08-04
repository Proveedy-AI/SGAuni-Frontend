import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadMyNotifications = (params = {}, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['my_notifications', params],
		queryFn: async () => {
			const res = await axiosPrivate.get(
				'/api/v1/notifications/my_notifications/',
				{ params }
			);
			return res.data;
		},
		refetchInterval: 60000, // 👈 vuelve a consultar cada 1 minuto
		...options,
	});
};
