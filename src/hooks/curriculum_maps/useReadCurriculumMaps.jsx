import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useReadCurriculumMaps = (options = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['curriculum-maps'],
    queryFn: async () => {
      const res = await axiosPrivate.get('/api/v1/curriculum-maps/');
      return res.data;
    },
    ...options,
  });
};