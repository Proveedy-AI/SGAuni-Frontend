import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../../axios/useAxiosPrivate';

export const useUnassignPermission = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (payload) => {
			const res = await axiosPrivate.post(
				'/role-has-permission/unassign',
				payload
			);
			return res.data;
		},
	});
};
