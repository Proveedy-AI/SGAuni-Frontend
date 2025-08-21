import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useUpdateTransferRequest = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await axiosPrivate.patch(`/api/v1/internal-transfer-requests/${id}/review/decision/`, payload);
      return res.data;
    },
  });
};
