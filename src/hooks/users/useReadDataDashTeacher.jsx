import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadDataDashTeacher = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['data-dashboard-teacher'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/api/v1/users/dashboard/teacher/');
      return response.data;
    },
  });
};
