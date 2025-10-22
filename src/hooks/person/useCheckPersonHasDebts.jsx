import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useCheckPersonHasDebts = (uuid, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['personHasDebts', uuid],
		queryFn: async () => {
			if (!uuid) throw new Error('UUID is required');
			const res = await axiosPrivate.get(`/api/v1/persons/debt-status/${uuid}/`);
			return res.data;
		},
		enabled: !!uuid,
		...options,
	});
};

