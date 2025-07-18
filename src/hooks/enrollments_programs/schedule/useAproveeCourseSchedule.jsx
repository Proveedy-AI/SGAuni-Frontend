// src/hooks/countries/useUpdateCountry.jsx
import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useMutation } from '@tanstack/react-query';

export const useAproveeCourseSchedule = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async ({ id, payload }) => {
			const res = await axiosPrivate.patch(
				`/api/v1/course-schedules/${id}/review/decision/`,
				payload
			);
			return res.data;
		},
	});
};
