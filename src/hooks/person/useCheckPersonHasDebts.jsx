import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useCheckPersonHasDebts = (uuid, options={}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['personHasDebts', uuid],
		queryFn: async () => {
			const res = await axiosPrivate.get(`/api/v1/person/debt-status/${uuid}`);
			return res.data;
		},
	 ...options,
	});
};
