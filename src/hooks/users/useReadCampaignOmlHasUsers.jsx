import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/auth';
import axios from 'axios';

export const useReadCampaignOmlHasUsers = (params) => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [error, setError] = useState(null);
	const { getToken } = useAuth();

	const fetchCampaignOmlHasUsers = useCallback(async () => {
		if (!params) return; // Evita llamadas innecesarias si no hay un `params`

		setLoading(true);
		setError(null);

		try {
			const token = getToken();

			if (!token) {
				throw new Error('El usuario no está autenticado.');
			}

			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/omnileads/list-user-campaigns/${params}`,
				{
					headers: { Authorization: `Bearer ${token}` },
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
	}, [params, getToken]); // ✅ `params` y `getToken` como dependencias

	useEffect(() => {
		fetchCampaignOmlHasUsers();
	}, [fetchCampaignOmlHasUsers]); // ✅ `useEffect` se ejecuta cuando `fetchOpProducts` cambia

	return { loading, data, error, fetchCampaignOmlHasUsers };
};
