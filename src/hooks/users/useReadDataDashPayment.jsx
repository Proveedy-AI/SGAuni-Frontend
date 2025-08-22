import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadDataDashPayment = (params = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['data-dashboard-debt', params], // ✅ incluye params en la cache key
    queryFn: async () => {
      const response = await axiosPrivate.get(
        '/api/v1/users/dashboard/payment-administrator/',
        { params } // ✅ pasa parámetros dinámicos
      );
      return response.data;
    },
  });
};
