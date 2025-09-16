import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useReadCourseConvalidations = (params = {}, options = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['courses-convalidations', params],
    queryFn: async () => {
      const res = await axiosPrivate.get('/api/v1/curriculum-course-convalidations/', { params });
      return res.data;
    },
    ...options,
  });
};