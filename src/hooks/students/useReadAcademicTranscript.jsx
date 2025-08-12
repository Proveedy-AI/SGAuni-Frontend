import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useReadAcademicTranscript = (UUIDStudent) => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ['academic-transcript', UUIDStudent],
    queryFn: async () => {
      if (!UUIDStudent) throw new Error('UUID requerido');
      const res = await axiosPrivate.get(`/api/v1/students/academic-transcript/${UUIDStudent}/`);
      return res.data;
    },
    enabled: !!UUIDStudent
  });
};