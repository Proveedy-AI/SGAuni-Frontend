import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/auth';
import axios from 'axios';

export const useReadRoles = (params = {}) => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [error, setError] = useState(null);
	const { getToken } = useAuth();

	const fetchRoles = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const token = getToken();

			if (!token) {
				throw new Error('El usuario no está autenticado.');
			}

			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/role`,
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
					: 'A ocurrido un error al intentar listar los datos.'
			);
		} finally {
			setLoading(false);
		}
	}, [params, getToken]);

	useEffect(() => {
		fetchRoles();
	}, []);

	return { loading, data, error, fetchRoles };
};
