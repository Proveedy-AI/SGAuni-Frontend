// src/hooks/auth/useChangePassword.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useChangePassword = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (payload) => {
			const response = await axiosPrivate.post(
				'/auth/change-password',
				payload
			);
			return response.data;
		},
	});
};
