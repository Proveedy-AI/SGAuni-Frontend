import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useConfigureEvaluationByCourse = (courseGroupId) => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPrivate.post(`/api/v1/course-groups/${courseGroupId}/configure-evaluation/`, payload);
      return res.data;
    },
  });
};