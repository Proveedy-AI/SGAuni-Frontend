import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadAvailableCourses = (params={}, options={}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['course-selections'],
    queryFn: async () => {
      const res = await axiosPrivate.get("/api/v1/course-selections/available-courses/", {
        params: { ...params },
      });
      return res.data;
    },
    ...options,
  });
};