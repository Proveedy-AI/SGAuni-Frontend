// src/hooks/roles/useReorderRole.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReorderRole = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async ({ id, direction }) => {
			const res = await axiosPrivate.patch(`/role/reorder/${id}?dir=${direction}`, {});
			return res.data;
		},
	});
};
