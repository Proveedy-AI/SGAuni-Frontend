import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadExcelTemplate = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (courseGroupId) => {
			if (!courseGroupId) throw new Error('Id requerido');

			try {
				const res = await axiosPrivate.get(
					`/api/v1/evaluations/template/${courseGroupId}/`,
					{ responseType: 'blob' } // siempre blob
				);
				return res.data; // ✅ caso éxito (Excel)
			} catch (error) {
				if (error.response?.data instanceof Blob) {
					const text = await error.response.data.text();
					const json = JSON.parse(text);
					throw new Error(json.error || 'Error al procesar respuesta');
				}
				// fallback genérico
				throw new Error(
					error.response?.data?.error ||
						error.response?.data?.detail ||
						error.message ||
						'Error inesperado'
				);
			}
		},
	});
};
