import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useConfirmCourseSelection = (uuid) => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		// `variables` será lo que pases en mutate()
		mutationFn: async (params) => {
			const res = await axiosPrivate.patch(
				`/api/v1/course-selections/selections/confirm/${uuid}/`,
				params // 👈 se envía como body del PATCH
			);
			return res.data;
		},
	});
};
