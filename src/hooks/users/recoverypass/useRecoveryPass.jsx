import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

export const useRecoveryPass = (params = {}) => {
	return useQuery({
		queryKey: ['recovery-pass', params],
		queryFn: async () => {
			const response = await axios.get(`${API_URL}/api/v1/password-reset/validate_user/`, {
				params,
			});
			return response.data;
		},
		enabled: false,
	});
};
