import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useGenerateReportEnrolled = (uuid, params={}, options={}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
      queryKey: ['report-enrolled', uuid],
      queryFn: async () => {
          if (!uuid) throw new Error('ID requerido');
          const res = await axiosPrivate.get(`/api/v1/enrollment-processes/report-enrolled/${uuid}/`, 
            { params }
          );
          return res.data;
      },
      ...options,
  });
}