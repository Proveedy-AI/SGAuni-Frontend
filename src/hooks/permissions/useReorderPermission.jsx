// src/hooks/permissions/useReorderPermission.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReorderPermission = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async ({ id, direction }) => {
			const res = await axiosPrivate.patch(`/permission/reorder/${id}?dir=${direction}`, {});
			return res.data;
		},
	});
};
