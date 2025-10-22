import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useReadCourseGradesByCourseId = (courseSelectionId, params = {}, options = {}) => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ['course-grades', courseSelectionId],
    queryFn: async () => {
      if (!courseSelectionId) throw new Error('ID requerido');
      const res = await axiosPrivate.get(`/api/v1/students/course-grades/${courseSelectionId}/`, 
        { params }
      );
      return res.data;
    },
    ...options,
  });
};