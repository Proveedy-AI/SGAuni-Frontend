import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const usePostponeEnrollment = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (uuid) => {
      const res = await axiosPrivate.post(`/api/v1/enrollments/postpone-enrollment/${uuid}/`);
      return res.data;
    },
  });
};
