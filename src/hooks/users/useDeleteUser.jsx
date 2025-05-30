import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useDeleteUser = () => {
	const axiosPrivate = useAxiosPrivate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id) => {
			const res = await axiosPrivate.delete(`/user/${id}`);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['users']);
		},
	});
};
