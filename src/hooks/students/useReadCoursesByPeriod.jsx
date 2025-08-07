import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useReadCoursesByPeriod = (params = {}, options = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['courses-by-period'],
    queryFn: async () => {
      const res = await axiosPrivate.get('/api/v1/students/courses-by-period/',
        { params }
      );
      return res.data;
    },
    ...options, // allows passing `enabled`, `staleTime`, etc.
  });
}
