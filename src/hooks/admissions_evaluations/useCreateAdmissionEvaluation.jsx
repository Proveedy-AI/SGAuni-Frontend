import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useCreateAdmissionEvaluation = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPrivate.post(
        '/api/v1/admission-evaluations/',
        payload
      );
      return res.data;
    },
  });
};
