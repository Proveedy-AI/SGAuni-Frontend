import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useReadCurriculumMapsCourses = (options = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['courses-curriculum-maps'],
    queryFn: async () => {
      const res = await axiosPrivate.get('/api/v1/courses-curriculum-maps/');
      return res.data;
    },
    ...options,
  });
};