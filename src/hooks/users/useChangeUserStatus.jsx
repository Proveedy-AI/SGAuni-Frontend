import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/auth';

export const useChangeUserStatus = () => {
	const [loading, setLoading] = useState(false);
	const { getToken } = useAuth();

	const changeStatus = async (payload, user_id) => {
		setLoading(true);

		try {
			const token = getToken();
			const response = await axios.post(
				import.meta.env.VITE_API_URL + `/user/toggle-status/${user_id}`,
				payload,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			return response.data;
		} catch (err) {
			const errorMessage =
				err.response?.data?.message ||
				err.response?.data?.error ||
				err.message ||
				'Ocurrió un error al intentar cambiar el estado.';

			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { changeStatus, loading };
};
