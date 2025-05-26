import { useCallback, useState } from 'react';
import axios from 'axios';

export const useFindTokenRecovery = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);

	const fetchTokenRecovery = useCallback(async (token) => {
		if (!token) return;
		setLoading(true);
		setError(null);

		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/auth/recovery-password-find/${token}`
			);
			setData(response.data);
		} catch (err) {
			setData(null);
			setError(
				err.response?.data ||
					'Ha ocurrido un error al validar el token.'
			);
		} finally {
			setLoading(false);
		}
	}, []);

	return { loading, data, error, fetchTokenRecovery };
};
