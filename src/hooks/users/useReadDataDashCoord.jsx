import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadDataDashCoord = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['data-dashboard-coord'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/api/v1/users/dashboard/coordinator-director/');
      return response.data;
    },
  });
};
