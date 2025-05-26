import { useCallback, useState } from 'react';
import { useAuth } from '@/hooks/auth';
import axios from 'axios';

export const useReadCampaignUsers = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [error, setError] = useState(null);
	const { getToken } = useAuth();

	const fetchCampaignUsers = useCallback(
		async (params) => {
			// Validación: No ejecutar si no hay filtro definido
			if (!params || Object.keys(params).length === 0) {
				return;
			}

			setLoading(true);
			setError(null);
			try {
				const token = getToken();
				if (!token) {
					throw new Error('El usuario no está autenticado.');
				}

				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/omnileads/campaigns`,
					{
						headers: { Authorization: `Bearer ${token}` },
						params,
					}
				);

				setData(response.data);
			} catch (err) {
				setData([]);
				setError(
					err.response
						? err.response.data
						: 'Ha ocurrido un error al listar los datos.'
				);
			} finally {
				setLoading(false);
			}
		},
		[getToken]
	);

	return { loading, data, error, fetchCampaignUsers };
};
