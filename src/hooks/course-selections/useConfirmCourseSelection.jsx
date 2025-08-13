import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useConfirmCourseSelection = (uuid) => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async () => {
			const res = await axiosPrivate.post(
				`/api/v1/course-selections/selections/confirm/${uuid}`
			);
			return res.data;
		},
	});
};
