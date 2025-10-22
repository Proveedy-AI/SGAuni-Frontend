// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadPaymentVoucherById = (id) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['payment_vouchers', id],
    queryFn: async () => {
      if (!id) throw new Error('ID requerido');
      const res = await axiosPrivate.get(`/api/v1/payment-vouchers/${id}/`);
      return res.data;
    },
    enabled: !!id, // solo corre si hay un id válido
  });
};
