import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useGenerateGradesReport = (courseGroupId) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['grades-report', courseGroupId],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/api/v1/course-groups/grade-report/${courseGroupId}/`);
      return res.data;
    },
    enabled: !!courseGroupId, // Solo se ejecuta si courseGroupId está definido
  });
};
