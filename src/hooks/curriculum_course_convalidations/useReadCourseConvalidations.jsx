import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useReadCourseConvalidations = (options = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['courses-convalidations'],
    queryFn: async () => {
      const res = await axiosPrivate.get('/api/v1/curriculum-course-convalidations/');
      return res.data;
    },
    ...options,
  });
};