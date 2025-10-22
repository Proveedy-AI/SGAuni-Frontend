import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useDeleteCurriculumMapCourse = () => {
  const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (id) => {
			const res = await axiosPrivate.delete(`/api/v1/courses-curriculum-maps/${id}/`);
			return res.data;
		},
	});
};
