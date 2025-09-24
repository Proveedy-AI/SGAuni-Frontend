import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useCreateAcademicDegreeByPerson = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await axiosPrivate.post(`/api/v1/persons/${id}/degrees/`, payload);
      return res.data;
    },
  });
};
