import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useUpdateRole = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (payload) => {
			const res = await axiosPrivate.patch(`/api/v1/roles/${payload.id}/`, payload);
			return res.data;
		},
	});
};