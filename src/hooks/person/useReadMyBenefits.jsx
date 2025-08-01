import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadMyBenefits = (options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['my-benefits'],
		queryFn: async () => {
			try {
				const res = await axiosPrivate.get(`/api/v1/persons/current-benefit/`);
				return res.data;
			} catch (error) {
				if (error?.response?.status === 400) {
					// Evita retry para este tipo de error
					throw new Error('SIN_BENEFICIO');
				}
				throw error;
			}
		},
		retry: (failureCount, error) => {
			// Si el error fue SIN_BENEFICIO, no reintentar
			if (error.message === 'SIN_BENEFICIO') return false;
			return failureCount < 3; // hasta 3 reintentos para otros errores
		},
		...options,
	});
};
