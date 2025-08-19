import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useRequestReincorporation = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
      mutationFn: async (payload) => {
        const res = await axiosPrivate.post(
            '/api/v1/enrollments/request-reincorporation/',
            payload
        );
        return res.data;
      },
  });
}
