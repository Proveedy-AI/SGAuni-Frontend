import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../../axios/useAxiosPrivate';

export const useAssignPermission = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async ({ role_id, permission_ids }) => {
			const res = await axiosPrivate.post(
				`api/v1/roles/${role_id}/assign_permissions/`,
				{ permission_ids }
			);
			return res.data;
		},
	});
};
