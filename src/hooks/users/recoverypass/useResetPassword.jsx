import { useQuery } from '@tanstack/react-query';
import { axiosPrivate } from '@/api';

const API_URL = import.meta.env.VITE_API_URL;

export const useResetPassword = () => {
	return useQuery({
		queryKey: ['recovery-pass'],
		queryFn: async (payload) => {
			const response = await axiosPrivate.post(`${API_URL}/api/v1/request_password_reset/`, payload);
			return response.data;
		},
		enabled: false,
	});
};

