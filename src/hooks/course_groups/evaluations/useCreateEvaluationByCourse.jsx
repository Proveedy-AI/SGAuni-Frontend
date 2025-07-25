import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useMutation } from '@tanstack/react-query';
export const useCreateEvaluationByCourse = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPrivate.post('/api/v1/evaluations-components/', payload);
      return res.data;
    },
  });
};
