import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadCourseGroupsById = (courseId,  params={}, options={}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['course-selections', courseId],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/api/v1/course-selections/course-groups/${courseId}/`, {
        params: { ...params },
      });
      return res.data;
    },
    ...options,
  });
};