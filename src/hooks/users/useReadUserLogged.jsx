import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadUserLogged = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/api/v1/users/me/');
      return response.data;
    },
  });
};
