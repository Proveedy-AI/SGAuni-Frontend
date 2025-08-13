import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadAvailableCourses = (uuid, params={}, options={}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['course-selections', uuid],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/api/v1/course-selections/available-courses/${uuid}/`, {
        params: { ...params },
      });
      return res.data;
    },
    ...options,
  });
};