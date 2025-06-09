import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useDeleteAdmissionEvaluator = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axiosPrivate.delete(
        `/api/v1/admission-evaluators/${id}/`
      );
      return res.data;
    },
  });
};
