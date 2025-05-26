import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/auth';

export const useUpdatePermission = () => {
	const [loading, setLoading] = useState(false);
	const { getToken } = useAuth();

	const update = async (payload, id) => {
		setLoading(true);

		try {
			const token = getToken();
			const response = await axios.patch(
				import.meta.env.VITE_API_URL + `/permission/${id}`,
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
				'Ocurrió un error al intentar editar los datos.';

			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { update, loading };
};
