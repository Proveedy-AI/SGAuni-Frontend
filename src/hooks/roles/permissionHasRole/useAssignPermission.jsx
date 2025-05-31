import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../../axios/useAxiosPrivate';

export const useAssignPermission = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (payload) => {
			const res = await axiosPrivate.post(`api/v1/roles/${payload.role_id}/assign_permissions/`, payload);
			return res.data;
		},
	});
};
