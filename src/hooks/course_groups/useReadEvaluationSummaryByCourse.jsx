import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useReadEvaluationSummaryByCourse = (courseGroupId, options = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['evaluation-summary', courseGroupId],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/api/v1/course-groups/${courseGroupId}/evaluation-summary/`);
      return res.data;
    },
    ...options, // permite pasar `enabled`, `staleTime`, etc.
  });
};