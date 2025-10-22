import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useUploadEvaluationsByExcel = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ courseGroupId, payload }) => {
      if (!courseGroupId) throw new Error('Id requerido');
      const res = await axiosPrivate.post(
        `/api/v1/evaluations/upload/${courseGroupId}/`,
        payload
      );
      return res.data;
    },
  });
};
