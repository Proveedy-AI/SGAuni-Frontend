import useAxiosPrivate from "@/hooks/axios/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";

export const useReadEnrollmentPayment = (id, params={}, options={}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['enrollment-payment', id],
    queryFn: async () => {
      if (!id) throw new Error('ID requerido');
      const res = await axiosPrivate.get(`/api/v1/payment-requests/${id}/person/`,
        { params: {...params} }
      );
      return res.data;
    },
    ...options, // solo corre si hay un id válido
  });
};