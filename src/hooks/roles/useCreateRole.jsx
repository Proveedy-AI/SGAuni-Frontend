// src/hooks/roles/useCreateRole.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useCreateRole = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (payload) => {
			const res = await axiosPrivate.post('/api/v1/roles/', payload);
			return res.data;
		},
	});
};
