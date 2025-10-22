// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadPaymentDebts = (params = {}, options = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['admission_debts', params],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/api/v1/admission-debts/`, {
        params
      });
      return res.data;
    },
		...options, // Permite `enabled`, `staleTime`, etc.
  });
};
