import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadReportEnrollment = (params = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['report-enrollment', params], // ✅ incluye params en la cache key
    queryFn: async () => {
      const response = await axiosPrivate.get(
        '/api/v1/users/dashboard-enrollment/',
        { params }
      );
      return response.data;
    },
  });
};
