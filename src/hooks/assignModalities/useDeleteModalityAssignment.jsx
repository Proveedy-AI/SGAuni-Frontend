import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useDeleteModalityAssignment = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (id) => {
			const res = await axiosPrivate.delete(
				`/api/v1/program-modalities/${id}/`
			);
			return res.data;
		},
	});
};
