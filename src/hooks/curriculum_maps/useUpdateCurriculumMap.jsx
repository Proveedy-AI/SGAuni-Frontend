import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useUpdateCurriculumMap = () => {
  const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async ({ id, payload }) => {
      console.log({ id, payload });
			const res = await axiosPrivate.patch(`/api/v1/curriculum-maps/${id}/`, payload);
			return res.data;
		},
	});
};
