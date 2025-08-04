import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useCreateEvaluationComponents = () => {
  const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (payload) => {
			const res = await axiosPrivate.post('/api/v1/evaluation-components', payload);
			return res.data;
		},
	});
};
