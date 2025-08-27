import { axiosPrivate } from '@/api';
import { useMutation } from '@tanstack/react-query';

export const useCreateAdmissionAplicant = () => {
  
  return useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPrivate.post(
        '/api/v1/admission-applications/',
        payload
      );
      return res.data;
    },
  });
};
