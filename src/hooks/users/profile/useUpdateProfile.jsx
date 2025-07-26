import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../../axios/useAxiosPrivate';

export const useUpdateProfile = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async ( payload ) => {
      const response = await axiosPrivate.patch(`/api/v1/users/profile/`, payload);
      return response.data;
    },
  });
};
