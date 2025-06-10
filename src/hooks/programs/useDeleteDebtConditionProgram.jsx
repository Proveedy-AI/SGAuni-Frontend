import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useDeleteDebtConditionProgram = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (programId) => {
      const res = await axiosPrivate.delete(`/api/v1/postgraduate-programs/${programId}/remove-debt-condition`);
      return res.data;
    },
  });
};
