import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useMutation } from '@tanstack/react-query';


export const useUpdateProgramFocus = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const response = await axiosPrivate.patch(`/api/v1/admission-focus/${id}/`, payload);
      return response.data;
    },
  });
};
