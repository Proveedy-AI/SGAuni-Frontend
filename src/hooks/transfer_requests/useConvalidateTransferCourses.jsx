import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useConvalidateTransferCourses = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async ({ id, payload }) => {
			const res = await axiosPrivate.patch(
				`/api/v1/internal-transfer-requests/${id}/convalidate-courses/`,
				payload
			);
			return res.data;
		},
	});
};
