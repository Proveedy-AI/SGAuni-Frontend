import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useReadAcademicTranscript = (UUIDStudent, programId) => {
  console.log(UUIDStudent, programId);
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ['academic-transcript', UUIDStudent, programId],
    queryFn: async () => {
      if (!UUIDStudent) throw new Error('UUID requerido');
      if (!programId) throw new Error('ID de programa requerido');
      const res = await axiosPrivate.get(`/api/v1/students/academic-transcript/${UUIDStudent}/program/${programId}/`);
      return res.data;
    },
    enabled: !!UUIDStudent && !!programId,
  });
};