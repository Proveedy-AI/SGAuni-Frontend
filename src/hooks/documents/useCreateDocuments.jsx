import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useCreateDocuments = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPrivate.post('/api/v1/document-applications/bulk-create/', payload);
      return res.data;
    },
  });
};
