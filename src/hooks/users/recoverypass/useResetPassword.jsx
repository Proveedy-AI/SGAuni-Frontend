import { useMutation } from '@tanstack/react-query';
import axios from '@/api/axios';

export const useResetPassword = () => {
	return useMutation({
		mutationFn: async (payload) => {
			const response = await axios.post(`/api/v1/password-reset/request_password_reset/`, payload);
			return response.data;
		},
	});
};
