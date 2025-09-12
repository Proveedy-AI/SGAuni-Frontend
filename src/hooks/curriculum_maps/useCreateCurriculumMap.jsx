import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export const useCreateCurriculumMap = () => {
  const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (payload) => {
			const res = await axiosPrivate.post('/api/v1/curriculum-maps/', payload);
			return res.data;
		},
	});
};
