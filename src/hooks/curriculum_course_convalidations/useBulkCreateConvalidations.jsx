import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useBulkCreateConvalidations = () => {
  const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (payload) => {
			const res = await axiosPrivate.post('/api/v1/curriculum-course-convalidations/bulk-create/', payload);
			return res.data;
		},
	});
};