import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useDeleteScheduleType = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axiosPrivate.delete(`/api/v1/type-schedules/${id}/`);
      return res.data;
    },
  });
};
