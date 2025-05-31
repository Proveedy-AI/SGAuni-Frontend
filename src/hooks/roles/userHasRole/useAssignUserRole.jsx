import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../../axios/useAxiosPrivate';

export const useAssignUserRole = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (payload) => {
			const res = await axiosPrivate.post('/user-has-role', payload);
			return res.data;
		},
	});
};
