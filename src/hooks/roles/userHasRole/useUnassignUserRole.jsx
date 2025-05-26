import { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import axios from 'axios';

export const useUnassignUserRole = () => {
	const [loading, setLoading] = useState(false);
	const { getToken } = useAuth();

	const unassignRole = async (payload) => {
		setLoading(true);

		try {
			const token = getToken();
			const response = await axios.post(
				import.meta.env.VITE_API_URL +
					'/user-has-role/unassign-user-role',
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
				'Ocurrió un error al intentar quitar el permiso.';

			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { unassignRole, loading };
};
