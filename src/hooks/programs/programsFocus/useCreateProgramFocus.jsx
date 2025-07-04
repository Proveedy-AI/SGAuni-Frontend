import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useMutation } from '@tanstack/react-query';


export const useCreateProgramFocus = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPrivate.post('/api/v1/admission-focus/', payload);
      return res.data;
    },
  });
};
