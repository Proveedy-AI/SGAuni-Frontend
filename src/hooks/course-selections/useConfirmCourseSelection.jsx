import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useConfirmCourseSelection = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async () => {
			const res = await axiosPrivate.post(
				`/api/v1/course-selections/selections/confirm/`
			);
			return res.data;
		},
	});
};
