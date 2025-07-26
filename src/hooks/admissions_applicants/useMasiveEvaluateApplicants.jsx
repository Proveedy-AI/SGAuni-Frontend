import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useMasiveEvaluateApplicants = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
		mutationFn: async (uuid) => {
      if (!uuid) throw new Error('ID requerido');
			const res = await axiosPrivate.post(
				`/api/v1/admission-process-prograns/process-applicants/${uuid}/`
			);
			return res.data;
		},
	});
}