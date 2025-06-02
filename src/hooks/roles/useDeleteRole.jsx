// src/hooks/roles/useDeleteRole.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useDeleteRole = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (id) => {
			const res = await axiosPrivate.delete(`/api/v1/roles/${id}/`);
			return res.data;
		},
	});
};
