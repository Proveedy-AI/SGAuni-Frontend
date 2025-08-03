import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useMyEvaluationsByCourse = (courseId, params={}, options={}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['my_evaluations', courseId],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/api/v1/courses/my-evaluations/${courseId}`, {
        params: { ...params },
      });
      return response.data;
    },
    ...options,
  });
}