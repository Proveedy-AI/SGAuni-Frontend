import { useState } from 'react';
import axios from 'axios';

export const useGenerateTokenRecovery = () => {
	const [loading, setLoading] = useState(false);

	const generate = async (email) => {
		setLoading(true);

		try {
			const response = await axios.post(
				import.meta.env.VITE_API_URL +
					`/auth/recovery-password-create/${email}/1`,
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

	return { generate, loading };
};
