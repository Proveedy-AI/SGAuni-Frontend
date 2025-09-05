import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useUpdatePaymentRequest = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await axiosPrivate.patch(
        `/api/v1/payment-requests/${id}/`,
        payload
      );
      return res.data;
    },
  });
};
