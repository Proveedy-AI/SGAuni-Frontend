import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useReadMyCourses = (params={}, options={}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['my_courses'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/api/v1/courses/my-courses/', {
        params: { ...params },
      });
      return response.data;
    },
    ...options,
  });
}