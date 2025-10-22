import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useMutation } from '@tanstack/react-query';

export const useDeleteEvaluationByCourse = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axiosPrivate.delete(`/api/v1/evaluation-components/${id}/`);
      return res.data;
    },
  });
};