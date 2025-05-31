import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../../axios/useAxiosPrivate';

export const useUnassignUserRole = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (payload) => {
			const res = await axiosPrivate.post(
				'/user-has-role/unassign-user-role',
				payload
			);
			return res.data;
		},
	});
};
