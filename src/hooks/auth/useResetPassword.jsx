import { useState } from 'react';
import axios from 'axios';

export const useResetPassword = () => {
	const [loading, setLoading] = useState(false);

	const reset = async (payload) => {
		setLoading(true);

		try {
			const response = await axios.post(
				import.meta.env.VITE_API_URL + '/auth/recovery-password-reset',
				payload,
				{}
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

	return { reset, loading };
};
