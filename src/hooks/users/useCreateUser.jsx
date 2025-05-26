import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/auth';

export const useCreateUser = () => {
	const [loading, setLoading] = useState(false);
	const { getToken } = useAuth();

	const register = async (payload) => {
		setLoading(true);

		try {
			const token = getToken();
			const response = await axios.post(
				import.meta.env.VITE_API_URL + '/user',
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
				'Ocurrió un error al intentar registrar los datos.';

			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { register, loading };
};
