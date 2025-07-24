import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useReadCourseGroupById = (courseGroupId, options = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['courses', courseGroupId],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/api/v1/course-groups/${courseGroupId}/`);
      return res.data;
    },
    ...options, // permite pasar `enabled`, `staleTime`, etc.
  });
};