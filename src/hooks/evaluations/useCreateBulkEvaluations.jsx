import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useCreateBulkEvaluations = () => {
  const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async ({ courseSelectionId, payload }) => {
			const res = await axiosPrivate.post(`/api/v1/evaluations/bulk/${courseSelectionId}/`, payload);
			return res.data;
		},
	});
};
