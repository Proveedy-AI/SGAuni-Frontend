import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useReadCoursesByPeriod = (uuid, program_id) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['courses-by-period', uuid, program_id],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/api/v1/students/courses-by-period/${uuid}/`,
        { 
          params: {
             program_id
          }
        }
      );
      return res.data;
    },
    enabled: !!uuid && !!program_id
  });
}
