import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useReadCurriculumMaps = (params = {}, options = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['curriculum-maps', params],
    queryFn: async () => {
      const res = await axiosPrivate.get('/api/v1/curriculum-maps/', { params });
      return res.data;
    },
    ...options,
  });
};