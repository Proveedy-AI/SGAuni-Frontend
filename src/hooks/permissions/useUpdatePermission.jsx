import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useUpdatePermission = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (payload) => {
			const res = await axiosPrivate.patch(
				`/api/v1/permissions/${payload.id}/`,
				payload
			);
			return res.data;
		},
	});
};
