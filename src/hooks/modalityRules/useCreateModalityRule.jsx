import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useCreateModalityRule = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPrivate.post('/api/v1/modality-rules/', payload);
      return res.data;
    },
  });
};
