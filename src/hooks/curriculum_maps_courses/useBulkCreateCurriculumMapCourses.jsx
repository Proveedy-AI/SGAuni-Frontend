import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useBulkCreateCurriculumMapCourses = () => {
  const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (payload) => {
			const res = await axiosPrivate.post('/api/v1/courses-curriculum-maps/bulk-create/', payload);
			return res.data;
		},
	});
};
