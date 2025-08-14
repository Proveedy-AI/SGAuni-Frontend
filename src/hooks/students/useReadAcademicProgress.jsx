import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useReadAcademicProgress = (UUIDStudent) => {
  console.log(UUIDStudent);
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ['academic-progress', UUIDStudent],
    queryFn: async () => {
      if (!UUIDStudent) throw new Error('UUID requerido');
      const res = await axiosPrivate.get(`/api/v1/students/academic-progress/${UUIDStudent}/`);
      return res.data;
    },
    enabled: !!UUIDStudent
  });
};