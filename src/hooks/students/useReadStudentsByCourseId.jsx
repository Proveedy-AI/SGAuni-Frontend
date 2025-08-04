import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useReadStudentsByCourseId = (courseId, options = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['students-courses', courseId],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/api/v1/course-groups/${courseId}/students/`);
      return res.data;
    },
    ...options, // allows passing `enabled`, `staleTime`, etc.
  });
}