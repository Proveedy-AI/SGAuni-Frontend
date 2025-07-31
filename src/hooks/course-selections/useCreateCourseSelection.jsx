import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useCreateCourseSelection = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (courseGroupId) => {
      const res = await axiosPrivate.post(`/api/v1/course-selections/select-course/${courseGroupId}/`);
      return res.data;
    },
  });
};
