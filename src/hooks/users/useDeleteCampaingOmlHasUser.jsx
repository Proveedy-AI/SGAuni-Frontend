import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/auth';

export const useDeleteCampaingOmlHasUser = () => {
	const [loading, setLoading] = useState(false);
	const { getToken } = useAuth();

	const remove = async (payload) => {
		setLoading(true);

		try {
			const token = getToken();
			const response = await axios.delete(
				import.meta.env.VITE_API_URL + `/omnileads/unassign-user-campaign`,
				{
					headers: { Authorization: `Bearer ${token}` },
					data: payload,
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
