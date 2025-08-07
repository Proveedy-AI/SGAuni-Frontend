import useAxiosPrivate from "@/hooks/axios/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";

export const useReadEnrollmentReceipt = (id, params={}, options={}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['enrollment-receipt', id],
    queryFn: async () => {
      if (!id) throw new Error('ID requerido');
      const res = await axiosPrivate.get(`/api/v1/students/${id}/enrollment-receipt/`,
        { params: {...params} }
      );
      return res.data;
    },
    ...options, // solo corre si hay un id válido
  });
};