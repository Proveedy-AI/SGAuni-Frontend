import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useGenerateReportEnrolled = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
		mutationFn: async (uuid) => {
			if (!uuid) throw new Error('UUID requerido');
			const res = await axiosPrivate.get(
				`/api/v1/enrollment-processes/report-enrolled/${uuid}/`,
				{
					responseType: 'blob', // ✅ Muy importante para archivos
				}
			);
			return res.data;
		},
	});
}