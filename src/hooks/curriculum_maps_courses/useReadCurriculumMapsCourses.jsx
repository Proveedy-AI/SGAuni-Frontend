import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useReadCurriculumMapsCourses = (params = {}, options = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['courses-curriculum-maps', params],
    queryFn: async () => {
      const res = await axiosPrivate.get('/api/v1/courses-curriculum-maps/', { params });
      return res.data;
    },
    ...options,
  });
};