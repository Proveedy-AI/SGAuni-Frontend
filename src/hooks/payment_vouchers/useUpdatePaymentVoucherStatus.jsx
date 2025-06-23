// src/hooks/countries/useUpdateCountry.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useUpdatePaymentVoucherStatus = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ payload }) => {
      const res = await axiosPrivate.post(
        '/api/v1/payment-vouchers/update-voucher-status/',
        payload
      );
      return res.data;
    },
  });
};
