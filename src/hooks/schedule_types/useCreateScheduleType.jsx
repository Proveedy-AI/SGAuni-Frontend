import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useCreateScheduleType = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPrivate.post('/api/v1/type-schedules/', payload);
      return res.data;
    },
  });
};
