import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useRemoveStudentToCourse = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axiosPrivate.patch(
        `/api/v1/course-selections/${id}/withdrawal/`
      );
      return res.data;
    },
  });
};