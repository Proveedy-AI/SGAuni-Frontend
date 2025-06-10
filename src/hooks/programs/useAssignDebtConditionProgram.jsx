import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useMutation } from '@tanstack/react-query';

export const useAssignDebtConditionProgram = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ programId, payload }) => {
      console.log({ programId, payload })
      const res = await axiosPrivate.post(`/api/v1/postgraduate-programs/${programId}/assign-debt-condition`, payload);
      return res.data;
    },
  });
};
