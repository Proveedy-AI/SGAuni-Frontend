// src/hooks/countries/useReadCountries.jsx
import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';


export const useReadCourseScheduleReview = (params = {}, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['course-schedule-review', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/course-schedule-reviews/', {
				params,
			});
			return res.data;
		},
		...options,
	});
};
