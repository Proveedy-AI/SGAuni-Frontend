import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/auth';

export const useDeleteUser = () => {
	const [loading, setLoading] = useState(false);
	const { getToken } = useAuth();

	const remove = async (id) => {
		setLoading(true);

		try {
			const token = getToken();
			const response = await axios.delete(
				import.meta.env.VITE_API_URL + `/user/${id}`,
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
				'Ocurrió un error al intentar eliminar los datos.';

			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { remove, loading };
};
