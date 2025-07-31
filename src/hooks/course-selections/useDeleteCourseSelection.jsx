import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useDeleteCourseSelection = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (courseGroupId) => {
      const res = await axiosPrivate.delete(`/api/v1/course-selections/${courseGroupId}/`);
      return res.data;
    },
  });
};
