import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useDeleteContracts = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (id) => {
			const res = await axiosPrivate.delete(`/api/v1/contracts/${id}/`);
			return res.data;
		},
	});
};
