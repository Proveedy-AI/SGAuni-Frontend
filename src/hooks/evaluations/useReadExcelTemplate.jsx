import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useReadExcelTemplate = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (courseGroupId) => {
      if (!courseGroupId) throw new Error('Id requerido');
      const res = await axiosPrivate.get(
        `/api/v1/evaluations/template/${courseGroupId}/`,
        {
					responseType: 'blob', // ✅ Muy importante para archivos
				}
      );
      return res.data;
    },
  });
};