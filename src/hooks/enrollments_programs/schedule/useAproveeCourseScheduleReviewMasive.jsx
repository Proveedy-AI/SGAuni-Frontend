// src/hooks/countries/useCreateCountry.jsx
import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useMutation } from '@tanstack/react-query';

export const useAproveeCourseScheduleReviewMasive = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		// ahora recibe "payload"
		mutationFn: async (payload) => {
			const res = await axiosPrivate.patch(
				`/api/v1/course-schedules/bulk-approve/`,
				payload
			);
			return res.data;
		},
	});
};
