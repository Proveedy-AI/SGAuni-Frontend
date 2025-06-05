import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useDeleteProgramType = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axiosPrivate.delete(`/api/v1/postgraduate-program-types/${id}/`);
      return res.data;
    },
  });
};
