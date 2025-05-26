import { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import axios from 'axios';

export const useReorderRole = () => {
	const [loading, setLoading] = useState(false);
	const { getToken } = useAuth();

	const reorder = async (id, direction) => {
		setLoading(true);

		try {
			const token = getToken();
			const response = await axios.patch(
				import.meta.env.VITE_API_URL +
					`/role/reorder/${id}?dir=${direction}`,
				{},
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
				'Ocurrió un error al intentar reordenar los datos.';

			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { reorder, loading };
};
