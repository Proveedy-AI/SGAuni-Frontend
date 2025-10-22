import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadCourseGroupsById = (courseId, uuid, params={}, options={}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['course-selections', courseId, uuid],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/api/v1/course-selections/course-groups/${courseId}/enrollment/${uuid}/`, {
        params: { ...params },
      });
      return res.data;
    },
    ...options,
  });
};