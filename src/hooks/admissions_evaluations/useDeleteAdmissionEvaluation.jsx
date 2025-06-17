import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useDeleteAdmissionEvaluation = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axiosPrivate.delete(
        `/api/v1/admission-evaluations/${id}/`
      );
      return res.data;
    },
  });
};
