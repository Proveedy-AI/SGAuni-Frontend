import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadReportAdmission = (params = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['report-admission', params], // ✅ incluye params en la cache key
    queryFn: async () => {
      const response = await axiosPrivate.get(
        '/api/v1/users/dashboard-admission/',
        { params }
      );
      return response.data;
    },
  });
};
