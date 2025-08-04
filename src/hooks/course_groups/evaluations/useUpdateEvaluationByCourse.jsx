import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useMutation } from '@tanstack/react-query';

export const useUpdateEvaluationByCourse = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await axiosPrivate.patch(`/api/v1/evaluation-components/${id}/`, payload);
      return res.data;
    },
  });
};