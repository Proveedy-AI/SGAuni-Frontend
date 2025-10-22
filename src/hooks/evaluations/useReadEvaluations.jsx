import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadEvaluations = (params = {}, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['evaluation-components', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/evaluations/', {
				params,
			});
			return res.data;
		},
		...options,
	});
};
