import useAxiosPrivate from "@/hooks/axios/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";

export const useReadEnrollmentReceipt = (periodProgramId, params={}, options={}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['enrollment-receipt'],
    queryFn: async () => {
      if (!periodProgramId) throw new Error('ID requerido');
      const res = await axiosPrivate.get(`/api/v1/students/enrollment-receipt/${periodProgramId}/`,
        { params: {...params} }
      );
      return res.data;
    },
    ...options, // solo corre si hay un id válido
  });
};