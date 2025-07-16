// src/hooks/countries/useCreateCountry.jsx
import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useMutation } from '@tanstack/react-query';


export const useCreateCourseScheduleReview = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (id) => {
			const res = await axiosPrivate.patch(
				`/api/v1/course-schedules/${id}/review/`
			);
			return res.data;
		},
	});
};
